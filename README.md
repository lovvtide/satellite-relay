# A Very Simple Nostr Relay Implementation

I started building this while developing the [Satellite web client](https://github.com/lovvtide/satellite-web).

It's very simple. NodeJS + MongoDB.

I haven't tried to run this relay in production (yet) but it has been quite useful for local development as a way to understand exactly what's happening in the interaction between the relay and the client.

### Getting Started

You'll need to have Node installed obviously.

You'll also need to install monogodb to run a local database.

https://www.mongodb.com/docs/manual/installation/

Once that's up and running, the last bit of setup is to create a `.env` file at the root of the project to hold your local environmental variables. It should look something like this:

``` .env
DB_CONNECTION_STRING=mongodb://localhost/<my_database_name>
EVENT_MAX_SIZE=524288
HEARTBEAT_INTERVAL=60000
PORT=3030
```

Just replace `<my_database_name>` with the appropriate value.

Then `npm install` and `npm start`.

Now that your relay is started, you can add `ws://localhost:3030` to the relay list of your client running on the same machine.

. . . full documentation coming soon
