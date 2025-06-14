# Window Editor API Documentation

The Window Editor API provides a powerful integration interface that allows host applications to configure and control the Mail Craft email editor. This API is exposed through the `window.editor` object and enables deep customization of editor behavior.

## Table of Contents

1. [Overview](#overview)
2. [API Reference](#api-reference)
3. [Configuration Options](#configuration-options)
4. [Custom Handlers](#custom-handlers)
5. [Image Browser Integration](#image-browser-integration)
6. [Branding and Theming](#branding-and-theming)
7. [Examples](#examples)
8. [PostMessage Integration](#postmessage-integration)
8. [Branding and Theming](#branding-and-theming)

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
  
  // Branding configuration
  branding?: {
    title?: string;                    // Replace "Mailcraft" with custom title
    logoUrl?: string;                  // Custom logo image URL
    logoAlt?: string;                  // Alt text for logo
    hideTitle?: boolean;               // Hide title when using logo
    customHeaderContent?: string;      // Custom HTML content for header
  };
  
  // Theme configuration
  theme?: {
    mode?: 'light' | 'dark' | 'auto';  // Theme mode
    primaryColor?: string;             // Primary brand color
    backgroundColor?: string;          // Background color
    headerBackgroundColor?: string;    // Header background
    headerTextColor?: string;          // Header text color
    borderColor?: string;              // Border colors
    customCSS?: string;                // Custom CSS styles
  };
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

## Branding and Theming

The Window Editor API provides powerful branding and theming capabilities, allowing you to completely customize the editor's appearance and branding to match your application.

### Branding Configuration

Replace the default "Mailcraft" branding with your own:

```javascript
// Custom title only
window.editor.configure({
  branding: {
    title: 'My Email Builder'
  }
});

// Custom logo with title
window.editor.configure({
  branding: {
    title: 'Acme Corp',
    logoUrl: 'https://example.com/logo.png',
    logoAlt: 'Acme Corp Logo'
  }
});

// Logo only (hide title)
window.editor.configure({
  branding: {
    logoUrl: 'https://example.com/logo.png',
    logoAlt: 'Company Logo',
    hideTitle: true
  }
});

// Completely custom header HTML
window.editor.configure({
  branding: {
    customHeaderContent: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(45deg, #3b82f6, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">A</div>
        <div>
          <div style="font-size: 20px; font-weight: bold;">Acme Email Builder</div>
          <div style="font-size: 12px; color: #666;">Campaign Management Platform</div>
        </div>
      </div>
    `
  }
});
```

### Theme Configuration

#### Basic Theme Modes

```javascript
// Light mode
window.editor.configure({
  theme: {
    mode: 'light'
  }
});

// Dark mode
window.editor.configure({
  theme: {
    mode: 'dark'
  }
});

// Auto mode (follows system preference)
window.editor.configure({
  theme: {
    mode: 'auto'
  }
});
```

#### Custom Colors

```javascript
window.editor.configure({
  theme: {
    primaryColor: '#dc2626',           // Custom primary color
    backgroundColor: '#fef2f2',        // Custom background
    headerBackgroundColor: '#dc2626',  // Header background
    headerTextColor: '#ffffff',        // Header text color
    borderColor: '#fecaca'             // Border colors
  }
});
```

#### Advanced Theming with Custom CSS

```javascript
window.editor.configure({
  theme: {
    mode: 'light',
    primaryColor: '#8b5cf6',
    customCSS: `
      /* Custom button styles */
      .btn-primary { 
        background: linear-gradient(45deg, #8b5cf6, #3b82f6) !important; 
        border: none !important;
      }
      .btn-primary:hover { 
        background: linear-gradient(45deg, #7c3aed, #2563eb) !important; 
      }
      
      /* Custom panel styling */
      .settings-panel {
        border-left: 3px solid #8b5cf6;
      }
      
      /* Custom canvas styling */
      .email-canvas {
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
      }
    `
  }
});
```

### Complete Brand Integration Example

```javascript
// Complete company branding setup
window.editor.configure({
  branding: {
    title: 'Acme Email Studio',
    logoUrl: 'https://cdn.acme.com/logo.svg',
    logoAlt: 'Acme Corporation'
  },
  theme: {
    mode: 'light',
    primaryColor: '#dc2626',
    backgroundColor: '#fef2f2',
    headerBackgroundColor: '#dc2626',
    headerTextColor: '#ffffff',
    borderColor: '#fecaca',
    customCSS: `
      /* Acme brand styling */
      .btn-primary, .bg-primary { 
        background-color: #dc2626 !important; 
      }
      .btn-primary:hover { 
        background-color: #b91c1c !important; 
      }
      .text-primary, .border-primary { 
        color: #dc2626 !important; 
        border-color: #dc2626 !important; 
      }
      
      /* Custom header gradient */
      .editor-header {
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      }
    `
  }
});
```

### Branding Interface

```typescript
interface BrandingConfig {
  title?: string;                    // Custom title (replaces "Mailcraft")
  logoUrl?: string;                  // Logo image URL
  logoAlt?: string;                  // Logo alt text
  hideTitle?: boolean;               // Hide title when using logo
  customHeaderContent?: string;      // Complete custom header HTML
}
```

### Theme Interface

```typescript
interface ThemeConfig {
  mode?: 'light' | 'dark' | 'auto';  // Theme mode
  primaryColor?: string;             // Primary brand color
  backgroundColor?: string;          // Main background color
  headerBackgroundColor?: string;    // Header background
  headerTextColor?: string;          // Header text color
  borderColor?: string;              // Border colors throughout UI
  customCSS?: string;                // Custom CSS injection
}
```

### CSS Variables

The editor uses CSS variables that can be customized through the theme API:

```css
:root {
  --primary: /* Primary color */
  --background: /* Background color */
  --header-bg: /* Header background */
  --header-text: /* Header text color */
  --border: /* Border color */
  /* ... and many more */
}
```

### Dark Mode Support

The editor includes comprehensive dark mode support:

- Automatic CSS variable switching
- System preference detection in 'auto' mode  
- Full UI adaptation including panels, buttons, and canvas
- Proper contrast ratios for accessibility

### Testing Branding and Themes

Use the test page (`test-branding-theme.html`) to test branding and theming:

```bash
# Start dev server
npm run dev

# Open test page
http://localhost:5174/test-branding-theme.html
```

The test page provides:
- Live branding configuration
- Theme mode switching
- Custom color selection
- Real-time preview of changes
- Example configurations for different use cases

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
