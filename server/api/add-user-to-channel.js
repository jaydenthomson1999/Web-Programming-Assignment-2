/**
 * Adds user to a channel if user is already a memeber of the group and 
 * adminUser is an admin of the group
 */

module.exports = function(app, fs) {
    app.put('/api/add-user-to-channel', (req, res) => {
        let { adminUser, addUser, groupName, channelName } = req.body;
        let adminOk = false;
        let channelExist = false;

        let foundAddUser = false;
        let userIndex;

        let isGroupMember = false;
        let groupIndex;

        let isChannelMember = false;

        // open file
        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if(err) {
                console.log(err);
                res.json({'err': err});
            } 
            else {
                let users = JSON.parse(data);

                // check if adminUser has groupName in there admin list
                for(user in users.users) {
                    if(users.users[user].username == adminUser) {
                        for(group in users.users[user].adminGroupList){
                            if(users.users[user].adminGroupList[group]
                                == groupName) {
                                    adminOk = true;
                                    break;
                                }
                        }

                        // check if channel exists
                        for(group in users.users[user].groupList) {
                            if(users.users[user].groupList[group].
                                groupName == groupName) {
                                    for(channel in users.users[user].
                                        groupList[group].channels) {
                                            if(users.users[user].
                                                groupList[group].
                                                channels[channel] 
                                                == channelName) {
                                                    channelExist = true;
                                                }
                                        }
                                }
                        }
                        break;
                    }
                }

                if(adminOk && channelExist) {
                    // check if add user exists
                    for(user in users.users) {
                        if(users.users[user].username == addUser) {
                            foundAddUser = true;
                            userIndex = user;

                            // check if group memeber
                            for(group in users.users[user].groupList) {
                                if(users.users[user].groupList[group].groupName
                                    == groupName) {
                                        isGroupMember = true;
                                        groupIndex = group;

                                        //check if channel memeber
                                        for(channel in users.users[user].
                                            groupList[group].channels) {
                                            if(users.users[user].
                                                groupList[group].
                                                channels[channel]
                                                == channelName) {
                                                    isChannelMember = true;
                                                }
                                        }
                                    }
                            }                            

                            break;
                        }
                    }

                    if(foundAddUser && isGroupMember && !isChannelMember) {
                        users.users[userIndex].groupList[groupIndex].
                            channels.push(channelName);
                        
                        // write to file
                        fs.writeFile(__dirname + '/../users.json',
                            JSON.stringify(users), err => {
                                if(err) {
                                    console.log(err);
                                    res.json({'err': err});
                                } else{
                                    res.json({'add': true});
                                }
                        });
                    } else {
                        res.json({
                            'add': false,
                            'comment': 'cannnot add user to channel'
                        });
                    }
                } else {
                    res.json({
                        'add': false,
                        'comment': 'admin does not have priviledge'
                    });
                }
            }
        });
    });
}