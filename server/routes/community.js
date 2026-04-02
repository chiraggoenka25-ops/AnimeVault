const express = require('express');
const router = express.Router();
const { supabase, verifyAuth } = require('../middleware/auth');

// Get all posts (global feed)
router.get('/posts', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                users(username, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single post with comments
router.get('/posts/:id', async (req, res) => {
    try {
        const { data: post, error: postErr } = await supabase
            .from('posts')
            .select('*, users(username, avatar_url)')
            .eq('id', req.params.id)
            .single();

        if (postErr) throw postErr;

        const { data: comments, error: commErr } = await supabase
            .from('comments')
            .select('*, users(username, avatar_url)')
            .eq('post_id', req.params.id)
            .order('created_at', { ascending: true });

        if (commErr) throw commErr;

        res.json({ post, comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new post
router.post('/posts', verifyAuth, async (req, res) => {
    try {
        const { title, description, image_url, tags } = req.body;
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                user_id: req.user.id,
                title,
                description,
                image_url,
                tags
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a comment
router.post('/comments', verifyAuth, async (req, res) => {
    try {
        const { post_id, content, parent_id } = req.body;
        const { data, error } = await supabase
            .from('comments')
            .insert([{
                user_id: req.user.id,
                post_id,
                content,
                parent_id
            }])
            .select(`
                *,
                users(username, avatar_url)
            `);

        if (error) throw error;
        res.status(201).json({ data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upvote/Downvote a post
router.post('/vote', verifyAuth, async (req, res) => {
    try {
        const { post_id, vote_type } = req.body;
        const { data, error } = await supabase
            .from('votes')
            .upsert({ user_id: req.user.id, post_id, vote_type }, { onConflict: 'user_id,post_id' })
            .select();
            
        if (error) throw error;
        res.json({ message: 'Vote recorded', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
