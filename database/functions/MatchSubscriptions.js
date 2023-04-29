const { Subscription } = require('../models');


// Lookup subscriptions that match given event record
module.exports = (record) => {

	// Construct a query to find all subscriptions where each filter
	// condition either matches the event property or is undefined
	return Subscription.find({
		$and: [
			{ $or: [{ e: { $exists: false } }, { e: { $in: record.e } }] },
			{ $or: [{ p: { $exists: false } }, { p: { $in: record.p } }] },
			{ $or: [{ ids: { $exists: false } }, { ids: record.id }] },
			{ $or: [{ kinds: { $exists: false } }, { kinds: record.kind }] },
			{ $or: [{ authors: { $exists: false } }, { authors: record.pubkey }] }
		]
	}).select({
		_id: false,
		id: true
	}).lean();
}
