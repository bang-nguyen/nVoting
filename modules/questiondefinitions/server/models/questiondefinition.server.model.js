'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Questiondefinition Schema
 */
var QuestiondefinitionSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill title for the question',
    trim: true
  },
  description: {
    type: String,
    default: '',    
    trim: true
  },
  vote:{
    type: Schema.ObjectId,
    ref: 'VoteDefinition'
  },
  required:{
    type: Boolean
  },
  type: {
    type: String,
    default: '',
    required: 'Please choose a type for question',
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
  },  
});

mongoose.model('Questiondefinition', QuestiondefinitionSchema);
