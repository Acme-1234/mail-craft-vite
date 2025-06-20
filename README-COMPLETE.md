# MailCraft - Complete Integration Ready ✅

🎉 **MailCraft is now fully configured and ready for external integration!**

## What's Been Completed

### ✅ Build System
- **Stable filenames**: Build output uses consistent paths (`emaileditor/index.js`, `emaileditor/main.css`)
- **Production ready**: Optimized bundles with proper CSS extraction
- **No breaking changes**: File paths remain consistent across builds

### ✅ Window.editor API
- **Dynamic configuration**: Configure MailCraft at runtime
- **Complete API**: All core methods (`getHtml`, `setHtml`, `getJson`, `setJson`, `clearDocument`, `getAllLinks`)
- **Custom handlers**: Override default button behavior
- **Image browser integration**: Promise-based asset selection
- **Merge files support**: Dynamic placeholder/variable loading

### ✅ Theming & Branding
- **Custom branding**: Logo, title, header customization
- **Theme system**: Light/dark mode, custom colors, CSS injection
- **Design tokens**: Consistent spacing, typography, colors throughout
- **Google Fonts integration**: Proper typography with Poppins + Roboto

### ✅ Integration Examples
- **`test-complete-integration.html`**: Full-featured test suite with all API methods
- **`mailcraft-fixed.html`**: Minimal working example
- **`mailcraft-integration.html`**: Advanced example with SweetAlert2
- **`test-server.js`**: Local development server for testing

### ✅ Documentation
- **`INTEGRATION_GUIDE_NEW.md`**: Comprehensive integration guide
- **Live examples**: Multiple HTML files demonstrating different use cases
- **API reference**: Complete documentation of all methods and configuration options

## Quick Start

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Copy the built files** to your server:
   - `dist/emaileditor/index.js`
   - `dist/emaileditor/main.css`

3. **Use the integration template**:
   ```html
   <!doctype html>
   <html lang="en">
   <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Your App with MailCraft</title>
       
       <!-- Required: Google Fonts -->
       <link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
       
       <!-- MailCraft CSS -->
       <link href="emaileditor/main.css" rel="stylesheet" />
   </head>
   <body>
       <div id="root"></div>
       
       <!-- Configure before loading -->
       <script>
           window.editor = {
               showExportHtml: true,
               showPreview: true,
               imageBrowser: function() {
                   return new Promise((resolve, reject) => {
                       // Your image selection logic
                       const url = prompt('Image URL:');
                       url ? resolve(url) : reject(new Error('Cancelled'));
                   });
               }
           };
       </script>
       
       <!-- MailCraft Script -->
       <script type="module" src="emaileditor/index.js"></script>
   </body>
   </html>
   ```

## Test Locally

1. **Install Express** (if not already installed):
   ```bash
   npm install express
   ```

2. **Start the test server**:
   ```bash
   node test-server.js
   ```

3. **Open in browser**:
   - **Complete Test Suite**: http://localhost:3000/
   - **Basic Integration**: http://localhost:3000/basic
   - **Advanced Integration**: http://localhost:3000/advanced

## API Methods Available

Once MailCraft loads, these methods are available on `window.editor`:

```javascript
// Content management
const html = window.editor.getHtml();
window.editor.setHtml('<h1>Hello</h1>');
const json = window.editor.getJson();
window.editor.setJson({ blocks: [...] });
window.editor.clearDocument();
const links = window.editor.getAllLinks();

// Dynamic configuration
window.editor.configure({
    showExportHtml: false,
    theme: { primaryColor: '#10b981' }
});
```

## Configuration Options

### Button Visibility
```javascript
window.editor = {
    showExportHtml: true,
    showExportJson: true,
    showImportJson: true,
    showPreview: true,
    showClear: true,
    showGetLinks: true
};
```

### Custom Branding
```javascript
window.editor = {
    branding: {
        title: 'My Email Builder',
        logoUrl: 'https://example.com/logo.png',
        logoAlt: 'My Logo'
    }
};
```

### Custom Theme
```javascript
window.editor = {
    theme: {
        mode: 'light', // or 'dark', 'auto'
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        headerBackgroundColor: '#1f2937',
        headerTextColor: '#ffffff'
    }
};
```

### Image Browser
```javascript
window.editor = {
    imageBrowser: function() {
        return new Promise((resolve, reject) => {
            // Your asset browser implementation
            // resolve(selectedImageUrl) or reject(error)
        });
    }
};
```

### Merge Files/Placeholders
```javascript
window.editor = {
    loadMergeFiles: function() {
        return [
            { name: 'firstName', label: 'First Name', type: 'text', defaultValue: 'John' },
            { name: 'email', label: 'Email', type: 'email', defaultValue: 'john@example.com' }
        ];
    }
};
```

## File Structure

```
dist/
├── emaileditor/
│   ├── index.js       ← Main JavaScript bundle (stable filename)
│   └── main.css       ← CSS styles (stable filename)
├── index.html         ← Standalone version
└── vite.svg

Integration Examples:
├── test-complete-integration.html    ← Full test suite
├── mailcraft-fixed.html             ← Minimal example
├── mailcraft-integration.html       ← Advanced example
├── test-server.js                   ← Local test server
└── INTEGRATION_GUIDE_NEW.md         ← Complete guide
```

## Events

Listen for MailCraft events:

```javascript
window.addEventListener('message', (event) => {
    const { type, data } = event.data || {};
    
    switch (type) {
        case 'EDITOR_READY':
            console.log('MailCraft is ready!');
            break;
        case 'EDITOR_HTML_RESULT':
            console.log('HTML exported:', data.html);
            break;
    }
});
```

## Integration Checklist

- [x] ✅ Build system configured for stable output
- [x] ✅ Window.editor API fully implemented
- [x] ✅ All core methods working (`getHtml`, `setHtml`, etc.)
- [x] ✅ Dynamic configuration support
- [x] ✅ Image browser integration
- [x] ✅ Merge files/placeholders support
- [x] ✅ Custom theming and branding
- [x] ✅ Event system for communication
- [x] ✅ Comprehensive documentation
- [x] ✅ Multiple integration examples
- [x] ✅ Local test server
- [x] ✅ Google Fonts integration
- [x] ✅ Design system with tokens
- [x] ✅ Error handling and validation

## Ready for Production

MailCraft is now **production-ready** and can be embedded in any web application. The build output is stable, the API is comprehensive, and all integration scenarios are documented and tested.

For detailed integration instructions, see `INTEGRATION_GUIDE_NEW.md`.
