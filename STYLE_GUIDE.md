Style Guide
1. Design Tokens
1.1 Colors
Define in :root { … } for easy theming (and optionally [data-theme="dark"] { … } overrides).

css
Copy
Edit
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
1.2 Typography
css
Copy
Edit
/* Font Families */
--font-heading: "Poppins", sans-serif;
--font-body:    "Roboto", sans-serif;

/* Font Weights */
--fw-heading-bold: 600;
--fw-heading-med:  500;
--fw-body-med:     500;
--fw-body-std:     400;

/* Font Sizes */
--text-h1:    2rem;    /* 32px */
--text-h2:    1.75rem; /* 28px */
--text-h3:    1.5rem;  /* 24px */
--text-h4:    1.25rem; /* 20px */
--text-body:  1rem;    /* 16px */
--text-small: 0.875rem;/* 14px */
1.3 Spacing Scale
css
Copy
Edit
--space-xxs: 4px;
--space-xs:  8px;
--space-sm:  16px;
--space-md:  24px;
--space-lg:  32px;
--space-xl:  48px;
--space-xxl: 64px;
1.4 Border Radius
css
Copy
Edit
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
1.5 Elevation / Shadows
css
Copy
Edit
--shadow-1: 0 1px 2px rgba(0,0,0,0.05);
--shadow-2: 0 2px 4px rgba(0,0,0,0.08);
--shadow-3: 0 4px 8px rgba(0,0,0,0.12);
1.6 Motion & Transitions
css
Copy
Edit
--duration-fast:   150ms;
--duration-base:   200ms;
--duration-slow:   300ms;
--easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
1.7 Breakpoints
css
Copy
Edit
--break-sm:  640px;
--break-md:  768px;
--break-lg:  1024px;
--break-xl:  1280px;
2. Typography Usage
css
Copy
Edit
h1 { font: var(--fw-heading-bold) var(--text-h1) var(--font-heading); color: var(--color-text-high); }
h2 { font: var(--fw-heading-bold) var(--text-h2) var(--font-heading); color: var(--color-text-high); }
h3 { font: var(--fw-heading-med)  var(--text-h3) var(--font-heading); color: var(--color-text-high); }
h4 { font: var(--fw-heading-med)  var(--text-h4) var(--font-heading); color: var(--color-text-high); }

p, .body-text { font: var(--fw-body-std) var(--text-body) var(--font-body); color: var(--color-text-high); }
.small-text { font: var(--fw-body-std) var(--text-small) var(--font-body); color: var(--color-text-medium); }
3. Component Patterns
3.1 Buttons
css
Copy
Edit
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
3.2 Cards
css
Copy
Edit
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
3.3 Utility Classes
Text:
.text-primary, .text-accent, .text-success, etc.

Background:
.bg-primary-light, .bg-success, etc.

Border:
.border-primary-dark, .border-warning, etc.

4. Accessibility & States
Focus

css
Copy
Edit
:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
Contrast
Aim for ≥4.5:1 contrast between --color-text-high and --color-bg.

Hover/Active
Use subtle darken or elevating box-shadow.

Disabled
Low-opacity (opacity: 0.5) and cursor: not-allowed.

5. How to Use
Never hard-code colors, fonts, spacing—always pull from the design tokens.

Wrap all tokens in :root { … } for default and [data-theme="dark"] { … } for dark mode.

Follow the scales (spacing, typography, shadows, motion) to maintain consistency.

Add new components by mapping to existing tokens; extend scales only when absolutely necessary.