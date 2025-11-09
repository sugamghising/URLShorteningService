// Vercel serverless function handler
// Handle both CommonJS default export and named exports
let app;
try {
    // Try to get default export (ES module style)
    const imported = require("../dist/index.js");
    app = imported.default || imported;
} catch (error) {
    console.error('Error loading serverless function:', error);
    // Return a basic error handler if module fails to load
    app = (req, res) => {
        res.status(500).json({ 
            error: 'Server initialization failed',
            message: error.message 
        });
    };
}

module.exports = app;
