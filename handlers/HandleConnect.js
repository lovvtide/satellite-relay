const crypto = require('crypto');

// Called when a new ws connection is established
module.exports = (ws, req, wss) => {

	let ip;

	// Record the IP address of the client
	if (req.headers['x-forwarded-for']) {

		ip = req.headers['x-forwarded-for'].split(',')[0].trim();

	} else {

		ip = req.socket.remoteAddress;
	}

	// Generate a unique ID for ws connection
	const id = crypto.randomUUID();

	// Save a reference to the connection
	wss.connections[id] = ws;

	// Attach the id to the websocket itself
	ws.id = id;

	// Init array of linked subscriptions
	ws.subids = [];

	// Set default alive
	ws.isAlive = true;

	// Mark alive on client response
	ws.on('pong', () => { ws.isAlive = true; });

	// Create interval to check connection status
	ws.kai = setInterval(() => {

		// If the connection is inactive, remove it
		if (ws.isAlive === false) {

			return ws.terminate();
		}

		// Invalidate alive status
		ws.isAlive = false;

		// Challeng client to revalidate
		ws.ping();

	}, process.env.HEARTBEAT_INTERVAL ? parseInt(process.env.HEARTBEAT_INTERVAL) : 60000);

	// Return model of the connection
	return { id, ip, opened: Math.floor(Date.now() / 1000) };
};
