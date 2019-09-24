/**
 * Adds user to a channel if user is already a memeber of the group and 
 * adminUser is an admin of the group
 */

module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.put('/api/add-user-to-channel', (req, res) => {
        if(!req.body) return res.sendStatus(400);

        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');
            const group = req.body.groupName;
            const channel = req.body.channelName;
            let adminid = new dbSettings.ObjectID(req.body.adminid);
            let userid = new dbSettings.ObjectID(req.body.userid);

            // check if admin has group in adminGroupList
            collection.find({
                $and: [
                    { _id: adminid },
                    { adminGroupList: group },
                    { groupList: {$elemMatch: {
                        groupName: group, 
                        channels: channel
                    }}}
                ]
            })
            .count((err, count) => {
                if(err) return res.send(err);

                if(count === 1) {
                    // check if channel exists in group
                    collection.find({
                        $and: [
                            { _id: userid },
                            { groupList: {$elemMatch: {
                                groupName: group, 
                                channels: channel
                            }}}
                        ]
                    })
                    .count((err, count) => {
                        if(err) return res.send(err);
                        if(count === 0) {
                            // add channel
                            collection.updateOne(
                                {_id: userid, "groupList.groupName": group},
                                { $push: {
                                        "groupList.$.channels": channel
                                    }
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
                                'comment': 'user already in channel'
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