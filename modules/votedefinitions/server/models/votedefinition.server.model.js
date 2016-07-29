'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Votedefinition Schema
 */
var VotedefinitionSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill the vote title',
    trim: true
  },
  description: {
    type: String,
    default: '',    
    trim: true
  },
  deadline: {
    type: Date    
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Votedefinition', VotedefinitionSchema);
