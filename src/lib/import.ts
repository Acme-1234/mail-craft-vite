
import type { EditorDocument, TextBlockData } from './types';

// Basic JSON import, assuming structure matches EditorDocument
export function importJsonToDocument(jsonData: any): EditorDocument {
  // Add validation and type checking here in a real application
  // For now, assume jsonData is a valid EditorDocument
  if (jsonData && Array.isArray(jsonData.rows)) {
    return jsonData as EditorDocument;
  }
  // Return an empty document if JSON is invalid
  return { rows: [] };
}

// Basic HTML import - This is highly complex to do robustly.
// This will be a very simplified version that might not work for all HTML.
// It's better to use a dedicated HTML parsing library and map to your structure.
export function importHtmlToDocument(htmlString: string): EditorDocument {
  console.warn("HTML import is a simplified stub and may not work reliably for complex HTML.");
  
  // Placeholder: In a real app, you'd parse htmlString into your EditorDocument structure.
  // This is a non-trivial task. For now, we'll return a document with one text block
  // containing a message about this limitation.
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  // Attempt to find a main content area (very naive)
  const bodyContent = doc.body.innerHTML; // Or a more specific selector

  const newDocument: EditorDocument = {
    rows: [
      {
        id: `imported-row-${Math.random().toString(36).substr(2, 9)}`,
        columns: [
          {
            id: `imported-col-${Math.random().toString(36).substr(2, 9)}`,
            span: 12,
            blocks: [
              {
                id: `imported-text-block-${Math.random().toString(36).substr(2, 9)}`,
                type: 'text',
                content: `HTML import is complex. This is a placeholder. Content found: <br /> <pre>${escapeHtml(bodyContent.substring(0, 500))}...</pre>`,
              } as TextBlockData,
            ],
          },
        ],
      },
    ],
  };

  return newDocument;
}

function escapeHtml(unsafe: string): string {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}
