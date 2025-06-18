# System Prompt for Email Template JSON Generation

## Purpose
This system prompt is designed to help AI generate properly structured JSON email template files that are fully compatible with the MailCraft email editor. Use this prompt when you need to create new templates or convert existing templates to the correct format.

## Template Structure

### Basic Structure
```json
{
  "document": {
    "settings": {
      "contentWidth": "600px",
      "backgroundColor": "#f8fafc",
      "fontFamily": "'Inter', sans-serif"
    }
  },
  "rows": [
    {
      "id": "row-id",
      "columns": [
        {
          "id": "column-id",
          "width": "100%",
          "blocks": [
            {
              "id": "block-id",
              "type": "block-type",
              "content": "Block content",
              "styles": {},
              "properties": {}
            }
            // Additional blocks...
          ]
        }
      ]
    }
    // Additional rows...
  ],
  "metadata": {
    "version": "1.0",
    "createdAt": "YYYY-MM-DDThh:mm:ssZ",
    "tags": ["tag1", "tag2"],
    "estimatedWidth": "600px",
    "previewText": "Preview text for email clients"
  }
}
```

### Required Structure Hierarchy
- `document` → Contains global settings
- `rows` → Array of row objects
  - Each row contains → `columns` array
    - Each column contains → `blocks` array
      - Each block has specific properties based on its type

## Block Types and Properties

### 1. Text Block
```json
{
  "id": "text-block-id",
  "type": "text",
  "content": "<p>Your text content here. Can include HTML.</p>",
  "styles": {
    "fontSize": "16px",
    "color": "#333333",
    "lineHeight": "1.6",
    "padding": "10px 20px",
    "backgroundColor": "#ffffff",
    "textAlign": "left"
  }
}
```

### 2. Heading Block
```json
{
  "id": "heading-block-id",
  "type": "heading",
  "content": "Heading Text",
  "level": 2,
  "styles": {
    "fontSize": "24px",
    "color": "#333333",
    "fontWeight": "600",
    "textAlign": "center",
    "padding": "20px",
    "backgroundColor": "#ffffff"
  }
}
```
**Important**: Always include the `level` property (1-6) in heading blocks to prevent editor crashes.

### 3. Image Block
```json
{
  "id": "image-block-id",
  "type": "image",
  "content": "",
  "styles": {
    "padding": "20px",
    "textAlign": "center",
    "backgroundColor": "#ffffff"
  },
  "properties": {
    "src": "https://example.com/image.jpg",
    "alt": "Image description",
    "width": "400",
    "height": "auto"
  }
}
```

### 4. Button Block
```json
{
  "id": "button-block-id",
  "type": "button",
  "content": "Click Me",
  "styles": {
    "backgroundColor": "#4f46e5",
    "color": "#ffffff",
    "borderRadius": "6px",
    "padding": "12px 24px",
    "fontSize": "16px",
    "fontWeight": "600",
    "textAlign": "center",
    "margin": "10px auto",
    "display": "inline-block"
  },
  "properties": {
    "href": "https://example.com"
  }
}
```

### 5. Divider Block
```json
{
  "id": "divider-block-id",
  "type": "divider",
  "content": "",
  "styles": {
    "borderTop": "1px solid #e2e8f0",
    "padding": "10px 0",
    "width": "100%",
    "margin": "10px auto"
  }
}
```

## Common Style Properties
- `padding`: Controls spacing inside elements (format: "10px" or "10px 20px 10px 20px")
- `margin`: Controls spacing outside elements
- `backgroundColor`: Background color (hex, rgb, or named colors)
- `color`: Text color
- `fontSize`: Font size with units (px, em, rem)
- `fontWeight`: Font weight (normal, bold, 400, 700, etc.)
- `textAlign`: Text alignment (left, center, right)
- `lineHeight`: Line height (1.5, 1.6, etc.)
- `borderRadius`: Rounded corners for elements (px or %)
- `width`: Element width (px or %)
- `display`: Display type (block, inline-block, etc.)

## Best Practices

1. **IDs and Naming**:
   - Use descriptive IDs for rows, columns, and blocks
   - Follow a consistent naming convention (e.g., `header-row`, `logo-image`, etc.)
   - IDs should be unique within the template

