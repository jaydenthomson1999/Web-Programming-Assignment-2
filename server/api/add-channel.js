/* 
    Adds a channel to a users groupList if they are a memeber of a group
*/
module.exports = function(app, fs) {
    app.put('/api/add-channel', (req, res) => {
        let {username, groupName, channelName} = req.body;
        
        // User
        let userIndex = -1;
        let userIsAdmin = false;

        // Group
        let groupIndex = -1;

        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if(err) {
                console.log(err);
                res.json({'err': err});
            } else {
                let users = JSON.parse(data);

                // find user
                for(user in users.users) {
                    if(users.users[user].username === username) {
                        userIndex = user;
                        // check if user is admin
                        for(group in users.users[userIndex].adminGroupList) {
                            if( users.users[userIndex].adminGroupList[userIndex] 
                                === groupName) {
                                    userIsAdmin = true;
                                    break;
                                }
                        }
                        break;
                    }
                }

                if(userIsAdmin) {
                    //find group
                    for(group in users.users[userIndex].groupList) {
                        if(users.users[userIndex].groupList[group].groupName 
                            === groupName) {
                                groupIndex = group;
                                break;
                            }
                    }

                    if(groupIndex >= 0) {
                        //add channel to group
                        users.users[userIndex].groupList[groupIndex].channels
                            .push(channelName);

                        fs.writeFile(__dirname + '/../users.json', 
                        JSON.stringify(users), err => {
                            if(err) {
                                console.log(err);
                                res.json({'err': err});
                                return;
                            } else {
                                res.json({'add': true});
                                return;
                            }
                        });

                    } else {
                        res.json({
                            'add': false,
                            'comment': 'is admin of group that doesn\'t exist'
                        });
                    }
                } else {
                    res.json({
                        'add': false,
                        'comment': 'is not admin or user doesn\'t exist'
                    });
                }
            }
        });

    });
}