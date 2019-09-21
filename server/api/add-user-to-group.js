/**
 * Adds user to a group if adminUser is the admin of the group name
 */

module.exports = function(app, fs) {
    app.put('/api/add-user-to-group', (req, res) => {
        let { adminUser, addUser, groupName } = req.body;
        let foundAddUser = false;
        let adminPriviledge = false;
        let groupExists = false;
        let userIndex;

        // open file
        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if(err) {
                console.log(err);
                res.json({'err': err});
            }
            else {
                // checks if addUser exsits
                let users = JSON.parse(data);

                for(user in users.users) {
                    if(users.users[user].username == addUser) {
                        foundAddUser = true;
                        userIndex = user;
                        break;
                    }
                }

                if(foundAddUser) {
                    // check if adminUser has groupName in there admin list
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
                        //check if user is a group memeber

                        for(group in users.users[userIndex].groupList) {
                            if(users.users[userIndex].groupList[group].groupName 
                                == groupName) {
                                    groupExists = true;
                                    break;
                                }
                        }

                        if(!groupExists) {
                            // add user to group
                            const group = {
                                'groupName': groupName,
                                'channels' : [
                                    'main'
                                ]
                            }
                            
                            users.users[userIndex].groupList.push(group);
                            

                            //write to file
                            fs.writeFile(__dirname + '/../users.json',
                            JSON.stringify(users), err => {
                                if(err) {
                                    console.log(err);
                                    res.json({'err': err});
                                } else{
                                    res.json({'add': true});
                                }
                            });
                        } 
                        // well this is a mess
                        else {
                            res.json({
                                'add': false,
                                'comment': 'user is already a memeber'
                            });
                        }
                    } else {
                        res.json({
                            'add': false,
                            'comment': 'admin does not have priviledge'
                        });
                    }
                } else {
                    res.json({
                        'add': false,
                        'comment': 'user does not exist'
                    });
                }
            }
        });
    });
}