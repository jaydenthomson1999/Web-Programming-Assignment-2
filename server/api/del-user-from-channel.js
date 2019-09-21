/**
 * If admin is the admin of the group and del user is a memeber of the 
 * channel they will be deleted from the channel
 */

module.exports = function(app, fs) { 
    app.delete('/api/del-user-from-channel', (req, res) => {
        let { adminUser, delUser, groupName, channelName } = req.body;
        let adminPriviledge = false;
        let userIndex = -1;
        let groupIndex = -1;
        let channelIndex = -1;

        if(channelName == 'main') {
            res.json({
                'delete': false,
                'comment': 'cannot delete main channel'
            });
        } else {
            // open file
            fs.readFile(__dirname + '/../users.json', (err, data) => {
                if(err) {
                    console.log(err);
                    res.json({'err': err});
                }
                else {
                    let users = JSON.parse(data);

                    //checks if user is admin of group
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

                                //find group
                                for(group in users.users[user].groupList) {
                                    if(users.users[user].groupList[group].
                                        groupName == groupName) {
                                            groupIndex = group;

                                            //find channel
                                            for(channel in users.users[user].
                                                groupList[group].channels) {
                                                    if(users.users[user].
                                                        groupList[group].
                                                        channels[channel] == 
                                                        channelName) {
                                                            channelIndex = channel;
                                                    }
                                                }

                                        }
                                }
                            }
                        }

                        if(channelIndex >= 0 && groupIndex >= 0 && userIndex >= 0) {
                            // delete channel from user
                            users.users[userIndex].groupList[groupIndex].channels.
                            splice(channelIndex, 1);

                            // write to file
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
                                'comment': 'cannot delete channel from user'
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
        }
    });
}