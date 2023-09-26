const { MongoClient } = require("mongodb");

let _db;
const uri = `mongodb+srv://verma-shu6ham:${process.env.mongoPassword}@nodejs.xwd8o9y.mongodb.net/shop?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

const mongoConnect = (callback) => {
    client.connect()
        .then((result) => {
            console.log("db Connected.");
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log("db error: ", err);
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found..';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;