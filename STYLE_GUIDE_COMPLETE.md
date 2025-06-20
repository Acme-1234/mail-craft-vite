# MailCraft Style Guide - Complete Implementation

## Overview
This document outlines the complete style guide implementation for MailCraft, following the comprehensive AI & Copilot design system specifications.

## 1. Design Tokens (✅ Implemented)

### 1.1 Colors
```css
/* Primary Blues */
--color-primary:       #007ACC;
--color-primary-light: #E6F4FF;
--color-primary-dark:  #005A9E;

/* Accent */
--color-accent:        #FF7A59;

/* Neutrals */
--color-bg:            #FFFFFF;
--color-surface:       #F9FAFB;
--color-border:        #E5E7EB;

/* Text */
--color-text-high:     #333333;
--color-text-medium:   #666666;
--color-text-low:      #999999;

/* Feedback */
--color-success:       #2EA44F;
--color-warning:       #D9822B;
--color-error:         #CB2431;
```

### 1.2 Typography
```css
/* Font Families */
--font-heading: "Poppins", sans-serif;
--font-body:    "Roboto", sans-serif;

/* Font Weights */
--fw-heading-bold: 600;
--fw-heading-med:  500;
--fw-body-med:     500;
--fw-body-std:     400;

/* Font Sizes */
--text-h1:    2rem;      /* 32px */
--text-h2:    1.75rem;   /* 28px */
--text-h3:    1.5rem;    /* 24px */
--text-h4:    1.25rem;   /* 20px */
--text-body:  1rem;      /* 16px */
--text-small: 0.875rem;  /* 14px */
```

### 1.3 Spacing Scale
```css
--space-xxs: 4px;
--space-xs:  8px;
--space-sm:  16px;
--space-md:  24px;
--space-lg:  32px;
--space-xl:  48px;
--space-xxl: 64px;
```

### 1.4 Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
```

### 1.5 Elevation / Shadows
```css
--shadow-1: 0 1px 2px rgba(0,0,0,0.05);
--shadow-2: 0 2px 4px rgba(0,0,0,0.08);
--shadow-3: 0 4px 8px rgba(0,0,0,0.12);
```

### 1.6 Motion & Transitions
```css
--duration-fast:   150ms;
--duration-base:   200ms;
--duration-slow:   300ms;
--easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

### 1.7 Breakpoints
```css
--break-sm:  640px;
--break-md:  768px;
--break-lg:  1024px;
--break-xl:  1280px;
```

## 2. Typography Usage (✅ Implemented)

```css
h1 { font: var(--fw-heading-bold) var(--text-h1) var(--font-heading); color: var(--color-text-high); }
h2 { font: var(--fw-heading-bold) var(--text-h2) var(--font-heading); color: var(--color-text-high); }
h3 { font: var(--fw-heading-med)  var(--text-h3) var(--font-heading); color: var(--color-text-high); }
h4 { font: var(--fw-heading-med)  var(--text-h4) var(--font-heading); color: var(--color-text-high); }

p, .body-text { font: var(--fw-body-std) var(--text-body) var(--font-body); color: var(--color-text-high); }
.small-text { font: var(--fw-body-std) var(--text-small) var(--font-body); color: var(--color-text-medium); }
```

## 3. Component Patterns (✅ Implemented)

### 3.1 Buttons
```css
.btn {
  display: inline-block;
  font: var(--fw-body-med) var(--text-small) var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background var(--duration-base) var(--easing-standard),
              box-shadow var(--duration-base) var(--easing-standard);
}

.btn-primary {
  background: var(--color-primary);
  color: #FFF;
  border-radius: var(--radius-sm);
  padding: var(--space-xs) var(--space-md);
  box-shadow: var(--shadow-1);
}
.btn-primary:hover {
  background: var(--color-primary-dark);
  box-shadow: var(--shadow-2);
}

.btn-secondary {
  background: var(--color-accent);
  color: #FFF;
  border-radius: var(--radius-sm);
  padding: var(--space-xs) var(--space-md);
  box-shadow: var(--shadow-1);
}
.btn-secondary:hover {
  box-shadow: var(--shadow-2);
}
```

