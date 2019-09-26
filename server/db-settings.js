// keeps all mongo settings in oen file

MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectID;
const dbName = 'chat-room';

module.exports.MongoClient = MongoClient;
module.exports.url = url;
module.exports.mongodb = mongodb;
module.exports.ObjectID = ObjectId;
module.exports.dbName = dbName;

// MongoClient.connect(url, {poolSize:10,useNewUrlParser: true,
//     useUnifiedTopology: true},function(err, client) {
//         const dbName = 'chat-room';
//         const db = client.db(dbName);
//         let user = {"username":"super","email":"admin@chat.com","password":"super","type":"super","groupList":[{"groupName":"test group","channels":["main","test channel"]},{"groupName":"one more test","channels":["main"]}],"adminGroupList":["test group","one more test"]}
//         const collection = db.collection('users');

//         collection.find({'username': user.username}).count((err, count) => {
//             if(count == 0) {
//                 collection.insertOne(user, (err, dbres) => {
//                     if(err) throw err;
//                     console.log("Initizalised Database with Super");
//                 });
//             } else {
//                 console.log("Super is ready");
//             }
//         });
// });

// MongoClient.connect(url, {poolSize:10,useNewUrlParser: true,
//     useUnifiedTopology: true},function(err, client) {
//         const dbName = 'chat-room';
//         const db = client.db(dbName);
//         let user = {"username":"super","email":"admin@chat.com","password":"super","type":"super","groupList":[{"groupName":"test group","channels":["main","test channel"]},{"groupName":"one more test","channels":["main"]}],"adminGroupList":["test group","one more test"]}
//         const collection = db.collection('users');

//         collection.find({'username': user.username}).limit(1).toArray((err, data) => {
//             console.log(data);
//         });
// });