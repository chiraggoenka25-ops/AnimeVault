const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase environment variables. Make sure to set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env.");
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key');

// Middleware to verify Supabase JWT
const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized', details: error });
    }

    // Attach user to request
    req.user = user;
    
    // We can also attach a user-scoped supabase client to req if needed,
    // but usually making REST calls with the token directly works too.
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  supabase,
  verifyAuth
};
