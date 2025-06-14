

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { EditorDocument, Placeholder } from '@/lib/types';
import { generatePreviewHtml } from '@/lib/preview';
import { X } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: EditorDocument | null;
  placeholders: Placeholder[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, document, placeholders }) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');

  useEffect(() => {
    if (isOpen && document) {
      const html = generatePreviewHtml(document, placeholders);
      setPreviewHtml(html);
    }
  }, [isOpen, document, placeholders]);

  if (!document) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b flex flex-row justify-between items-center">
          <DialogTitle>Email Preview</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex-grow overflow-hidden p-0">
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              title="Email Preview"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="p-6 text-center text-muted-foreground">Loading preview...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;

    
