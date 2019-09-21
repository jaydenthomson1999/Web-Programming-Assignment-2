/*  Finds user in user.json file and checks to see 
    if there password matches one on record
*/

// _id: 5d85e53edfd0b3564450d884

module.exports = function(app, fs) {
    const dbSettings = require('../db-settings');

    app.post('/api/login', (req, res) => {
        if(!req.body) return res.sendStatus(400);

        dbSettings.MongoClient.connect(dbSettings.url, 
            {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
            function(err, client) {
                const db = client.db(dbSettings.dbName);
                const collection = db.collection('users');
                let {userid, password} = req.body;
                let objectid = new dbSettings.ObjectID(userid);

                collection.find({_id: objectid, password: password}).limit(1).toArray((err, data) => {
                    if(data.length) {
                        delete data[0].password;

                        res.send({
                            'ok': true,
                            'user': data[0]
                        });
                    } else {
                        res.send({
                            'ok': false,
                            'comment': "username or password was incorrect"
                        });
                    }
                });
        });
    });
}