'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Questiontype Schema
 */
var QuestiontypeSchema = new Schema({
  type: {
    type: String,
    default: '',
    required: 'Please fill question type',
    trim: true
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

mongoose.model('Questiontype', QuestiontypeSchema);
