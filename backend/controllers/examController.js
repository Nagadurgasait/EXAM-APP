const Question = require('../models/Question');

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

exports.submitExam = async (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers)) return res.status(400).json({ message: 'Invalid answers format' });

  try {
    let score = 0;
    for (const { questionId, selectedOptionIndex } of answers) {
      const question = await Question.findById(questionId);
      if (question && question.correctOptionIndex === selectedOptionIndex) {
        score++;
      }
    }
    res.json({ score, totalQuestions: answers.length });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting exam' });
  }
};
