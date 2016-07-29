'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Answerinstance = mongoose.model('Answerinstance'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, answerinstance;

/**
 * Answerinstance routes tests
 */
describe('Answerinstance CRUD tests', function () {

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

    // Save a user to the test db and create new Answerinstance
    user.save(function () {
      answerinstance = {
        name: 'Answerinstance name'
      };

      done();
    });
  });

  it('should be able to save a Answerinstance if logged in', function (done) {
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

        // Save a new Answerinstance
        agent.post('/api/answerinstances')
          .send(answerinstance)
          .expect(200)
          .end(function (answerinstanceSaveErr, answerinstanceSaveRes) {
            // Handle Answerinstance save error
            if (answerinstanceSaveErr) {
              return done(answerinstanceSaveErr);
            }

            // Get a list of Answerinstances
            agent.get('/api/answerinstances')
              .end(function (answerinstancesGetErr, answerinstancesGetRes) {
                // Handle Answerinstance save error
                if (answerinstancesGetErr) {
                  return done(answerinstancesGetErr);
                }

                // Get Answerinstances list
                var answerinstances = answerinstancesGetRes.body;

                // Set assertions
                (answerinstances[0].user._id).should.equal(userId);
                (answerinstances[0].name).should.match('Answerinstance name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Answerinstance if not logged in', function (done) {
    agent.post('/api/answerinstances')
      .send(answerinstance)
      .expect(403)
      .end(function (answerinstanceSaveErr, answerinstanceSaveRes) {
        // Call the assertion callback
        done(answerinstanceSaveErr);
      });
  });

  it('should not be able to save an Answerinstance if no name is provided', function (done) {
    // Invalidate name field
    answerinstance.name = '';

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

        // Save a new Answerinstance
        agent.post('/api/answerinstances')
          .send(answerinstance)
          .expect(400)
          .end(function (answerinstanceSaveErr, answerinstanceSaveRes) {
            // Set message assertion
            (answerinstanceSaveRes.body.message).should.match('Please fill Answerinstance name');

            // Handle Answerinstance save error
            done(answerinstanceSaveErr);
          });
      });
  });

  it('should be able to update an Answerinstance if signed in', function (done) {
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

        // Save a new Answerinstance
        agent.post('/api/answerinstances')
          .send(answerinstance)
          .expect(200)
          .end(function (answerinstanceSaveErr, answerinstanceSaveRes) {
            // Handle Answerinstance save error
            if (answerinstanceSaveErr) {
              return done(answerinstanceSaveErr);
            }

            // Update Answerinstance name
            answerinstance.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Answerinstance
            agent.put('/api/answerinstances/' + answerinstanceSaveRes.body._id)
              .send(answerinstance)
              .expect(200)
              .end(function (answerinstanceUpdateErr, answerinstanceUpdateRes) {
                // Handle Answerinstance update error
                if (answerinstanceUpdateErr) {
                  return done(answerinstanceUpdateErr);
                }

                // Set assertions
                (answerinstanceUpdateRes.body._id).should.equal(answerinstanceSaveRes.body._id);
                (answerinstanceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Answerinstances if not signed in', function (done) {
    // Create new Answerinstance model instance
    var answerinstanceObj = new Answerinstance(answerinstance);

    // Save the answerinstance
    answerinstanceObj.save(function () {
      // Request Answerinstances
      request(app).get('/api/answerinstances')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Answerinstance if not signed in', function (done) {
    // Create new Answerinstance model instance
    var answerinstanceObj = new Answerinstance(answerinstance);

    // Save the Answerinstance
    answerinstanceObj.save(function () {
      request(app).get('/api/answerinstances/' + answerinstanceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', answerinstance.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Answerinstance with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/answerinstances/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Answerinstance is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Answerinstance which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Answerinstance
    request(app).get('/api/answerinstances/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Answerinstance with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Answerinstance if signed in', function (done) {
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

        // Save a new Answerinstance
        agent.post('/api/answerinstances')
          .send(answerinstance)
          .expect(200)
          .end(function (answerinstanceSaveErr, answerinstanceSaveRes) {
            // Handle Answerinstance save error
            if (answerinstanceSaveErr) {
              return done(answerinstanceSaveErr);
            }

            // Delete an existing Answerinstance
            agent.delete('/api/answerinstances/' + answerinstanceSaveRes.body._id)
              .send(answerinstance)
              .expect(200)
              .end(function (answerinstanceDeleteErr, answerinstanceDeleteRes) {
                // Handle answerinstance error error
                if (answerinstanceDeleteErr) {
                  return done(answerinstanceDeleteErr);
                }

                // Set assertions
                (answerinstanceDeleteRes.body._id).should.equal(answerinstanceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Answerinstance if not signed in', function (done) {
    // Set Answerinstance user
    answerinstance.user = user;

    // Create new Answerinstance model instance
    var answerinstanceObj = new Answerinstance(answerinstance);

    // Save the Answerinstance
    answerinstanceObj.save(function () {
      // Try deleting Answerinstance
      request(app).delete('/api/answerinstances/' + answerinstanceObj._id)
        .expect(403)
        .end(function (answerinstanceDeleteErr, answerinstanceDeleteRes) {
          // Set message assertion
          (answerinstanceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Answerinstance error error
          done(answerinstanceDeleteErr);
        });

    });
  });

  it('should be able to get a single Answerinstance that has an orphaned user reference', function (done) {
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

          // Save a new Answerinstance
          agent.post('/api/answerinstances')
            .send(answerinstance)
            .expect(200)
            .end(function (answerinstanceSaveErr, answerinstanceSaveRes) {
              // Handle Answerinstance save error
              if (answerinstanceSaveErr) {
                return done(answerinstanceSaveErr);
              }

              // Set assertions on new Answerinstance
              (answerinstanceSaveRes.body.name).should.equal(answerinstance.name);
              should.exist(answerinstanceSaveRes.body.user);
              should.equal(answerinstanceSaveRes.body.user._id, orphanId);

              // force the Answerinstance to have an orphaned user reference
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

                    // Get the Answerinstance
                    agent.get('/api/answerinstances/' + answerinstanceSaveRes.body._id)
                      .expect(200)
                      .end(function (answerinstanceInfoErr, answerinstanceInfoRes) {
                        // Handle Answerinstance error
                        if (answerinstanceInfoErr) {
                          return done(answerinstanceInfoErr);
                        }

                        // Set assertions
                        (answerinstanceInfoRes.body._id).should.equal(answerinstanceSaveRes.body._id);
                        (answerinstanceInfoRes.body.name).should.equal(answerinstance.name);
                        should.equal(answerinstanceInfoRes.body.user, undefined);

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
      Answerinstance.remove().exec(done);
    });
  });
});
