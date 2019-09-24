/*  Finds user in user.json file and checks to see 
    if there password matches one on record
*/

module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.post('/api/login', (req, res) => {
        if(!req.body) return res.sendStatus(400);

        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');
            let {username, password} = req.body;
            collection.find({username: username, password: password}).limit(1)
            .toArray((err, data) => {
                if(err) return res.send(err);

                if(data.length) {
                    delete data[0].password;
                    return res.send({
                        'ok': true,
                        'user': data[0]
                    });
                } else {
                    return res.send({
                        'ok': false,
                        'comment': "username or password was incorrect"
                    });
                }
            });
        });
    });
}