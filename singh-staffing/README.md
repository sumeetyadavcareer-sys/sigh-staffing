# Singh Staffing – Website

A professional staffing agency website built with HTML/CSS/JS, served via a Node.js + Express backend.

---

## 📁 Project Structure

```
singh-staffing/
├── public/
│   └── index.html       ← Your frontend (HTML, CSS, JS all-in-one)
├── server.js            ← Express server
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Deploy on Render (Step-by-Step)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit – Singh Staffing site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/singh-staffing.git
git push -u origin main
```

### 2. Create a Web Service on Render
1. Go to [https://render.com](https://render.com) and sign in.
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub account and select the `singh-staffing` repository.
4. Fill in the settings:
   - **Name:** `singh-staffing` (or any name you like)
   - **Region:** Choose nearest to your users
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid for better performance)
5. Click **"Create Web Service"**.

Render will automatically build and deploy. Your site will be live at:
`https://singh-staffing.onrender.com` (or whatever name you chose).

---

## 🔄 Auto-Deploys
Every time you push to `main`, Render will automatically redeploy your site.

---

## 📬 Contact Form API
The backend exposes a POST endpoint at `/api/contact`.

**Request body (JSON):**
```json
{
  "name": "Rajesh",
  "email": "rajesh@example.com",
  "subject": "Job Inquiry",
  "message": "I am interested in your services."
}
```

**Response:**
```json
{ "success": true, "message": "Message received! We will get back to you soon." }
```

To wire up the contact form to actually send emails, you can add [Nodemailer](https://nodemailer.com/) or use a service like [SendGrid](https://sendgrid.com/) in `server.js`.

---

## 💻 Run Locally
```bash
npm install
npm start
# Open http://localhost:3000
```
