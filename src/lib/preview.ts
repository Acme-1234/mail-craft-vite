
import type { EditorDocument, Placeholder } from './types';
import { exportDocumentAsHtml } from './export';

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

export function generatePreviewHtml(document: EditorDocument, availablePlaceholders: Placeholder[]): string {
  const baseHtml = exportDocumentAsHtml(document);
  const previewHtml = replacePlaceholdersInHtml(baseHtml, availablePlaceholders, fakeData);
  return previewHtml;
}

    