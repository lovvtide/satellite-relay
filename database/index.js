const CloseSubscription = require('./functions/CloseSubscription');
const CreateEvent = require('./functions/CreateEvent');
const CreateSubscription = require('./functions/CreateSubscription');
const DeleteEvents = require('./functions/DeleteEvents');
const Initialize = require('./functions/Initialize');
const MatchSubscriptions = require('./functions/MatchSubscriptions');
const QueryEvents = require('./functions/QueryEvents');


/* Database Interface */

// TODO this "database" folder should really be its own module.
// Keeping the logic for interacting with the database self
// contained would allow other db interfaces to be swapped out

module.exports = {
	CloseSubscription,
	CreateEvent,
	CreateSubscription,
	DeleteEvents,
	Initialize,
	MatchSubscriptions,
	QueryEvents
};
