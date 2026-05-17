# GlobalTNA Service Request Board

GlobalTNA is a full-stack service request platform where homeowners can post jobs and professionals can view and manage requests.

This repository contains:
- Frontend: Next.js app in client
- Backend: Express + MongoDB API in server

## Features

- User registration and login
- Create service requests
- View all service requests
- View single request details
- Update request status (Open, In Progress, Closed)
- Delete requests
- MongoDB Atlas data persistence

## Tech Stack

- Frontend: Next.js, React
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Auth: JWT
- Deployment: Vercel (frontend), Render (backend)

## Project Structure

- client: Next.js frontend application
- server: Express backend API and MongoDB models
- vercel.json: Vercel build settings

## Local Development

### 1. Clone and install

    git clone <your-repo-url>
    cd globaltna-service-request-board

### 2. Backend setup (server)

    cd server
    npm install

Create server/.env:

    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000
    FRONTEND_URL=http://localhost:3000

Run backend:

    npm run dev

Backend runs at:
- http://localhost:5000

### 3. Frontend setup (client)

Open a new terminal:

    cd client
    npm install

Create client/.env.local:

    NEXT_PUBLIC_API_URL=http://localhost:5000

Run frontend:

    npm run dev

Frontend runs at:
- http://localhost:3000

## API Endpoints

Auth routes:
- POST /api/auth/register
- POST /api/auth/login

Job routes:
- GET /api/jobs
- POST /api/jobs
- GET /api/jobs/:id
- PATCH /api/jobs/:id
- DELETE /api/jobs/:id

## Deployment Guide

## Backend deployment (Render)

1. Create a Render Web Service from this repository.
2. Set Root Directory to server.
3. Build Command: npm install
4. Start Command: npm start
5. Add environment variables:

    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    FRONTEND_URL=https://your-production-vercel-domain.vercel.app

Notes:
- Backend CORS is configured to allow FRONTEND_URL, localhost, and Vercel deployment domains.
- This fixes network errors caused by blocked browser requests from Vercel frontend.

## Frontend deployment (Vercel)

1. Import the repository as a new Vercel project.
2. Set Root Directory to client.
3. Add environment variable:

    NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com

4. Deploy.

Important:
- NEXT_PUBLIC_API_URL must point to your live backend URL.
- Use https URLs in production.

## Troubleshooting

If frontend shows Network Error on Vercel:
- Confirm NEXT_PUBLIC_API_URL is set in Vercel project settings.
- Confirm FRONTEND_URL is set in Render backend settings.
- Redeploy backend first, then frontend.
- Check browser DevTools Network tab for blocked CORS/preflight requests.

If backend does not start:
- Verify MONGO_URI and JWT_SECRET values.
- Check Render logs for runtime errors.

If data is not saved:
- Confirm backend URL is reachable directly in browser or Postman.
- Verify MongoDB Atlas network access and user permissions.

## Recent Fixes Included

- Improved backend CORS for Vercel deployments and preview URLs.
- Removed duplicate auth route registration in backend server setup.
- Normalized frontend API base URL to prevent malformed request URLs.

## License

Add your preferred license here.
