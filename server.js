const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies (for contact form API)
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  // Log to console (replace with email/DB logic as needed)
  console.log('📬 New contact form submission:');
  console.log(`  Name: ${name}`);
  console.log(`  Email: ${email}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  Message: ${message}`);

  res.json({ success: true, message: 'Message received! We will get back to you soon.' });
});

// Catch-all: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Singh Staffing server running on port ${PORT}`);
});
