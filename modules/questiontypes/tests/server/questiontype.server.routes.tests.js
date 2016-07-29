'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Questiontype = mongoose.model('Questiontype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, questiontype;

/**
 * Questiontype routes tests
 */
describe('Questiontype CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Questiontype
    user.save(function () {
      questiontype = {
        name: 'Questiontype name'
      };

      done();
    });
  });

  it('should be able to save a Questiontype if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Questiontype
        agent.post('/api/questiontypes')
          .send(questiontype)
          .expect(200)
          .end(function (questiontypeSaveErr, questiontypeSaveRes) {
            // Handle Questiontype save error
            if (questiontypeSaveErr) {
              return done(questiontypeSaveErr);
            }

            // Get a list of Questiontypes
            agent.get('/api/questiontypes')
              .end(function (questiontypesGetErr, questiontypesGetRes) {
                // Handle Questiontype save error
                if (questiontypesGetErr) {
                  return done(questiontypesGetErr);
                }

                // Get Questiontypes list
                var questiontypes = questiontypesGetRes.body;

                // Set assertions
                (questiontypes[0].user._id).should.equal(userId);
                (questiontypes[0].name).should.match('Questiontype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Questiontype if not logged in', function (done) {
    agent.post('/api/questiontypes')
      .send(questiontype)
      .expect(403)
      .end(function (questiontypeSaveErr, questiontypeSaveRes) {
        // Call the assertion callback
        done(questiontypeSaveErr);
      });
  });

  it('should not be able to save an Questiontype if no name is provided', function (done) {
    // Invalidate name field
    questiontype.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Questiontype
        agent.post('/api/questiontypes')
          .send(questiontype)
          .expect(400)
          .end(function (questiontypeSaveErr, questiontypeSaveRes) {
            // Set message assertion
            (questiontypeSaveRes.body.message).should.match('Please fill Questiontype name');

            // Handle Questiontype save error
            done(questiontypeSaveErr);
          });
      });
  });

  it('should be able to update an Questiontype if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Questiontype
        agent.post('/api/questiontypes')
          .send(questiontype)
          .expect(200)
          .end(function (questiontypeSaveErr, questiontypeSaveRes) {
            // Handle Questiontype save error
            if (questiontypeSaveErr) {
              return done(questiontypeSaveErr);
            }

            // Update Questiontype name
            questiontype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Questiontype
            agent.put('/api/questiontypes/' + questiontypeSaveRes.body._id)
              .send(questiontype)
              .expect(200)
              .end(function (questiontypeUpdateErr, questiontypeUpdateRes) {
                // Handle Questiontype update error
                if (questiontypeUpdateErr) {
                  return done(questiontypeUpdateErr);
                }

                // Set assertions
                (questiontypeUpdateRes.body._id).should.equal(questiontypeSaveRes.body._id);
                (questiontypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Questiontypes if not signed in', function (done) {
    // Create new Questiontype model instance
    var questiontypeObj = new Questiontype(questiontype);

    // Save the questiontype
    questiontypeObj.save(function () {
      // Request Questiontypes
      request(app).get('/api/questiontypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Questiontype if not signed in', function (done) {
    // Create new Questiontype model instance
    var questiontypeObj = new Questiontype(questiontype);

    // Save the Questiontype
    questiontypeObj.save(function () {
      request(app).get('/api/questiontypes/' + questiontypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', questiontype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Questiontype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/questiontypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Questiontype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Questiontype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Questiontype
    request(app).get('/api/questiontypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Questiontype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Questiontype if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Questiontype
        agent.post('/api/questiontypes')
          .send(questiontype)
          .expect(200)
          .end(function (questiontypeSaveErr, questiontypeSaveRes) {
            // Handle Questiontype save error
            if (questiontypeSaveErr) {
              return done(questiontypeSaveErr);
            }

            // Delete an existing Questiontype
            agent.delete('/api/questiontypes/' + questiontypeSaveRes.body._id)
              .send(questiontype)
              .expect(200)
              .end(function (questiontypeDeleteErr, questiontypeDeleteRes) {
                // Handle questiontype error error
                if (questiontypeDeleteErr) {
                  return done(questiontypeDeleteErr);
                }

                // Set assertions
                (questiontypeDeleteRes.body._id).should.equal(questiontypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Questiontype if not signed in', function (done) {
    // Set Questiontype user
    questiontype.user = user;

    // Create new Questiontype model instance
    var questiontypeObj = new Questiontype(questiontype);

    // Save the Questiontype
    questiontypeObj.save(function () {
      // Try deleting Questiontype
      request(app).delete('/api/questiontypes/' + questiontypeObj._id)
        .expect(403)
        .end(function (questiontypeDeleteErr, questiontypeDeleteRes) {
          // Set message assertion
          (questiontypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Questiontype error error
          done(questiontypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Questiontype that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Questiontype
          agent.post('/api/questiontypes')
            .send(questiontype)
            .expect(200)
            .end(function (questiontypeSaveErr, questiontypeSaveRes) {
              // Handle Questiontype save error
              if (questiontypeSaveErr) {
                return done(questiontypeSaveErr);
              }

              // Set assertions on new Questiontype
              (questiontypeSaveRes.body.name).should.equal(questiontype.name);
              should.exist(questiontypeSaveRes.body.user);
              should.equal(questiontypeSaveRes.body.user._id, orphanId);

              // force the Questiontype to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Questiontype
                    agent.get('/api/questiontypes/' + questiontypeSaveRes.body._id)
                      .expect(200)
                      .end(function (questiontypeInfoErr, questiontypeInfoRes) {
                        // Handle Questiontype error
                        if (questiontypeInfoErr) {
                          return done(questiontypeInfoErr);
                        }

                        // Set assertions
                        (questiontypeInfoRes.body._id).should.equal(questiontypeSaveRes.body._id);
                        (questiontypeInfoRes.body.name).should.equal(questiontype.name);
                        should.equal(questiontypeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Questiontype.remove().exec(done);
    });
  });
});
