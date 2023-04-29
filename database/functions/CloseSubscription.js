const { Subscription } = require('../models');


// Remove subscription(s)
module.exports = (which) => {

	return Subscription.deleteMany({
		id: Array.isArray(which) ? { $in: which } : which
	}).lean();
};
