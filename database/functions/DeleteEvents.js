const { Event } = require('../models');


// Remove subscription(s)
module.exports = ({ ids, pubkey }) => {

	return Event.updateMany({ id: { $in: ids }, pubkey }, { deleted: true }).lean();
};
