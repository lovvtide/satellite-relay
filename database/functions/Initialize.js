const Mongoose = require('mongoose');

const { Subscription } = require('../models');


// Called on startup to initialize the databae
module.exports = (params, resolve) => {

	// Connect to the database and start server
	Mongoose.connect(params.connection, {
		useUnifiedTopology: true,
		useNewUrlParser: true
	}, async (err) => {

		if (err) { throw Error('DB failed to connect', err); }

		// Remove all subscription objects from the database.
		// In the future we might restore data from a memcache.
		await Subscription.deleteMany({}).lean();

		resolve();
	});
}
