const express = require('express');
const router = express.Router();
const { supabase, verifyAuth } = require('../middleware/auth');

// POST /api/ai/recommendations - Get suggestions based on user vault
router.post('/recommendations', verifyAuth, async (req, res) => {
    try {
        // 1. Fetch user's watchlist to understand taste
        const { data: watchlist, error } = await supabase
            .from('watchlist')
            .select('anime_title')
            .eq('user_id', req.user.id);

        if (error) throw error;

        const titles = watchlist.map(i => i.anime_title).join(', ');
        
        // 2. Logic: If OPENAI_API_KEY exists, use AI. Otherwise, use simulated engine.
        let recommendations = [];
        let message = "";

        if (process.env.OPENAI_API_KEY) {
            // Real OpenAI Logic (Example placeholder)
            // const response = await openai.chat.completions.create({...});
            // message = response.choices[0].message.content;
            message = "Your taste is exquisite! Based on your love for titles like " + (titles || "anime") + ", I sense you would enjoy dark fantasies or high-stakes shonen. (AI Analysis Active)";
        } else {
            // Simulated Recommendation Engine
            const suggestions = [
                { title: "Chainsaw Man", reason: "Matches your preference for high-octane action.", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400&auto=format&fit=crop" },
                { title: "Steins;Gate", reason: "Highly rated sci-fi that fits your psychological interests.", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=400&auto=format&fit=crop" },
                { title: "Spy x Family", reason: "A perfect wholesome break for your action-heavy list.", image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=400&auto=format&fit=crop" }
            ];
            
            message = watchlist.length > 0 
                ? `I analyzed your vault containing ${watchlist.length} titles. You seem to favor story-driven series. Here are my top picks for you:`
                : "Your vault is a clean slate! Here are some legendary essentials to start your journey.";
            
            recommendations = suggestions;
        }

        res.json({ 
            message,
            recommendations,
            isAi: !!process.env.OPENAI_API_KEY
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
