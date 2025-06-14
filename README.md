# Mail Craft - Visual Email Editor

A modern, React-based visual email editor built with Vite, TypeScript, and Tailwind CSS. Create beautiful, responsive email templates with drag-and-drop functionality, conditional layouts, and host integration capabilities.

## Features

### Core Functionality
- 🎨 **Visual Drag & Drop Editor** - Intuitive interface for building emails
- 📱 **Responsive Design** - Mobile-friendly email templates
- 🧱 **Block System** - Text, Image, Button, and Conditional Layout blocks
- 📐 **Layout System** - 1, 2, and 3-column layouts with flexible spans
- 🎯 **Live Preview** - Real-time preview of your email templates
- 💾 **Import/Export** - HTML and JSON format support

### Advanced Features
- 🔀 **Conditional Layouts** - Dynamic content based on merge field conditions
- 🔧 **Settings Panel** - Comprehensive styling and configuration options
- 📝 **Merge Fields** - Dynamic placeholder support for personalization
- 🔗 **Link Management** - Extract and manage all links in your templates
- 🎨 **Custom Styling** - Full control over fonts, colors, spacing, and more

### Host Integration (NEW)
- 🌐 **Window Editor API** - Deep integration capabilities for host applications
- ⚙️ **Configurable Buttons** - Show/hide and override default button behaviors
- 🖼️ **Custom Image Browser** - Promise-based image selection integration
- 📊 **Merge File Loading** - Dynamic placeholder/merge field management
- 💬 **PostMessage Support** - iframe-based communication for embedded scenarios

### Branding & Theming (NEW)
- 🎨 **Custom Branding** - Replace "Mailcraft" with your company name/logo
- 🌈 **Flexible Theming** - Custom colors, CSS, and complete visual control
- 🌙 **Dark Mode Support** - Built-in dark mode with system preference detection
- 🏢 **Brand Integration** - Logo, custom headers, and branded styling
- ✨ **CSS Injection** - Advanced theming with custom CSS and variables

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

```tsx
import EmailEditor from './components/editor/EmailEditor';
import type { EmailEditorRef } from './lib/types';

function App() {
  const editorRef = useRef<EmailEditorRef>(null);
  
  const placeholders = [
    { label: 'First Name', field: 'firstName' },
    { label: 'Email', field: 'email' }
  ];
  
  const handleImageSelect = (callback: (url: string) => void) => {
    // Open your image browser
    // Call callback with selected image URL
    callback('https://example.com/image.jpg');
  };
  
  return (
    <EmailEditor
      ref={editorRef}
      placeholders={placeholders}
      onImageSelect={handleImageSelect}
    />
  );
}
```

## Host Integration

### Window Editor API

The editor exposes a powerful `window.editor` API for deep integration:

```javascript
// Configure button visibility
window.editor.configure({
  showExportHtml: true,
  showExportJson: false,
  showImportJson: true,
  showPreview: true,
  showClear: false,
  showGetLinks: true
});

// Override button behaviors
window.editor.configure({
  exportHtml: () => {
    const html = window.editor.getHtml();
    // Custom export logic
  },
  
  exportJson: async () => {
    const json = window.editor.getJson();
    await saveToBackend(json);
  }
});

// Custom image browser integration
window.editor.configure({
  imageBrowser: () => {
    return new Promise((resolve) => {
      openImageBrowser({
        onSelect: (url) => resolve(url),
        onCancel: () => resolve(null)
      });
    });
  }
});

// Load custom merge fields
window.editor.configure({
  loadMergeFiles: async () => {
    const response = await fetch('/api/merge-fields');
    return response.json();
  }
});
```

### Programmatic Access

```javascript
// Get/set content
const html = window.editor.getHtml();
const json = window.editor.getJson();
window.editor.setHtml(htmlContent);
window.editor.setJson(jsonData);

// Utility functions
const links = window.editor.getAllLinks();
window.editor.clearDocument();
```

## Testing & Demo Pages

The project includes several test pages for different features:

```bash
# Start development server
npm run dev

# Test pages available at:
http://localhost:5174/test-window-editor-api.html    # Complete API testing
http://localhost:5174/test-button-visibility.html    # Button configuration
http://localhost:5174/test-branding-theme.html       # Branding & theming
http://localhost:5174/test-rulebuilder.html          # Conditional layouts
```

### Test Page Features

- **API Test Page** - Test all window.editor API features including custom handlers, image browser integration, and content management
- **Button Visibility** - Configure which buttons appear in the toolbar and test custom button handlers
- **Branding & Theme** - Live testing of branding options (logos, titles, custom headers) and theming (colors, dark mode, custom CSS)
- **Rule Builder** - Test conditional layout functionality and merge field integration

### Manual Testing

1. **Basic Functionality**: `npm run dev` and test drag & drop, styling, preview
2. **RuleBuilder**: Open `test-rulebuilder.html` for conditional layout testing
3. **Host Integration**: Open `test-window-editor-api.html` for Window API testing

### Unit Tests

```bash
npm run test
```

Test files are located in `src/components/editor/settings/__tests__/`

## Architecture

### Component Structure
```
src/
├── components/
│   ├── editor/
│   │   ├── EmailEditor.tsx           # Main editor component
│   │   ├── Canvas.tsx                # Drag & drop canvas
│   │   ├── Toolbar.tsx               # Draggable blocks/layouts
│   │   ├── SettingsPanel.tsx         # Settings container
│   │   ├── RuleBuilder.tsx           # Conditional logic builder
│   │   ├── PreviewModal.tsx          # Email preview
│   │   ├── dnd/                      # Drag & drop providers
│   │   └── settings/                 # Modular settings components
│   └── ui/                           # Shadcn/ui components
├── hooks/
│   ├── useEditorStore.ts             # Zustand state management
│   └── useWindowEditorAPI.ts         # Window API integration
├── lib/
│   ├── types.ts                      # TypeScript definitions
│   ├── export.ts                     # HTML/JSON export
│   ├── import.ts                     # HTML/JSON import
│   └── utils.ts                      # Utility functions
└── config/
    └── editorConfig.ts               # Default configuration
```

### Key Technologies
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **@dnd-kit** for drag & drop
- **Zustand** for state management
- **Shadcn/ui** for UI components

## API Documentation

- **[Window Editor API](./WINDOW_EDITOR_API.md)** - Complete integration guide
- **[Refactoring Summary](./REFACTORING_SUMMARY.md)** - Technical implementation details
- **[Development Status](./STATUS.md)** - Current project status

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
