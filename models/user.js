const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: false,
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

  // notes: {
  //   type: [note],
  //   default: undefined,
  // },
  // memoPacks: {
  //   type: [memoPack],
  //   default: undefined,
  // },
  // groups: {
  //   type: [group],
  //   default: undefined,
  // },
});

module.exports = model('User', userSchema);
