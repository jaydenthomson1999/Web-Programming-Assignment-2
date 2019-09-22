/*
    Returns the list of groups and admin groups of a specified user
*/

module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.post('/api/get-groups', (req, res) => {
        if(!req.body) return res.sendStatus(400);

        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');
            const userid = req.body.userid;
            let objectid = new dbSettings.ObjectID(userid);

            collection.find({_id: objectid}).limit(1).toArray((err, data) => {
                if(err) return res.send(err);

                if(data.length == 0) {
                    return res.send({
                        'ok': false, 
                        'comment': 'user doesnt exist'
                    });
                }

                return res.send({
                    'ok': true,
                    'groupList': data[0].groupList,
                    'adminGroupList': data[0].adminGroupList
                });
            });
        });
    });
}