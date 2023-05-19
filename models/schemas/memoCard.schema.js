const { Schema } = require('mongoose');

const memoCardSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  state: {
    type: String, // 'difficult' | 'normal' | 'easy' | 'new'
    default: 'new',
  },

  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = memoCardSchema;
