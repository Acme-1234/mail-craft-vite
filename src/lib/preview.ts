import type { EditorDocument } from './types';
import { exportDocumentAsHtml } from './export';
import { Liquid } from 'liquidjs';

// Initialize Liquid template engine
const liquid = new Liquid({
  strictFilters: false, // Allow undefined variables without throwing errors
  strictVariables: false, // Don't throw on undefined variables
  trimTagLeft: true,
  trimTagRight: true,
  trimOutputLeft: true,
  trimOutputRight: true,
});

// Define a comprehensive set of fake data for placeholders
const fakeData: Record<string, any> = {
  // User data
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  company_name: 'Acme Corp',
  
  // Links
  unsubscribe_link: '#unsubscribe',
  view_online_link: '#view-online',
  
  // Order data
  order_id: '12345XYZ',
  tracking_number: 'TN987654321',
  order_count: 5,
  order_total: 299.99,
  
  // Advanced user data
  'user.name': 'Alice Wonderland',
  'user.email_address': 'alice@wonderland.io',
  
  // Product data
  'product.name': 'Magic Potion',
  'product.price': '$99.99',
  
  // Promotional data
  'coupon.code': 'SUMMER25',
  discount_percent: 25,
  
  // Event data
  'event.title': 'Annual Tech Conference',
  'event.date': 'October 26, 2024',
  'event.location': 'Virtual',
  
  // Boolean flags for conditional logic
  is_premium: true,
  show_discount: true,
  has_order: true,
  is_new_user: false,
  is_vip: true,
  
  // String conditionals
  user_type: 'premium',
  subscription_tier: 'gold',
  your_condition_here: true,
  
  // Arrays for loop testing
  items: [
    { name: 'Product 1', price: 99.99 },
    { name: 'Product 2', price: 149.99 },
    { name: 'Product 3', price: 199.99 }
  ],
  
  // Nested objects
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
      newsletter: true,
      notifications: false
    }
  }
};

// Process HTML using Liquid template engine - works directly with exported HTML
async function processLiquidTemplate(html: string, data: Record<string, any>): Promise<string> {
  try {
    // Merge provided data with our comprehensive fake data
    const mergedData = { ...fakeData, ...data };
    
    // Use LiquidJS to render the template with the merged data
    const processedHtml = await liquid.parseAndRender(html, mergedData);
    return processedHtml;
  } catch (error) {
    console.error('Liquid template processing failed:', error);
    console.log('HTML that failed to process:', html.substring(0, 500) + '...');
    
    // Return original HTML as fallback if Liquid processing fails
    return html;
  }
}

export async function generatePreviewHtml(
  document: EditorDocument, 
  customData?: Record<string, any>
): Promise<string> {
  // 1. Export document as HTML (contains Liquid syntax like {% if %}, {{placeholders}})
  const baseHtml = exportDocumentAsHtml(document);
  
  // 2. Process Liquid templates and placeholders in one step using LiquidJS
  const dataToUse = customData || {};
  const processedHtml = await processLiquidTemplate(baseHtml, dataToUse);
  
  return processedHtml;
}

export async function generatePreviewHtmlWithMockData(
  document: EditorDocument, 
  mockData: Record<string, any>
): Promise<string> {
  // 1. Export document as HTML (contains Liquid syntax)
  const baseHtml = exportDocumentAsHtml(document);
  
  // 2. Process with merged mock data using LiquidJS (handles both {% %} and {{ }} syntax)
  const processedHtml = await processLiquidTemplate(baseHtml, mockData);
  
  return processedHtml;
}

