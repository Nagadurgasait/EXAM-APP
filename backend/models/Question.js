const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true },
  options: {
    type: [String],
    validate: [opt => opt.length >= 2, 'At least two options are required']
  },
  correctOptionIndex: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model('Question', questionSchema, 'questions');
