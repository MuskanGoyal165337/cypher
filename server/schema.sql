-- Supabase Database Schema
-- Run this in the Supabase SQL Editor (supabase.com > SQL Editor)

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Scenario results table
CREATE TABLE scenario_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scenario_id TEXT NOT NULL,
    scenario_name TEXT NOT NULL,
    scenario_icon TEXT,
    starting_balance DECIMAL(12,2) NOT NULL,
    final_balance DECIMAL(12,2) NOT NULL,
    profit_loss DECIMAL(12,2) NOT NULL,
    profit_loss_percent DECIMAL(6,2) NOT NULL,
    total_trades INTEGER DEFAULT 0,
    learning_score DECIMAL(4,2) DEFAULT 0,
    days_completed INTEGER DEFAULT 0,
    total_days INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries by user
CREATE INDEX idx_scenario_results_user_id ON scenario_results(user_id);

-- Enable Row Level Security (RLS) for production
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for now (update for production with auth)
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all access to scenario_results" ON scenario_results FOR ALL USING (true);
