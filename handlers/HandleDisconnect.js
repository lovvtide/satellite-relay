const Database = require('../database');


// Cleanup when a websocket is disconnected
module.exports = async (ws, wss) => {

	if (wss.connections[ws.id]) {

		// Remove in-memory mapping
		delete wss.connections[ws.id];

		// Clear keepalive interval
		clearInterval(ws.kai);

		const remove = [];

		// Find subscriptions on this connection
		for (let subid of ws.subids) {

			if (wss.subscriptions[subid]) {

				// Delete memory reference and
				// mark for database removal
				delete wss.subscriptions[subid];
				remove.push(subid);
			}
		}

		if (remove.length > 0) {

			// Remove subscription model from the DB
			await Database.CloseSubscription(remove);
		}
	}
};
