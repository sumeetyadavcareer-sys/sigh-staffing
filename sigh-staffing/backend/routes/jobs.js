const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { getJobs, saveJob, updateJob, deleteJob } = require('../middleware/dataStore');

// ── GET /api/jobs  (public – used by frontend) ────────────────────
router.get('/', (req, res) => {
  const jobs = getJobs();
  res.json({ success: true, data: jobs });
});

// ── GET /api/jobs/:id ─────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const job = getJobs().find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: job });
});

// ── POST /api/jobs  (admin only) ──────────────────────────────────
router.post('/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const job = {
      id: uuidv4(),
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type || 'Full-Time',
      category: req.body.category || 'General',
      salary: req.body.salary || 'Not disclosed',
      description: req.body.description,
      requirements: req.body.requirements || [],
      responsibilities: req.body.responsibilities || [],
      postedAt: new Date().toISOString(),
      active: true
    };

    saveJob(job);
    res.status(201).json({ success: true, message: 'Job posted successfully', data: job });
  }
);

// ── PUT /api/jobs/:id  (admin only) ───────────────────────────────
router.put('/:id', auth, (req, res) => {
  const updated = updateJob(req.params.id, req.body);
  if (!updated)
    return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, message: 'Job updated', data: updated });
});

// ── DELETE /api/jobs/:id  (admin only) ────────────────────────────
router.delete('/:id', auth, (req, res) => {
  const deleted = deleteJob(req.params.id);
  if (!deleted)
    return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, message: 'Job deleted' });
});

module.exports = router;
