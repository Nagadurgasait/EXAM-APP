import React, { useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from './AuthContext';

const styles = {
  container: {
    maxWidth: 700,
    margin: '40px auto',
    backgroundColor: '#fff',
    padding: '30px 40px',
    borderRadius: 12,
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#2c3e50',
  },
  timer: {
    fontWeight: '700',
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 30,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 20,
    minHeight: 70,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    display: 'block',
    padding: '12px 20px',
    marginBottom: 15,
    borderRadius: 10,
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.3s, border-color 0.3s',
  },
  clearButton: {
    marginBottom: 20,
    backgroundColor: '#f4d03f',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontWeight: 600,
    cursor: 'pointer',
    color: '#333',
    marginLeft: 8,
  },
  buttonsRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    boxShadow: '0 8px 15px rgba(41, 128, 185, 0.3)',
    transition: 'background-color 0.3s',
  },
  navButtonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    marginTop: 20,
    width: '100%',
    padding: '14px 0',
    fontSize: 20,
    fontWeight: '700',
    borderRadius: 10,
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(39, 174, 96, 0.4)',
    transition: 'background-color 0.3s',
  },
  submitButtonHover: {
    backgroundColor: '#1e8449',
  },
  completionContainer: {
    textAlign: 'center',
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 20,
  },
  completionScore: {
    fontSize: 24,
    fontWeight: 600,
    color: '#27ae60',
  },
  loading: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 60,
    color: '#34495e',
  },
};

function Timer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <div style={styles.timer}>
      Time Left: {minutes}:{seconds < 10 ? '0' : ''}
      {seconds}
    </div>
  );
}

export default function ExamPage() {
  const { token } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 min
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitHover, setSubmitHover] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/exam/questions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setQuestions)
      .catch(console.error);
  }, [token]);

  const submitExam = useCallback(() => {
    const answerArray = Object.entries(answers).map(([qid, selected]) => ({
      questionId: qid,
      selectedOptionIndex: selected,
    }));

    fetch('http://localhost:5000/api/exam/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answers: answerArray }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitted(true);
        setResult(data);
      })
      .catch(console.error);
  }, [answers, token]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) submitExam();

    if (timeLeft > 0 && !submitted) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, submitted, submitExam]);

  function selectAnswer(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function clearAnswer(questionId) {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  }

  if (!token)
    return (
      <p style={{ textAlign: 'center', color: '#c0392b', marginTop: 40 }}>
        Please login to start the exam.
      </p>
    );

  if (submitted)
    return (
      <div style={styles.container}>
        <div style={styles.completionContainer}>
          <h2 style={styles.completionTitle}>Exam Completed</h2>
          <p style={styles.completionScore}>
            Your Score: {result?.score} / {result?.totalQuestions}
          </p>
        </div>
      </div>
    );

  if (questions.length === 0)
    return <p style={styles.loading}>Loading questions...</p>;

  const question = questions[currentIndex];
  const selectedOption = answers[question._id];

  return (
    <div style={styles.container}>
      <Timer timeLeft={timeLeft} />
      <div style={styles.questionText}>{question.questionText}</div>
      <div style={styles.optionsContainer}>
        {question.options.map((opt, idx) => {
          const isChecked = selectedOption === idx;
          return (
            <label
              key={idx}
              style={{
                ...styles.option,
                backgroundColor: isChecked ? '#d6eaff' : '#f5f6fa',
                border: isChecked ? '2px solid #2980b9' : '2px solid #e0e3eb',
              }}
            >
              <input
                type="radio"
                name={question._id}
                checked={isChecked}
                onChange={() => selectAnswer(question._id, idx)}
                style={{ marginRight: 15 }}
              />
              {opt}
            </label>
          );
        })}
      </div>
      <button
        style={styles.clearButton}
        disabled={selectedOption === undefined}
        onClick={() => clearAnswer(question._id)}
      >
        Clear Answer
      </button>

      <div style={styles.buttonsRow}>
        <button
          style={{
            ...styles.navButton,
            ...(currentIndex === 0 ? styles.navButtonDisabled : {}),
          }}
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          Previous
        </button>

        <button
          style={{
            ...styles.navButton,
            ...(currentIndex === questions.length - 1
              ? styles.navButtonDisabled
              : {}),
          }}
          disabled={currentIndex === questions.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
        >
          Next
        </button>
      </div>

      <button
        style={{
          ...styles.submitButton,
          ...(submitHover ? styles.submitButtonHover : {}),
          marginTop: 30,
        }}
        onMouseEnter={() => setSubmitHover(true)}
        onMouseLeave={() => setSubmitHover(false)}
        onClick={submitExam}
      >
        Submit Exam
      </button>
    </div>
  );
}
