const express = require('express');
const router = express.Router();
const { supabase, verifyAuth } = require('../middleware/auth');

router.get('/', verifyAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', verifyAuth, async (req, res) => {
    try {
        const { username, avatar_url } = req.body;
        const { data, error } = await supabase
            .from('users')
            .update({ username, avatar_url })
            .eq('id', req.user.id)
            .select();

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
