# Online Job Portal - Frontend

React + Vite frontend for the Online Job Portal.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

For PowerShell, `Copy-Item .env.example .env` can be used instead.

Default API: `http://localhost:5000/api`

Expected backend endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/jobs
- GET /api/jobs/:id
- POST /api/jobs
- PUT /api/jobs/:id
- DELETE /api/jobs/:id
- POST /api/applications
- GET /api/applications/my
