import React, { useState, useEffect } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUp, Link2 } from 'lucide-react';
import type { ImageSettingsProps } from './types';
import type { ImageBlockData } from '@/lib/types';

const ImageSettings: React.FC<ImageSettingsProps> = ({ block, onUpdate, onImageSelect }) => {
  const [localSrc, setLocalSrc] = useState('');
  const [localAlt, setLocalAlt] = useState('');
  const [localImageAlign, setLocalImageAlign] = useState<'left' | 'center' | 'right'>('center');
  const [localImageLinkHref, setLocalImageLinkHref] = useState('');
  const [localImageElementBorder, setLocalImageElementBorder] = useState('');
  const [localImageElementBorderRadius, setLocalImageElementBorderRadius] = useState('');

  useEffect(() => {
    const imageBlock = block as ImageBlockData;
    setLocalSrc(imageBlock.src || '');
    setLocalAlt(imageBlock.alt || '');
    setLocalImageAlign(imageBlock.align || 'center');
    setLocalImageLinkHref(imageBlock.linkHref || '');
    setLocalImageElementBorder(imageBlock.imageElementStyles?.border || '');
    setLocalImageElementBorderRadius(imageBlock.imageElementStyles?.borderRadius || '');
  }, [block]);

  const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSrc(e.target.value);
    onUpdate({ src: e.target.value });
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAlt(e.target.value);
    onUpdate({ alt: e.target.value });
  };

  const handleAlignChange = (value: 'left' | 'center' | 'right') => {
    setLocalImageAlign(value);
    onUpdate({ align: value });
  };

  const handleLinkHrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalImageLinkHref(e.target.value);
    onUpdate({ linkHref: e.target.value });
  };

  const handleImageElementBorderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalImageElementBorder(e.target.value);
    const currentStyles = (block as ImageBlockData).imageElementStyles || {};
    onUpdate({ 
      imageElementStyles: { 
        ...currentStyles, 
        border: e.target.value 
      } 
    });
  };

  const handleImageElementBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalImageElementBorderRadius(e.target.value);
    const currentStyles = (block as ImageBlockData).imageElementStyles || {};
    onUpdate({ 
      imageElementStyles: { 
        ...currentStyles, 
        borderRadius: e.target.value 
      } 
    });
  };

  const handleSelectImage = () => {
    if (onImageSelect) {
      onImageSelect((imageUrl: string) => {
        setLocalSrc(imageUrl);
        onUpdate({ src: imageUrl });
      });
    }
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <ImageUp className="h-5 w-5" /> Image Block
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="image-src" className="text-xs">Image URL</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="image-src"
              type="url"
              value={localSrc}
              onChange={handleSrcChange}
              placeholder="https://example.com/image.jpg"
              className="text-xs"
            />
            <Button variant="outline" size="sm" onClick={handleSelectImage}>
              Browse
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="image-alt" className="text-xs">Alt Text</Label>
          <Input
            id="image-alt"
            value={localAlt}
            onChange={handleAltChange}
            placeholder="Descriptive text for accessibility"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label className="text-xs">Alignment</Label>
          <Select value={localImageAlign} onValueChange={handleAlignChange}>
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
          <Label htmlFor="image-link" className="text-xs flex items-center gap-1">
            <Link2 className="h-3 w-3" /> Link URL (optional)
          </Label>
          <Input
            id="image-link"
            type="url"
            value={localImageLinkHref}
            onChange={handleLinkHrefChange}
            placeholder="https://example.com"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label htmlFor="image-border" className="text-xs">Border</Label>
          <Input
            id="image-border"
            value={localImageElementBorder}
            onChange={handleImageElementBorderChange}
            placeholder="1px solid #ccc"
            className="text-xs mt-1"
          />
        </div>

        <div>
          <Label htmlFor="image-border-radius" className="text-xs">Border Radius</Label>
          <Input
            id="image-border-radius"
            value={localImageElementBorderRadius}
            onChange={handleImageElementBorderRadiusChange}
            placeholder="4px"
            className="text-xs mt-1"
          />
        </div>
      </CardContent>
    </>
  );
};

export default ImageSettings;
