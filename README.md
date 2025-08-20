# EXAM-APP

A full-stack online exam application designed for students, featuring:

- Secure JWT authentication for user security  
- Randomized questions for each test session  
- Timed test environment to simulate real exam conditions  

Built with modern technologies including React for the frontend,  
Node.js or Python for the backend, and MongoDB or PostgreSQL for the database.

---

## Setup Instructions

### Prerequisites

- Node.js (v16 or newer recommended)  
- MongoDB installed and running locally or use a remote URI  
- npm or yarn package manager

---

### Backend Setup

1. Clone the repository and navigate to backend:

git clone https://github.com/Nagadurgasait/EXAM-APP.git
cd EXAM-APP/backend

2. Install dependencies:

3. already Created a `.env` file in the backend folder with the following variables:
MONGO_URI=mongodb://localhost:27017/admin
JWT_SECRET=your_jwt_secret_key
PORT=5000

4. Start the backend server:

npm start

Backend API runs at `http://localhost:5000`.

---
## MongoDB Setup

- Ensure MongoDB is installed and running locally (default port 27017) or use a remote MongoDB URI.

- To start MongoDB locally, run:
mongod

- Your `.env` file must contain the correct connection string, :MONGO_URI=mongodb://localhost:27017/admin

- If you want to seed the database with exam questions, you can run a seed script or manually insert questions.

---

## Managing Exam Questions in MongoDB

### Exam Question Document Structure

The `questions` collection stores exam questions in this format:

{
"questionText": "What does CSS stand for?",
"options": [
"Computer Style Sheets",
"Cascading Style Sheets",
"Creative Style Sheets",
"Colorful Style Sheets"
],
"correctOptionIndex": 1
}



# Frontend Setup

1. Navigate to frontend folder:
cd ../frontend


2. Install frontend dependencies:


3. Start the React app:
npm start

Open your browser to [http://localhost:3000](http://localhost:3000).

---

# API Testing

### Using Postman

Import the included `ExamApp.postman_collection.json` into Postman to test all API endpoints:

- User registration  
- User login  
- Fetch exam questions  
- Submit exam answers

---

### Curl Command in this project

**Register new user:**

curl -X POST http://localhost:5000/api/auth/register
-H "Content-Type: application/json"
-d '{"username":"testuser","password":"testpassword"}'

**Login:**
curl -X POST http://localhost:5000/api/auth/login
-H "Content-Type: application/json"
-d '{"username":"testuser","password":"testpassword"}'

**Get exam questions (replace YOUR_JWT_TOKEN):**
curl -X GET http://localhost:5000/api/exam/questions
-key "Authorization" value: Bearer "YOUR_JWT_TOKEN"

**Submit exam answers:**
curl -X POST http://localhost:5000/api/exam/submit
-H "Content-Type: application/json"
-H "Authorization: Bearer YOUR_JWT_TOKEN"
-d '{
"answers": [
{ "questionId": "QUESTION_ID_1", "selectedOptionIndex": 0 },
{ "questionId": "QUESTION_ID_2", "selectedOptionIndex": 2 }
]
}'

---
## Exam Instructions

- **Register an account** before you can take the exam.  
- After logging in, you will be presented with a set of **multiple-choice questions (MCQs)**.  
- For each question, select the option you believe is correct.  
- Once you have answered all questions, **submit your exam** to receive your score.  
- The exam is timed, so please answer all questions within the allotted time.

Make sure to follow these steps carefully to complete the exam successfully.

## React Scripts

In the frontend directory, you can run:

- `npm start` — Runs the app in development mode  
- `npm test` — Launches the test runner  
- `npm run build` — Builds the app for production  
- `npm run eject` — Ejects the app configuration (use with caution)

See [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) for more details.

---



Thank you for reviewing this project!  
For any questions or support, please feel free to reach out.



