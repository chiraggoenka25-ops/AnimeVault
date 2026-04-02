require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'AnimeVault API is running.' });
});

// Import Routes
const authRoutes = require('./routes/auth');
const vaultRoutes = require('./routes/vault');
const communityRoutes = require('./routes/community');
const profileRoutes = require('./routes/profile');
const aiRoutes = require('./routes/ai');
const animeRoutes = require('./routes/anime');
const achievementRoutes = require('./routes/achievements');

app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/achievements', achievementRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
