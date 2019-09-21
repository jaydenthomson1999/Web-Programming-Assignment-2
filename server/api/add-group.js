/*
    Checks to see if group exists, if it doesn't, 
    the new group will be added and will be appended to the adminGroupList of 
    the specified admin
*/

module.exports = function(app, fs) {
    app.put('/api/add-group', (req, res) => {
        let groupName = req.body.groupName;
        let username = req.body.username;
        let foundUser = false;
        let userIndex;

        console.log(req.body);
    
        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if(err) {
                console.log(err);
                res.json({'err': err});
            } else {
                //find user in users json list
                let users = JSON.parse(data);

                for(user in users.users) {
                    if(users.users[user].username === username) {
                        foundUser = true;
                        userIndex = user;
                        break;
                    }
                }

                if(foundUser){
                    // check if they are super or groupAdmin
                    if( users.users[userIndex].type === 'super' || 
                    users.users[userIndex].type === 'group admin') {
                        // check if groupName already exists
                        let groupExits = false;

                        for(group in users.users[userIndex].adminGroupList) {
                            if(users.users[userIndex].adminGroupList[group]
                                === groupName) {
                                groupExits = true;
                            }
                        }

                        if(groupExits){
                            res.json({'add': false, 'comment': 'group exsits'});
                            return;
                        }

                        // add groupName to user
                        let groupJson = {
                            'groupName': groupName, 
                            'channels': ['main']
                        };
                        users.users[userIndex].adminGroupList.push(groupName);
                        users.users[userIndex].groupList.push(groupJson);
                        
                        fs.writeFile(__dirname + '/../users.json', 
                        JSON.stringify(users) , err => {
                            if(err) {
                                console.log(err);
                                res.json({'err': err});
                                return;
                            } else{
                                res.json({'add': true});
                                return;
                            }
                        });
                    }
                    else {
                        // user does not have priviledge
                        res.json({'add': false, 'comment': 'no priviledge'});
                        return;
                    }                    
                } else {
                    res.json({'add': false})
                }
            }
        });
    });
}