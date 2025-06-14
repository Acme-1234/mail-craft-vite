import React, { useState, useEffect } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MousePointerSquareDashed, ImagePlus } from 'lucide-react';
import type { ButtonSettingsProps } from './types';
import type { ButtonBlockData } from '@/lib/types';
import { fontWeights, alignmentOptions } from './constants';

const ButtonSettings: React.FC<ButtonSettingsProps> = ({ block, onUpdate, onImageSelect }) => {
  const [localButtonText, setLocalButtonText] = useState('');
  const [localButtonHref, setLocalButtonHref] = useState('');
  const [localButtonContainerAlign, setLocalButtonContainerAlign] = useState<'left' | 'center' | 'right'>('center');
  const [localButtonBackgroundColor, setLocalButtonBackgroundColor] = useState('');
  const [localButtonTextColor, setLocalButtonTextColor] = useState('');
  const [localButtonPadding, setLocalButtonPadding] = useState('');
  const [localButtonBorderRadius, setLocalButtonBorderRadius] = useState('');
  const [localButtonFontWeight, setLocalButtonFontWeight] = useState('');
  const [localButtonFontSize, setLocalButtonFontSize] = useState('');
  const [localButtonBorder, setLocalButtonBorder] = useState('');
  const [localButtonImageUrl, setLocalButtonImageUrl] = useState('');
  const [localButtonImagePosition, setLocalButtonImagePosition] = useState<'none' | 'left' | 'right'>('none');

  useEffect(() => {
    const buttonBlock = block as ButtonBlockData;
    setLocalButtonText(buttonBlock.text || '');
    setLocalButtonHref(buttonBlock.href || '');
    setLocalButtonContainerAlign(buttonBlock.align || 'center');
    setLocalButtonBackgroundColor(buttonBlock.buttonStyles?.backgroundColor || '');
    setLocalButtonTextColor(buttonBlock.buttonStyles?.color || '');
    setLocalButtonPadding(buttonBlock.buttonStyles?.padding || '');
    setLocalButtonBorderRadius(buttonBlock.buttonStyles?.borderRadius || '');
    setLocalButtonFontWeight(buttonBlock.buttonStyles?.fontWeight || '');
    setLocalButtonFontSize(buttonBlock.buttonStyles?.fontSize || '');
    setLocalButtonBorder(buttonBlock.buttonStyles?.border || '');
    setLocalButtonImageUrl(buttonBlock.imageUrl || '');
    setLocalButtonImagePosition(buttonBlock.imagePosition || 'none');
  }, [block]);

  const handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonText(e.target.value);
    onUpdate({ text: e.target.value });
  };

  const handleButtonHrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonHref(e.target.value);
    onUpdate({ href: e.target.value });
  };

  const handleButtonContainerAlignChange = (value: 'left' | 'center' | 'right') => {
    setLocalButtonContainerAlign(value);
    onUpdate({ align: value });
  };

  const handleButtonStyleChange = (property: string, value: string) => {
    const currentStyles = (block as ButtonBlockData).buttonStyles || {};
    onUpdate({ 
      buttonStyles: { 
        ...currentStyles, 
        [property]: value 
      } 
    });
  };

  const handleButtonImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonImageUrl(e.target.value);
    onUpdate({ imageUrl: e.target.value });
  };

  const handleButtonImagePositionChange = (value: 'none' | 'left' | 'right') => {
    setLocalButtonImagePosition(value);
    onUpdate({ imagePosition: value });
  };

  const handleSelectButtonImage = () => {
    if (onImageSelect) {
      onImageSelect((imageUrl: string) => {
        setLocalButtonImageUrl(imageUrl);
        onUpdate({ imageUrl });
      });
    }
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <MousePointerSquareDashed className="h-5 w-5" /> Button Block
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="button-text" className="text-xs">Button Text</Label>
          <Input
            id="button-text"
            value={localButtonText}
            onChange={handleButtonTextChange}
            placeholder="Click Me"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label htmlFor="button-href" className="text-xs">Link URL</Label>
          <Input
            id="button-href"
            type="url"
            value={localButtonHref}
            onChange={handleButtonHrefChange}
            placeholder="https://example.com"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label className="text-xs">Button Alignment</Label>
          <Select value={localButtonContainerAlign} onValueChange={handleButtonContainerAlignChange}>
            <SelectTrigger className="text-xs mt-1">
              <SelectValue />
            </SelectTrigger>            <SelectContent>
              {alignmentOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="button-bg-color" className="text-xs">Background Color</Label>
          <Input
            id="button-bg-color"
            value={localButtonBackgroundColor}
            onChange={(e) => {
              setLocalButtonBackgroundColor(e.target.value);
              handleButtonStyleChange('backgroundColor', e.target.value);
            }}
            placeholder="#64B5F6"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label htmlFor="button-text-color" className="text-xs">Text Color</Label>
          <Input
            id="button-text-color"
            value={localButtonTextColor}
            onChange={(e) => {
              setLocalButtonTextColor(e.target.value);
              handleButtonStyleChange('color', e.target.value);
            }}
            placeholder="#FFFFFF"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label htmlFor="button-padding" className="text-xs">Padding</Label>
          <Input
            id="button-padding"
            value={localButtonPadding}
            onChange={(e) => {
              setLocalButtonPadding(e.target.value);
              handleButtonStyleChange('padding', e.target.value);
            }}
            placeholder="10px 25px"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label htmlFor="button-border-radius" className="text-xs">Border Radius</Label>
          <Input
            id="button-border-radius"
            value={localButtonBorderRadius}
            onChange={(e) => {
              setLocalButtonBorderRadius(e.target.value);
              handleButtonStyleChange('borderRadius', e.target.value);
            }}
            placeholder="5px"
            className="text-xs mt-1"
          />
        </div>        <div>
          <Label htmlFor="button-border" className="text-xs">Border</Label>
          <Input
            id="button-border"
            value={localButtonBorder}
            onChange={(e) => {
              setLocalButtonBorder(e.target.value);
              handleButtonStyleChange('border', e.target.value);
            }}
            placeholder="1px solid #ccc"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label htmlFor="button-font-size" className="text-xs">Font Size</Label>
          <Input
            id="button-font-size"
            value={localButtonFontSize}
            onChange={(e) => {
              setLocalButtonFontSize(e.target.value);
              handleButtonStyleChange('fontSize', e.target.value);
            }}
            placeholder="16px"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label className="text-xs">Font Weight</Label>
          <Select value={localButtonFontWeight} onValueChange={(value) => {
            setLocalButtonFontWeight(value);
            handleButtonStyleChange('fontWeight', value);
          }}>
            <SelectTrigger className="text-xs mt-1">
              <SelectValue />
            </SelectTrigger>            <SelectContent>
              {fontWeights.map(fw => (
                <SelectItem key={fw.value} value={fw.value}>{fw.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="button-image" className="text-xs flex items-center gap-1">
            <ImagePlus className="h-3 w-3" /> Button Image (optional)
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="button-image"
              value={localButtonImageUrl}
              onChange={handleButtonImageChange}
              placeholder="https://example.com/icon.png"
              className="text-xs"
            />
            <Button variant="outline" size="sm" onClick={handleSelectButtonImage}>
              Browse
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs">Image Position</Label>
          <Select value={localButtonImagePosition} onValueChange={handleButtonImagePositionChange}>
            <SelectTrigger className="text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Image</SelectItem>
              <SelectItem value="left">Left of Text</SelectItem>
              <SelectItem value="right">Right of Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </>
  );
};

export default ButtonSettings;
