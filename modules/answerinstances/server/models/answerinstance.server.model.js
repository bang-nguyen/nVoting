'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Answerinstance Schema
 */
var AnswerinstanceSchema = new Schema({
  question: {
    type: Schema.ObjectId,
    ref: 'QuestionDefinition'
  },
  answer: {
    type: Schema.ObjectId,
    ref: 'AnswerDefinition'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Answerinstance', AnswerinstanceSchema);
