const { Schema } = require('mongoose');

const note = require('./note.schema');
const memoPack = require('./memoPack.schema');
const memoCard = require('./memoCard.schema');

const userSchema = new Schema({
  username: {
    type: String,
    default: undefined,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
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
  // groups: {
  //   type: [group],
  //   default: undefined,
  // },
});

module.exports = userSchema;
