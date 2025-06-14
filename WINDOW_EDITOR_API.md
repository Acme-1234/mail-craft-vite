# Window Editor API Documentation

The Window Editor API provides a powerful integration interface that allows host applications to configure and control the Mail Craft email editor. This API is exposed through the `window.editor` object and enables deep customization of editor behavior.

## Table of Contents

1. [Overview](#overview)
2. [API Reference](#api-reference)
3. [Configuration Options](#configuration-options)
4. [Custom Handlers](#custom-handlers)
5. [Image Browser Integration](#image-browser-integration)
6. [Examples](#examples)
7. [PostMessage Integration](#postmessage-integration)

## Overview

The Window Editor API allows host applications to:

- Configure button visibility in the editor toolbar
- Override default button behaviors with custom handlers
- Integrate custom image browsers via Promise-based API
- Load custom merge files/placeholders
- Programmatically export/import content
- Access editor state and functionality

## API Reference

### Core Methods

```typescript
interface WindowEditorAPI {
  // Direct content access
  getHtml(): string;
  setHtml(html: string): void;
  getJson(): EditorDocument;
  setJson(data: EditorDocument): void;
  clearDocument(): void;
  getAllLinks(): string[];
  
  // Configuration
  configure(config: Partial<WindowEditorConfig>): void;
}
```

### Configuration Interface

```typescript
interface WindowEditorConfig {
  // Button visibility (default: true for all)
  showExportHtml?: boolean;
  showExportJson?: boolean;
  showImportJson?: boolean;
  showPreview?: boolean;
  showClear?: boolean;
  showGetLinks?: boolean;
  
  // Custom button handlers
  exportHtml?: () => void | Promise<void>;
  exportJson?: () => void | Promise<void>;
  importJson?: () => void | Promise<void>;
  preview?: () => void | Promise<void>;
  clear?: () => void | Promise<void>;
  getLinks?: () => void | Promise<void>;
  
  // Integration APIs
  imageBrowser?: () => Promise<string | null>;
  loadMergeFiles?: () => Promise<any[]> | any[];
}
```

## Configuration Options

### Button Visibility

Control which buttons appear in the editor toolbar:

```javascript
window.editor.configure({
  showExportHtml: true,   // Show/hide Export HTML button
  showExportJson: false,  // Show/hide Export JSON button
  showImportJson: true,   // Show/hide Import JSON button
  showPreview: true,      // Show/hide Preview button
  showClear: false,       // Show/hide Clear button
  showGetLinks: true      // Show/hide Get Links button
});
```

## Custom Handlers

Override default button behaviors with custom implementations:

```javascript
window.editor.configure({
  exportHtml: () => {
    // Custom HTML export logic
    const html = window.editor.getHtml();
    // Send to your backend, show in modal, etc.
    console.log('Custom HTML export:', html);
  },
  
  exportJson: async () => {
    // Custom JSON export with async operation
    const json = window.editor.getJson();
    await fetch('/api/save-template', {
      method: 'POST',
      body: JSON.stringify(json),
      headers: { 'Content-Type': 'application/json' }
    });
  },
  
  clear: () => {
    // Custom clear with confirmation
    if (confirm('Are you sure you want to clear the document?')) {
      window.editor.clearDocument();
    }
  }
});
```

## Image Browser Integration

Integrate your custom image browser using the Promise-based API:

```javascript
window.editor.configure({
  imageBrowser: () => {
    return new Promise((resolve, reject) => {
      // Open your custom image browser
      const modal = openImageBrowserModal();
      
      modal.onSelect = (imageUrl) => {
        resolve(imageUrl); // Return selected image URL
      };
      
      modal.onCancel = () => {
        resolve(null); // Return null if cancelled
      };
      
      modal.onError = (error) => {
        reject(error); // Reject on error
      };
    });
  }
});
```

### Real-world Image Browser Example

```javascript
window.editor.configure({
  imageBrowser: async () => {
    try {
      // Example: Integration with Unsplash API
      const response = await fetch('/api/images/browse');
      const images = await response.json();
      
      // Show custom image picker UI
      const selectedImage = await showImagePicker(images);
      
      if (selectedImage) {
        return selectedImage.url;
      }
      return null;
    } catch (error) {
      console.error('Image browser error:', error);
      return null;
    }
  }
});
```

## Examples

### Basic Configuration

```javascript
// Hide some buttons and add custom export
window.editor.configure({
  showImportJson: false,
  showGetLinks: false,
  exportHtml: () => {
    const html = window.editor.getHtml();
    downloadFile(html, 'email.html', 'text/html');
  }
});
```

### Full Integration Example

```javascript
// Complete integration with custom image browser and merge files
window.editor.configure({
  // Button visibility
  showExportJson: false,
  showImportJson: false,
  
  // Custom handlers
  exportHtml: async () => {
    const html = window.editor.getHtml();
    await saveToBackend(html);
    showSuccessMessage('Email saved successfully!');
  },
  
  preview: () => {
    const html = window.editor.getHtml();
    openPreviewWindow(html);
  },
  
  // Image browser integration
  imageBrowser: () => {
    return new Promise((resolve) => {
      openAssetManager({
        onSelect: (asset) => resolve(asset.url),
        onCancel: () => resolve(null)
      });
    });
  },
  
  // Load merge fields from your system
  loadMergeFiles: async () => {
    const response = await fetch('/api/merge-fields');
    return response.json();
  }
});
```

### Programmatic Content Management

```javascript
// Set content programmatically
const sampleEmail = {
  rows: [
    {
      id: 'row-1',
      columns: [
        {
          id: 'col-1',
          span: 12,
          blocks: [
            {
              id: 'block-1',
              type: 'text',
              content: '<h1>Welcome {{firstName}}!</h1>',
              styles: { padding: '20px', textAlign: 'center' }
            }
          ]
        }
      ]
    }
  ],
  settings: {
    contentWidth: '600px',
    backgroundColor: '#f8fafc'
  }
};

window.editor.setJson(sampleEmail);

// Get content
const currentHtml = window.editor.getHtml();
const currentJson = window.editor.getJson();
const allLinks = window.editor.getAllLinks();
```

## PostMessage Integration

For iframe-based integrations, the editor also supports PostMessage communication:

### Sending Commands

```javascript
// From parent window to iframe
iframe.contentWindow.postMessage({
  type: 'CONFIGURE_EDITOR',
  config: {
    showExportJson: false,
    imageBrowser: () => Promise.resolve('https://example.com/image.jpg')
  }
}, '*');

iframe.contentWindow.postMessage({ type: 'GET_HTML' }, '*');
iframe.contentWindow.postMessage({ type: 'GET_JSON' }, '*');
iframe.contentWindow.postMessage({ 
  type: 'SET_JSON', 
  data: emailData 
}, '*');
```

### Receiving Responses

```javascript
window.addEventListener('message', (event) => {
  switch (event.data.type) {
    case 'EDITOR_READY':
      console.log('Editor is ready');
      break;
    case 'EDITOR_HTML_RESULT':
      console.log('HTML:', event.data.html);
      break;
    case 'EDITOR_JSON_RESULT':
      console.log('JSON:', event.data.json);
      break;
    case 'EDITOR_LINKS_RESULT':
      console.log('Links:', event.data.links);
      break;
  }
});
```

## TypeScript Support

The API is fully typed for TypeScript projects:

```typescript
import type { WindowEditorAPI, WindowEditorConfig } from '@/hooks/useWindowEditorAPI';

declare global {
  interface Window {
    editor?: WindowEditorAPI;
  }
}

// Type-safe configuration
const config: WindowEditorConfig = {
  showExportHtml: true,
  imageBrowser: (): Promise<string | null> => {
    return myImageBrowser.show();
  }
};

window.editor?.configure(config);
```

## Error Handling

The API includes proper error handling:

```javascript
window.editor.configure({
  imageBrowser: () => {
    return new Promise((resolve, reject) => {
      try {
        // Your image browser logic
        openImageBrowser()
          .then(resolve)
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }
});

// Handle content import errors
try {
  window.editor.setHtml(htmlContent);
} catch (error) {
  console.error('Failed to import HTML:', error);
}
```

## Best Practices

1. **Always check if window.editor exists** before calling methods
2. **Handle Promise rejections** in custom handlers
3. **Validate content** before calling setHtml/setJson
4. **Use TypeScript** for better development experience
5. **Test integration** with the provided test page
6. **Configure early** - set up the API before users interact with the editor

## Testing

Use the included test page (`test-window-editor-api.html`) to test your integration:

1. Start the development server
2. Open `test-window-editor-api.html` in your browser
3. Test different configurations and custom handlers
4. Verify iframe communication works correctly

The test page provides a comprehensive interface for testing all API features and serves as a reference implementation.
