'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Answerdefinition Schema
 */
var AnswerdefinitionSchema = new Schema({
  content: {
    type: String,
    default: '',
    required: 'Please fill up content for the answer',
    trim: true
  },
  question:{
    type: Schema.ObjectId,
    ref: 'QuestionDefinition'
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

mongoose.model('Answerdefinition', AnswerdefinitionSchema);
