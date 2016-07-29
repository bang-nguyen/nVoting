'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Answerdefinition = mongoose.model('Answerdefinition'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, answerdefinition;

/**
 * Answerdefinition routes tests
 */
describe('Answerdefinition CRUD tests', function () {

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

    // Save a user to the test db and create new Answerdefinition
    user.save(function () {
      answerdefinition = {
        name: 'Answerdefinition name'
      };

      done();
    });
  });

  it('should be able to save a Answerdefinition if logged in', function (done) {
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

        // Save a new Answerdefinition
        agent.post('/api/answerdefinitions')
          .send(answerdefinition)
          .expect(200)
          .end(function (answerdefinitionSaveErr, answerdefinitionSaveRes) {
            // Handle Answerdefinition save error
            if (answerdefinitionSaveErr) {
              return done(answerdefinitionSaveErr);
            }

            // Get a list of Answerdefinitions
            agent.get('/api/answerdefinitions')
              .end(function (answerdefinitionsGetErr, answerdefinitionsGetRes) {
                // Handle Answerdefinition save error
                if (answerdefinitionsGetErr) {
                  return done(answerdefinitionsGetErr);
                }

                // Get Answerdefinitions list
                var answerdefinitions = answerdefinitionsGetRes.body;

                // Set assertions
                (answerdefinitions[0].user._id).should.equal(userId);
                (answerdefinitions[0].name).should.match('Answerdefinition name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Answerdefinition if not logged in', function (done) {
    agent.post('/api/answerdefinitions')
      .send(answerdefinition)
      .expect(403)
      .end(function (answerdefinitionSaveErr, answerdefinitionSaveRes) {
        // Call the assertion callback
        done(answerdefinitionSaveErr);
      });
  });

  it('should not be able to save an Answerdefinition if no name is provided', function (done) {
    // Invalidate name field
    answerdefinition.name = '';

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

        // Save a new Answerdefinition
        agent.post('/api/answerdefinitions')
          .send(answerdefinition)
          .expect(400)
          .end(function (answerdefinitionSaveErr, answerdefinitionSaveRes) {
            // Set message assertion
            (answerdefinitionSaveRes.body.message).should.match('Please fill Answerdefinition name');

            // Handle Answerdefinition save error
            done(answerdefinitionSaveErr);
          });
      });
  });

  it('should be able to update an Answerdefinition if signed in', function (done) {
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

        // Save a new Answerdefinition
        agent.post('/api/answerdefinitions')
          .send(answerdefinition)
          .expect(200)
          .end(function (answerdefinitionSaveErr, answerdefinitionSaveRes) {
            // Handle Answerdefinition save error
            if (answerdefinitionSaveErr) {
              return done(answerdefinitionSaveErr);
            }

            // Update Answerdefinition name
            answerdefinition.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Answerdefinition
            agent.put('/api/answerdefinitions/' + answerdefinitionSaveRes.body._id)
              .send(answerdefinition)
              .expect(200)
              .end(function (answerdefinitionUpdateErr, answerdefinitionUpdateRes) {
                // Handle Answerdefinition update error
                if (answerdefinitionUpdateErr) {
                  return done(answerdefinitionUpdateErr);
                }

                // Set assertions
                (answerdefinitionUpdateRes.body._id).should.equal(answerdefinitionSaveRes.body._id);
                (answerdefinitionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Answerdefinitions if not signed in', function (done) {
    // Create new Answerdefinition model instance
    var answerdefinitionObj = new Answerdefinition(answerdefinition);

    // Save the answerdefinition
    answerdefinitionObj.save(function () {
      // Request Answerdefinitions
      request(app).get('/api/answerdefinitions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Answerdefinition if not signed in', function (done) {
    // Create new Answerdefinition model instance
    var answerdefinitionObj = new Answerdefinition(answerdefinition);

    // Save the Answerdefinition
    answerdefinitionObj.save(function () {
      request(app).get('/api/answerdefinitions/' + answerdefinitionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', answerdefinition.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Answerdefinition with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/answerdefinitions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Answerdefinition is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Answerdefinition which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Answerdefinition
    request(app).get('/api/answerdefinitions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Answerdefinition with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Answerdefinition if signed in', function (done) {
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

        // Save a new Answerdefinition
        agent.post('/api/answerdefinitions')
          .send(answerdefinition)
          .expect(200)
          .end(function (answerdefinitionSaveErr, answerdefinitionSaveRes) {
            // Handle Answerdefinition save error
            if (answerdefinitionSaveErr) {
              return done(answerdefinitionSaveErr);
            }

            // Delete an existing Answerdefinition
            agent.delete('/api/answerdefinitions/' + answerdefinitionSaveRes.body._id)
              .send(answerdefinition)
              .expect(200)
              .end(function (answerdefinitionDeleteErr, answerdefinitionDeleteRes) {
                // Handle answerdefinition error error
                if (answerdefinitionDeleteErr) {
                  return done(answerdefinitionDeleteErr);
                }

                // Set assertions
                (answerdefinitionDeleteRes.body._id).should.equal(answerdefinitionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Answerdefinition if not signed in', function (done) {
    // Set Answerdefinition user
    answerdefinition.user = user;

    // Create new Answerdefinition model instance
    var answerdefinitionObj = new Answerdefinition(answerdefinition);

    // Save the Answerdefinition
    answerdefinitionObj.save(function () {
      // Try deleting Answerdefinition
      request(app).delete('/api/answerdefinitions/' + answerdefinitionObj._id)
        .expect(403)
        .end(function (answerdefinitionDeleteErr, answerdefinitionDeleteRes) {
          // Set message assertion
          (answerdefinitionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Answerdefinition error error
          done(answerdefinitionDeleteErr);
        });

    });
  });

  it('should be able to get a single Answerdefinition that has an orphaned user reference', function (done) {
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

          // Save a new Answerdefinition
          agent.post('/api/answerdefinitions')
            .send(answerdefinition)
            .expect(200)
            .end(function (answerdefinitionSaveErr, answerdefinitionSaveRes) {
              // Handle Answerdefinition save error
              if (answerdefinitionSaveErr) {
                return done(answerdefinitionSaveErr);
              }

              // Set assertions on new Answerdefinition
              (answerdefinitionSaveRes.body.name).should.equal(answerdefinition.name);
              should.exist(answerdefinitionSaveRes.body.user);
              should.equal(answerdefinitionSaveRes.body.user._id, orphanId);

              // force the Answerdefinition to have an orphaned user reference
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

                    // Get the Answerdefinition
                    agent.get('/api/answerdefinitions/' + answerdefinitionSaveRes.body._id)
                      .expect(200)
                      .end(function (answerdefinitionInfoErr, answerdefinitionInfoRes) {
                        // Handle Answerdefinition error
                        if (answerdefinitionInfoErr) {
                          return done(answerdefinitionInfoErr);
                        }

                        // Set assertions
                        (answerdefinitionInfoRes.body._id).should.equal(answerdefinitionSaveRes.body._id);
                        (answerdefinitionInfoRes.body.name).should.equal(answerdefinition.name);
                        should.equal(answerdefinitionInfoRes.body.user, undefined);

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
      Answerdefinition.remove().exec(done);
    });
  });
});
