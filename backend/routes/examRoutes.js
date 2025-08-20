const express = require('express');
const { getQuestions, submitExam } = require('../controllers/examController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitExam);

module.exports = router;
