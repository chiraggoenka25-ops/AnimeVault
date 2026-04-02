const express = require('express');
const router = express.Router();
const { supabase } = require('../middleware/auth');

// Auth endpoints

// In Supabase, usually client handles signup/login, but if we need custom 
// server-side operations on auth, we can define them here.
// e.g. handling a custom redirect or saving additional user data on creation.

router.get('/status', (req, res) => {
    res.json({ message: 'Auth endpoint hit' });
});

module.exports = router;
