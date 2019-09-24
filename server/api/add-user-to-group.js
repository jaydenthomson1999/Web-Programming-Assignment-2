/**
 * Adds user to a group if adminUser is the admin of the group name
 */

module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.put('/api/add-user-to-group', (req, res) => {
        if(!req.body) return res.sendStatus(400);

        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');
            const group = req.body.groupName;
            let adminid = new dbSettings.ObjectID(req.body.adminid);
            let userid = new dbSettings.ObjectID(req.body.userid);

            // check if admin has group in adminGroupList
            collection.find({
                $and: [
                    { _id: adminid },
                    { adminGroupList: group }
                ]
            })
            .count((err, count) => {
                if(err) return res.send(err);

                if(count === 1) {
                    collection.find({
                        $and: [
                            { _id: userid },
                            { groupList: {$elemMatch: {groupName: group}} }
                        ]
                    })
                    .count((err, count) => {
                        if(err) return res.send(err);

                        if(count === 0) {
                            // add user to group
                            let groupItem = {
                                groupName: group,
                                channels: [
                                    "main"
                                ]
                            };

                            collection.updateOne(
                                { _id: userid },
                                { $push:
                                    {
                                        groupList: groupItem
                                    }
                                },
                                (err, records) => {
                                    if(err) return res.send(err);

                                    if(records.result.nModified) {
                                        return res.send({'add': true});
                                    } else {
                                        return res.send({
                                            'add': false, 
                                            'comment': 'user does not exist'
                                        });
                                    }
                                }
                            );
                        } else {
                            return res.send({
                                'add': false, 
                                'comment': 'user is already memeber'
                            });
                        }
                    });        
                } else {
                    return res.send({
                        'add': false, 
                        'comment': 'admin doesnt exist or doesnt have permission'
                    });
                }
            });
        });
    });
}