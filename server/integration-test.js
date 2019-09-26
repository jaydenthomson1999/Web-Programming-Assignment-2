const assert = require('assert');
const app = require('./server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const should = chai.should();
chai.use(chaiHttp);

let testData = {
    username: "johndoe",
    password: "password",
    email: "email",
    type: "basic"
};
let testID;
let superID;
let testGroup = 'test';
let testChannel = 'test';

describe('Server Integration Test', () => {

    describe('/api/login', () => {
        it('should log in with correct credential', done => {
            chai.request(app)
            .post('/api/login').type('form')
            .send({ 'username': 'super', 'password': 'super' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.ok.should.equal(true);
                res.body.user.should.have.property('_id');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('type');
                res.body.user.should.have.property('groupList');
                res.body.user.should.have.property('adminGroupList');
                done();
            });
        });

        it('should not log in with incorrect credential', done => {
            chai.request(app)
            .post('/api/login').type('form')
            .send({ 'username': 'wrong', 'password': 'credentials' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.ok.should.equal(false);
                res.body.comment.should.equal("username or password was incorrect");
                done();
            });
        });
    });

    describe('/api/add-user', () => {
        it('should be able to add a user with new username', done => {
            chai.request(app)
            .put('/api/add-user')
            .send(testData)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(true);
                done();
            });
        });

        it('should not be able to add a user with same username', done => {
            chai.request(app)
            .put('/api/add-user')
            .send(testData)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(false)
                done();
            });
        });
    });

    describe('/api/get-users', () => {
        it('should get response in the type of an array', done => {
            chai.request(app)
                .get('/api/get-users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('should get a super user in the resposne and recently added test data', done => {
            chai.request(app)
            .get('/api/get-users')
            .end((err, res) => {
                let superUser = res.body.find((user) => user.username === 'super');
                let testUser = res.body.find((user) => user.username === testData.username);
                superUser.should.not.equal(undefined);
                testUser.should.not.equal(undefined);
                superID = superUser._id;
                testID = testUser._id;
                done();
            });
        });
    });

    describe('/api/add-group', () => {
        it('should be able to add a new group to the database', done => {
            superID.should.be.a('string');
            chai.request(app)
            .put('/api/add-group')
            .send({userid: superID, groupName: testGroup})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(true);
                done();
            });
        });

        it('should not be able to add recently added group to database', done => {
            superID.should.be.a('string');
            chai.request(app)
            .put('/api/add-group')
            .send({userid: superID, groupName: testGroup})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(false);
                done();
            });
        });
    });

    describe('/api/get-groups', () => {
        it('should be able to get groups of super', done => {
            superID.should.be.a('string');
            chai.request(app)
            .post('/api/get-groups')
            .send({userid: superID})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.ok.should.equal(true);
                res.body.should.have.property('groupList');
                res.body.should.have.property('adminGroupList');
                done();
            });
        });

        it('should not be able to get group of user that doesnt exist', done => {
            chai.request(app)
            .post('/api/get-groups')
            .send({userid: '5d889349cd6f475774accf7c'}) //im assuming this doesn't exist in database
            .end((err, res) => {
                res.should.have.status(200);
                res.body.ok.should.equal(false);
                res.body.comment.should.equal('user doesnt exist');
                done();
            });
        });
    });

    describe('/api/add-channel', () => {
        it('should be able to add channel to a group that a user is admin of', done => {
            superID.should.be.a('string');
            chai.request(app)
            .put('/api/add-channel')
            .send({userid: superID, groupName: testGroup, channelName: testChannel})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(true);
                done();
            });
        });

        it('should not be able to add channel to a group that was already added', done => {
            superID.should.be.a('string');
            chai.request(app)
            .put('/api/add-channel')
            .send({userid: superID, groupName: testGroup, channelName: testChannel})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(false);
                res.body.comment.should.equal('channel already exists');
                done();
            });
        });
    });

    describe('/api/add-user-to-group', () => {
        it('should be able to add a user to a group', done => {
            superID.should.be.a('string');
            testID.should.be.a('string');

            chai.request(app)
            .put('/api/add-user-to-group')
            .send({adminid: superID, userid: testID, groupName: testGroup})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(true);
                done();
            });
        });

        it('should not be able to add a user to a group if they are already a memeber', done => {
            superID.should.be.a('string');
            testID.should.be.a('string');

            chai.request(app)
            .put('/api/add-user-to-group')
            .send({adminid: superID, userid: testID, groupName: testGroup})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(false);
                res.body.comment.should.equal('user is already memeber');
                done();
            });
        });

    });

    describe('/api/add-user-to-channel', () => {
        it('should be able to add a user to a channel if they are a memeber', done => {
            superID.should.be.a('string');
            testID.should.be.a('string');

            chai.request(app)
            .put('/api/add-user-to-channel')
            .send({adminid: superID, userid: testID, groupName: testGroup, channelName: testChannel})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(true);
                done();
            });
        });

        it('should not be able to add a user to a channel if they are already a channel memeber', done => {
            superID.should.be.a('string');
            testID.should.be.a('string');

            chai.request(app)
            .put('/api/add-user-to-channel')
            .send({adminid: superID, userid: testID, groupName: testGroup, channelName: testChannel})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.add.should.equal(false);
                res.body.comment.should.equal('user already in channel');
                done();
            });
        });
    });

    describe('/api/del-user-from-channel', () => {
        it('should be able to delete a user from a channel if they are a memeber', done => {
            superID.should.be.a('string');
            testID.should.be.a('string');

            chai.request(app)
            .delete('/api/del-user-from-channel')
            .send({adminid: superID, userid: testID, groupName: testGroup, channelName: testChannel})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.delete.should.equal(true);
                done();
            });
        });

        it('should not be able to delete a user from a channel they are not a memeber of', done => {
            superID.should.be.a('string');
            testID.should.be.a('string');

            chai.request(app)
            .delete('/api/del-user-from-channel')
            .send({adminid: superID, userid: testID, groupName: testGroup, channelName: testChannel})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.delete.should.equal(false);
                res.body.comment.should.equal('user is not in channel');
                done();
            });
        });
    });

    describe('/api/del-user-from-group', () => {
        it('should be able to delete a user from a group', done => {
            superID.should.be.a('string');
            testID.should.be.a('string');

            chai.request(app)
            .delete('/api/del-user-from-group')
            .send({adminid: superID, userid: testID, groupName: testGroup})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.delete.should.equal(true);
                done();
            });
        });

        it('should not be able to delete a user from a group if they are not a memeber', done => {
            superID.should.be.a('string');
            testID.should.be.a('string');

            chai.request(app)
            .delete('/api/del-user-from-group')
            .send({adminid: superID, userid: testID, groupName: testGroup})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.delete.should.equal(false);
                res.body.comment.should.equal('user is not a group memeber');
                done();
            });
        });
    });

    describe('/api/del-group', () => {
        it('should delete group from database', (done) => {
            superID.should.be.a('string');
            chai.request(app)
            .delete('/api/del-group')
            .send({userid: superID, groupName: testGroup})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.delete.should.equal(true);
                done();
            });
        });

        it('should not delete group from database that was already deleted', (done) => {
            superID.should.be.a('string');
            chai.request(app)
            .delete('/api/del-group')
            .send({userid: superID, groupName: testGroup})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.delete.should.equal(false);
                done();
            });
        });
    });

    describe('/api/del-user', () => {
        it('should delete user that is in database', (done)=> {
            testID.should.be.a('string');
            chai.request(app)
            .delete('/api/del-user')
            .send({userid: testID})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.delete.should.equal(true);
                done();
            });
        });

        it('should not delete user that was recently deleted', (done)=> {
            testID.should.be.a('string');
            chai.request(app)
            .delete('/api/del-user')
            .send({userid: testID})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.delete.should.equal(false);
                done();
            });
        });
    });
    
});