# Online Job Portal (MERN Stack)

A complete, production-ready full-stack job portal web application using the MERN stack (MongoDB, Express.js, React.js, Node.js). 

## 🚀 Features

### For Job Seekers:
- **Authentication:** Secure Registration and Login using JWT.
- **Job Discovery:** Browse latest jobs with a modern grid UI.
- **Search & Filter:** Search jobs by keywords, skills, or company.
- **Apply to Jobs:** Submit applications with a cover letter.
- **Manage Applications:** View tracked applications and their status (Pending, Accepted, Rejected).

### For Recruiters:
- **Authentication:** Secure recruiter-specific login system.
- **Post Jobs:** Create detailed job listings with required skills, job type, and salary.
- **Dashboard:** Manage posted jobs directly from a unified dashboard.
- **Edit & Delete:** Full control over your created jobs.
- **Application Management:** Review all received applications and easily Accept or Reject them.

## 🛠️ Tech Stack

**Frontend:**
- React.js & Vite
- React Router (Protected Routes)
- Axios (with interceptors)
- Modern Vanilla CSS (Responsive, Glassmorphism, Clean Design)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs (Password Hashing)
- dotenv & cors

## 📂 Folder Structure

```
Online Job Portal/
│
├── Backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic (auth, job, application)
│   ├── middleware/      # Auth & Role validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API endpoints
│   ├── .env             # Environment variables 
│   └── server.js        # Server entry point
│
└── Frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Next.js-like page components
    │   ├── services/    # Axios configuration
    │   ├── utils/       # Auth helpers
    │   └── styles.css   # Main stylesheet
    ├── .env             # Vite environment variables
    └── package.json
```

## ⚙️ Installation & Setup

### 1. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the Backend folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Run the backend:
```bash
npm run dev
# or
node server.js
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
```
Create a `.env` file in the Frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```

## 🔌 API Endpoints
All backend endpoints are prefixed with `/api`.
### Auth
- `POST /auth/register` - Create new user (Job Seeker / Recruiter)
- `POST /auth/login` - Authenticate user

### Jobs
- `GET /jobs` - Publicly view all jobs
- `GET /jobs/:id` - View single job detail
- `POST /jobs` - Create job (Recruiter)
- `PUT /jobs/:id` - Update job (Recruiter owner)
- `DELETE /jobs/:id` - Delete job (Recruiter owner)

### Applications
- `POST /applications` - Apply for a job (Job Seeker)
- `GET /applications/my` - View my applications (Job Seeker)
- `GET /applications/:jobId/applications` - View applications for a specific job (Recruiter)
- `PUT /applications/:id/status` - Accept/Reject application (Recruiter)

## 🔐 Authentication Flow & Roles
- Logins generate a JWT strictly tied to either a **jobSeeker** or **recruiter** role.
- Frontend attaches the token globally via an Axios Interceptor.
- Backend restricts access via `authMiddleware.js` and `roleMiddleware.js`.

## 🧪 Postman Testing Guide

1. **Health check**: `GET /api/health` -> Ensure server returns 200 OK.
2. **Register job seeker**: `POST /api/auth/register` (body contains name, email, password, role="jobSeeker") -> Returns 201 Created.
3. **Login job seeker**: `POST /api/auth/login` -> Returns user obj + JWT.
4. **Register recruiter**: `POST /api/auth/register` (role="recruiter") -> Returns 201 Created.
5. **Login recruiter**: `POST /api/auth/login` -> returns token. Save it for Postman Auth.
6. **Create job**: `POST /api/jobs` (Bearer Token from Recruiter). 
7. **Get all jobs**: `GET /api/jobs` -> Should show your new job.
8. **Get single job**: `GET /api/jobs/:id`
9. **Update job**: `PUT /api/jobs/:id` (Bearer Token from Recruiter).
10. **Apply for job**: `POST /api/applications` using Bearer Token from Job Seeker.
11. **Get my applications**: `GET /api/applications/my` -> Should list the application.
12. **Recruiter gets applications**: `GET /api/applications/:jobId/applications` -> Recruiter can view all applying jobseekers.
13. **Recruiter accepts application**: `PUT /api/applications/:id/status` (body: `{"status":"Accepted"}`).
14. **Test unauthorized requests**: Try creating a job with a jobSeeker token -> Expect `403 Forbidden`.
15. **Test duplicate application**: Apply for the same job again -> Expect `400 Error`.
16. **Delete job**: `DELETE /api/jobs/:id` (Recruiter only).

## 🚀 Deployment Instructions

### Backend (Render / Heroku)
- Add your Backend repo or run via CLI.
- Ensure Environment variables are populated in the deployment platform settings.

### Frontend (Vercel / Netlify)
- Deploy your Frontend directory.
- Update `VITE_API_URL` to point to the remote Backend URL.
- Make sure to configure rewrites to `index.html` on Vercel for React Router.

## 💻 Git / GitHub Commands
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```
