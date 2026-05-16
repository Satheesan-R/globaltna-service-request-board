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

## Contributing
- Fork the repo, create a branch, open a PR. Keep changes focused and add tests where appropriate.

## License
- (Add your preferred license here)

---
If you'd like, I can add a short `docker-compose.yml` to run Mongo + server + client for faster local setup. Would you like that? 
