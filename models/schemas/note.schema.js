const { Schema, Types } = require('mongoose');

const noteSchema = new Schema({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },

  nextRepetition: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },

  group: {
    type: Types.ObjectId, // reference to a group document
    default: null,
  },
});

module.exports = noteSchema;
