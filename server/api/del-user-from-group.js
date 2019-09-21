/**
 * If admin user is the admin of the group name and del user is a 
 * memeber of the group they will be deleted from the group
 */
module.exports = function(app, fs) {
    app.delete('/api/del-user-from-group', (req, res) => {
        let { adminUser, delUser, groupName } = req.body;
        let adminPriviledge = false;
        let userIndex = -1;
        let groupIndex = -1;

        console.log({ adminUser, delUser, groupName });

        // open file
        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if(err) {
                console.log(err);
                res.json({'err': err});
            }
            else {
                let users = JSON.parse(data);

                // checks if user is admin of group
                for(user in users.users) {
                    if(users.users[user].username == adminUser) {
                        for(group in users.users[user].adminGroupList){
                            if(users.users[user].adminGroupList[group]
                                == groupName) {
                                    adminPriviledge = true;
                                    break;
                                }
                        }
                        break;
                    }
                }

                if(adminPriviledge) {
                    // find user
                    for(user in users.users) {
                        if(users.users[user].username == delUser) {
                            userIndex = user;

                            //get group
                            for(group in users.users[user].groupList) {
                                if(users.users[user].groupList[group].
                                    groupName == groupName) {
                                        groupIndex = group;
                                    }
                            }
                        }
                    }

                    if(groupIndex >= 0 && userIndex >= 0) {
                        // delete group from user
                        users.users[userIndex].groupList.splice(groupIndex, 1);
                        
                        //write to file
                        fs.writeFile(__dirname + '/../users.json',
                        JSON.stringify(users), err => {
                            if(err) {
                                console.log(err);
                                res.json({'err': err});
                            } else{
                                res.json({'delete': true});
                            }
                        });

                    } else {
                        res.json({
                            'delete': false,
                            'comment': 'cannot delete group from user'
                        });
                    }
                } else {
                    res.json({
                        'delete': false,
                        'comment': 'admin does not have priviledge'
                    });
                }
            }
        });
    });
}