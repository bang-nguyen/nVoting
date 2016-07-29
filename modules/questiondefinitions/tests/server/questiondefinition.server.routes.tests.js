'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Questiondefinition = mongoose.model('Questiondefinition'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, questiondefinition;

/**
 * Questiondefinition routes tests
 */
describe('Questiondefinition CRUD tests', function () {

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

    // Save a user to the test db and create new Questiondefinition
    user.save(function () {
      questiondefinition = {
        name: 'Questiondefinition name'
      };

      done();
    });
  });

  it('should be able to save a Questiondefinition if logged in', function (done) {
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

        // Save a new Questiondefinition
        agent.post('/api/questiondefinitions')
          .send(questiondefinition)
          .expect(200)
          .end(function (questiondefinitionSaveErr, questiondefinitionSaveRes) {
            // Handle Questiondefinition save error
            if (questiondefinitionSaveErr) {
              return done(questiondefinitionSaveErr);
            }

            // Get a list of Questiondefinitions
            agent.get('/api/questiondefinitions')
              .end(function (questiondefinitionsGetErr, questiondefinitionsGetRes) {
                // Handle Questiondefinition save error
                if (questiondefinitionsGetErr) {
                  return done(questiondefinitionsGetErr);
                }

                // Get Questiondefinitions list
                var questiondefinitions = questiondefinitionsGetRes.body;

                // Set assertions
                (questiondefinitions[0].user._id).should.equal(userId);
                (questiondefinitions[0].name).should.match('Questiondefinition name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Questiondefinition if not logged in', function (done) {
    agent.post('/api/questiondefinitions')
      .send(questiondefinition)
      .expect(403)
      .end(function (questiondefinitionSaveErr, questiondefinitionSaveRes) {
        // Call the assertion callback
        done(questiondefinitionSaveErr);
      });
  });

  it('should not be able to save an Questiondefinition if no name is provided', function (done) {
    // Invalidate name field
    questiondefinition.name = '';

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

        // Save a new Questiondefinition
        agent.post('/api/questiondefinitions')
          .send(questiondefinition)
          .expect(400)
          .end(function (questiondefinitionSaveErr, questiondefinitionSaveRes) {
            // Set message assertion
            (questiondefinitionSaveRes.body.message).should.match('Please fill Questiondefinition name');

            // Handle Questiondefinition save error
            done(questiondefinitionSaveErr);
          });
      });
  });

  it('should be able to update an Questiondefinition if signed in', function (done) {
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

        // Save a new Questiondefinition
        agent.post('/api/questiondefinitions')
          .send(questiondefinition)
          .expect(200)
          .end(function (questiondefinitionSaveErr, questiondefinitionSaveRes) {
            // Handle Questiondefinition save error
            if (questiondefinitionSaveErr) {
              return done(questiondefinitionSaveErr);
            }

            // Update Questiondefinition name
            questiondefinition.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Questiondefinition
            agent.put('/api/questiondefinitions/' + questiondefinitionSaveRes.body._id)
              .send(questiondefinition)
              .expect(200)
              .end(function (questiondefinitionUpdateErr, questiondefinitionUpdateRes) {
                // Handle Questiondefinition update error
                if (questiondefinitionUpdateErr) {
                  return done(questiondefinitionUpdateErr);
                }

                // Set assertions
                (questiondefinitionUpdateRes.body._id).should.equal(questiondefinitionSaveRes.body._id);
                (questiondefinitionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Questiondefinitions if not signed in', function (done) {
    // Create new Questiondefinition model instance
    var questiondefinitionObj = new Questiondefinition(questiondefinition);

    // Save the questiondefinition
    questiondefinitionObj.save(function () {
      // Request Questiondefinitions
      request(app).get('/api/questiondefinitions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Questiondefinition if not signed in', function (done) {
    // Create new Questiondefinition model instance
    var questiondefinitionObj = new Questiondefinition(questiondefinition);

    // Save the Questiondefinition
    questiondefinitionObj.save(function () {
      request(app).get('/api/questiondefinitions/' + questiondefinitionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', questiondefinition.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Questiondefinition with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/questiondefinitions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Questiondefinition is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Questiondefinition which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Questiondefinition
    request(app).get('/api/questiondefinitions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Questiondefinition with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Questiondefinition if signed in', function (done) {
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

        // Save a new Questiondefinition
        agent.post('/api/questiondefinitions')
          .send(questiondefinition)
          .expect(200)
          .end(function (questiondefinitionSaveErr, questiondefinitionSaveRes) {
            // Handle Questiondefinition save error
            if (questiondefinitionSaveErr) {
              return done(questiondefinitionSaveErr);
            }

            // Delete an existing Questiondefinition
            agent.delete('/api/questiondefinitions/' + questiondefinitionSaveRes.body._id)
              .send(questiondefinition)
              .expect(200)
              .end(function (questiondefinitionDeleteErr, questiondefinitionDeleteRes) {
                // Handle questiondefinition error error
                if (questiondefinitionDeleteErr) {
                  return done(questiondefinitionDeleteErr);
                }

                // Set assertions
                (questiondefinitionDeleteRes.body._id).should.equal(questiondefinitionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Questiondefinition if not signed in', function (done) {
    // Set Questiondefinition user
    questiondefinition.user = user;

    // Create new Questiondefinition model instance
    var questiondefinitionObj = new Questiondefinition(questiondefinition);

    // Save the Questiondefinition
    questiondefinitionObj.save(function () {
      // Try deleting Questiondefinition
      request(app).delete('/api/questiondefinitions/' + questiondefinitionObj._id)
        .expect(403)
        .end(function (questiondefinitionDeleteErr, questiondefinitionDeleteRes) {
          // Set message assertion
          (questiondefinitionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Questiondefinition error error
          done(questiondefinitionDeleteErr);
        });

    });
  });

  it('should be able to get a single Questiondefinition that has an orphaned user reference', function (done) {
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

          // Save a new Questiondefinition
          agent.post('/api/questiondefinitions')
            .send(questiondefinition)
            .expect(200)
            .end(function (questiondefinitionSaveErr, questiondefinitionSaveRes) {
              // Handle Questiondefinition save error
              if (questiondefinitionSaveErr) {
                return done(questiondefinitionSaveErr);
              }

              // Set assertions on new Questiondefinition
              (questiondefinitionSaveRes.body.name).should.equal(questiondefinition.name);
              should.exist(questiondefinitionSaveRes.body.user);
              should.equal(questiondefinitionSaveRes.body.user._id, orphanId);

              // force the Questiondefinition to have an orphaned user reference
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

                    // Get the Questiondefinition
                    agent.get('/api/questiondefinitions/' + questiondefinitionSaveRes.body._id)
                      .expect(200)
                      .end(function (questiondefinitionInfoErr, questiondefinitionInfoRes) {
                        // Handle Questiondefinition error
                        if (questiondefinitionInfoErr) {
                          return done(questiondefinitionInfoErr);
                        }

                        // Set assertions
                        (questiondefinitionInfoRes.body._id).should.equal(questiondefinitionSaveRes.body._id);
                        (questiondefinitionInfoRes.body.name).should.equal(questiondefinition.name);
                        should.equal(questiondefinitionInfoRes.body.user, undefined);

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
      Questiondefinition.remove().exec(done);
    });
  });
});