2. **Structure**:
   - Keep the nesting consistent: document → rows → columns → blocks
   - Each row should contain at least one column
   - Each column should contain at least one block

3. **Content and Styling**:
   - Place actual content in the `content` property
   - Place HTML attributes in the `properties` object
   - Place CSS styles in the `styles` object
   - Always include required properties for each block type
   - Always include a `level` property for heading blocks

4. **Responsive Design**:
   - Set appropriate column widths (percentages are recommended)
   - Use `contentWidth` in document settings to control overall email width
   - Test on multiple screen sizes

5. **Accessibility**:
   - Always include `alt` text for images
   - Use semantic HTML in content when possible
   - Maintain sufficient color contrast

## Example Template

```json
{
  "document": {
    "settings": {
      "contentWidth": "600px",
      "backgroundColor": "#f8fafc",
      "fontFamily": "'Inter', sans-serif"
    }
  },
  "rows": [
    {
      "id": "header-row",
      "columns": [
        {
          "id": "header-col",
          "width": "100%",
          "blocks": [
            {
              "id": "logo-block",
              "type": "image",
              "content": "",
              "styles": {
                "padding": "40px 20px 20px 20px",
                "textAlign": "center"
              },
              "properties": {
                "src": "https://via.placeholder.com/200x60/4f46e5/ffffff?text=LOGO",
                "alt": "Company Logo",
                "width": "200",
                "height": "60"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "content-row",
      "columns": [
        {
          "id": "content-col",
          "width": "100%",
          "blocks": [
            {
              "id": "greeting-heading",
              "type": "heading",
              "content": "Welcome to Our Service",
              "level": 1,
              "styles": {
                "padding": "20px",
                "textAlign": "center",
                "fontSize": "32px",
                "color": "#1a202c",
                "backgroundColor": "#ffffff"
              }
            },
            {
              "id": "welcome-text",
              "type": "text",
              "content": "<p>Thank you for joining us! We're excited to have you onboard.</p>",
              "styles": {
                "padding": "0 20px 20px 20px",
                "textAlign": "center",
                "fontSize": "16px",
                "color": "#4a5568",
                "lineHeight": "1.6",
                "backgroundColor": "#ffffff"
              }
            },
            {
              "id": "cta-button",
              "type": "button",
              "content": "Get Started",
              "styles": {
                "padding": "12px 24px",
                "margin": "10px auto 40px auto",
                "backgroundColor": "#4f46e5",
                "color": "#ffffff",
                "fontSize": "16px",
                "fontWeight": "600",
                "borderRadius": "6px",
                "textAlign": "center",
                "display": "inline-block"
              },
              "properties": {
                "href": "https://example.com/start"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "footer-row",
      "columns": [
        {
          "id": "footer-col",
          "width": "100%",
          "blocks": [
            {
              "id": "footer-text",
              "type": "text",
              "content": "<p>© 2025 Your Company. All rights reserved.</p>",
              "styles": {
                "padding": "20px",
                "textAlign": "center",
                "fontSize": "14px",
                "color": "#718096",
                "backgroundColor": "#f1f5f9"
              }
            }
          ]
        }
      ]
    }
  ],
  "metadata": {
    "version": "1.0",
    "createdAt": "2025-06-18T10:00:00Z",
    "tags": ["welcome", "onboarding"],
    "estimatedWidth": "600px",
    "previewText": "Welcome to our service! Get started today."
  }
}
```

## Common Issues to Avoid

1. **Incorrect Structure**: Ensure proper nesting of document → rows → columns → blocks
2. **Missing Required Properties**: Always include all required properties for each block type
3. **Missing Heading Level**: Every heading block must have a "level" property (1-6)
4. **Incorrect Properties Location**: Don't mix up styles and properties - use appropriate objects
5. **Inconsistent Styling**: Keep your styling consistent across similar elements
6. **Invalid JSON**: Ensure your JSON is valid with proper brackets, commas, and quotes
7. **Missing Image Properties**: Image blocks need properties with src, alt, width attributes
8. **Button Configuration**: Button blocks should have both styles and properties correctly set

By following this guide, you'll generate template JSON files that work flawlessly with the MailCraft email editor.
