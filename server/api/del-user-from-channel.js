/**
 * If admin is the admin of the group and del user is a memeber of the 
 * channel they will be deleted from the channel
 */

module.exports = function(app) { 
    const dbSettings = require('../db-settings');

    app.delete('/api/del-user-from-channel', (req, res) => {
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
                    // check if user is in channel
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

                        if(count === 1) {
                            // delete channel
                            collection.updateOne(
                                {_id: userid, "groupList.groupName": group},
                                { $pull: {
                                    "groupList.$.channels": channel
                                }},
                                (err, records) => {
                                    if(err) return res.send(err);

                                    if(records.result.nModified) {
                                        return res.send({'delete': true});
                                    } else {
                                        return res.send({
                                            'delete': false, 
                                            'comment': 'error adding to database'
                                        });
                                    }
                                }
                            );
                        } else {
                            return res.send({
                                'delete': false, 
                                'comment': 'user is not in channel'
                            });
                        }
                    });
                } else {
                    return res.send({
                        'delete': false, 
                        'comment': 'admin doesnt exist or doesnt have permission'
                    });
                }
            });
        });
    });
}