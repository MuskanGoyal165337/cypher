/**
 * User Routes
 * 
 * API endpoints for user management
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../supabase');

// Create or get user
router.post('/', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        const { username, email } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (existingUser) {
            // Update last login
            await supabase
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', existingUser.id);

            return res.json({ user: existingUser, isNew: false });
        }

        // Create new user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ username, email }])
            .select()
            .single();

        if (error) {
            console.error('[Users] Create error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json({ user: newUser, isNew: true });

    } catch (error) {
        console.error('[Users] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('[Users] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
