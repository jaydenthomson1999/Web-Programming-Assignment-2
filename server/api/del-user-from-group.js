/**
 * If admin user is the admin of the group name and del user is a 
 * memeber of the group they will be deleted from the group
 */
module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.delete('/api/del-user-from-group', (req, res) => {
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

                        if(count === 1) {
                            collection.updateOne(
                                { _id: userid },
                                { $pull: {groupList: {groupName: group}} },
                                (err, data) => {
                                    if(err) return res.send(err);

                                    if(data.result.nModified) {
                                        return res.send({'delete': true});
                                    } else {
                                        return res.send({
                                            'delete': false, 
                                            'comment': 'error deleting from database user group list'
                                        });
                                    }
                                }
                            );
                        } else {
                            return res.send({
                                'delete': false, 
                                'comment': 'user is not a group memeber'
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