/* 
    If username is a group admin of the group name it will be deleted
    from every users group list if it exists
*/
module.exports = function(app) {
    const dbSettings = require('../db-settings');

    app.delete('/api/del-group', (req, res) => {
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

            //find user id and check if they are admin
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
                        'delete': false, 
                        'comment': 'user doesnt exist or does not have permission'
                    });
                }

                collection.updateOne(
                    {_id: objectid},
                    {$pull: {adminGroupList: group}},
                    (err, data) => {
                        if(err) return res.send(err);
                        if(data.result.nModified) {
                            //delete group from all users
                            collection.updateMany(
                                { groupList: {$elemMatch: {groupName: group}}},
                                {$pull: {groupList: {groupName: group}}},
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
                                'comment': 'error deleting from database admin list'
                            });
                        }
                    }
                );
            });
        });
    });
}