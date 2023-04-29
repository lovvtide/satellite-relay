const { verifySignature } = require('nostr-tools');

const Database = require('../database');


module.exports = async (data, conn, wss) => {

	// TODO - as a performance optimization, consider
	// building a "memcache" of sorts that keeps track
	// of event ids that have already been stored to
	// avoid a db lookup

	// Get the event data
	const event = data[1];

	let inserted = null;
	let okstatus = true;
	let okmessage = '';

	// Verify the event's signature
	if (verifySignature(event)) {

		try {

			// Persist to database
			inserted = await Database.CreateEvent(event, {
				maxSize: process.env.EVENT_MAX_SIZE ? parseInt(process.env.EVENT_MAX_SIZE) : undefined
			});

		} catch (err) {

			console.log(err);

			okstatus = false;

			switch (err.code) {

				case 413: // Event too large
					okmessage = `invalid: event exceeds max size (${process.env.EVENT_MAX_SIZE} bytes)`;
					break;

				default: // Unknown error
					okmessage = 'error: server error';
			}
		}

	} else { // Failed to verify

		console.log(`Event ${event.id} failed verification`);

		okstatus = false;
		okmessage = `invalid: event failed to validate or verify`;
	}

	// Get a reference to sender's connection
	const sws = wss.connections[conn.id];

	if (sws) { // Send NIP-20 'OK' message

		sws.send(JSON.stringify([ 'OK', event.id, okstatus, okmessage ]));
		console.log('sent "OK" status');
	}

	// If new event, look for active subscriptions
	// that might need the event pushed to them
	if (inserted) {

		const matched = await Database.MatchSubscriptions(inserted);

		if (inserted.kind === 5) {

			await Database.DeleteEvents({
				pubkey: inserted.pubkey,
				ids: inserted.tags.filter(tag => {
					return tag[0] === 'e';
				}).map(tag => {
					return tag[1];
				})
			});
		}

		// Keep track of which subscriptions an event was
		// sent to - it's possible that an event matches
		// multiple filters on the same subscription, and
		// we don't want to send the client duplicates
		const sent = {/* <subid> : <bool> */};

		for (let sub of matched) {

			// Skip if already sent event
			if (sent[sub.id]) { continue; }

			// Try to find an active ws connection id
			// associated with this subscription
			const connid = wss.subscriptions[sub.id];

			if (!connid) { continue; }

			// Get the actual connection object
			const ws = wss.connections[connid];

			if (!ws) { continue; }

			try { // Push the event

				ws.send(JSON.stringify([ 'EVENT', sub.id, event ]));

				// Mark sub sent
				sent[sub.id] = true;

			} catch (err) {

				console.log(`Failed to push event ${event.id} to sub ${sub.id}`, err);
				// TODO if websocket error, maybe delete the reference to the connection
			}
		}
	}
};
