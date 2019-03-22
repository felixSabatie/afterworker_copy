const handleMessages = (http, db) => {
    const io = require('socket.io')(http, { origins: '*:*' })

    io.on('connection', socket => {

        let currentUserId, currentEventHash;

        socket.on('connectToEvent', ({event, user}) => {
            // TODO check that user can access the event

            currentUserId = user.id;
            currentEventHash = event.hash

            socket.join(currentEventHash);

            console.log(currentUserId + ' connected on ' + currentEventHash);

            db.collection('messages').find({event_hash: currentEventHash}).toArray((err, result) => {
                if(err) {
                    console.error(err);
                } else {
                    socket.emit('messages', { messages: result });
                }
            });
        });

        socket.on('newMessage', message => {
            const storedMessage = {
                creator_id: currentUserId,
                message: message.message,
                createdAt: new Date(),
                event_hash: currentEventHash
            }

            db.collection('messages').insert(storedMessage, (err, records) => {
                if (err) {
                    console.error(err);
                } else {
                    socket.broadcast.to(currentEventHash).emit('newMessage', {message: storedMessage});
                }
            });
        });
    });
};

module.exports = handleMessages;