    
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

//user api
require(__dirname + '/api/login.js')(app, fs);
require(__dirname + '/api/add-user.js')(app, fs);
require(__dirname + '/api/get-users.js')(app, fs);
require(__dirname + '/api/del-user.js')(app, fs);

//group api
require(__dirname + '/api/add-group.js')(app, fs);
require(__dirname + '/api/get-groups.js')(app, fs);
require(__dirname + '/api/add-channel.js')(app, fs);
require(__dirname + '/api/del-group.js')(app, fs);

//users in groups
require(__dirname + '/api/add-user-to-group.js')(app, fs);
require(__dirname + '/api/add-user-to-channel.js')(app, fs);
require(__dirname + '/api/del-user-from-group.js')(app, fs);
require(__dirname + '/api/del-user-from-channel.js')(app, fs);

//Start server listening for requests
server.listen(http, PORT);