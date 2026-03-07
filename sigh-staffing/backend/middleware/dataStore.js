/**
 * Simple JSON file-based data store.
 * Data is saved in /backend/data/*.json files.
 * Perfect for small sites – no database setup needed.
 * When you grow, swap these functions for real DB calls.
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR    = path.join(__dirname, '../data');
const JOBS_FILE    = path.join(DATA_DIR, 'jobs.json');
const RESUMES_FILE = path.join(DATA_DIR, 'resumes.json');
const CONTACTS_FILE= path.join(DATA_DIR, 'contacts.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── JOBS ──────────────────────────────────────────────────────────
function getJobs()       { return readJSON(JOBS_FILE); }
function saveJob(job)    { const all = getJobs(); all.unshift(job); writeJSON(JOBS_FILE, all); }
function updateJob(id, patch) {
  const all = getJobs();
  const idx = all.findIndex(j => j.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  writeJSON(JOBS_FILE, all);
  return all[idx];
}
function deleteJob(id) {
  const all = getJobs();
  const idx = all.findIndex(j => j.id === id);
  if (idx === -1) return null;
  const [deleted] = all.splice(idx, 1);
  writeJSON(JOBS_FILE, all);
  return deleted;
}

// ── RESUMES ───────────────────────────────────────────────────────
function getResumes()      { return readJSON(RESUMES_FILE); }
function saveResume(entry) { const all = getResumes(); all.unshift(entry); writeJSON(RESUMES_FILE, all); }

// ── CONTACTS ─────────────────────────────────────────────────────
function getContacts()       { return readJSON(CONTACTS_FILE); }
function saveContact(entry)  {
  const all = getContacts();
  all.unshift({ ...entry, id: Date.now().toString(), receivedAt: new Date().toISOString() });
  writeJSON(CONTACTS_FILE, all);
}

// ── Seed sample jobs if empty ─────────────────────────────────────
function seedIfEmpty() {
  if (getJobs().length > 0) return;
  const sample = [
    {
      id: 'job-001',
      title: 'Store Keeper / Inventory Manager',
      company: 'Sports Goods Manufacturer',
      location: 'Jalandhar',
      type: 'Full-Time',
      category: 'Manufacturing',
      salary: '₹25,000 – ₹35,000/month',
      description: 'We require a Store Keeper / Inventory Manager for a reputed sports goods manufacturing company.',
      requirements: [
        'Experience of 2 to 5 years in Sports goods manufacturing / Sports apparels / Sports shoes industry.',
        'Graduate in any stream with excellent communication and computer skills.',
        'Must have experience to work on MS Excel and ERP systems.'
      ],
      responsibilities: [
        'Maintain accurate records of all raw materials and finished goods.',
        'Monitor stock levels and inform management of reorder needs.',
        'Conduct daily, weekly and monthly stock verification.',
        'Ensure proper FIFO system implementation.'
      ],
      postedAt: new Date('2026-03-02').toISOString(),
      active: true
    },
    {
      id: 'job-002',
      title: 'Sales Executive – FMCG',
      company: 'Leading FMCG Brand',
      location: 'Punjab & Haryana',
      type: 'Full-Time',
      category: 'Sales',
      salary: '₹20,000 – ₹30,000 + Incentives',
      description: 'Hiring experienced Sales Executives for a leading FMCG brand expanding across Punjab and Haryana.',
      requirements: [
        'Minimum 1–3 years of FMCG sales / distribution experience.',
        'Strong communication, negotiation, and relationship management skills.',
        'Own vehicle preferred. Willing to travel within assigned territory.'
      ],
      responsibilities: [
        'Achieve monthly and quarterly sales targets.',
        'Build and maintain strong relationships with distributors and retailers.',
        'Report daily activities and market feedback to manager.'
      ],
      postedAt: new Date('2026-02-28').toISOString(),
      active: true
    },
    {
      id: 'job-003',
      title: 'HR Executive',
      company: 'Manufacturing Firm',
      location: 'Ludhiana',
      type: 'Full-Time',
      category: 'HR',
      salary: '₹22,000 – ₹30,000/month',
      description: 'Hiring an HR Executive for a reputed manufacturing unit in Ludhiana with 200+ employees.',
      requirements: [
        '2–4 years of HR experience in a manufacturing environment.',
        'Proficient in payroll processing, attendance management, and compliance.',
        'Hands-on experience with HRMS software preferred.'
      ],
      responsibilities: [
        'Handle end-to-end recruitment for blue-collar and white-collar roles.',
        'Maintain employee records and coordinate appraisal cycles.',
        'Ensure statutory compliance (PF, ESI, Labour laws).'
      ],
      postedAt: new Date('2026-02-25').toISOString(),
      active: true
    }
  ];
  writeJSON(JOBS_FILE, sample);
  console.log('📋 Sample jobs seeded.');
}

seedIfEmpty();

module.exports = { getJobs, saveJob, updateJob, deleteJob, getResumes, saveResume, getContacts, saveContact };
