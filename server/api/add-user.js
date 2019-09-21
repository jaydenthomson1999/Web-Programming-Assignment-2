/*  Searches through whole user.json file to see if newUser.username exists, 
    if it doesn't, they will be added as a new user
*/

module.exports = function(app, fs) {
    app.put('/api/add-user', (req, res) => {
        let new_user = req.body;

        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if (err) {
                console.log(err);
                res.json({'err': err});
            }
            else {
                //check if user exits
                let users = JSON.parse(data);

                for(user in users.users) {
                    if(users.users[user].username == new_user.username) {
                        res.json({'add': false});
                        return;
                    }
                }
                new_user.groupList = [];
                new_user.adminGroupList = [];
                users.users.push(new_user);

                fs.writeFile(__dirname + '/../users.json', JSON.stringify(users)
                , err => {
                    if(err) {
                        console.log(err);
                        res.json({'err': err});
                    } else{
                        res.json({'add': true});
                    }
                });
            }
        });
    }); 
}
