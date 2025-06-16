import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pipette, Palette } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Helper functions for color conversion
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const parseColor = (color: string): { hex: string; rgb: string; hsl: string; rgba: string } => {
  // Create a temporary element to let the browser parse the color
  const div = document.createElement('div');
  div.style.color = color;
  document.body.appendChild(div);
  const computed = window.getComputedStyle(div).color;
  document.body.removeChild(div);

  // Parse RGB values from computed style
  const rgbMatch = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const [h, s, l] = rgbToHsl(r, g, b);
    const hsl = `hsl(${h}, ${s}%, ${l}%)`;
    const rgba = `rgba(${r}, ${g}, ${b}, 1)`;

    return { hex, rgb, hsl, rgba };
  }

  // Fallback for invalid colors
  return { hex: '#000000', rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)', rgba: 'rgba(0, 0, 0, 1)' };
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = '#000000',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hex');
  const [localValue, setLocalValue] = useState(value || '');
  const [isEyedropperSupported, setIsEyedropperSupported] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    // Check if EyeDropper API is supported
    setIsEyedropperSupported('EyeDropper' in window);
  }, []);

  const handleColorChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-ignore - EyeDropper is not in TypeScript types yet
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        handleColorChange(result.sRGBHex);
      } catch (error) {
        console.error('Error using eye dropper:', error);
      }
    }
  };

  const getCurrentDisplayValue = () => {
    if (!localValue) return '';
    
    try {
      const colors = parseColor(localValue);
      switch (activeTab) {
        case 'hex': return colors.hex;
        case 'rgb': return colors.rgb;
        case 'hsl': return colors.hsl;
        case 'rgba': return colors.rgba;
        default: return localValue;
      }
    } catch {
      return localValue;
    }
  };

  const getColorPreview = () => {
    try {
      const colors = parseColor(localValue);
      return colors.hex;
    } catch {
      return '#000000';
    }
  };

  const commonColors = [
    '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
    '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
    '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF', '#F0F0F0',
    '#8B4513', '#A0522D', '#D2691E', '#CD853F', '#F4A460', '#DEB887'
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-xs font-medium">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-8 px-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: getColorPreview() }}
              />
              <span className="truncate">{localValue || placeholder}</span>
            </div>
            <Palette className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            {/* Color format tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 h-8">
                <TabsTrigger value="hex" className="text-xs">HEX</TabsTrigger>
                <TabsTrigger value="rgb" className="text-xs">RGB</TabsTrigger>
                <TabsTrigger value="hsl" className="text-xs">HSL</TabsTrigger>
                <TabsTrigger value="rgba" className="text-xs">RGBA</TabsTrigger>
              </TabsList>

              <TabsContent value="hex" className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={getCurrentDisplayValue()}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#000000"
                    className="text-xs"
                  />
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={getColorPreview()}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </TabsContent>

              <TabsContent value="rgb" className="space-y-2">
                <Input
                  value={getCurrentDisplayValue()}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="rgb(0, 0, 0)"
                  className="text-xs"
                />
              </TabsContent>

              <TabsContent value="hsl" className="space-y-2">
                <Input
                  value={getCurrentDisplayValue()}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="hsl(0, 0%, 0%)"
                  className="text-xs"
                />
              </TabsContent>

              <TabsContent value="rgba" className="space-y-2">
                <Input
                  value={getCurrentDisplayValue()}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="rgba(0, 0, 0, 1)"
                  className="text-xs"
                />
              </TabsContent>
            </Tabs>

            {/* Eye dropper tool */}
            {isEyedropperSupported && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-gray-600">Pick from screen</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEyeDropper}
                  className="h-7 px-2"
                >
                  <Pipette className="h-3 w-3 mr-1" />
                  <span className="text-xs">Pick</span>
                </Button>
              </div>
            )}

            {/* Common colors palette */}
            <div className="pt-2 border-t">
              <Label className="text-xs text-gray-600 mb-2 block">Common Colors</Label>
              <div className="grid grid-cols-12 gap-1">
                {commonColors.map((color, index) => (
                  <button
                    key={index}
                    className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Current preview */}
            <div className="pt-2 border-t">
              <Label className="text-xs text-gray-600 mb-2 block">Preview</Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: getColorPreview() }}
                />
                <div className="text-xs text-gray-600">
                  <div>{getCurrentDisplayValue()}</div>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
