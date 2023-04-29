const Database = require('../database');


module.exports = async (data, conn, wss) => {

	const subid = data[1];

	if (typeof subid !== 'string') { return; }

	const filters = data.slice(2);

	// Create record(s) of the subscription filter(s)
	await Database.CreateSubscription(subid, filters);

	// Save a reference connecting the sub id to the websocket
	// connection id so new events can be pushed to the client
	wss.subscriptions[subid] = conn.id;

	// Pass request filters to query function
	const events = await Database.QueryEvents(filters);

	// Get a reference to the websocket
	const ws = wss.connections[conn.id];

	// Return id linked connection not found
	if (!ws) { return; }

	// Add subid to array of linked subs
	ws.subids.push(subid);

	// Push each event to the client
	for (let event of events) {

		ws.send(JSON.stringify([ 'EVENT', subid, event ]));			
	}

	// Send NIP-15 "end of saved events" message
	ws.send(JSON.stringify([ 'EOSE', subid ]));
};
