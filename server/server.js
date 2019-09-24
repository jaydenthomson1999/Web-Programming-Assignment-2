    
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const server = require('./listen.js');
const bodyParser = require('body-parser');
const fs = require('fs');

//Define port used for the server
const PORT = 3000;

//Apply express middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//user api // mongo refactor done
require(__dirname + '/api/login.js')(app); 
require(__dirname + '/api/add-user.js')(app); 
require(__dirname + '/api/get-users.js')(app);
require(__dirname + '/api/del-user.js')(app); 
 
//group api // mongo refactor done
require(__dirname + '/api/add-group.js')(app);
require(__dirname + '/api/get-groups.js')(app); 
require(__dirname + '/api/add-channel.js')(app);
require(__dirname + '/api/del-group.js')(app);

//users in groups // mongo refactor done
require(__dirname + '/api/add-user-to-group.js')(app);
require(__dirname + '/api/add-user-to-channel.js')(app);
require(__dirname + '/api/del-user-from-group.js')(app);
require(__dirname + '/api/del-user-from-channel.js')(app);

//Start server listening for requests
server.listen(http, PORT);