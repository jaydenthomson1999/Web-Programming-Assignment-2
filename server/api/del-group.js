/* 
    If username is a group admin of the group name it will be deleted
    from every users group list if it exists
*/
module.exports = function(app, fs) {
    app.delete('/api/del-group', (req, res) => {
        let { username, groupName } = req.body;
        let adminConfirm = false;

        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if(err) {
                console.log(err);
                res.json({'err': err});
            } else {
                let users = JSON.parse(data);

                // find user
                for(user in users.users) {
                    if(users.users[user].username === username) {
                        // check if user has groupName in admin list
                        for(group in users.users[user].adminGroupList) {
                            if(users.users[user].adminGroupList[group] 
                                === groupName) {
                                    adminConfirm = true;
                                    users.users[user].adminGroupList
                                        .splice(group, 1);
                                }
                        }
                    }
                }

                if(adminConfirm) {
                    // loop through users and delete group from groupList
                    // NOTE this is a very slow method O(N^2) nested loop
                    for(user in users.users) {
                        for(group in users.users[user].groupList) {
                            if(users.users[user].groupList[group].groupName 
                                === groupName) {
                                    users.users[user].groupList.splice(group, 1);                                                                                                              
                            }
                        }
                    }

                    // write new json file
                    fs.writeFile(__dirname + '/../users.json',
                    JSON.stringify(users), err => {
                        if(err) {
                            console.log(err);
                            res.json({'err': err});
                            return;
                        } else {
                            res.json({'delete': true});
                            return;
                        }
                    });
                } else {
                    res.json({
                        'delete': false,
                        'comment': 'is not admin or group doesn\'t exist'
                    });
                }
            }
        });
    });
}