const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { saveResume, getResumes } = require('../middleware/dataStore');

// ── Multer storage config ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase()))
      cb(null, true);
    else
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

// ── POST /api/resume ──────────────────────────────────────────────
router.post('/',
  upload.single('resume'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('position').trim().notEmpty().withMessage('Position is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, mobile, email, position, jobCode, location } = req.body;

    if (!req.file)
      return res.status(400).json({ success: false, message: 'Please upload a resume file (PDF/DOC/DOCX)' });

    const entry = {
      id: uuidv4(),
      name, mobile, email, position,
      jobCode: jobCode || 'N/A',
      location: location || 'N/A',
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      submittedAt: new Date().toISOString()
    };

    saveResume(entry);

    // Email notification to HR
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      await transporter.sendMail({
        from: `"Sigh Staffing Portal" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `[New Resume] ${name} – ${position}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#d4875a;padding:20px;text-align:center">
              <h2 style="color:#fff;margin:0">New Resume Submission</h2>
            </div>
            <div style="padding:24px;background:#faf6f0">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px;font-weight:bold;width:140px">Name</td><td>${name}</td></tr>
                <tr><td style="padding:6px;font-weight:bold">Mobile</td><td>${mobile}</td></tr>
                <tr><td style="padding:6px;font-weight:bold">Email</td><td>${email}</td></tr>
                <tr><td style="padding:6px;font-weight:bold">Position</td><td>${position}</td></tr>
                <tr><td style="padding:6px;font-weight:bold">Job Code</td><td>${jobCode || 'N/A'}</td></tr>
                <tr><td style="padding:6px;font-weight:bold">Location</td><td>${location || 'N/A'}</td></tr>
              </table>
            </div>
            <div style="background:#12243a;padding:12px;text-align:center;color:rgba(255,255,255,.6);font-size:12px">
              Resume file is attached and saved on the server.
            </div>
          </div>
        `,
        attachments: [{
          filename: req.file.originalname,
          path: req.file.path
        }]
      });
    } catch (e) {
      console.warn('⚠️  Resume email failed:', e.message);
    }

    res.json({ success: true, message: 'Resume submitted successfully! We will contact you soon.' });
  }
);

// ── GET /api/resume (admin) ───────────────────────────────────────
router.get('/', require('../middleware/auth'), (req, res) => {
  res.json({ success: true, data: getResumes() });
});

module.exports = router;
