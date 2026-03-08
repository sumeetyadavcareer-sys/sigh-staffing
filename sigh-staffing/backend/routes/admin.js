const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'Sigh@2026';
  if (username === adminUser && password === adminPass) {
    return res.json({ success: true, token: 'admin-token-singh-2026' });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const contacts = readJSON(CONTACTS_FILE);
  res.json({ success: true, data: { contacts: contacts.length } });
});

module.exports = router;
