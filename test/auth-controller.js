const { expect } = require('chai');
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
                email: 'not@aadaaa.com',
                password: 'kkkkkkk'
            }
        };   

        // for async function of "login"
        // 1) put "return" at the end of login function. => go to login function

        // 2) invoke the function
        Auth.login(req, {}, () => {}).expect(result => {
            console.log('resultrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr: ', result);
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            // done();
            
            // User.findOne.restore();
            // must put done to let it know the async is finished
            // done();

            // we should know
            // without done(); ==> pass
            // with done() ==> fail
            // expect(result).to.have.property('statusCode', 200);
            
        })
        .end((err, result) => {
            if(err) done(err);
            User.findOne.restore();
            done();
        })
        //.catch(e => {
            // console.log('eeeeeeeeeeeeeeeeeee: ', e);
            // done();
        // })
        // get back to the original function
       //  User.findOne.restore();
       
    });
});
