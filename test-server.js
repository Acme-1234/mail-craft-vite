const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the current directory and dist folder
app.use(express.static('.'));
app.use('/emaileditor', express.static(path.join(__dirname, 'dist', 'emaileditor')));

// Serve integration test files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-complete-integration.html'));
});

app.get('/basic', (req, res) => {
    res.sendFile(path.join(__dirname, 'mailcraft-fixed.html'));
});

app.get('/advanced', (req, res) => {
    res.sendFile(path.join(__dirname, 'mailcraft-integration.html'));
});

// Mock assets endpoint for testing image browser
app.get('/assets/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Asset Browser</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .asset { 
                    display: inline-block; 
                    margin: 10px; 
                    text-align: center; 
                    cursor: pointer;
                    border: 2px solid transparent;
                    padding: 10px;
                    border-radius: 8px;
                }
                .asset:hover { border-color: #3b82f6; background: #f0f9ff; }
                .asset img { width: 120px; height: 80px; object-fit: cover; border-radius: 4px; }
                .asset p { margin: 5px 0 0 0; font-size: 12px; }
            </style>
        </head>
        <body>
            <h3>Select an Image</h3>
            <div class="asset" onclick="selectImage('https://picsum.photos/600/400?random=1')">
                <img src="https://picsum.photos/120/80?random=1" alt="Sample 1">
                <p>Image 1 (600x400)</p>
            </div>
            <div class="asset" onclick="selectImage('https://picsum.photos/800/600?random=2')">
                <img src="https://picsum.photos/120/80?random=2" alt="Sample 2">
                <p>Image 2 (800x600)</p>
            </div>
            <div class="asset" onclick="selectImage('https://picsum.photos/400/300?random=3')">
                <img src="https://picsum.photos/120/80?random=3" alt="Sample 3">
                <p>Image 3 (400x300)</p>
            </div>
            
            <script>
                function selectImage(url) {
                    // Send the selected image URL back to the parent window
                    window.parent.postMessage({ file: url }, window.location.origin);
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Test server running at http://localhost:${PORT}`);
    console.log(`📝 Complete integration test: http://localhost:${PORT}/`);
    console.log(`📝 Basic integration: http://localhost:${PORT}/basic`);
    console.log(`📝 Advanced integration: http://localhost:${PORT}/advanced`);
});
