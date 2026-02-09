/**
 * Scenario Routes
 * 
 * API endpoints for scenario history management
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../supabase');

// Save scenario result
router.post('/', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        const {
            user_id,
            scenario_id,
            scenario_name,
            scenario_icon,
            starting_balance,
            final_balance,
            profit_loss,
            profit_loss_percent,
            total_trades,
            learning_score,
            days_completed,
            total_days
        } = req.body;

        if (!user_id || !scenario_id) {
            return res.status(400).json({ error: 'user_id and scenario_id are required' });
        }

        const { data, error } = await supabase
            .from('scenario_results')
            .insert([{
                user_id,
                scenario_id,
                scenario_name,
                scenario_icon,
                starting_balance,
                final_balance,
                profit_loss,
                profit_loss_percent,
                total_trades,
                learning_score,
                days_completed,
                total_days
            }])
            .select()
            .single();

        if (error) {
            console.error('[Scenarios] Insert error:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`[Scenarios] Saved result for user ${user_id}: ${scenario_name}`);
        res.status(201).json({ result: data });

    } catch (error) {
        console.error('[Scenarios] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's scenario history
router.get('/:userId', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        const { data, error } = await supabase
            .from('scenario_results')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('completed_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('[Scenarios] Fetch error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ results: data || [] });

    } catch (error) {
        console.error('[Scenarios] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's scenario stats
router.get('/:userId/stats', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        const { data, error } = await supabase
            .from('scenario_results')
            .select('profit_loss, learning_score')
            .eq('user_id', req.params.userId);

        if (error) {
            console.error('[Scenarios] Stats error:', error);
            return res.status(500).json({ error: error.message });
        }

        const results = data || [];
        const total = results.length;
        const profitable = results.filter(r => r.profit_loss > 0).length;
        const totalPL = results.reduce((sum, r) => sum + (r.profit_loss || 0), 0);
        const avgLearningScore = total > 0
            ? results.reduce((sum, r) => sum + (r.learning_score || 0), 0) / total
            : 0;

        res.json({
            stats: {
                totalScenarios: total,
                profitableScenarios: profitable,
                winRate: total > 0 ? (profitable / total) * 100 : 0,
                totalProfitLoss: totalPL,
                averageLearningScore: avgLearningScore
            }
        });

    } catch (error) {
        console.error('[Scenarios] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
