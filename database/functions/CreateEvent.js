const { Event } = require('../models');


module.exports = async (event, options = {}) => {
	
	const size = JSON.stringify(event).length;

	// Ensure that the event is not too large
	if (options.maxSize && size > options.maxSize) {
		throw { code: 413 };
	}

	const e = {};
	const p = {};

	// Extract unique "e" and "p" tags
	for (let z = 0; z < event.tags.length; z++) {

		const tag = event.tags[z];

		if (tag[0] === 'e') {
			e[tag[1]] = true;
			continue;
		}

		if (tag[0] === 'p') {
			p[tag[1]] = true;
			continue;
		}
	}

	const record = {
		id: event.id,
		pubkey: event.pubkey,
		created_at: event.created_at,
		kind: event.kind,
		tags: event.tags,
		content: event.content,
		sig: event.sig,
		e: Object.keys(e),
		p: Object.keys(p),
		size
	};

	// Insert the event and check for existing
	const existing = await Event.findOneAndUpdate({
		id: event.id
	}, {
		$setOnInsert: record
	}, {
		upsert: true
	}).lean();

	// Return record only if upserted
	return existing ? null : record;
};
