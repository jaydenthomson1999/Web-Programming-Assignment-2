/*
    Returns the list of groups and admin groups of a specified user
*/

module.exports = function(app, fs) {
    app.post('/api/get-groups', (req, res) => {
        let { username } = req.body;
        console.log(username);

        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if(err){
                res.json({'err': err});
            }
            else {
                // find username in user.json
                let users = JSON.parse(data);

                for(user in users.users) {
                    console.log(users.users[user]);
                    if(users.users[user].username === username) {
                        res.json({
                            'ok': true,
                            'groupList': users.users[user].groupList, 
                            'adminGroupList': users.users[user].adminGroupList
                        });

                        return;
                    }
                }

                res.json({'ok': false});
            }
        });
    });
}