const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get Airing Schedule (Today)
router.get('/schedule', async (req, res) => {
    try {
        const response = await axios.get('https://api.jikan.moe/v4/schedules?filter=today');
        res.json({ data: response.data.data });
    } catch (err) {
        console.error('Jikan Schedule Error:', err);
        res.status(500).json({ error: 'Failed to fetch schedule from Neural Link (Jikan)' });
    }
});

// Get Upcoming Seasons
router.get('/seasons', async (req, res) => {
    try {
        const response = await axios.get('https://api.jikan.moe/v4/seasons/upcoming');
        res.json({ data: response.data.data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch seasonal data.' });
    }
});

module.exports = router;
