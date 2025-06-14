

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (linkData: { url: string; text: string }) => void;
  initialUrl?: string;
  initialText?: string;
}

// This component is no longer used by TextBlockComponent as TinyMCE has its own link dialog.
// It's kept here in case it's needed for other purposes or if TinyMCE is removed later.
// For now, it's effectively dead code in the context of TextBlockComponent.

const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = '',
  initialText = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
    }
  }, [isOpen, initialUrl, initialText]);

  const handleSubmit = () => {
    if (url && text) {
      onSubmit({ url, text });
      onClose();
    } else if (url && !text) {
        onSubmit({ url, text: url });
        onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert/Edit Link</DialogTitle>
          <DialogDescription>
            Enter the URL and the text to display for your link.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link-url" className="text-right">
              URL
            </Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link-text" className="text-right">
              Text
            </Label>
            <Input
              id="link-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="col-span-3"
              placeholder="Link display text"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Save Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
