import React from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Type as TypeIcon } from 'lucide-react';
import type { TextSettingsProps } from './types';

const TextSettings: React.FC<TextSettingsProps> = ({ block: _block, onUpdate: _onUpdate }) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <TypeIcon className="h-5 w-5" /> Text Block
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Click on the text in the canvas to edit content directly. Use the rich text editor for formatting.
        </p>
        <div className="p-2 bg-muted/30 rounded text-xs">
          <strong>Tip:</strong> You can add placeholders like {`{{user.name}}`} for dynamic content.
        </div>
      </CardContent>
    </>
  );
};

export default TextSettings;