### 3.2 Cards
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-1);
  transition: box-shadow var(--duration-base) var(--easing-standard);
}
.card:hover {
  box-shadow: var(--shadow-2);
}
```

### 3.3 Utility Classes (✅ Implemented)

#### Text Colors:
- `.text-primary`, `.text-accent`, `.text-success`, `.text-warning`, `.text-error`
- `.text-high`, `.text-medium`, `.text-low`

#### Background Colors:
- `.bg-primary`, `.bg-primary-light`, `.bg-primary-dark`, `.bg-accent`
- `.bg-surface`, `.bg-success`, `.bg-warning`, `.bg-error`

#### Border Colors:
- `.border-primary`, `.border-primary-dark`, `.border-accent`
- `.border-warning`, `.border-error`

#### Spacing:
- `.p-xxs`, `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl`, `.p-xxl`
- `.m-xxs`, `.m-xs`, `.m-sm`, `.m-md`, `.m-lg`, `.m-xl`, `.m-xxl`

#### Typography:
- `.font-heading`, `.font-body`
- `.text-h1`, `.text-h2`, `.text-h3`, `.text-h4`, `.text-body`, `.text-small`
- `.fw-heading-bold`, `.fw-heading-med`, `.fw-body-med`, `.fw-body-std`

#### Other Utilities:
- `.rounded-sm`, `.rounded-md`, `.rounded-lg`
- `.shadow-1`, `.shadow-2`, `.shadow-3`
- `.transition-fast`, `.transition-base`, `.transition-slow`

## 4. Accessibility & States (✅ Implemented)

### Focus
```css
:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Disabled States
```css
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Hover Effects
All interactive components use consistent hover states with shadow elevation or color changes.

## 5. Dark Mode Support (✅ Implemented)

Dark mode is implemented using `[data-theme="dark"]` selector:

```css
[data-theme="dark"] {
  /* Neutrals - Dark Mode */
  --color-bg: #1A1A1A;
  --color-surface: #2D2D2D;
  --color-border: #404040;

  /* Text - Dark Mode */
  --color-text-high: #FFFFFF;
  --color-text-medium: #CCCCCC;
  --color-text-low: #999999;
}
```

## 6. Usage Guidelines

### ✅ DO:
- Always use design tokens: `var(--color-primary)` instead of `#007ACC`
- Use utility classes for consistent spacing: `.p-md` instead of `padding: 24px`
- Follow the component patterns for new UI elements
- Use the typography scale for all text elements

### ❌ DON'T:
- Hard-code colors, fonts, or spacing values
- Create one-off styles that don't follow the system
- Skip accessibility considerations (focus states, contrast)
- Extend scales without discussing with the design team

## 7. Implementation Status

### ✅ Completed:
- All design tokens defined and implemented
- Typography system with proper font loading
- Component patterns (buttons, cards)
- Comprehensive utility classes
- Dark mode support
- Accessibility focus states
- Build system integration
- Tailwind CSS configuration

### 📁 Files Updated:
- `src/index.css` - Complete design system implementation
- `tailwind.config.js` - Extended theme configuration
- `index.html` - Google Fonts integration
- `src/App.css` - Updated to use design tokens

## 8. Examples

### Using the Style Guide in Components:

```html
<!-- Typography -->
<h1>Main Heading</h1>
<p class="small-text text-medium">Subtitle text</p>

<!-- Buttons -->
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>

<!-- Cards -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content using design system.</p>
</div>

<!-- Utility Classes -->
<div class="bg-surface p-md rounded-md shadow-1">
  <span class="text-primary fw-body-med">Highlighted text</span>
</div>
```

### Using CSS Variables Directly:

```css
.custom-component {
  background: var(--color-surface);
  color: var(--color-text-high);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);
  transition: transform var(--duration-base) var(--easing-standard);
}
```

## 9. Build Verification

✅ **Build Status**: Successful  
✅ **CSS Compilation**: No errors  
✅ **Design Tokens**: All available  
✅ **Utility Classes**: Generated correctly  
✅ **TypeScript**: No type errors  

The style guide is now fully implemented and ready for use across the MailCraft application.
