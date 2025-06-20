# MailCraft Integration Guide

This guide explains how to integrate MailCraft as an embedded email editor widget in your web application.

## Quick Start

1. **Build MailCraft** (if you haven't already):
   ```bash
   npm run build
   ```

2. **Copy the built files** to your web server:
   - `dist/emaileditor/index.js` - The main JavaScript bundle
   - `dist/emaileditor/main.css` - The CSS styles

3. **Include the required files** in your HTML:
   ```html
   <!doctype html>
   <html lang="en">
   <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Your App with MailCraft</title>
       
       <!-- Required: Google Fonts for proper typography -->
       <link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
       
       <!-- MailCraft CSS -->
       <link href="emaileditor/main.css" rel="stylesheet" />
   </head>
   <body>
       <div id="root"></div>
       
       <!-- Configure MailCraft before loading -->
       <script>
           window.editor = {
               showExportHtml: true,
               showPreview: true,
               // ... other configuration
           };
       </script>
       
       <!-- MailCraft JavaScript -->
       <script type="module" src="emaileditor/index.js"></script>
   </body>
   </html>
   ```

## Configuration

MailCraft can be configured by setting properties on the `window.editor` object **before** loading the main script.

### Button Visibility

Control which buttons appear in the editor toolbar:

```javascript
window.editor = {
    showExportHtml: true,    // Export to HTML button
    showExportJson: true,    // Export to JSON button  
    showImportJson: true,    // Import from JSON button
    showPreview: true,       // Preview button
    showClear: true,         // Clear document button
    showGetLinks: true,      // Extract links button
};
```

### Custom Event Handlers

Override default button behavior with custom handlers:

```javascript
window.editor = {
    exportHtml: async function() {
        const html = window.editor.getHtml();
        // Your custom export logic
        console.log('Exporting HTML:', html);
    },
    
    exportJson: async function() {
        const json = window.editor.getJson();
        // Your custom export logic
        console.log('Exporting JSON:', json);
    },
    
    preview: async function() {
        const html = window.editor.getHtml();
        // Your custom preview logic
        window.open('data:text/html,' + encodeURIComponent(html));
    }
};
```

### Image Browser Integration

Provide a custom image browser for asset selection:

```javascript
window.editor = {
    imageBrowser: function() {
        return new Promise((resolve, reject) => {
            // Show your asset browser UI
            // When user selects an image, resolve with the URL:
            resolve('https://example.com/selected-image.jpg');
            
            // If user cancels, reject:
            // reject(new Error('Cancelled'));
        });
    }
};
```

### Merge Files / Placeholders

Provide dynamic content placeholders:

```javascript
window.editor = {
    loadMergeFiles: function() {
        return [
            { name: 'firstName', label: 'First Name', type: 'text', defaultValue: 'John' },
            { name: 'email', label: 'Email', type: 'email', defaultValue: 'john@example.com' },
            { name: 'company', label: 'Company', type: 'text', defaultValue: 'Acme Corp' }
        ];
    }
};
```

### Branding

Customize the editor's appearance:

```javascript
window.editor = {
    branding: {
        title: 'My Email Builder',           // Custom title
        logoUrl: 'https://example.com/logo.png',  // Custom logo
        logoAlt: 'My Logo',                  // Logo alt text
        hideTitle: false,                    // Hide title when using logo
        customHeaderContent: '<div>Custom content</div>' // Custom header HTML
    }
};
```

### Theming

Apply custom colors and styling:

```javascript
window.editor = {
    theme: {
        mode: 'light',                       // 'light', 'dark', or 'auto'
        primaryColor: '#3b82f6',             // Primary brand color
        backgroundColor: '#ffffff',          // Background color
        headerBackgroundColor: '#1f2937',    // Header background
        headerTextColor: '#ffffff',          // Header text color
        borderColor: '#e5e7eb',              // Border colors
        customCSS: '.custom { color: red; }' // Custom CSS styles
    }
};
```

## API Methods

Once MailCraft is loaded, these methods are available on `window.editor`:

### Content Management

```javascript
// Get current content as HTML
const html = window.editor.getHtml();

// Set content from HTML
window.editor.setHtml('<h1>Hello World</h1>');

// Get current content as JSON
const json = window.editor.getJson();

// Set content from JSON
window.editor.setJson({
    blocks: [
        { id: '1', type: 'heading', data: { text: 'Hello', level: 1 } }
    ]
});

// Clear the document
window.editor.clearDocument();

// Extract all links from the document
const links = window.editor.getAllLinks();
```

### Dynamic Configuration

```javascript
// Update configuration at runtime
window.editor.configure({
    showExportHtml: false,
    theme: {
        primaryColor: '#10b981'
    }
});
```

## Examples

### Complete Integration Example

See `test-complete-integration.html` for a comprehensive example that demonstrates:

- All API methods
- Dynamic configuration
- Custom theming
- Image browser integration
- Merge files/placeholders
- Event handling

### Basic Integration Example

See `mailcraft-fixed.html` for a minimal working example.

### Advanced Integration Example

See `mailcraft-integration.html` for an example with SweetAlert2 popups and asset browser integration.

## Events

MailCraft dispatches events via `window.postMessage`:

```javascript
window.addEventListener('message', (event) => {
    const { type, data } = event.data || {};
    
    switch (type) {
        case 'EDITOR_READY':
            console.log('MailCraft is ready');
            break;
            
        case 'EDITOR_HTML_RESULT':
            console.log('HTML export:', data.html);
            break;
            
        case 'EDITOR_JSON_RESULT':
            console.log('JSON export:', data.json);
            break;
            
        case 'EDITOR_LINKS_RESULT':
            console.log('Links found:', data.links);
            break;
    }
});
```

## Troubleshooting

### Common Issues

1. **Editor doesn't load**: Ensure the correct paths to `index.js` and `main.css`
2. **Styling issues**: Make sure Google Fonts are loaded and CSS is properly included
3. **API methods not available**: Wait for the 'EDITOR_READY' event before calling API methods
4. **Image browser not working**: Ensure your `imageBrowser` function returns a Promise

### Debug Mode

Add this to see console logs:

```javascript
window.addEventListener('message', console.log);
```

### File Paths

The build creates these stable filenames:
- `dist/emaileditor/index.js` - Main bundle
- `dist/emaileditor/main.css` - Styles

Always use these exact paths in your HTML.

## Advanced Configuration Example

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Advanced MailCraft Integration</title>
    
    <!-- Required Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- MailCraft CSS -->
    <link href="emaileditor/main.css" rel="stylesheet" />
    
    <style>
        body { margin: 0; padding: 20px; background: #f5f5f5; }
        #root { height: 90vh; background: white; border-radius: 8px; overflow: hidden; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script>
        window.editor = {
            // Button configuration
            showExportHtml: true,
            showExportJson: false,
            showImportJson: true,
            showPreview: true,
            showClear: false,
            showGetLinks: true,
            
            // Custom branding
            branding: {
                title: 'My Email Builder',
                logoUrl: 'https://via.placeholder.com/120x40/3b82f6/ffffff?text=LOGO',
                logoAlt: 'My Logo'
            },
            
            // Custom theme
            theme: {
                mode: 'light',
                primaryColor: '#3b82f6',
                backgroundColor: '#ffffff',
                headerBackgroundColor: '#1f2937',
                headerTextColor: '#ffffff'
            },
            
            // Image browser
            imageBrowser: function() {
                return new Promise((resolve, reject) => {
                    const images = [
                        'https://picsum.photos/600/400?random=1',
                        'https://picsum.photos/800/600?random=2',
                        'https://picsum.photos/400/300?random=3'
                    ];
                    
                    const choice = prompt('Select image:\n1. Image 1\n2. Image 2\n3. Image 3\n\nEnter 1, 2, or 3:');
                    const index = parseInt(choice) - 1;
                    
                    if (index >= 0 && index < images.length) {
                        resolve(images[index]);
                    } else {
                        reject(new Error('No image selected'));
                    }
                });
            },
            
            // Merge files
            loadMergeFiles: function() {
                return [
                    { name: 'firstName', label: 'First Name', type: 'text', defaultValue: 'John' },
                    { name: 'lastName', label: 'Last Name', type: 'text', defaultValue: 'Doe' },
                    { name: 'email', label: 'Email', type: 'email', defaultValue: 'john.doe@example.com' },
                    { name: 'company', label: 'Company', type: 'text', defaultValue: 'Acme Corp' }
                ];
            },
            
            // Custom export handler
            exportHtml: async function() {
                const html = window.editor.getHtml();
                console.log('Custom HTML export:', html);
                alert('HTML exported to console!');
            }
        };
        
        // Listen for editor events
        window.addEventListener('message', (event) => {
            const { type, data } = event.data || {};
            
            if (type === 'EDITOR_READY') {
                console.log('🚀 MailCraft is ready!');
                
                // Example: Load initial content
                setTimeout(() => {
                    window.editor.setHtml(`
                        <div style="padding: 20px; text-align: center;">
                            <h1 style="color: #3b82f6;">Welcome to MailCraft!</h1>
                            <p>This content was loaded programmatically.</p>
                        </div>
                    `);
                }, 1000);
            }
        });
    </script>
    
    <!-- MailCraft Main Script -->
    <script type="module" src="emaileditor/index.js"></script>
</body>
</html>
```

This integration guide provides everything needed to embed MailCraft successfully in any web application.
