const Database = require('../database');


module.exports = async (data, conn, wss) => {

	const subid = data[1];

	// Remove subscription model from the DB
	await Database.CloseSubscription(subid);

	// Delete memory reference
	delete wss.subscriptions[subid];

	// Try to find the connection for this sub
	const ws = wss.connections[conn.id];

	if (ws) {

		// Remove sub id from array of active subs
		ws.subids = ws.subids.filter(_subid => {
			return _subid !== subid;
		});
	}
};
