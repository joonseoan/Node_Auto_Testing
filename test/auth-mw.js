const { expect } = require('chai');
const auth_mw = require('../middleware/is_auth');
// to test jwt
const jwt = require('jsonwebtoken');

// to get back to the original logic
const sinon = require('sinon');


// describe : a function to group the tests provided by mocha
describe('Auth MW', () => {

    it('should throw an error if no auth header is present', () => {
        const req = {
            get: function() {
                return null;
            }
        };
        expect(auth_mw.bind(this, req, {})).to.throw('Not able to get token from your browser.');
    });
    
    it('should throw an error if the authorization header is only one string', () => {
        const req = {
            get: function() {
                return 'xyz'; // virtual token value to test
            }
    
        }
        // if the token format is not correct,
        //  "authHeader.split()" will generate an error we can't expect
        //  Therefore thow() is empty.
        expect(auth_mw.bind(this, req, {})).to.throw();
    });

    it('should yield a userId after decoding the token', () => {
        const req = {
            get: function() {
                return 'Bear xyz';
            }
        };

        // jwt.verify = { userId: 'abc' };

        /* 
            // might be class but...simplified.

            jwt : {
                verify:  function() {
                    return{ userId: 'abc' }
                }
            }
        */

       // overriding "const decodedToken = jwt.verify(token, 'xxxx');"
       // Therefore, the function below with parameters (token, 'xxx)
       /* 
            jwt: {
                verify: function (token, 'xxx) {
                    return { 
                        token: 'adfafadfafdafd',
                        secrekt 'xxxx'
                    };
                }
            }
       
       */
       // can be replaced with the one as shown up and above in "jwt class!!!!!!!!" package!!!!
        
        // jwt: object
        // verify: a method of the object
        sinon.stub(jwt, 'verify');
        // only for the test, what the value should return!!!!
        jwt.verify.returns({ userId: 'abc' });

        // Since the stub above, it is not required.
        // jwt.verify = function() {
        //     return { userId: 'abc' };
        // }


        auth_mw(req, {}, () => {});

        //  testing "req.userId = decodedToken.userId;"
        expect(req).to.have.property('userId');

        /* 
            Important:
            However, the issue is that once it is replaced with "jwt.verify = function() {
                return { userId: 'abc' };"
                We cannot restore it to the orginal code in a while of testing.
            }

            For instance, jwt.verifiy still returns { userId: 'abc' }
            at the following test.

            In order to keep the code clean with the original logic, we are required to use "stub"

        */

        // additionally test
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;

        // get back to the original function.
        jwt.verify.restore();

    })

    it('should throw an error if the token cannot be verified', () => {
        const req = {
            get: function() {
                return 'Bear xyz';
            }
        }

        // since using stub at the expect above,
        //   it does not return  { userId: 'abc' } any more.
        // jwt.verify = { userId: 'abc' }

        // jwt malformed is from lib, not from my code
        // Therefore I can't test it.
        // expect(auth_mw.bind(this, req, {})).to.throw('jwt malformed');
        expect(auth_mw.bind(this, req, {})).to.throw();
        
    })

})


