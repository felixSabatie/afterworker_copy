const handleMessages = (http, db) => {
    const io = require('socket.io')(http, { origins: '*:*' })

    io.on('connection', socket => {
        console.log('user connected');
    });
};

module.exports = handleMessages;