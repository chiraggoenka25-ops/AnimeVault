const express = require('express');
const router = express.Router();
const multer = require('multer');
const { supabase, verifyAuth } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Vault - Get all files for the authenticated user
router.get('/files', verifyAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('anime_files')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vault - Upload a new raw file to Supabase Storage and Save Metadata
router.post('/upload', verifyAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) throw new Error('No file uploaded');
        
        const { originalname, mimetype, buffer, size } = req.file;
        const filePath = `${req.user.id}/${Date.now()}_${originalname}`;
        
        // 1. Upload to Supabase Storage Bucket ('vault')
        const { data: storageData, error: storageError } = await supabase.storage
            .from('vault')
            .upload(filePath, buffer, {
                contentType: mimetype,
                upsert: false
            });
            
        if (storageError) throw storageError;
        
        // Retrieve public URL
        const { data: { publicUrl } } = supabase.storage.from('vault').getPublicUrl(filePath);

        // 2. Save metadata to anime_files
        const { data, error } = await supabase
            .from('anime_files')
            .insert([{
                user_id: req.user.id,
                filename: originalname,
                file_url: publicUrl,
                file_type: mimetype,
                size
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vault - Add a new file record manually (fallback)
router.post('/files', verifyAuth, async (req, res) => {
    try {
        const { filename, file_url, file_type, size } = req.body;
        const { data, error } = await supabase
            .from('anime_files')
            .insert([{
                user_id: req.user.id,
                filename,
                file_url,
                file_type,
                size
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vault - Get watchlist
router.get('/watchlist', verifyAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('watchlist')
            .select('*')
            .eq('user_id', req.user.id);
        
        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/watchlist', verifyAuth, async (req, res) => {
    try {
        const { anime_title, cover_image, status, rating, episodes_watched, total_episodes } = req.body;
        const { data, error } = await supabase
            .from('watchlist')
            .insert([{
                user_id: req.user.id,
                anime_title,
                cover_image,
                status,
                rating,
                episodes_watched: episodes_watched || 0,
                total_episodes: total_episodes || 0
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vault - Update watchlist item (progress tracking)
router.put('/watchlist/:id', verifyAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const { data, error } = await supabase
            .from('watchlist')
            .update(updates)
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select();

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Vault - Get notes
router.get('/notes', verifyAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notes_reviews')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/notes', verifyAuth, async (req, res) => {
    try {
        const { anime_title, content } = req.body;
        const { data, error } = await supabase
            .from('notes_reviews')
            .insert([{
                user_id: req.user.id,
                anime_title,
                content
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vault - Get characters
router.get('/characters', verifyAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/characters', verifyAuth, async (req, res) => {
    try {
        const { name, image_url, reason } = req.body;
        const { data, error } = await supabase
            .from('characters')
            .insert([{
                user_id: req.user.id,
                name,
                image_url,
                reason
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
