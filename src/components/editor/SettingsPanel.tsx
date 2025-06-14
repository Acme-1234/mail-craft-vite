

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';
import type { EditorBlockData, ImageBlockData, ButtonBlockData, BlockStyles, ButtonSpecificStyles, ConditionalLayoutBlockData, ImageElementStyles } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area-simple';
import { ImageUp, Link2, Type as TypeIconBlock, LayoutGrid, MousePointerSquareDashed, AlignCenter, PaletteIcon as PaletteBlockIcon, ImagePlus, FileCog, Ruler, Type as FontIcon, TerminalSquare, MinusSquare, Maximize2, AlignHorizontalJustifyCenter, Bold, BoxSelect } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const SettingsPanel: React.FC = () => {
  const { 
    selectedBlockId, 
    getBlockById,    updateBlock, 
    onImageSelect: globalOnImageSelect,
    document: editorDocument,
    updateDocumentSettings
  } = useEditorStore();
  
  const [selectedBlock, setSelectedBlock] = useState<EditorBlockData | null>(null);

  // Common block settings
  const [localSrc, setLocalSrc] = useState('');
  const [localAlt, setLocalAlt] = useState('');
  const [localImageAlign, setLocalImageAlign] = useState<'left' | 'center' | 'right'>('center');
  const [localImageLinkHref, setLocalImageLinkHref] = useState('');
  const [localImageElementBorder, setLocalImageElementBorder] = useState('');
  const [localImageElementBorderRadius, setLocalImageElementBorderRadius] = useState('');
  
  // Button specific settings
  const [localButtonText, setLocalButtonText] = useState('');
  const [localButtonHref, setLocalButtonHref] = useState('');
  const [localButtonContainerAlign, setLocalButtonContainerAlign] = useState<'left' | 'center' | 'right'>('center');
  const [localButtonTextColor, setLocalButtonTextColor] = useState('');
  const [localButtonBgColor, setLocalButtonBgColor] = useState('');
  const [localButtonBorderRadius, setLocalButtonBorderRadius] = useState(''); // Button element's border radius
  const [localButtonPadding, setLocalButtonPadding] = useState('');
  const [localButtonImageUrl, setLocalButtonImageUrl] = useState('');
  const [localButtonImagePosition, setLocalButtonImagePosition] = useState<'left' | 'right' | 'none'>('none');
  const [localButtonFontWeight, setLocalButtonFontWeight] = useState('');
  const [localButtonFontSize, setLocalButtonFontSize] = useState('');
  const [localButtonBorder, setLocalButtonBorder] = useState('');


  // Conditional Layout specific settings
  const [localConditionalCondition, setLocalConditionalCondition] = useState('');


  // Local state for style settings (container)
  const [localPadding, setLocalPadding] = useState('');
  const [localMargin, setLocalMargin] = useState('');
  const [localBackgroundColor, setLocalBackgroundColor] = useState('');
  const [localContainerBorder, setLocalContainerBorder] = useState('');
  const [localContainerBorderRadius, setLocalContainerBorderRadius] = useState('');


  // Local state for document settings
  const [localContentWidth, setLocalContentWidth] = useState(editorDocument.settings?.contentWidth || '600px');
  const [localDocBackgroundColor, setLocalDocBackgroundColor] = useState(editorDocument.settings?.backgroundColor || '#F0F4F8');
  const [localFontFamily, setLocalFontFamily] = useState(editorDocument.settings?.fontFamily || "'PT Sans', sans-serif");

  useEffect(() => {
    setLocalContentWidth(editorDocument.settings?.contentWidth || '600px');
    setLocalDocBackgroundColor(editorDocument.settings?.backgroundColor || '#F0F4F8');
    setLocalFontFamily(editorDocument.settings?.fontFamily || "'PT Sans', sans-serif");
  }, [editorDocument.settings]);

  useEffect(() => {
    if (selectedBlockId) {
      const block = getBlockById(selectedBlockId);
      setSelectedBlock(block || null);
      if (block) {
        // Common container styles
        setLocalPadding(block.styles?.padding || '');
        setLocalMargin(block.styles?.margin || '');
        setLocalBackgroundColor(block.styles?.backgroundColor || (block.type === 'conditionalLayout' ? 'transparent' : '#FFFFFF'));
        setLocalContainerBorder(block.styles?.border || '');
        setLocalContainerBorderRadius(block.styles?.borderRadius || '');

        if (block.type === 'image') {
          const imageBlock = block as ImageBlockData;
          setLocalSrc(imageBlock.src);
          setLocalAlt(imageBlock.alt);
          setLocalImageAlign(imageBlock.align || 'center');
          setLocalImageLinkHref(imageBlock.linkHref || '');
          setLocalImageElementBorder(imageBlock.imageElementStyles?.border || '');
          setLocalImageElementBorderRadius(imageBlock.imageElementStyles?.borderRadius || '');
        } else if (block.type === 'button') {
          const buttonBlock = block as ButtonBlockData;
          setLocalButtonText(buttonBlock.text);
          setLocalButtonHref(buttonBlock.href);
          setLocalButtonContainerAlign(buttonBlock.align || 'center');
          setLocalButtonTextColor(buttonBlock.buttonStyles?.color || '#FFFFFF');
          setLocalButtonBgColor(buttonBlock.buttonStyles?.backgroundColor || '#64B5F6');
          setLocalButtonBorderRadius(buttonBlock.buttonStyles?.borderRadius || '');
          setLocalButtonPadding(buttonBlock.buttonStyles?.padding || '');
          setLocalButtonImageUrl(buttonBlock.imageUrl || '');
          setLocalButtonImagePosition(buttonBlock.imagePosition || 'none');
          setLocalButtonFontWeight(buttonBlock.buttonStyles?.fontWeight || 'bold');
          setLocalButtonFontSize(buttonBlock.buttonStyles?.fontSize || '16px');
          setLocalButtonBorder(buttonBlock.buttonStyles?.border || '');
        } else if (block.type === 'conditionalLayout') {
          const conditionalBlock = block as ConditionalLayoutBlockData;
          setLocalConditionalCondition(conditionalBlock.condition);
        }
      }
    } else {
      setSelectedBlock(null);
      // Reset all local states for blocks
      setLocalSrc(''); setLocalAlt(''); setLocalImageAlign('center'); setLocalImageLinkHref('');
      setLocalImageElementBorder(''); setLocalImageElementBorderRadius('');
      setLocalButtonText(''); setLocalButtonHref(''); setLocalButtonContainerAlign('center');
      setLocalButtonTextColor('#FFFFFF'); setLocalButtonBgColor('#64B5F6'); setLocalButtonBorderRadius('');
      setLocalButtonPadding(''); setLocalButtonImageUrl(''); setLocalButtonImagePosition('none');
      setLocalButtonFontWeight('bold'); setLocalButtonFontSize('16px'); setLocalButtonBorder('');
      setLocalConditionalCondition('');
      setLocalPadding(''); setLocalMargin(''); setLocalBackgroundColor('#FFFFFF');
      setLocalContainerBorder(''); setLocalContainerBorderRadius('');
    }
  }, [selectedBlockId, getBlockById]);

  const handleUpdateBlock = (updates: Partial<EditorBlockData> | { styles?: Partial<BlockStyles>, buttonStyles?: Partial<ButtonSpecificStyles>, imageElementStyles?: Partial<ImageElementStyles> }) => {
    if (selectedBlockId) {
      updateBlock(selectedBlockId, updates);
    }
  };

  // Image Block Handlers
  const handleImageSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSrc(e.target.value);
    handleUpdateBlock({ src: e.target.value } as Partial<ImageBlockData>);
  };
  const handleImageAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAlt(e.target.value);
    handleUpdateBlock({ alt: e.target.value } as Partial<ImageBlockData>);
  };
  const handleImageAlignChange = (value: 'left' | 'center' | 'right') => {
    setLocalImageAlign(value);
    handleUpdateBlock({ align: value } as Partial<ImageBlockData>);
  };
  const handleImageLinkHrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalImageLinkHref(e.target.value);
    handleUpdateBlock({ linkHref: e.target.value } as Partial<ImageBlockData>);
  };
   const handleImageElementBorderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalImageElementBorder(e.target.value);
    handleUpdateBlock({ imageElementStyles: { border: e.target.value } });
  };
  const handleImageElementBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalImageElementBorderRadius(e.target.value);
    handleUpdateBlock({ imageElementStyles: { borderRadius: e.target.value } });
  };


  const handleSelectImageFromDAM = (target: 'blockImage' | 'buttonImage') => {
    if (globalOnImageSelect && selectedBlockId) {
      globalOnImageSelect((imageUrl) => {
        if (target === 'blockImage' && selectedBlock?.type === 'image') {
          setLocalSrc(imageUrl);
          handleUpdateBlock({ src: imageUrl } as Partial<ImageBlockData>);
        } else if (target === 'buttonImage' && selectedBlock?.type === 'button') {
          setLocalButtonImageUrl(imageUrl);
          handleUpdateBlock({ imageUrl } as Partial<ButtonBlockData>);
        }
      });
    } else {
      alert('Image selection callback not configured or no block selected.');
    }
  };

  // Button Block Handlers
  const handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonText(e.target.value);
    handleUpdateBlock({ text: e.target.value } as Partial<ButtonBlockData>);
  };
  const handleButtonHrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonHref(e.target.value);
    handleUpdateBlock({ href: e.target.value } as Partial<ButtonBlockData>);
  };
  const handleButtonContainerAlignChange = (value: 'left' | 'center' | 'right') => {
    setLocalButtonContainerAlign(value);
    handleUpdateBlock({ align: value } as Partial<ButtonBlockData>); // This 'align' is for the container of the button
  };
  const handleButtonTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonTextColor(e.target.value);
    handleUpdateBlock({ buttonStyles: { color: e.target.value } });
  };
  const handleButtonBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonBgColor(e.target.value);
    handleUpdateBlock({ buttonStyles: { backgroundColor: e.target.value } });
  };
  const handleButtonBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonBorderRadius(e.target.value);
    handleUpdateBlock({ buttonStyles: { borderRadius: e.target.value } });
  };
  const handleButtonPaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonPadding(e.target.value);
    handleUpdateBlock({ buttonStyles: { padding: e.target.value } });
  };
  const handleButtonImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonImageUrl(e.target.value);
    handleUpdateBlock({ imageUrl: e.target.value } as Partial<ButtonBlockData>);
  };
  const handleButtonImagePositionChange = (value: 'left' | 'right' | 'none') => {
    setLocalButtonImagePosition(value);
    handleUpdateBlock({ imagePosition: value } as Partial<ButtonBlockData>);
  };
   const handleButtonFontWeightChange = (value: string) => {
    setLocalButtonFontWeight(value);
    handleUpdateBlock({ buttonStyles: { fontWeight: value } });
  };
  const handleButtonFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonFontSize(e.target.value);
    handleUpdateBlock({ buttonStyles: { fontSize: e.target.value } });
  };
  const handleButtonBorderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalButtonBorder(e.target.value);
    handleUpdateBlock({ buttonStyles: { border: e.target.value } });
  };  // Conditional Layout Handler
  const handleConditionalConditionChange = (value: string) => {
    setLocalConditionalCondition(value);
    handleUpdateBlock({ condition: value } as Partial<ConditionalLayoutBlockData>);
  };


  // Container Style Handlers
  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPadding(e.target.value);
    handleUpdateBlock({ styles: { padding: e.target.value } });
  };
  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMargin(e.target.value);
    handleUpdateBlock({ styles: { margin: e.target.value } });
  };
  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalBackgroundColor(e.target.value);
    handleUpdateBlock({ styles: { backgroundColor: e.target.value } });
  };
  const handleContainerBorderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContainerBorder(e.target.value);
    handleUpdateBlock({ styles: { border: e.target.value } });
  };
  const handleContainerBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContainerBorderRadius(e.target.value);
    handleUpdateBlock({ styles: { borderRadius: e.target.value } });
  };


  // Document Settings Handlers
  const handleContentWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setLocalContentWidth(newWidth);
    updateDocumentSettings({ contentWidth: newWidth });
  };

  const handleDocBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLocalDocBackgroundColor(newColor);
    updateDocumentSettings({ backgroundColor: newColor });
  };

  const handleFontFamilyChange = (value: string) => {
    setLocalFontFamily(value);
    updateDocumentSettings({ fontFamily: value });
  };


  if (!selectedBlockId) {
    return (
      <aside className="w-80 border-l border-border bg-card flex flex-col">
        <ScrollArea className="flex-1 p-0">
          <Card className="shadow-none border-none rounded-none h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-headline"><FileCog className="h-5 w-5"/> Document Settings</CardTitle>
              <CardDescription>Global settings for the email document.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="doc-content-width" className="text-xs flex items-center gap-1"><Ruler className="h-3 w-3"/> Content Width</Label>
                <Input 
                  id="doc-content-width" 
                  type="text" 
                  value={localContentWidth} 
                  onChange={handleContentWidthChange} 
                  placeholder="e.g., 600px" 
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label htmlFor="doc-bg-color" className="text-xs flex items-center gap-1"><PaletteBlockIcon className="h-3 w-3"/> Background Color</Label>
                <Input 
                  id="doc-bg-color" 
                  type="color" 
                  value={localDocBackgroundColor} 
                  onChange={handleDocBackgroundColorChange} 
                  className="h-8 text-xs mt-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="doc-font-family" className="text-xs flex items-center gap-1"><FontIcon className="h-3 w-3"/> Font Family</Label>
                <Select value={localFontFamily} onValueChange={handleFontFamilyChange}>
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {googleFontsList.map(font => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </aside>
    );
  }

  if (!selectedBlock) { 
    return (
        <aside className="w-80 border-l border-border bg-card flex flex-col">
            <ScrollArea className="flex-1 p-0">
                <Card className="shadow-none border-none rounded-none h-full">
                    <CardHeader>
                        <CardTitle>No block selected</CardTitle>
                        <CardDescription>Select a block on the canvas to see its settings.</CardDescription>
                    </CardHeader>
                </Card>
            </ScrollArea>
        </aside>
    );
  }

  const renderSpecificSettings = () => {
    if (!selectedBlock) return null; 
    switch (selectedBlock.type) {
      case 'text':
        return (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-headline"><TypeIconBlock className="h-5 w-5"/> Text Block</CardTitle>
              <CardDescription>Use inline editor for formatting.</CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-xs text-muted-foreground">Text formatting is done via the toolbar that appears when the block is selected on the canvas.</p>
            </CardContent>
          </>
        );
      case 'image':
        return (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-headline"><ImageUp className="h-5 w-5"/> Image Block</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="image-src" className="text-xs">Image URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <Input id="image-src" type="text" value={localSrc} onChange={handleImageSrcChange} placeholder="https://..." className="h-8 text-xs"/>
                </div>
              </div>
              <div>
                <Label htmlFor="image-alt" className="text-xs">Alt Text</Label>
                 <Input id="image-alt" type="text" value={localAlt} onChange={handleImageAltChange} placeholder="Descriptive alt text" className="h-8 text-xs mt-1"/>
              </div>
              <div>
                <Label htmlFor="image-align" className="text-xs flex items-center gap-1"><AlignHorizontalJustifyCenter className="h-3 w-3"/> Alignment</Label>
                <Select value={localImageAlign} onValueChange={handleImageAlignChange}>
                  <SelectTrigger className="h-8 text-xs mt-1"> <SelectValue placeholder="Select alignment" /> </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="image-link-href" className="text-xs flex items-center gap-1"><Link2 className="h-3 w-3"/> Link URL (optional)</Label>
                <Input id="image-link-href" type="text" value={localImageLinkHref} onChange={handleImageLinkHrefChange} placeholder="https://example.com" className="h-8 text-xs mt-1"/>
              </div>
              <Button onClick={() => handleSelectImageFromDAM('blockImage')} size="sm" variant="outline" className="w-full text-xs">
                <ImageUp className="mr-2 h-3 w-3" /> Select from DAM
              </Button>
              <Separator/>
              <Label className="text-xs font-medium flex items-center gap-1"><PaletteBlockIcon className="h-3 w-3"/> Image Element Styling</Label>
               <div>
                <Label htmlFor="image-element-border" className="text-xs flex items-center gap-1"><BoxSelect className="h-3 w-3"/> Border</Label>
                <Input id="image-element-border" type="text" value={localImageElementBorder} onChange={handleImageElementBorderChange} placeholder="1px solid #cccccc" className="h-8 text-xs mt-1"/>
              </div>
              <div>
                <Label htmlFor="image-element-borderRadius" className="text-xs flex items-center gap-1"><MinusSquare className="h-3 w-3"/> Border Radius</Label>
                <Input id="image-element-borderRadius" type="text" value={localImageElementBorderRadius} onChange={handleImageElementBorderRadiusChange} placeholder="8px" className="h-8 text-xs mt-1"/>
              </div>
            </CardContent>
          </>
        );
      case 'button':
        return (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-headline"><MousePointerSquareDashed className="h-5 w-5"/> Button Block</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="button-text" className="text-xs">Button Text</Label>
                <Input id="button-text" type="text" value={localButtonText} onChange={handleButtonTextChange} placeholder="Button Text" className="h-8 text-xs mt-1"/>
              </div>
              <div>
                <Label htmlFor="button-href" className="text-xs">Link URL</Label>
                <Input id="button-href" type="text" value={localButtonHref} onChange={handleButtonHrefChange} placeholder="https://..." className="h-8 text-xs mt-1"/>
              </div>
              <div>
                <Label htmlFor="button-container-align" className="text-xs flex items-center gap-1"><AlignCenter className="h-3 w-3"/>Container Alignment</Label>
                <Select value={localButtonContainerAlign} onValueChange={handleButtonContainerAlignChange}>
                  <SelectTrigger className="h-8 text-xs mt-1"> <SelectValue placeholder="Select alignment" /> </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <Label className="text-xs font-medium flex items-center gap-1"><PaletteBlockIcon className="h-3 w-3"/> Button Styling</Label>
              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                <div>
                  <Label htmlFor="button-textColor" className="text-xs">Text Color</Label>
                  <Input id="button-textColor" type="color" value={localButtonTextColor} onChange={handleButtonTextColorChange} className="h-8 text-xs mt-1"/>
                </div>
                <div>
                  <Label htmlFor="button-bgColor" className="text-xs">Background</Label>
                  <Input id="button-bgColor" type="color" value={localButtonBgColor} onChange={handleButtonBgColorChange} className="h-8 text-xs mt-1"/>
                </div>
                <div>
                    <Label htmlFor="button-fontSize" className="text-xs flex items-center gap-1"><Maximize2 className="h-3 w-3" /> Font Size</Label>
                    <Input id="button-fontSize" type="text" value={localButtonFontSize} onChange={handleButtonFontSizeChange} placeholder="16px" className="h-8 text-xs mt-1"/>
                </div>
                <div>
                    <Label htmlFor="button-fontWeight" className="text-xs flex items-center gap-1"><Bold className="h-3 w-3"/> Font Weight</Label>
                    <Select value={localButtonFontWeight} onValueChange={handleButtonFontWeightChange}>
                        <SelectTrigger className="h-8 text-xs mt-1"> <SelectValue placeholder="Select weight" /> </SelectTrigger>
                        <SelectContent>
                        {fontWeights.map(fw => <SelectItem key={fw.value} value={fw.value}>{fw.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                  <Label htmlFor="button-borderRadius" className="text-xs flex items-center gap-1"><MinusSquare className="h-3 w-3" /> Border Radius</Label>
                  <Input id="button-borderRadius" type="text" value={localButtonBorderRadius} onChange={handleButtonBorderRadiusChange} placeholder="5px" className="h-8 text-xs mt-1"/>
                </div>
                 <div>
                  <Label htmlFor="button-border" className="text-xs flex items-center gap-1"><BoxSelect className="h-3 w-3"/> Border</Label>
                  <Input id="button-border" type="text" value={localButtonBorder} onChange={handleButtonBorderChange} placeholder="1px solid #000" className="h-8 text-xs mt-1"/>
                </div>
              </div>
              <div> {/* Padding needs full width */}
                <Label htmlFor="button-padding" className="text-xs">Padding</Label>
                <Input id="button-padding" type="text" value={localButtonPadding} onChange={handleButtonPaddingChange} placeholder="10px 25px" className="h-8 text-xs mt-1"/>
              </div>
              <Separator />
              <Label className="text-xs font-medium flex items-center gap-1"><ImagePlus className="h-3 w-3"/> Image in Button</Label>
              <div>
                <Label htmlFor="button-imageUrl" className="text-xs">Image URL (optional)</Label>
                <Input id="button-imageUrl" type="text" value={localButtonImageUrl} onChange={handleButtonImageUrlChange} placeholder="https://..." className="h-8 text-xs mt-1"/>
              </div>
              <Button onClick={() => handleSelectImageFromDAM('buttonImage')} size="sm" variant="outline" className="w-full text-xs" disabled={!globalOnImageSelect}>
                <ImageUp className="mr-2 h-3 w-3" /> Select Image for Button
              </Button>
              <div>
                <Label htmlFor="button-imagePos" className="text-xs">Image Position</Label>
                <Select value={localButtonImagePosition} onValueChange={handleButtonImagePositionChange} disabled={!localButtonImageUrl}>
                  <SelectTrigger className="h-8 text-xs mt-1"> <SelectValue placeholder="Select position" /> </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="left">Left of Text</SelectItem>
                    <SelectItem value="right">Right of Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </>
        );      case 'conditionalLayout':
        return (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-headline"><TerminalSquare className="h-5 w-5"/> Conditional Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">              <div>
                <Label htmlFor="conditional-condition" className="text-xs">Condition Rules</Label>
                <div className="mt-2">
                  <Textarea
                    id="conditional-condition"
                    value={localConditionalCondition}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleConditionalConditionChange(e.target.value)}
                    placeholder="Enter conditional logic (e.g., user.type == 'premium')"
                    className="text-xs font-mono"
                    rows={3}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Enter conditional logic using Liquid syntax. Example: user.type == 'premium'
                </p>
              </div>
               <p className="text-xs text-muted-foreground">
                Blocks inside this conditional layout can be selected and edited on the canvas.
              </p>
            </CardContent>
          </>
        );
      default:
        return <p className="p-4 text-xs text-muted-foreground">Unknown block type selected.</p>;
    }
  };

  const renderContainerStyleSettings = () => (
    <>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="flex items-center gap-2 text-md font-headline"><LayoutGrid className="h-4 w-4"/> Container Styling</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor={`${selectedBlock?.id}-style-padding`} className="text-xs">Padding</Label>
          <Input id={`${selectedBlock?.id}-style-padding`} type="text" value={localPadding} onChange={handlePaddingChange} placeholder="e.g., 10px or 5px 10px" className="h-8 text-xs mt-1"/>
        </div>
        <div>
          <Label htmlFor={`${selectedBlock?.id}-style-margin`} className="text-xs">Margin</Label>
          <Input id={`${selectedBlock?.id}-style-margin`} type="text" value={localMargin} onChange={handleMarginChange} placeholder="e.g., 10px or 10px auto" className="h-8 text-xs mt-1"/>
        </div>
        <div>
          <Label htmlFor={`${selectedBlock?.id}-style-bgcolor`} className="text-xs">Background Color</Label>
          <Input id={`${selectedBlock?.id}-style-bgcolor`} type="color" value={localBackgroundColor} onChange={handleBackgroundColorChange} className="h-8 text-xs mt-1"/>
        </div>
        <div>
          <Label htmlFor={`${selectedBlock?.id}-style-border`} className="text-xs flex items-center gap-1"><BoxSelect className="h-3 w-3"/> Border</Label>
          <Input id={`${selectedBlock?.id}-style-border`} type="text" value={localContainerBorder} onChange={handleContainerBorderChange} placeholder="1px solid #cccccc" className="h-8 text-xs mt-1"/>
        </div>
        <div>
          <Label htmlFor={`${selectedBlock?.id}-style-borderradius`} className="text-xs flex items-center gap-1"><MinusSquare className="h-3 w-3"/> Border Radius</Label>
          <Input id={`${selectedBlock?.id}-style-borderradius`} type="text" value={localContainerBorderRadius} onChange={handleContainerBorderRadiusChange} placeholder="8px" className="h-8 text-xs mt-1"/>
        </div>
      </CardContent>
    </>
  );

  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col">
      <ScrollArea className="flex-1 p-0">
        <Card className="shadow-none border-none rounded-none h-full">
         {selectedBlock && renderSpecificSettings()}
         {selectedBlock && <Separator className="my-2" />}
         {selectedBlock && renderContainerStyleSettings()}
        </Card>
      </ScrollArea>
    </aside>
  );
};

export default SettingsPanel;
