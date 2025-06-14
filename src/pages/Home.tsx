


import { useRef } from 'react';
import EmailEditor from '@/components/editor/EmailEditor';
import type { EmailEditorRef, Placeholder } from '@/lib/types';
import { DEFAULT_PLACEHOLDERS } from '@/config/editorConfig'; // Using default for demo

export default function Home() {
  const editorRef = useRef<EmailEditorRef>(null);

  // Example onImageSelect callback for DAM integration
  const handleImageSelect = (callback: (imageUrl: string) => void) => {
    // In a real app, this would open a DAM browser/modal
    // For demo, we'll use a prompt or a fixed URL
    const imageUrl = prompt('Enter image URL:', 'https://placehold.co/600x400.png/007BFF/FFFFFF?text=Selected+Image');
    if (imageUrl) {
      callback(imageUrl);
    }
  };

  const customPlaceholders: Placeholder[] = [
    ...DEFAULT_PLACEHOLDERS,
    { label: "Order ID", field: "order_id" },
    { label: "Tracking Number", field: "tracking_number" },
  ];

  return (
    <main className="h-screen w-screen overflow-hidden">
      <EmailEditor
        ref={editorRef}
        placeholders={customPlaceholders}
        onImageSelect={handleImageSelect}
      />
    </main>
  );
}
