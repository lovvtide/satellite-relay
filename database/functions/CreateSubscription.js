const { Subscription } = require('../models');


module.exports = async (subid, filters) => {

	// Mapping of db model keys to filter keys
	const adapter = {
		e: '#e',
		p: '#p',
		ids: 'ids',
		kinds: 'kinds',
		authors: 'authors'
	};

	// Create a subscription record for each filter
	const inserted = await Subscription.insertMany(filters.map(filter => {

		const record = { id: subid };

		for (let key of Object.keys(adapter)) {

			const value = filter[adapter[key]];

			if (value) { record[key] = value; }
		}

		return record;

	}));

	// Delete any older records on the same sub id
	// this allows clients to update their filters
	await Subscription.deleteMany({
		id: subid,
		_id: {
			$nin: inserted.map(record => {
				return record._id;
			})
		},
	}).lean();
};
