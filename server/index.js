/**
 * Express Backend Server for Hugging Face LLM Proxy
 * 
 * This server proxies requests from the frontend chatbot to Hugging Face's
 * Inference API, solving CORS issues and protecting the API key.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Route imports
const usersRoutes = require('./routes/users');
const scenariosRoutes = require('./routes/scenarios');

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Hugging Face API configuration (new v1/chat/completions endpoint)
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_API_KEY = process.env.HF_API_KEY;

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// User and scenario routes
app.use('/api/users', usersRoutes);
app.use('/api/scenarios', scenariosRoutes);

// Chat endpoint - proxies to Hugging Face
app.post('/api/chat', async (req, res) => {
    try {
        const { context, question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        if (!HF_API_KEY || HF_API_KEY === 'hf_YOUR_API_KEY_HERE') {
            return res.status(500).json({
                error: 'API key not configured',
                message: 'Please set HF_API_KEY in server/.env file'
            });
        }

        // Build the system prompt for the financial advisor
        const systemPrompt = `You are FinBot, a calm and experienced financial tutor.
Your role is to explain concepts and analyze simulated trading behavior.
This is an educational system, not real investment advice.

${context || ''}

Rules:
- Do NOT recommend specific stocks to buy or sell.
- Explain concepts in simple terms.
- Focus on learning and behavior, not profit chasing.
- Keep the answer under 4 sentences, wherever possible.
- Be helpful and informative.`;

        console.log(`[${new Date().toISOString()}] Chat request: "${question.substring(0, 50)}..."`);

        // Call Hugging Face API with OpenAI-compatible format
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'meta-llama/Llama-3.2-3B-Instruct',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question }
                ],
                max_tokens: 200,
                temperature: 0.7,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[HF API Error] Status: ${response.status}, Body: ${errorText}`);

            if (response.status === 503) {
                return res.status(503).json({
                    error: 'Model is loading',
                    message: 'The AI model is warming up. Please try again in a few seconds.'
                });
            }

            return res.status(response.status).json({
                error: 'Hugging Face API error',
                message: errorText
            });
        }

        const data = await response.json();

        // Extract the generated text from OpenAI-compatible response
        let generatedText = '';
        if (data.choices && data.choices[0]?.message?.content) {
            generatedText = data.choices[0].message.content.trim();
        } else if (Array.isArray(data) && data[0]?.generated_text) {
            generatedText = data[0].generated_text.trim();
        } else if (data.generated_text) {
            generatedText = data.generated_text.trim();
        } else {
            console.error('[HF API] Unexpected response format:', data);
            return res.status(500).json({
                error: 'Unexpected response format',
                message: 'Could not parse AI response'
            });
        }

        console.log(`[${new Date().toISOString()}] Response generated (${generatedText.length} chars)`);

        res.json({ response: generatedText });

    } catch (error) {
        console.error('[Server Error]', error);
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║       FinBot AI Backend Server                        ║
╠═══════════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:${PORT}          ║
║  📡 API endpoint: POST /api/chat                      ║
║  🔑 API Key: ${HF_API_KEY ? '✓ Configured' : '✗ Missing - check .env'}                       ║
║  🤖 Model: meta-llama/Llama-3.2-3B-Instruct           ║
╚═══════════════════════════════════════════════════════╝
  `);
});
