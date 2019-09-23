/*
    Checks to see if group exists, if it doesn't, 
    the new group will be added and will be appended to the adminGroupList of 
    the specified admin
*/

module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.put('/api/add-group', (req, res) => {
        if(!req.body) return res.sendStatus(400);
        
        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');
            const group = req.body.groupName;
            const userid = req.body.userid;
            let objectid = new dbSettings.ObjectID(userid);
            
            collection.find({_id: objectid}).limit(1).toArray((err, data) => {
                if(err) return res.send(err);

                if(data.length == 0) {
                    return res.send({
                        'add': false, 
                        'comment': 'user doesnt exist'
                    });
                }

                // user has permission
                if(data[0].type === 'super' || data[0].type === 'group admin') {
                    collection.find({
                        groupList: {$elemMatch: {groupName: group}}
                    }).count((err, count) => {
                        if(err) return res.send(err);

                        if(count === 0) {
                            let groupItem = {
                                groupName: group,
                                channels: [
                                    "main"
                                ]
                            };

                            collection.updateOne(
                                {_id: objectid},
                                {$push: 
                                    {groupList: groupItem, 
                                    adminGroupList: group }
                                },
                                (err, records) => {
                                    if(err) return res.send(err);
                                    
                                    if(records.result.nModified) {
                                        return res.send({'add': true});
                                    } else {
                                        return res.send({
                                            'add': false, 
                                            'comment': 'error adding to database'
                                        });
                                    }
                                }
                            );
                        } else {
                            return res.send({
                                'add': false, 
                                'comment': 'group exists'
                            });
                        }
                    });
                } else {
                    return res.send({
                        'add': false, 
                        'comment': 'no permission'
                    });
                }
            });
        });
    });
}