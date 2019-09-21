/* 
    Finds user in user.json and removes it from the file
*/

module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.delete('/api/del-user', (req, res) => {
        if(!req.body) return res.sendStatus(400);

        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');
            const userid = req.body.userid;
            let objectid = new dbSettings.ObjectID(userid);

            collection.deleteOne({_id: objectid}, (err, docs) => {
                if(err) return res.send(err);
                
                if(docs.deletedCount) 
                    return res.send({'delete': true});
                else {
                    return res.send({
                        'delete': false,
                        'comment': 'user does not exist'
                    });
                }
            });
        });
    });
}