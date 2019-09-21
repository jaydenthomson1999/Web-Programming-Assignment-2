/* 
    Finds user in user.json and removes it from the file
*/

module.exports = function(app, fs) {
    app.delete('/api/del-user', (req, res) => {
        let foundUser = false;
        let userIndex;

        console.log(req.body);

        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if (err) {
                console.log(err)
                res.json({'err': err});
            } else {
                let users = JSON.parse(data);

                for(user in users.users) {
                    if(users.users[user].username === req.body.username) {
                        foundUser = true;
                        userIndex = user;
                        break;
                    }
                }

                if(foundUser) {
                    if( users.users[userIndex].type !== 'super') {

                        users.users.splice(userIndex,1);
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
                    }
                } else {
                    res.json({
                        'delete': false,
                        'comment': 'user does not exists'
                    });
                }
            }
        });
    });
}