import React, { useState, useEffect } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaletteIcon, Ruler, BoxSelect } from 'lucide-react';
import type { ContainerStylesProps } from './types';

const googleFontsList = [
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
  { label: 'Open Sans', value: "'Open Sans', sans-serif" },
  { label: 'PT Sans', value: "'PT Sans', sans-serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Source Sans Pro', value: "'Source Sans Pro', sans-serif" },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Ubuntu', value: "'Ubuntu', sans-serif" },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

const fontWeights = [
  { label: 'Normal', value: 'normal' },
  { label: 'Bold', value: 'bold' },
  { label: '100', value: '100' },
  { label: '200', value: '200' },
  { label: '300', value: '300' },
  { label: '400', value: '400' },
  { label: '500', value: '500' },
  { label: '600', value: '600' },
  { label: '700', value: '700' },
  { label: '800', value: '800' },
  { label: '900', value: '900' },
];

const ContainerStyles: React.FC<ContainerStylesProps> = ({ block, onUpdate }) => {
  const [localPadding, setLocalPadding] = useState('');
  const [localMargin, setLocalMargin] = useState('');
  const [localBackgroundColor, setLocalBackgroundColor] = useState('');
  const [localTextAlign, setLocalTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [localFontFamily, setLocalFontFamily] = useState('');
  const [localFontSize, setLocalFontSize] = useState('');
  const [localFontWeight, setLocalFontWeight] = useState('');
  const [localTextColor, setLocalTextColor] = useState('');
  const [localLineHeight, setLocalLineHeight] = useState('');

  useEffect(() => {
    setLocalPadding(block.styles?.padding || '');
    setLocalMargin(block.styles?.margin || '');
    setLocalBackgroundColor(block.styles?.backgroundColor || '');
    setLocalTextAlign(block.styles?.textAlign || 'left');
    setLocalFontFamily(block.styles?.fontFamily || '');
    setLocalFontSize(block.styles?.fontSize || '');
    setLocalFontWeight(block.styles?.fontWeight || '');
    setLocalTextColor(block.styles?.color || '');
    setLocalLineHeight(block.styles?.lineHeight || '');
  }, [block]);

  const handleStyleChange = (property: string, value: string) => {
    onUpdate({ 
      styles: { 
        ...block.styles, 
        [property]: value 
      } 
    });
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <BoxSelect className="h-5 w-5" /> Container Styles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="padding" className="text-xs flex items-center gap-1">
              <Ruler className="h-3 w-3" /> Padding
            </Label>
            <Input
              id="padding"
              value={localPadding}
              onChange={(e) => {
                setLocalPadding(e.target.value);
                handleStyleChange('padding', e.target.value);
              }}
              placeholder="10px"
              className="text-xs mt-1"
            />
          </div>
          <div>
            <Label htmlFor="margin" className="text-xs flex items-center gap-1">
              <Ruler className="h-3 w-3" /> Margin
            </Label>
            <Input
              id="margin"
              value={localMargin}
              onChange={(e) => {
                setLocalMargin(e.target.value);
                handleStyleChange('margin', e.target.value);
              }}
              placeholder="10px"
              className="text-xs mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="background-color" className="text-xs flex items-center gap-1">
            <PaletteIcon className="h-3 w-3" /> Background Color
          </Label>
          <Input
            id="background-color"
            value={localBackgroundColor}
            onChange={(e) => {
              setLocalBackgroundColor(e.target.value);
              handleStyleChange('backgroundColor', e.target.value);
            }}
            placeholder="#FFFFFF"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label className="text-xs">Text Alignment</Label>
          <Select 
            value={localTextAlign} 
            onValueChange={(value: 'left' | 'center' | 'right') => {
              setLocalTextAlign(value);
              handleStyleChange('textAlign', value);
            }}
          >
            <SelectTrigger className="text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Font Family</Label>
          <Select 
            value={localFontFamily} 
            onValueChange={(value) => {
              setLocalFontFamily(value);
              handleStyleChange('fontFamily', value);
            }}
          >
            <SelectTrigger className="text-xs mt-1">
              <SelectValue placeholder="Select font..." />
            </SelectTrigger>
            <SelectContent>
              {googleFontsList.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="font-size" className="text-xs">Font Size</Label>
            <Input
              id="font-size"
              value={localFontSize}
              onChange={(e) => {
                setLocalFontSize(e.target.value);
                handleStyleChange('fontSize', e.target.value);
              }}
              placeholder="16px"
              className="text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Font Weight</Label>
            <Select 
              value={localFontWeight} 
              onValueChange={(value) => {
                setLocalFontWeight(value);
                handleStyleChange('fontWeight', value);
              }}
            >
              <SelectTrigger className="text-xs mt-1">
                <SelectValue placeholder="Weight..." />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="text-color" className="text-xs">Text Color</Label>
            <Input
              id="text-color"
              value={localTextColor}
              onChange={(e) => {
                setLocalTextColor(e.target.value);
                handleStyleChange('color', e.target.value);
              }}
              placeholder="#000000"
              className="text-xs mt-1"
            />
          </div>
          <div>
            <Label htmlFor="line-height" className="text-xs">Line Height</Label>
            <Input
              id="line-height"
              value={localLineHeight}
              onChange={(e) => {
                setLocalLineHeight(e.target.value);
                handleStyleChange('lineHeight', e.target.value);
              }}
              placeholder="1.5"
              className="text-xs mt-1"
            />
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ContainerStyles;
