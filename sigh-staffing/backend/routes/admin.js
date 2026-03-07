const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');

// ── POST /api/admin/login ─────────────────────────────────────────
// Simple username/password auth – returns a token stored in localStorage
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Simple base64 token (fine for small internal admin panel)
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    return res.json({ success: true, token, message: 'Login successful' });
  }

  res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// ── GET /api/admin/stats ──────────────────────────────────────────
router.get('/stats', auth, (req, res) => {
  const { getJobs, getResumes, getContacts } = require('../middleware/dataStore');
  res.json({
    success: true,
    data: {
      totalJobs:     getJobs().length,
      activeJobs:    getJobs().filter(j => j.active).length,
      totalResumes:  getResumes().length,
      totalContacts: getContacts().length
    }
  });
});

module.exports = router;
