'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Votedefinition = mongoose.model('Votedefinition'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, votedefinition;

/**
 * Votedefinition routes tests
 */
describe('Votedefinition CRUD tests', function () {

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

    // Save a user to the test db and create new Votedefinition
    user.save(function () {
      votedefinition = {
        name: 'Votedefinition name'
      };

      done();
    });
  });

  it('should be able to save a Votedefinition if logged in', function (done) {
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

        // Save a new Votedefinition
        agent.post('/api/votedefinitions')
          .send(votedefinition)
          .expect(200)
          .end(function (votedefinitionSaveErr, votedefinitionSaveRes) {
            // Handle Votedefinition save error
            if (votedefinitionSaveErr) {
              return done(votedefinitionSaveErr);
            }

            // Get a list of Votedefinitions
            agent.get('/api/votedefinitions')
              .end(function (votedefinitionsGetErr, votedefinitionsGetRes) {
                // Handle Votedefinition save error
                if (votedefinitionsGetErr) {
                  return done(votedefinitionsGetErr);
                }

                // Get Votedefinitions list
                var votedefinitions = votedefinitionsGetRes.body;

                // Set assertions
                (votedefinitions[0].user._id).should.equal(userId);
                (votedefinitions[0].name).should.match('Votedefinition name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Votedefinition if not logged in', function (done) {
    agent.post('/api/votedefinitions')
      .send(votedefinition)
      .expect(403)
      .end(function (votedefinitionSaveErr, votedefinitionSaveRes) {
        // Call the assertion callback
        done(votedefinitionSaveErr);
      });
  });

  it('should not be able to save an Votedefinition if no name is provided', function (done) {
    // Invalidate name field
    votedefinition.name = '';

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

        // Save a new Votedefinition
        agent.post('/api/votedefinitions')
          .send(votedefinition)
          .expect(400)
          .end(function (votedefinitionSaveErr, votedefinitionSaveRes) {
            // Set message assertion
            (votedefinitionSaveRes.body.message).should.match('Please fill Votedefinition name');

            // Handle Votedefinition save error
            done(votedefinitionSaveErr);
          });
      });
  });

  it('should be able to update an Votedefinition if signed in', function (done) {
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

        // Save a new Votedefinition
        agent.post('/api/votedefinitions')
          .send(votedefinition)
          .expect(200)
          .end(function (votedefinitionSaveErr, votedefinitionSaveRes) {
            // Handle Votedefinition save error
            if (votedefinitionSaveErr) {
              return done(votedefinitionSaveErr);
            }

            // Update Votedefinition name
            votedefinition.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Votedefinition
            agent.put('/api/votedefinitions/' + votedefinitionSaveRes.body._id)
              .send(votedefinition)
              .expect(200)
              .end(function (votedefinitionUpdateErr, votedefinitionUpdateRes) {
                // Handle Votedefinition update error
                if (votedefinitionUpdateErr) {
                  return done(votedefinitionUpdateErr);
                }

                // Set assertions
                (votedefinitionUpdateRes.body._id).should.equal(votedefinitionSaveRes.body._id);
                (votedefinitionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Votedefinitions if not signed in', function (done) {
    // Create new Votedefinition model instance
    var votedefinitionObj = new Votedefinition(votedefinition);

    // Save the votedefinition
    votedefinitionObj.save(function () {
      // Request Votedefinitions
      request(app).get('/api/votedefinitions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Votedefinition if not signed in', function (done) {
    // Create new Votedefinition model instance
    var votedefinitionObj = new Votedefinition(votedefinition);

    // Save the Votedefinition
    votedefinitionObj.save(function () {
      request(app).get('/api/votedefinitions/' + votedefinitionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', votedefinition.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Votedefinition with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/votedefinitions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Votedefinition is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Votedefinition which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Votedefinition
    request(app).get('/api/votedefinitions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Votedefinition with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Votedefinition if signed in', function (done) {
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

        // Save a new Votedefinition
        agent.post('/api/votedefinitions')
          .send(votedefinition)
          .expect(200)
          .end(function (votedefinitionSaveErr, votedefinitionSaveRes) {
            // Handle Votedefinition save error
            if (votedefinitionSaveErr) {
              return done(votedefinitionSaveErr);
            }

            // Delete an existing Votedefinition
            agent.delete('/api/votedefinitions/' + votedefinitionSaveRes.body._id)
              .send(votedefinition)
              .expect(200)
              .end(function (votedefinitionDeleteErr, votedefinitionDeleteRes) {
                // Handle votedefinition error error
                if (votedefinitionDeleteErr) {
                  return done(votedefinitionDeleteErr);
                }

                // Set assertions
                (votedefinitionDeleteRes.body._id).should.equal(votedefinitionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Votedefinition if not signed in', function (done) {
    // Set Votedefinition user
    votedefinition.user = user;

    // Create new Votedefinition model instance
    var votedefinitionObj = new Votedefinition(votedefinition);

    // Save the Votedefinition
    votedefinitionObj.save(function () {
      // Try deleting Votedefinition
      request(app).delete('/api/votedefinitions/' + votedefinitionObj._id)
        .expect(403)
        .end(function (votedefinitionDeleteErr, votedefinitionDeleteRes) {
          // Set message assertion
          (votedefinitionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Votedefinition error error
          done(votedefinitionDeleteErr);
        });

    });
  });

  it('should be able to get a single Votedefinition that has an orphaned user reference', function (done) {
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

          // Save a new Votedefinition
          agent.post('/api/votedefinitions')
            .send(votedefinition)
            .expect(200)
            .end(function (votedefinitionSaveErr, votedefinitionSaveRes) {
              // Handle Votedefinition save error
              if (votedefinitionSaveErr) {
                return done(votedefinitionSaveErr);
              }

              // Set assertions on new Votedefinition
              (votedefinitionSaveRes.body.name).should.equal(votedefinition.name);
              should.exist(votedefinitionSaveRes.body.user);
              should.equal(votedefinitionSaveRes.body.user._id, orphanId);

              // force the Votedefinition to have an orphaned user reference
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

                    // Get the Votedefinition
                    agent.get('/api/votedefinitions/' + votedefinitionSaveRes.body._id)
                      .expect(200)
                      .end(function (votedefinitionInfoErr, votedefinitionInfoRes) {
                        // Handle Votedefinition error
                        if (votedefinitionInfoErr) {
                          return done(votedefinitionInfoErr);
                        }

                        // Set assertions
                        (votedefinitionInfoRes.body._id).should.equal(votedefinitionSaveRes.body._id);
                        (votedefinitionInfoRes.body.name).should.equal(votedefinition.name);
                        should.equal(votedefinitionInfoRes.body.user, undefined);

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
      Votedefinition.remove().exec(done);
    });
  });
});
