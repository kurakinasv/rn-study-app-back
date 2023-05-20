const { Schema } = require('mongoose');

const memoPack = require('./memoPack.schema');
const note = require('./note.schema');

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  notes: {
    type: [note],
    default: undefined,
  },
  memoPacks: {
    type: [memoPack],
    default: undefined,
  },

  deadline: {
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
});

module.exports = groupSchema;
