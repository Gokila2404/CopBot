const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const aiRes = await axios.post(process.env.AI_API, { message });
    res.json(aiRes.data);
  } catch (err) {
    res.status(500).json({ error: 'AI service not available' });
  }
});

module.exports = router;
