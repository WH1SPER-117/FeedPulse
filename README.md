# FeedPulse — AI-Powered Product Feedback Platform
AI-powered feedback analysis platform that automatically categorizes, prioritizes, and summarizes user feedback in real-time.

## Tech Stack

Frontend:
- Next.js 14
- React
- Tailwind CSS

Backend:
- Node.js
- Express
- JWT Authentication

Database:
- MongoDB + Mongoose

AI:
- Google Gemini API (Flash model - gemini-flash-latest)


## Features

- AI-powered sentiment analysis, categorization, summarization, and priority scoring
- Spam protection using rate limiting
- Admin dashboard for managing and updating feedback
- Advanced filtering, search, and pagination
- Secure API with JWT-based authentication

## Run Locally

### 1. Clone the repo
git clone [https://github.com/WH1SPER-117/feedpulse.git](https://github.com/WH1SPER-117/FeedPulse.git)

### 2. Install dependencies

Backend:

- cd backend
- npm install

Frontend:

- cd frontend
- npm install

### 3. Setup environment variables

Create a `.env` file in backend:

- PORT=4000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_secret
- GEMINI_API_KEY=your_key

### 4. Run the app

**Backend:**
npm run dev

**Frontend:**
npm run dev

## Architecture Overview
- Frontend (Next.js) communicates with Express backend via REST API
- Backend processes feedback and integrates with Gemini API for AI analysis
- MongoDB stores feedback, user data, and AI results

## Screenshots

### Feedback Form
<img width="1897" height="911" alt="Screenshot 2026-04-03 224408" src="https://github.com/user-attachments/assets/d908af66-24d1-499a-aff1-fe289eb348ba" />


### Admin Dashboard
<img width="1900" height="901" alt="Screenshot 2026-04-03 225859" src="https://github.com/user-attachments/assets/e79cd017-f376-4574-89be-40be4b1a2003" />
<img width="1899" height="903" alt="Screenshot 2026-04-03 225905" src="https://github.com/user-attachments/assets/a9d15929-7f3d-431a-9ce3-5fa42dcbcbb2" />
<img width="1905" height="647" alt="Screenshot 2026-04-03 225840" src="https://github.com/user-attachments/assets/672f5a7b-9f6e-4579-ae05-c7feb3a6d726" />


## API Endpoints

### Auth
- POST /api/auth/login

### Feedback
- POST /api/feedback
- GET /api/feedback
- PATCH /api/feedback/:id
- DELETE /api/feedback/:id

### AI
- POST /api/feedback/:id/regenerate-ai
- GET /api/feedback/summary

### Status
- PATCH /api/feedback/:id/status

## Future Improvements

- Real authentication system with roles
- Real-time notifications for feedback updates
- Advanced analytics dashboard
- AI trend detection over time
- Dockerize the Project 
