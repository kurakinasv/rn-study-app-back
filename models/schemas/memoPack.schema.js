const { Schema, Types } = require('mongoose');

const memoCard = require('./memoCard.schema');

const memoPackSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cards: {
    type: [memoCard],
    default: undefined,
  },

  lastRepetition: {
    type: Date,
    default: null,
  },
  nextRepetition: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },

  group: {
    type: Types.ObjectId, // reference to a group document
    default: null,
  },
});

module.exports = memoPackSchema;
