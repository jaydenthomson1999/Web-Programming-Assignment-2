/*  Searches through whole user.json file to see if newUser.username exists, 
    if it doesn't, they will be added as a new user
*/

module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.put('/api/add-user', (req, res) => {
        if(!req.body) return res.sendStatus(400);

        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');
            let new_user = req.body;
            new_user.groupList = [];
            new_user.adminGroupList = [];

            //check if username exists
            collection.find({username: new_user.username})
            .count((err, count) => {
                if(count == 0) {
                    collection.insertOne(new_user, (err, dbres) => {
                        if(err) return res.send(err);
                        return res.send({'add': true});
                    });
                } else {
                    res.send({'add': false});
                }
            });
        });
    }); 
}
