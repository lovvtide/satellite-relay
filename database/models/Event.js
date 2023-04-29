const mongoose = require('mongoose');
const { Schema } = mongoose;

/* Model of a nostr event */

const Event = new Schema({

	/* NIP-01 spec */

	id: { type: String, index: true, unique: true },

	pubkey: { type: String, index: true },

	created_at: { type: Number, index: true },

	kind: { type: Number, index: true },

	tags: { type: Schema.Types.Mixed },

	content: { type: String },

	sig: { type: String },


	/* Indicies */

	e: { type: [String], index: true },

	p: { type: [String], index: true },


	/* Metadata */

	size: { type: Number },

	deleted: { type: Boolean }
	
});

module.exports = mongoose.model('Event', Event);
