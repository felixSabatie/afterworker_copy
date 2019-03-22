const MongoClient = require('mongodb').MongoClient

class DatabaseService {
    static connect(callback) {
        MongoClient.connect(process.env.MONGODB_URI || 'mongodb://afterworker:afterworker@mongodb:27017/afterworker?authSource=admin', (err, client) => {
            if (err) throw err;
            callback(client.db('afterworker'));
        });
    }
}

module.exports = DatabaseService;