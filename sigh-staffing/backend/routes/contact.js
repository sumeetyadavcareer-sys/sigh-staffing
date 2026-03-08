const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');
const nodemailer = require('nodemailer');

const DB_FILE = path.join(__dirname, '../data/contacts.json');

function readContacts() {
  if (!fs.existsSync(DB_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return []; }
}
function saveContacts(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// POST /api/contact  — submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const record = { id: Date.now(), name, email, subject: subject || '(no subject)', message, date: new Date().toISOString() };

    const contacts = readContacts();
    contacts.unshift(record);
    saveContacts(contacts);

    // Send email notification if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `[Singh Staffing] Contact: ${record.subject}`,
          html: `<h3>New Contact Message</h3>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Subject:</strong> ${record.subject}</p>
                 <p><strong>Message:</strong><br>${message.replace(/\n/g,'<br>')}</p>`
        });
      } catch (mailErr) {
        console.error('Email send failed:', mailErr.message);
      }
    }

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/contact  — admin: view all messages
router.get('/', (req, res) => {
  res.json({ success: true, data: readContacts() });
});

module.exports = router;
