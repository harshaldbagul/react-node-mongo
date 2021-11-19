const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const mongodbUrl = 'mongodb+srv://test:test@cluster0.ldvrj.mongodb.net?retryWrites=true&w=majority';

let _client;

const initDb = (callback) => {
    if (_client) {
        console.log('DB client already initialized!!');
        callback(null, _client);
        return;
    }
    MongoClient.connect(mongodbUrl)
        .then(client => {
            _client = client;
            console.log('DB client connected');
            callback(null, client);
            return;
        }).catch(err => {
            callback(err, null);
        });
}

const getClient = () => {
    if (!_client) {
        throw 'Client is not intialized';
    }
    return _client;
}

module.exports = { initDb, getClient };