import React, { useState, useEffect } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorPicker from '@/components/ui/color-picker';
import SizeInput from '@/components/ui/size-input';
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
      <CardContent className="space-y-3">        <SizeInput
          label="Content Width"
          value={localContentWidth}
          onChange={(value) => {
            setLocalContentWidth(value);
            handleDocumentSettingChange('contentWidth', value);
          }}
          placeholder="600px"
          type="single"
          max={1200}
          min={200}
          units={['px', '%', 'em', 'rem']}
          presets={[
            { label: 'Mobile', value: '320px' },
            { label: 'Tablet', value: '480px' },
            { label: 'Standard', value: '600px' },
            { label: 'Wide', value: '800px' },
            { label: 'Full', value: '100%' }
          ]}        />
        <p className="text-xs text-muted-foreground mt-1">
          Maximum width for the email content (e.g., 600px, 100%)
        </p>

        <ColorPicker
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
