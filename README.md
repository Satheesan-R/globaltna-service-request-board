(The file `c:\Users\sathe\globaltna-service-request-board\README.md` exists, but is empty)
# GlobalTNA — Service Request Board

Lightweight service-request board for homeowners and vendors. This repository contains a Next.js frontend (`client/`) and an Express + MongoDB backend (`server/`).

## Features
- Post service requests (title, description, category, location, contact)
- View request cards on homepage with category icons
- Request detail view with status management (Open / In Progress / Closed)
- Simple authentication (register / login) and job persistence in MongoDB

## Tech Stack
- Frontend: Next.js (app router), React
- Backend: Node.js, Express, Mongoose (MongoDB)
- Auth: JSON Web Tokens (JWT)

## Repo structure

- `client/` — Next.js frontend (app/ directory)
- `server/` — Express backend, routes, controllers, Mongoose models
- `client/public/` — static images used by the frontend

## Prerequisites
- Node.js (v18+ recommended)
- npm (or yarn)
- MongoDB (local or Mongo Atlas)

## Quick start

1. Clone repository

	git clone <repo-url>
	cd globaltna-service-request-board

2. Start backend

	cd server
	npm install

	Create a `.env` file in `server/` with the following variables:

	```env
	MONGO_URI=<your-mongodb-connection-string>
	PORT=5000
	JWT_SECRET=<a-strong-secret>
	```

	Start the server:

	```bash
	npm run dev
	```

	The server listens on `http://localhost:5000` by default.

3. Start frontend

	Open a new terminal, then:

	```bash
	cd client
	npm install
	npm run dev
	```

	The Next.js app runs on `http://localhost:3000` by default.

If your frontend fetches the backend at a different base URL, update the fetch calls or set an environment variable and reference it in the client code.

## API (quick reference)

- GET `/api/jobs` — list jobs (supports `?category=` and `?status=` filters)
- POST `/api/jobs` — create a job (JSON body)
- GET `/api/jobs/:id` — get job by id
- PATCH `/api/jobs/:id` — update job status (body: `{ status: "Open" | "In Progress" | "Closed" }`)
- DELETE `/api/jobs/:id` — delete job
- POST `/api/auth/register` — register user
- POST `/api/auth/login` — login user (returns JWT)

Example curl to change status:

bash
curl -X PATCH http://localhost:5000/api/jobs/<jobId> \
  -H 'Content-Type: application/json' \
  -d '{"status":"In Progress"}'


## Data model (JobRequest)

- `title` (String, required)
- `description` (String, required)
- `category` (String)
- `location` (String)
- `Address` (String)
- `phonenumber` (String)
- `contactName` (String)
- `contactEmail` (String, required, unique)
- `status` (Enum: `Open`, `In Progress`, `Closed`) — default `Open`
- `createdAt` (Date)

Schema file: `server/models/JobRequest.js`.

## Notes & Troubleshooting
- If `npm run dev` in `server/` exits immediately (exit code 1), check the `.env` `MONGO_URI` and ensure MongoDB is reachable. Look at server console for error details.
- If frontend can't reach the backend, confirm the base URL and CORS settings in `server/server.js`.

## Development
- Add or edit pages in `client/app/` (App Router). Remember to use `"use client"` at the top of files that use React hooks like `useState` or `useRouter`.
- Backend controllers are in `server/controllers/` and routes in `server/routes/`.

## TODO / Improvements
- Add proper auth-protected admin panel for managing requests
- Add notifications/email on status changes
- Add pagination and filters on the jobs listing

## Deployment

This project is split into two separate deploys:

- Frontend: `client/` on Vercel
- Backend: `server/` on Render

### 1) Deploy the backend to Render

1. Create a new Web Service in Render and connect this repository.
2. Set the Root Directory to `server`.
3. Use these values:
	- Build Command: `npm install`
	- Start Command: `npm start`
4. Add these environment variables in Render:
	- `MONGO_URI` = your MongoDB connection string
	- `JWT_SECRET` = a strong secret string
	- `PORT` = `10000` or leave it unset and let Render assign one
5. Deploy the service and copy the live backend URL, for example `https://your-service.onrender.com`.

### 2) Deploy the frontend to Vercel

1. Create a new project in Vercel and import the same repository.
2. Set the Root Directory to `client`.
3. Add this environment variable in Vercel:
	- `NEXT_PUBLIC_API_URL` = your Render backend URL, for example `https://your-service.onrender.com`
4. Deploy the project.
5. After deployment, open the Vercel URL and verify that login, register, job creation, and request listing all talk to the Render backend.

### Common issues

- If Vercel shows a 404, the Root Directory is usually wrong. It must be `client`.
- If the frontend cannot reach the backend, check `NEXT_PUBLIC_API_URL`.
- If Render fails to start, check `MONGO_URI`, `JWT_SECRET`, and the Render logs.
- If browser requests are blocked, confirm CORS is enabled in `server/server.js`.

### Live URLs

After both deploys finish, add your live URLs here:

- Frontend: `https://your-vercel-app.vercel.app`
- Backend: `https://your-render-service.onrender.com`

## Contributing
- Fork the repo, create a branch, open a PR. Keep changes focused and add tests where appropriate.

## License
- (Add your preferred license here)

---
If you'd like, I can add a short `docker-compose.yml` to run Mongo + server + client for faster local setup. Would you like that? 
