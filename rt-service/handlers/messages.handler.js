const axios = require('axios');
const env = require('../environment');

const handleMessages = (http, db) => {
    const io = require('socket.io')(http, { origins: '*:*' })

    io.on('connection', socket => {

        let currentUserId, currentEventHash, isValid = false;

        socket.on('connectToEvent', ({ event, user, token }) => {
            axios.get(env.apiUrl + '/events/' + event.hash, { headers: { 'Authorization': 'Bearer ' + token } }).then(response => {
                currentUserId = user.id;
                currentEventHash = event.hash
                isValid = true;

                socket.join(currentEventHash);

                console.log(currentUserId + ' connected on ' + currentEventHash);

                db.collection('messages').find({ event_hash: currentEventHash }).toArray((err, result) => {
                    if (err) {
                        console.error(err);
                    } else {
                        socket.emit('messages', { messages: result });
                    }
                });
            }).catch(err => {
                console.error(err);
            });
        });

        socket.on('newMessage', message => {
            if (isValid) {
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
                        socket.broadcast.to(currentEventHash).emit('newMessage', { message: storedMessage });
                    }
                });
            }
        });
    });
};

module.exports = handleMessages;