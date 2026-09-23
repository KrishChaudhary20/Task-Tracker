Task Tracker — Full Stack Assignment
A full-stack Task Tracker application built for the assignment.
----------------------------------------------------------------------------------------------------
Projects
backend/ — Node.js + Express + MongoDB + JWT 
frontend/ — React + Vite + Axios + React Router
----------------------------------------------------------------------------------------------------
Quick Start

1. Backend
cd backend
npm install

Create .env from .env.example, then:

npm run dev

Backend runs at http://localhost:5000.

2. Frontend
In another terminal:

cd frontend
npm install

Create .env from .env.example, then:

npm run dev
----------------------------------------------------------------------------------------------------
Creating an admin
Register a normal user first. To promote a user to admin, an existing admin must call:

POST /api/users/promote
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "email": "user@example.com"
}

For a fresh local evaluation, the easiest approach is to promote the first user directly in Prisma Studio or SQLite after registration, then log in again.
----------------------------------------------------------------------------------------------------
API endpoints
Auth
POST /api/auth/register
POST /api/auth/login
Users
GET /api/users/me
GET /api/users — admin
DELETE /api/users/:id — admin
Tasks
POST /api/tasks
GET /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
----------------------------------------------------------------------------------------------------
Testing
Backend:

cd backend
npm test

Frontend:

cd frontend
npm test
----------------------------------------------------------------------------------------------------
Security
Passwords are hashed with bcrypt.
JWT protects private endpoints.
Role checks protect admin endpoints.
Secrets are environment variables.
.env files are ignored by Git.
The frontend reads its API URL from VITE_API_URL.
