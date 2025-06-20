# MailCraft Integration Guide

## Current Issues with Your Implementation

1. **Wrong File Paths**: The build generates hashed filenames that change each build
2. **Missing Dependencies**: Google Fonts and proper CSS imports
3. **Promise Handling**: Incorrect promise resolution in image browser
4. **Configuration Timing**: Window.editor needs to be set before script loads

## Solution 1: Use the Fixed HTML (Recommended)

Use the `mailcraft-integration.html` file I created, but you'll need to:

1. **Update the file paths** after each build:
   - Check `dist/assets/` folder for the actual filenames
   - Update the CSS and JS references in your HTML

2. **Current file paths** (these change after each build):
   ```html
   <link rel="stylesheet" crossorigin href="assets/index-R_Ob_r-x.css">
   <script type="module" crossorigin src="assets/index-C0MT1Fyz.js"></script>
   ```

## Solution 2: Configure Vite for Stable Filenames

If you want stable filenames that don't change, update your `vite.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'emaileditor/index.js',
        chunkFileNames: 'emaileditor/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'emaileditor/main.css';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  }
});
```

## Solution 3: Complete Integration Example

Here's how your final HTML should look:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MailCraft Integration</title>
    
    <!-- Required: Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Optional: SweetAlert2 for popups -->
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet" />
    
    <!-- MailCraft CSS -->
    <link rel="stylesheet" href="assets/index-R_Ob_r-x.css">
</head>
<body>
    <div id="root"></div>

    <!-- Optional: SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Configure BEFORE loading MailCraft -->
    <script>
        window.editor = {
            showExportHtml: true,
            showExportJson: false,
            showImportJson: true,
            showPreview: true,
            showClear: false,
            showGetLinks: true,
            
            // Image browser implementation
            imageBrowser: function() {
                return new Promise((resolve, reject) => {
                    // Your custom image selection logic here
                    // For example, open a file picker or asset manager
                    
                    // Simple example:
                    const imageUrl = prompt('Enter image URL:', 'https://placehold.co/600x400.png');
                    if (imageUrl) {
                        resolve(imageUrl);
                    } else {
                        reject(new Error('No image selected'));
                    }
                });
            }
        };
    </script>
    
    <!-- MailCraft Main Script -->
    <script type="module" src="assets/index-C0MT1Fyz.js"></script>
</body>
</html>
```

## Key Points:

1. **File Paths**: Update the CSS and JS paths to match your actual build output
2. **Google Fonts**: Required for proper typography
3. **Window Configuration**: Must be set before loading the main script
4. **Image Browser**: Implement according to your asset management needs
5. **Event Handling**: Listen for editor events if needed

## Testing Your Integration:

1. Open your HTML file in a browser
2. Check browser console for any errors
3. Verify that MailCraft loads and displays correctly
4. Test image browser functionality
5. Test export/import functions

## Common Issues:

- **White screen**: Usually means wrong file paths or missing dependencies
- **Styling issues**: Missing Google Fonts or CSS file
- **Image browser not working**: Promise handling issues
- **Configuration not applied**: Window.editor set after script loads
