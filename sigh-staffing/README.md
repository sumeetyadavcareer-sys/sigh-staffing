# Sigh Staffing – Full Stack Website

A complete Node.js backend + HTML frontend for Sigh Staffing Organization.

## Project Structure

```
sigh-staffing/
├── backend/
│   ├── server.js              ← Main Express server
│   ├── package.json
│   ├── .env.example           ← Copy this to .env and fill in your details
│   ├── routes/
│   │   ├── contact.js         ← Contact form API
│   │   ├── resume.js          ← Resume upload API
│   │   ├── jobs.js            ← Jobs CRUD API
│   │   └── admin.js           ← Admin login & stats API
│   ├── middleware/
│   │   ├── auth.js            ← Admin authentication
│   │   └── dataStore.js       ← JSON file-based storage
│   ├── uploads/               ← Uploaded resumes saved here
│   └── data/                  ← JSON data files (auto-created)
│       ├── jobs.json
│       ├── resumes.json
│       └── contacts.json
└── frontend/
    └── public/
        ├── index.html         ← Main website
        └── admin.html         ← Admin panel
```

## Setup Instructions

### Step 1 – Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 – Install dependencies
```bash
cd backend
npm install
```

### Step 3 – Configure environment
```bash
cp .env.example .env
```
Open `.env` and fill in:
- `EMAIL_USER` → your Gmail address
- `EMAIL_PASS` → Gmail App Password (see below)
- `EMAIL_TO`   → email where you want to receive notifications
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` → your admin login

### Step 4 – Gmail App Password setup
1. Go to your Google Account → Security
2. Enable 2-Step Verification (if not already)
3. Search "App Passwords" → Create one for "Mail"
4. Copy the 16-character password into `.env` as `EMAIL_PASS`

### Step 5 – Run the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server runs on: http://localhost:5000
Admin panel:    http://localhost:5000/admin.html

## API Endpoints

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | /api/jobs             | Get all jobs             | No            |
| GET    | /api/jobs/:id         | Get single job           | No            |
| POST   | /api/jobs             | Create new job           | ✅ Yes        |
| PUT    | /api/jobs/:id         | Update job               | ✅ Yes        |
| DELETE | /api/jobs/:id         | Delete job               | ✅ Yes        |
| POST   | /api/resume           | Submit resume + file     | No            |
| GET    | /api/resume           | List all resumes         | ✅ Yes        |
| POST   | /api/contact          | Submit contact message   | No            |
| GET    | /api/contact          | List all messages        | ✅ Yes        |
| POST   | /api/admin/login      | Admin login              | No            |
| GET    | /api/admin/stats      | Dashboard stats          | ✅ Yes        |
| GET    | /api/health           | Health check             | No            |

## Deploying to Production (Render.com – Free)

1. Push your code to GitHub
2. Go to render.com → New → Web Service
3. Connect your GitHub repo
4. Set:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
5. Add all your `.env` variables in the Environment tab
6. Deploy! You'll get a URL like `https://sigh-staffing.onrender.com`

## Upgrading to a Real Database (Later)

When your site grows, replace the JSON file store with:
- **MongoDB** (free on Atlas) – replace dataStore.js functions with Mongoose models
- **PostgreSQL** (free on Supabase) – replace with pg/Supabase client calls
The API routes don't need to change – only the dataStore layer.
