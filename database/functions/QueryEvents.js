const { Event } = require('../models');


// TODO: support for prefix search

// Lookup events that match a subscription filter
module.exports = async (filters) => {

	// Convert event filters to mongoose queries and
	// generate db ops to be executed simultaneously
	const queries = filters.map(filter => {

		const query = {};

		if (filter.ids) {
			query.id = { $in: filter.ids };
		}

		if (filter['#e']) {
			query.e = { $in: filter['#e'] };
		}

		if (filter['#p']) {
			query.p = { $in: filter['#p'] };
		}

		if (filter.kinds) {
			query.kind = { $in: filter.kinds };
		}

		if (filter.authors) {
			query.pubkey = { $in: filter.authors };
		}

		if (typeof filter.since === 'number' || typeof filter.until === 'number') {

			created_at = {};

			if (typeof filter.since === 'number') {
				created_at['$gt'] = filter.since;
			}

			if (typeof filter.until === 'number') {
				created_at['$lt'] = filter.until;
			}

			query.created_at = created_at;
		}

		// Don't fetch events marked as deleted
		query.deleted = { $ne: true };

		return Event.find(query).select({
			_id: false,
			id: true,
			pubkey: true,
			created_at: true,
			kind: true,
			tags: true,
			content: true,
			sig: true
		}).sort({
			created_at: -1
		}).limit(filter.limit).lean();

	});

	// Fetch data for all queries
	const results = await Promise.all(queries);

	// For multiple filters, results need
	// to be merged to avoid duplicates
	if (results.length > 1) {

		const merged = {};

		for (let result of results) {
			for (let event of result) {
				merged[event.id] = event;
			}
		}

		// Return sorted unique array of
		// events that match any filter
		return Object.keys(merged).map(id => {
			return merged[id];
		}).sort((a, b) => {
			return b.created_at - a.created_at;
		});
	}

	// Return events matching single filter
	return results[0];
}
