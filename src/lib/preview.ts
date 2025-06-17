import type { EditorDocument, Placeholder } from './types';
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

// Define a simple set of fake data for placeholders
const fakeData: Record<string, string> = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  company_name: 'Acme Corp',
  unsubscribe_link: '#unsubscribe',
  view_online_link: '#view-online',
  order_id: '12345XYZ',
  tracking_number: 'TN987654321',
  // Add more fake data as needed for your custom placeholders
  'user.name': 'Alice Wonderland',
  'user.email_address': 'alice@wonderland.io',
  'product.name': 'Magic Potion',
  'product.price': '$99.99',
  'coupon.code': 'SUMMER25',
  'event.title': 'Annual Tech Conference',
  'event.date': 'October 26, 2024',
  'event.location': 'Virtual',
  // Conditional logic test fields
  'is_premium': 'true',
  'show_discount': 'true',
  'user_type': 'premium',
  'your_condition_here': 'true',
};

function replacePlaceholdersInHtml(html: string, availablePlaceholders: Placeholder[], data: Record<string, string>): string {
  let processedHtml = html;

  if (!Array.isArray(availablePlaceholders)) {
    console.warn('Available placeholders is not an array. Skipping placeholder replacement.');
    return html;
  }

  availablePlaceholders.forEach(placeholder => {
    if (typeof placeholder.field !== 'string' || typeof placeholder.label !== 'string') {
        console.warn('Invalid placeholder object encountered:', placeholder);
        return; // Skip this placeholder
    }
    const regex = new RegExp(`\\{\\{\\s*${placeholder.field.trim()}\\s*\\}\\}`, 'g');
    const replacementValue = data[placeholder.field.trim()] || `[${placeholder.label}]`; // Fallback to label if no data
    processedHtml = processedHtml.replace(regex, replacementValue);
  });

  return processedHtml;
}

// Process HTML using Liquid template engine for full template support
async function processLiquidTemplate(html: string, data: Record<string, string>): Promise<string> {
  try {
    // Convert string values to proper types for Liquid
    const liquidData: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      // Convert string booleans to actual booleans
      if (value === 'true') {
        liquidData[key] = true;
      } else if (value === 'false') {
        liquidData[key] = false;
      } else if (!isNaN(Number(value)) && value !== '') {
        // Convert numeric strings to numbers
        liquidData[key] = Number(value);
      } else {
        liquidData[key] = value;
      }
    });

    // Use LiquidJS to render the template with the provided data
    const processedHtml = await liquid.parseAndRender(html, liquidData);
    return processedHtml;
  } catch (error) {
    console.warn('Liquid template processing failed, using fallback:', error);
    // Fallback to basic conditional processing if Liquid fails
    return processConditionalLogic(html, data);
  }
}

// Fallback conditional processing (keeping the original logic as backup)
function processConditionalLogic(html: string, data: Record<string, string>): string {
  let processedHtml = html;
  
  // Process {% if condition %} ... {% endif %} blocks
  const conditionalRegex = /\{%\s*if\s+([^%]+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g;
  
  processedHtml = processedHtml.replace(conditionalRegex, (_match, condition, content) => {
    // Evaluate the condition
    const shouldShow = evaluateCondition(condition.trim(), data);
    return shouldShow ? content : '';
  });
  
  return processedHtml;
}

function evaluateCondition(condition: string, data: Record<string, string>): boolean {
  // Handle basic conditional logic for preview
  // Support common patterns like: field_name, !field_name, field_name == 'value', etc.
  
  try {
    // Remove quotes and trim
    condition = condition.replace(/['"]/g, '').trim();
    
    // Handle negation (!field_name)
    if (condition.startsWith('!')) {
      const field = condition.slice(1).trim();
      return !data[field] || data[field] === 'false' || data[field] === '';
    }
    
    // Handle equality checks (field_name == value)
    if (condition.includes('==')) {
      const [field, value] = condition.split('==').map(s => s.trim());
      return data[field] === value;
    }
    
    // Handle inequality checks (field_name != value) 
    if (condition.includes('!=')) {
      const [field, value] = condition.split('!=').map(s => s.trim());
      return data[field] !== value;
    }
    
    // Simple field existence check
    return !!data[condition] && data[condition] !== 'false';
  } catch (error) {
    console.warn('Error evaluating condition:', condition, error);
    return false; // Default to false if condition can't be evaluated
  }
}

export async function generatePreviewHtml(
  document: EditorDocument, 
  availablePlaceholders: Placeholder[], 
  customData?: Record<string, string>
): Promise<string> {
  const baseHtml = exportDocumentAsHtml(document);
  const dataToUse = customData || fakeData;
  
  // Process with Liquid template engine for full template support
  const conditionalProcessedHtml = await processLiquidTemplate(baseHtml, dataToUse);
  const previewHtml = replacePlaceholdersInHtml(conditionalProcessedHtml, availablePlaceholders, dataToUse);
  return previewHtml;
}

export async function generatePreviewHtmlWithMockData(
  document: EditorDocument, 
  availablePlaceholders: Placeholder[], 
  mockData: Record<string, string>
): Promise<string> {
  // Merge mock data with fake data as fallback
  const mergedData = { ...fakeData, ...mockData };
  const baseHtml = exportDocumentAsHtml(document);
  
  // Process with Liquid template engine for full template support
  const conditionalProcessedHtml = await processLiquidTemplate(baseHtml, mergedData);
  const previewHtml = replacePlaceholdersInHtml(conditionalProcessedHtml, availablePlaceholders, mergedData);
  return previewHtml;
}

