/*
    Checks to see if group exists, if it doesn't, 
    the new group will be added and will be appended to the adminGroupList of 
    the specified admin
*/

module.exports = function(app, fs) {
    const dbSettings = require('../db-settings');

    app.put('/api/add-group', (req, res) => {
        // let groupName = req.body.groupName;
        // let username = req.body.username;
        // let foundUser = false;
        // let userIndex;

        // console.log(req.body);
    
        // fs.readFile(__dirname + '/../users.json', (err, data) => {
        //     if(err) {
        //         console.log(err);
        //         res.json({'err': err});
        //     } else {
        //         //find user in users json list
        //         let users = JSON.parse(data);

        //         for(user in users.users) {
        //             if(users.users[user].username === username) {
        //                 foundUser = true;
        //                 userIndex = user;
        //                 break;
        //             }
        //         }

        //         if(foundUser){
        //             // check if they are super or groupAdmin
        //             if( users.users[userIndex].type === 'super' || 
        //             users.users[userIndex].type === 'group admin') {
        //                 // check if groupName already exists
        //                 let groupExits = false;

        //                 for(group in users.users[userIndex].adminGroupList) {
        //                     if(users.users[userIndex].adminGroupList[group]
        //                         === groupName) {
        //                         groupExits = true;
        //                     }
        //                 }

        //                 if(groupExits){
        //                     res.json({'add': false, 'comment': 'group exsits'});
        //                     return;
        //                 }

        //                 // add groupName to user
        //                 let groupJson = {
        //                     'groupName': groupName, 
        //                     'channels': ['main']
        //                 };
        //                 users.users[userIndex].adminGroupList.push(groupName);
        //                 users.users[userIndex].groupList.push(groupJson);
                        
        //                 fs.writeFile(__dirname + '/../users.json', 
        //                 JSON.stringify(users) , err => {
        //                     if(err) {
        //                         console.log(err);
        //                         res.json({'err': err});
        //                         return;
        //                     } else{
        //                         res.json({'add': true});
        //                         return;
        //                     }
        //                 });
        //             }
        //             else {
        //                 // user does not have priviledge
        //                 res.json({'add': false, 'comment': 'no priviledge'});
        //                 return;
        //             }                    
        //         } else {
        //             res.json({'add': false})
        //         }
        //     }
        // });
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
                                () => {
                                    return res.send({'add': true});
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