require('dotenv').config();
const { WebSocketServer } = require('ws');

const Database = require('./database');
const Handlers = require('./handlers');


// Create websocket server
const wss = new WebSocketServer({ port: parseInt(process.env.PORT) });

// Create a map of subscriptions
// in the form <subid> : <connid>
wss.subscriptions = {};

// Create a map of connections
// in the form <connid> : <ws>
wss.connections = {};

// Connect to MongoDB
Database.Initialize({
	connection: process.env.DB_CONNECTION_STRING
},() => {

	// Attach handlers on client connect
	wss.on('connection', (ws, req) => {

		console.log('opened websocket connection');

		// Handle new connection
		const conn = Handlers.HandleConnect(ws, req, wss);

		ws.on('message', async (buffer) => {

			try {

				// Parse JSON from the raw buffer
				const data = JSON.parse(buffer.toString());

				// Pass the data to appropriate handler
				switch (data[0]) {

					// case 'AUTH':
					// 	await Handlers.HandleAuth(data, ws, wss);
					// 	break;

					// Clients creating a subscription
					case 'REQ':
						await Handlers.HandleReq(data, conn, wss);
						break;

					// Clients publishing an event
					case 'EVENT':
						await Handlers.HandleEvent(data, conn, wss);
						break;

					// Clients canceling subscription
					case 'CLOSE':
						await Handlers.HandleUnsub(data, conn, wss);
						break;

					default:
						console.log('Unhandled message:', data);
						break;
				}

			} catch (err) {

				console.log(err);
			}

		});

		ws.on('close', async () => {

			await Handlers.HandleDisconnect(ws, wss);
		});
	});

});
