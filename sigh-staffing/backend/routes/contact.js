const express  = require('express');
const router   = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const { saveContact } = require('../middleware/dataStore');

// ── Nodemailer transporter ────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// ── POST /api/contact ─────────────────────────────────────────────
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, subject, message } = req.body;

    // Save to local JSON store
    saveContact({ name, email, subject, message });

    // Send email notification to HR
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        replyTo: email,
        subject: `[Sigh Staffing Contact] ${subject}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#d4875a;padding:20px;text-align:center">
              <h2 style="color:#fff;margin:0">New Contact Form Submission</h2>
            </div>
            <div style="padding:24px;background:#faf6f0">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr/>
              <p><strong>Message:</strong></p>
              <p style="white-space:pre-line">${message}</p>
            </div>
            <div style="background:#12243a;padding:12px;text-align:center;color:rgba(255,255,255,.6);font-size:12px">
              Sigh Staffing Organization © 2026
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.warn('⚠️  Email send failed (check .env):', emailErr.message);
      // Still return success — message is saved locally
    }

    res.json({ success: true, message: 'Thank you! Your message has been received. We will get back to you shortly.' });
  }
);

// ── GET /api/contact  (admin use) ─────────────────────────────────
router.get('/', require('../middleware/auth'), (req, res) => {
  const { getContacts } = require('../middleware/dataStore');
  res.json({ success: true, data: getContacts() });
});

module.exports = router;
