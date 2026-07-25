import express from 'express';
const router = express.Router();

// Proxy GitHub API to avoid CORS / rate limit issues from browser
router.get('/:username', async (req, res) => {
  try {
    const r = await fetch(`https://api.github.com/users/${req.params.username}`, {
      headers: { 'User-Agent': 'portfolio-app' }
    });
    res.status(r.status).json(await r.json());
  } catch { res.status(500).json({ message: 'GitHub API error' }); }
});

router.get('/:username/repos', async (req, res) => {
  try {
    const r = await fetch(`https://api.github.com/users/${req.params.username}/repos?per_page=100&sort=updated`, {
      headers: { 'User-Agent': 'portfolio-app' }
    });
    res.status(r.status).json(await r.json());
  } catch { res.status(500).json({ message: 'GitHub API error' }); }
});

export default router;
