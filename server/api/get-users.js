/*
    Returns array of users except the super user
*/

module.exports = function(app, fs) {
    app.get('/api/get-users', (req, res) => {
        fs.readFile(__dirname + '/../users.json', (err, data) => {
            if (err) {
                res.json({'err': err});
            }
            else {
                let users = JSON.parse(data);
                users.users.splice(0,1);
                res.json({'ok': true, 'users': users});
            }
        });
    });
}