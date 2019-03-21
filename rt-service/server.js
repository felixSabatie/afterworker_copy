const express = require('express');
const app = express();
const DatabaseService = require('./services/database.service');

const port = process.env.PORT || 8080;

DatabaseService.connect(db => {
    app.get('/', (req, res) => {
        // db.collection('messages').insert({userId: 2, message: 'Test message'}, (err, records) => {
        //     if (err) return res.json({error: err});
            db.collection('messages').find().toArray((err, result) => {
                res.json({messages: result});
            });
        // });
    })
});

app.listen(port);