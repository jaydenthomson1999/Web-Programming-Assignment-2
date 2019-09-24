/**
 * If admin user is the admin of the group name and del user is a 
 * memeber of the group they will be deleted from the group
 */
module.exports = function(app, fs) {
    const dbSettings = require('../db-settings');

    app.delete('/api/del-user-from-group', (req, res) => {
        // let { adminUser, delUser, groupName } = req.body;
        // let adminPriviledge = false;
        // let userIndex = -1;
        // let groupIndex = -1;

        // console.log({ adminUser, delUser, groupName });

        // // open file
        // fs.readFile(__dirname + '/../users.json', (err, data) => {
        //     if(err) {
        //         console.log(err);
        //         res.json({'err': err});
        //     }
        //     else {
        //         let users = JSON.parse(data);

        //         // checks if user is admin of group
        //         for(user in users.users) {
        //             if(users.users[user].username == adminUser) {
        //                 for(group in users.users[user].adminGroupList){
        //                     if(users.users[user].adminGroupList[group]
        //                         == groupName) {
        //                             adminPriviledge = true;
        //                             break;
        //                         }
        //                 }
        //                 break;
        //             }
        //         }

        //         if(adminPriviledge) {
        //             // find user
        //             for(user in users.users) {
        //                 if(users.users[user].username == delUser) {
        //                     userIndex = user;

        //                     //get group
        //                     for(group in users.users[user].groupList) {
        //                         if(users.users[user].groupList[group].
        //                             groupName == groupName) {
        //                                 groupIndex = group;
        //                             }
        //                     }
        //                 }
        //             }

        //             if(groupIndex >= 0 && userIndex >= 0) {
        //                 // delete group from user
        //                 users.users[userIndex].groupList.splice(groupIndex, 1);
                        
        //                 //write to file
        //                 fs.writeFile(__dirname + '/../users.json',
        //                 JSON.stringify(users), err => {
        //                     if(err) {
        //                         console.log(err);
        //                         res.json({'err': err});
        //                     } else{
        //                         res.json({'delete': true});
        //                     }
        //                 });

        //             } else {
        //                 res.json({
        //                     'delete': false,
        //                     'comment': 'cannot delete group from user'
        //                 });
        //             }
        //         } else {
        //             res.json({
        //                 'delete': false,
        //                 'comment': 'admin does not have priviledge'
        //             });
        //         }
        //     }
        // });

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