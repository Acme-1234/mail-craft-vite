import React, { useState, useEffect } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorPicker from '@/components/ui/color-picker';
import { FileCog } from 'lucide-react';
import type { DocumentSettingsProps } from './types';
import { googleFontsList } from './constants';

const DocumentSettings: React.FC<DocumentSettingsProps> = ({ settings, onUpdate }) => {
  const [localContentWidth, setLocalContentWidth] = useState('');
  const [localBackgroundColor, setLocalBackgroundColor] = useState('');
  const [localFontFamily, setLocalFontFamily] = useState('');

  useEffect(() => {
    setLocalContentWidth(settings?.contentWidth || '600px');
    setLocalBackgroundColor(settings?.backgroundColor || '#F0F4F8');
    setLocalFontFamily(settings?.fontFamily || "'PT Sans', sans-serif");
  }, [settings]);

  const handleDocumentSettingChange = (property: string, value: string) => {
    onUpdate({
      ...settings,
      [property]: value
    });
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <FileCog className="h-5 w-5" /> Document Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="content-width" className="text-xs">Content Width</Label>
          <Input
            id="content-width"
            value={localContentWidth}
            onChange={(e) => {
              setLocalContentWidth(e.target.value);
              handleDocumentSettingChange('contentWidth', e.target.value);
            }}
            placeholder="600px"
            className="text-xs mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Maximum width for the email content (e.g., 600px, 100%)
          </p>
        </div>        <ColorPicker
          label="Background Color"
          value={localBackgroundColor}
          onChange={(value) => {
            setLocalBackgroundColor(value);
            handleDocumentSettingChange('backgroundColor', value);
          }}
          placeholder="#F0F4F8"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Background color for the entire email
        </p>

        <div>
          <Label className="text-xs">Default Font Family</Label>
          <Select 
            value={localFontFamily} 
            onValueChange={(value) => {
              setLocalFontFamily(value);
              handleDocumentSettingChange('fontFamily', value);
            }}
          >
            <SelectTrigger className="text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {googleFontsList.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Default font family for the entire email
          </p>
        </div>
      </CardContent>
    </>
  );
};

export default DocumentSettings;
