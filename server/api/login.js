/*  Finds user in user.json file and checks to see 
    if there password matches one on record
*/
module.exports = function(app, fs) {
    app.post('/api/login', (req, res) => {
        let {username, password} = req.body;
        let ok = false;
        
        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if (err) {
                res.json({'err': err});
            }
            else {
                let users = JSON.parse(data);
                
                for(user in users.users) {
                    if(users.users[user].username == username) {
                        if(users.users[user].password == password) {
                            ok = true;
                            delete users.users[user].password;

                            res.json({
                                'ok': true, 
                                'user': users.users[user]
                            });
                        }
                        else 
                            break;
                    }
                }
                
                if(!ok)
                    res.json({'ok': false});
            }
        });
    });
}