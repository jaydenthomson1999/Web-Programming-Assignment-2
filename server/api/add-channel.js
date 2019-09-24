/* 
    Adds a channel to a users groupList if they are a memeber of a group
*/
module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.put('/api/add-channel', (req, res) => {
        if(!req.body) return res.sendStatus(400);

        dbSettings.MongoClient.connect(dbSettings.url, 
        {poolSize:10,useNewUrlParser: true, useUnifiedTopology: true},
        function(err, client) {
            if(err) throw new Error(err);

            const db = client.db(dbSettings.dbName);
            const collection = db.collection('users');
            const group = req.body.groupName;
            const channel = req.body.channelName;
            const userid = req.body.userid;
            let objectid = new dbSettings.ObjectID(userid);

            // need to check if user has group in adminGroupList
            collection.find({
                $and: [
                    { _id: objectid },
                    { adminGroupList: group }
                ]
            })
            .limit(1).toArray((err, data) => {
                if(err) return res.send(err);

                if(data.length == 0) {
                    return res.send({
                        'add': false, 
                        'comment': 'user doesnt exist or does not have permission'
                    });
                }

                // need to check if channel is already in group
                collection.find({
                    $and: [
                        { _id: objectid },
                        { groupList: {$elemMatch: {
                            groupName: group, 
                            channels: channel
                        }}}
                    ]
                }).count((err, count) => {
                    if(err) return res.send(err);

                    if(count === 0) {
                        // need to add admin to channel
                        collection.updateOne(
                            {_id: objectid, "groupList.groupName": group},
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
                            'comment': 'channel already exists'
                        });
                    }
                });
            });
        });
    });
}