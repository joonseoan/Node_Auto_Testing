const mongoose = require('mongoose');
const { expect } = require('chai');

const { mongoKey } = require('../config/keys')
// Fot testing database, use sinon, stub1!!!
const sinon = require('sinon');

// Also, use mongoose.
const User = require('../models/user');

// import Controllers to be verified.
const Auth = require('../controllers/auth');

// BTW, we do not need to test the validation method.

describe('Auth controller - login', function() {

    /* User.findOne({ email })
        .then(user => {

            if(!user) {
                const error = new Error('Unable to find your account.');
                error.statusCode = 401;
                throw error;
            }

            loadedUser = user;
            return bcrypt.compare(password, user.password);

        })
        .then(isMatched => {

            if(!isMatched) {
                const error = new Error('Password is wrong.');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign({
                email : loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'xxxx', { expiresIn : '1h' });

            res.status(200).json({
                token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(e => {
            if(!e.statusCode) {
                e.statusCode = 500;
            }
            next(e);

        }) */

    // pointing the main object
    //  and then entering the mothod to be tested.
    // Sync Done~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*******************************************************
    it('should throw an error if accessing the database fails with the correct status', function(done) {

        sinon.stub(User, 'findOne');

        // defining the expectation. what will happen!
        // this error is deriven by catch statement above.
        User.findOne.throws();

        // 3) dummy request
        const req = {
            body: {
                email: 'not@aadaqaa.com',
                password: 'kkkkkkk'
            }
        };   

        // for async function of "login"
        // 1) put "return" at the end of login function. => go to login function

        // 2) invoke the function
        Auth.login(req, {}, () => {})
            .then(result => {

                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();

            });
            
            
        User.findOne.restore();
    });

    // getUserStatus in Auth Controller
    it('should send a response with a valid user status for an existing user', (done) => {

        /* 
            exports.getStatus = (req, res, next) => {
                const userId = req.userId;
                if(!userId) {
                    const error = new Error('No logged-in user exists, now.');
                    error.statusCode = 401;
                    throw error;
                }

                User.findById(userId)
                    .then(user => {
                        if(!user) {
                            const error = new Error('No logged-in user exists, now.');
                            error.statusCode = 401;
                            throw error;
                        }
                        res.status(200).json({
                            status: user.status
                        });
                    })
                    .catch(e => {
                        if(!e.statusCode) {
                            e.statusCode = 500;
                        }
                        next(e);
                    });
            }
            
        */


        mongoose
        // we need to add a collection for testing. (message ==> test-message) *******
        .connect(`mongodb+srv://joon:${mongoKey}@firstatlas-drwhc.mongodb.net/test-message`, { useNewUrlParser: true })
        
        // building test logic
        .then(() => {

            // when the req.userId is generated, it is not required to be stored again.
            // const user = new User({
            //     email: 'xxxx@xxxx.com',
            //     password: 'ddddd',
            //     name: 'Test',
            //     posts: [],
            //     // externally set up _id for testing!!!
            //     _id: '5cad46f95ceb8237c4e1fall' // must be string 
            // });

            // return user.save();
        })
        .then(user => {
            // need req.userId
            // we need to pass json ({ status: user.status }) which is set as default to the client

            const req = { userId: '5cad46f95ceb8237c4e1faff'};
            
            // initial value to be compared 
            /* 
                // It is chaining implementing internal felds of res.
                // For this reason, "this" must be returned for the next field execution.
                res.status(200).json({
                    status: user.status
                });
            
            */
            const res = {
                statusCode: 500,
                userStatus: null,
                status: function(code) {
                    this.statusCode = code;
                    
                    // Must be "this", not this.statusCode
                    // becaus without this. we can't call "json()" method.!!!!!!!!!!!11
                    console.log('this: ', this)
                    return this;
                },

                // "data": { status: user.status }
                json: function(data) {

                    console.log(data);
                    this.userStatus = data.status;
                }
            };

            Auth.getStatus(req, res, () => {})
            .then(() => {
                console.log('res: ', res)
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('I am new');
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });

    });
});
