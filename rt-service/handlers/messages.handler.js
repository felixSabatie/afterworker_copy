const handleMessages = (http, db) => {
    const io = require('socket.io')(http, { origins: '*:*' })

    io.on('connection', socket => {

        let currentUserId, currentEventHash;

        socket.on('connectToEvent', ({event, user}) => {
            // TODO check that user can access the event

            currentUserId = user.id;
            currentEventHash = event.hash

            socket.join(currentEventHash);

            db.collection('messages').find({event_hash: currentEventHash}).toArray((err, result) => {
                if(err) {
                    console.error(err);
                } else {
                    socket.emit('messages', { messages: result });
                }
            });
        });
    });
};

module.exports = handleMessages;