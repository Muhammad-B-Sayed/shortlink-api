# [URL-Shortlink](https://urlshortlink.xyz)
<img width="1410" height="1206" alt="image" src="https://github.com/user-attachments/assets/d64534fa-de22-4549-aef0-49d78503ec39" />

URL-Shortlink is a full-stack URL shortener with guest link creation, authenticated link management, click analytics, expiration controls, and production deployments for both the frontend and backend.

## Live Application

- Frontend: [https://urlshortlink.xyz/dashboard](https://urlshortlink.xyz/dashboard)
- Backend API: [https://shortlink-c8sm.onrender.com](https://shortlink-c8sm.onrender.com)
- API docs: [https://shortlink-c8sm.onrender.com/docs](https://shortlink-c8sm.onrender.com/docs)

## Overview

Guest users can:
- create shortened URLs without signing in
- create shortened URLs with auto-generated short codes
- view and manage links stored locally in the browser through a guest dashboard
- inspect per-link analytics, including total clicks and last click time
- create up to 10 guest links with automatic expirations set to 7 days

Authenticated users can additionally:
- register for an account
- log in securely with their email and password
- stay authenticated using JWT-based bearer tokens
- create custom short codes when available
- generate random short codes automatically
- set optional expiration dates, including no expiration
- update link expiration dates after creation
- activate or deactivate links
- keep links tied to their account instead of only storing them in the browser
- create unlimited links

Shortlink uses a React frontend for the product UI, including a custom loading screen for backend cold starts, guest link creation, authenticated dashboards, custom short code support, random short code generation, and analytics visualizations. FastAPI is used for authentication, URL management, redirect handling, analytics, and persistence.

## Stack

### Frontend

- React 18
- TypeScript
- JavaScript
- Vite
- React Router
- Tailwind CSS
- PostCSS
- Fetch API
- Nginx
- Vercel + Custom Domain

### Backend

- Python 3
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic
- `python-jose` for JWT authentication
- `passlib` and `bcrypt` for password hashing
- `python-multipart` for OAuth2 form parsing
- `slowapi` for rate limiting
- Uvicorn
- CORS middleware

### Infrastructure

- Render for the deployed backend
- Docker
- Docker Compose

### Testing

- pytest
- FastAPI `TestClient`
- httpx

## Current Features

Authentication:
- user registration
- login with JWT
- protected dashboard routes
- current-user lookup

URL management:
- random short code generation
- optional custom aliases for authenticated users
- guest link creation
- guest link limit
- expiration dates
- activation and deactivation
- deletion

Analytics:
- total clicks
- last clicked time
- redirect tracking
- analytics visualizations
- duplicate/speculative request filtering

Deployment:
- frontend deployed on Vercel with a custom domain
- backend deployed on Render
- production CORS configuration
- Docker and Docker Compose support

## Product Behavior

- Guest users create links with automatically generated short codes.
- Authenticated users can optionally create custom short codes or generate random short codes automatically.
- Guest users can create up to 10 links, while signed-in users can create unlimited links.
- Guest links automatically expire after 7 days.
- Authenticated users can set optional expiration dates, including no expiration.
- Redirects respect both activation status and expiration.
- Expired links return `410 Gone`.
- Missing links return `404 Not Found`.
- Invalid bearer tokens return `401`.
- Delete operations cascade to related click records.
- Redirect analytics skip speculative browser requests to reduce double counting.

## Repository Layout

```text
shortlink-api/
├── alembic/
│   └── versions/
├── app/
│   ├── routers/
│   ├── services/
│   ├── utils/
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vercel.json
├── scripts/
├── tests/
├── alembic.ini
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.backend
├── requirements.txt
└── readme.md
```

## API Surface

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### URLs

- `POST /api/v1/urls/`
- `GET /api/v1/urls/my-urls`
- `GET /api/v1/urls/{short_code}/analytics`
- `PATCH /api/v1/urls/{short_code}/activate`
- `PATCH /api/v1/urls/{short_code}/deactivate`
- `PATCH /api/v1/urls/{short_code}/expiration`
- `DELETE /api/v1/urls/{short_code}`

### Redirect

- `GET /{short_code}`

## Authentication Notes

The backend uses JWT bearer tokens.

Swagger is configured with OAuth2 password flow.

In `/docs`:

1. Register a user.
2. Click `Authorize`.
3. Enter the account email in the `username` field.
4. Enter the password in the `password` field.
5. Leave `client_id` and `client_secret` blank.

## Environment Variables

Use [.env.example](/Users/muhammad/Random_Projects/shortlink-api/.env.example) as the starting point.

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shortlink_db
SECRET_KEY=change-this-in-production
PUBLIC_BASE_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://urlshortlink.xyz,https://www.urlshortlink.xyz
```

### Backend variables
- `DATABASE_URL`: database connection string used by SQLAlchemy and Alembic
- `SECRET_KEY`: signing key used for JWT creation and validation
- `PUBLIC_BASE_URL`: base URL used when the API returns `short_url`
- `CORS_ALLOWED_ORIGINS`: comma-separated frontend origins allowed to call the API
- `CORS_ALLOWED_ORIGIN_REGEX`: optional regex for additional local-development origins such as LAN IPs and `.local` hostnames

### Frontend variables
- `VITE_API_BASE_URL`: API base URL used by the frontend build

The frontend also supports runtime injection through `frontend/public/runtime-config.js`, which is populated by `frontend/docker-entrypoint.sh` in container deployments.

## Local Development

### Backend setup

1. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install backend dependencies:

```bash
pip install -r requirements.txt
```

3. Create a local environment file:

```bash
cp -n .env.example .env
```

If `.env` already exists, do not overwrite it unless you intentionally want to replace your working local settings.

4. Run database migrations:

```bash
alembic upgrade head
```

5. Start the backend:

```bash
uvicorn app.main:app --reload
```

Local backend URLs:

- API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Frontend setup

1. Install frontend dependencies:

```bash
cd frontend
npm ci
```

2. Point the frontend at the local API:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Use `127.0.0.1:8000` for local development. The frontend now auto-detects common local hosts, including `localhost`, `127.0.0.1`, `.local` hostnames, and private-network IPs, and will keep those pointed at a local backend unless you override `VITE_API_BASE_URL`.

3. Start the frontend:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

Typical local frontend URL:

- [http://localhost:5173](http://localhost:5173)

### Recommended local startup flow

Terminal 1, backend:

```bash
cd /Users/muhammad/Random_Projects/shortlink-api
source venv/bin/activate
./venv/bin/alembic upgrade head
./venv/bin/uvicorn app.main:app --reload
```

Terminal 2, frontend:

```bash
cd /Users/muhammad/Random_Projects/shortlink-api/frontend
npm ci
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

Then open:

- frontend: [http://localhost:5173](http://localhost:5173)
- backend docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Docker

Run the full local stack with:

```bash
docker compose up --build
```

This starts:

- PostgreSQL
- FastAPI backend
- React frontend served through Nginx

Default local ports:

- Frontend: `5173`
- Backend: `8000`
- PostgreSQL: `5433`

The backend containers automatically run `alembic upgrade head` before starting Uvicorn.

### Manual Development Setup (Optional)

#### Backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp -n .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm ci
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

## Migrations

Create a migration:

```bash
alembic revision --autogenerate -m "describe change"
```

Apply migrations:

```bash
alembic upgrade head
```

Roll back one revision:

```bash
alembic downgrade -1
```

If an older local database already has tables but no Alembic history, mark it as current only if the schema already matches:

```bash
alembic stamp head
```

## Testing

Run all backend tests:

```bash
python -m pytest -q
```

Run the URL-focused suite:

```bash
python -m pytest -v tests/test_urls.py
```

Run the frontend production build check:

```bash
cd frontend
npm run build
```

## Deployment Notes

- The production frontend runs on [https://urlshortlink.xyz](https://urlshortlink.xyz).
- The production backend runs on [https://shortlink-c8sm.onrender.com](https://shortlink-c8sm.onrender.com).
- The application is deployed with Vercel for the frontend and Render for the backend.
- The frontend defaults, runtime config, Docker config, and backend CORS settings are aligned to the current production URLs.

## Authors

- Muhammad Sayed
- Brandon Kochnari
