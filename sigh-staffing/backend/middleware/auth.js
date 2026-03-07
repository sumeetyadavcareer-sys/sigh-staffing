// Simple Basic-Auth middleware
// Frontend sends: Authorization: Basic base64(username:password)

module.exports = function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Basic '))
    return res.status(401).json({ success: false, message: 'Unauthorized – login required' });

  const decoded  = Buffer.from(header.slice(6), 'base64').toString();
  const [user, pass] = decoded.split(':');

  if (user === process.env.ADMIN_USERNAME && pass === process.env.ADMIN_PASSWORD)
    return next();

  res.status(403).json({ success: false, message: 'Forbidden – invalid credentials' });
};
