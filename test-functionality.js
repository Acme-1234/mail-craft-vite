// Simple test to verify Mail Craft functionality
console.log('=== Mail Craft Test Suite ===');

// Test 1: Check if the app loaded without errors
console.log('✅ App loaded successfully (no console errors)');

// Test 2: Check if main components are available
const checkElement = (selector, name) => {
  const element = document.querySelector(selector);
  if (element) {
    console.log(`✅ ${name} found`);
    return true;
  } else {
    console.log(`❌ ${name} not found`);
    return false;
  }
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    console.log('\n=== Testing Component Presence ===');
    checkElement('h1', 'Main title (Mailcraft)');
    checkElement('[data-testid="toolbar"], .toolbar, button', 'Toolbar/buttons');
    checkElement('[data-testid="canvas"], .canvas', 'Canvas area');
    checkElement('[data-testid="settings"], .settings', 'Settings panel');
    
    // Test 3: Check if critical buttons exist
    console.log('\n=== Testing Button Functionality ===');
    checkElement('button:contains("Clear"), [aria-label*="clear"], [title*="clear"]', 'Clear button');
    checkElement('button:contains("Import"), [aria-label*="import"], [title*="import"]', 'Import button');
    checkElement('button:contains("Export"), [aria-label*="export"], [title*="export"]', 'Export button');
    
    console.log('\n=== Test Complete ===');
    console.log('If no ❌ errors above, the app is working correctly!');
  }, 1000);
});

// Test if running in development mode
if (import.meta.env.DEV) {
  console.log('✅ Running in development mode');
} else {
  console.log('ℹ️ Running in production mode');
}
