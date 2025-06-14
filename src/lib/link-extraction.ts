
import type { EditorDocument, TextBlockData, ButtonBlockData } from './types';

export function extractLinksFromDocument(document: EditorDocument): string[] {
  const links: Set<string> = new Set();

  document.rows.forEach(row => {
    row.columns.forEach(column => {
      column.blocks.forEach(block => {
        if (block.type === 'text') {
          const textBlock = block as TextBlockData;
          // Use DOMParser to find links in HTML content
          const parser = new DOMParser();
          const doc = parser.parseFromString(textBlock.content, 'text/html');
          doc.querySelectorAll('a[href]').forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href) {
              links.add(href);
            }
          });
        } else if (block.type === 'button') {
          const buttonBlock = block as ButtonBlockData;
          if (buttonBlock.href) {
            links.add(buttonBlock.href);
          }
        }
        // Image blocks could also have links if functionality is extended
      });
    });
  });

  return Array.from(links);
}
