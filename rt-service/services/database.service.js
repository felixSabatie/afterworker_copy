const MongoClient = require('mongodb').MongoClient

class DatabaseService {
    static connect(callback) {
        MongoClient.connect('mongodb://localhost:27017/afterworker', (err, db) => {
            if (err) throw err;
            callback(db);
        });
    }
}

module.exports = DatabaseService;
