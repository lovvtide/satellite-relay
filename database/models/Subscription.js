const mongoose = require('mongoose');
const { Schema } = mongoose;


/* Model of a nostr subscription */

const Subscription = new Schema({

	id: { type: String, index: true },


	/* Filter Attributes */

	e: { type: [String], index: true, default: undefined },

	p: { type: [String], index: true, default: undefined },

	ids: { type: [String], index: true, default: undefined },

	kinds: { type: [Number], index: true, default: undefined },

	authors: { type: [String], index: true, default: undefined }

});

module.exports = mongoose.model('Subscription', Subscription);
