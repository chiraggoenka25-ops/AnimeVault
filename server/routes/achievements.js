const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Get User Achievements
router.get('/:userId', async (req, res) => {
    try {
        const { data: userAchievements } = await supabase
            .from('user_achievements')
            .select('achievement_id, unlocked_at')
            .eq('user_id', req.params.userId);

        const { data: allAchievements } = await supabase
            .from('achievements')
            .select('*');

        const achievements = allAchievements.map(a => ({
            ...a,
            unlocked: userAchievements.some(ua => ua.achievement_id === a.id),
            unlocked_at: userAchievements.find(ua => ua.achievement_id === a.id)?.unlocked_at
        }));

        res.json({ achievements });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch achievements.' });
    }
});

module.exports = router;
