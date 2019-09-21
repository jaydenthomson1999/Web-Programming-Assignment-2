/*
    Returns array of users except the super user
*/

module.exports = function(app, fs) {
    const dbSettings = require('../db-settings');

    app.get('/api/get-users', (req, res) => {
        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');

            collection.find({}).toArray((err, data) => {
                if(err) return res.send(err);

                return res.send(data);
            });
        });
    });
}