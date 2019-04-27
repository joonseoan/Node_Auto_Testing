const mongoose = require('mongoose');
const { expect } = require('chai');
const sinon = require('sinon');

const { mongoKey } = require('../config/keys');
const User = require('../models/user');
const Feed = require('../controllers/feed');

describe('Feed controller', function() {

    before(function(done) {
        mongoose
        .connect(`mongodb+srv://joon:${mongoKey}@firstatlas-drwhc.mongodb.net/test-message`, { useNewUrlParser: true })
        .then(() => {
            // Still need dummy user.
            const user = new User({
                email: 'xxxx@xxxx.com',
                password: 'ddddd',
                name: 'Test',
                posts: [],
                _id: '5cad46f95ceb8237c4e1faff' // must be string 
            });

            return user.save();
        })
        .then(() => {
            done();
        });

    });

    beforeEach(function() {});
    afterEach(function() {});

    it('should add a created post to the posts of the creator', function(done) {

        const req = {
            body: {
               title:'Test',
               content: 'A Test Post',
            },
            // from multer
            file: {
                path: 'imageURL'
            },
            // from isAuth m/w
            userId: '5cad46f95ceb8237c4e1faff'
        };   

        // just need to test creator
        // Therefore status and json do not need to do anyting. 
        const res = {
            status: function() { 
                return this; 
            },
            json: function() {

            }
        }

        // because createPost returns savedUser
        Feed.createPost(req, res, () => {})
            .then(savedUser => {
                expect(savedUser).to.have.property('posts');
                expect(savedUser.posts).to.have.length(1);
                done();

            });
            
    });


    after(function(done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            }); 
    })
});


// const expect = require('chai').expect;
// const sinon = require('sinon');
// const mongoose = require('mongoose');

// const User = require('../models/user');
// const FeedController = require('../controllers/feed');

// describe('Feed Controller', function() {
// //   before(function(done) {
// //     mongoose
// //       .connect(
// //         `mongodb+srv://joon:${mongoKey}@firstatlas-drwhc.mongodb.net/test-message`, { useNewUrlParser: true }
// //       )
// //       .then(result => {
// //         const user = new User({
// //           email: 'test@test.com',
// //           password: 'tester',
// //           name: 'Test',
// //           posts: [],
// //           _id: '5c0f66b979af55031b34728a'
// //         });
// //         return user.save();
// //       })
// //       .then(() => {
// //         done();
// //       });
// //   });

//     before(function(done) {
//         mongoose
//         .connect(`mongodb+srv://joon:${mongoKey}@firstatlas-drwhc.mongodb.net/test-message`, { useNewUrlParser: true })
//         .then(() => {
//             // Still need dummy user.
//             const user = new User({
//                 email: 'xxxx@xxxx.com',
//                 password: 'ddddd',
//                 name: 'Test',
//                 posts: [],
//                 _id: '5cad46f95ceb8237c4e1faff' // must be string 
//             });

//             return user.save();
//         })
//         .then(() => {
//             done();
//         });

//     });

//   beforeEach(function() {});

//   afterEach(function() {});

//   it('should add a created post to the posts of the creator', function(done) {
//     // const req = {
//     //   body: {
//     //     title: 'Test Post',
//     //     content: 'A Test Post'
//     //   },
//     //   file: {
//     //     path: 'abc'
//     //   },
//     //   userId: '5cad46f95ceb8237c4e1faff'
//     // };

//     const req = {
//         body: {
//             title: 'Test Post',
//             content: 'A Test Post'
//         },
//         // from multer
//         file: {
//             path: 'imageURL'
//         },
//         // from isAuth m/w
//         userId: '5cad46f95ceb8237c4e1faff'
//     };

//     // const res = {
//     //   status: function() {
//     //     return this;
//     //   },
//     //   json: function() {}
//     // };

//     const res = {
//         status: function() { 
//             return this; 
//         },
//         json: function() {}
//     };

//     FeedController.createPost(req, res, () => {}).then(savedUser => {
//       expect(savedUser).to.have.property('posts');
//       expect(savedUser.posts).to.have.length(1);
//       done();
//     });
//   });

//   after(function(done) {
//     User.deleteMany({})
//       .then(() => {
//         return mongoose.disconnect();
//       })
//       .then(() => {
//         done();
//       });
//   });
// });
