require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const contactRoutes = require('./routes/contact');
const resumeRoutes  = require('./routes/resume');
const jobRoutes     = require('./routes/jobs');
const adminRoutes   = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Auto-create uploads and data folders if they don't exist ──────
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir    = path.join(__dirname, 'data');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir))    fs.mkdirSync(dataDir,    { recursive: true });

// ── Security ──────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// ── CORS ──────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Rate limiting ─────────────────────────────────────────────────
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// ── Body parsers ──────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ──────────────────────────────────────────────────
// Serve the frontend HTML from /frontend/public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Resume uploads – publicly accessible so admin can download them
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/contact', contactRoutes);
app.use('/api/resume',  resumeRoutes);
app.use('/api/jobs',    jobRoutes);
app.use('/api/admin',   adminRoutes);

// ── Health check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', message: 'Sigh Staffing API is running 🚀' })
);

// ── Catch-all: serve frontend for any unknown route ───────────────
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'))
);

// ── Error handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Sigh Staffing server running on http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin.html\n`);
});
