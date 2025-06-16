import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Move, RotateCcw } from 'lucide-react';

interface SizeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  units?: string[];
  defaultUnit?: string;
  presets?: { label: string; value: string }[];
  allowNegative?: boolean;
  showSlider?: boolean;
  type?: 'single' | 'box' | 'sides';
}

// Helper functions
const parseSize = (value: string): { number: number; unit: string } => {
  if (!value || value === 'auto' || value === 'inherit') {
    return { number: 0, unit: 'px' };
  }
  
  const match = value.match(/^(-?\d*\.?\d+)(px|em|rem|%|vh|vw|pt|in|cm|mm|ex|ch)?$/);
  if (match) {
    return {
      number: parseFloat(match[1]),
      unit: match[2] || 'px'
    };
  }
  
  return { number: 0, unit: 'px' };
};

const formatSize = (number: number, unit: string): string => {
  if (number === 0 && unit === 'px') return '';
  return `${number}${unit}`;
};

const parseBoxValue = (value: string): { top: string; right: string; bottom: string; left: string } => {
  if (!value) return { top: '', right: '', bottom: '', left: '' };
  
  const parts = value.split(/\s+/).filter(p => p);
  
  if (parts.length === 1) {
    return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  } else if (parts.length === 2) {
    return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  } else if (parts.length === 3) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
  } else if (parts.length === 4) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }
  
  return { top: '', right: '', bottom: '', left: '' };
};

const formatBoxValue = (top: string, right: string, bottom: string, left: string): string => {
  if (!top && !right && !bottom && !left) return '';
  
  if (top === right && right === bottom && bottom === left) {
    return top || '0px';
  } else if (top === bottom && right === left) {
    return `${top || '0px'} ${right || '0px'}`;
  } else {
    return `${top || '0px'} ${right || '0px'} ${bottom || '0px'} ${left || '0px'}`;
  }
};

const SizeInput: React.FC<SizeInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '0px',
  className = '',
  min = 0,
  max = 200,
  step = 1,  units = ['px', 'em', 'rem', '%'],
  presets = [],
  allowNegative = false,
  showSlider = true,
  type = 'single'
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [activeTab, setActiveTab] = useState<'slider' | 'input' | 'box'>('slider');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleSingleValueChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleSliderChange = (values: number[]) => {
    const parsed = parseSize(localValue);
    const newValue = formatSize(values[0], parsed.unit);
    handleSingleValueChange(newValue);
  };

  const handleNumberChange = (number: number) => {
    const parsed = parseSize(localValue);
    const newValue = formatSize(number, parsed.unit);
    handleSingleValueChange(newValue);
  };

  const handleUnitChange = (unit: string) => {
    const parsed = parseSize(localValue);
    const newValue = formatSize(parsed.number, unit);
    handleSingleValueChange(newValue);
  };

  const handlePresetClick = (preset: string) => {
    handleSingleValueChange(preset);
  };

  const handleReset = () => {
    handleSingleValueChange('');
  };

  const getCurrentNumber = (): number => {
    const parsed = parseSize(localValue);
    return parsed.number;
  };

  const getCurrentUnit = (): string => {
    const parsed = parseSize(localValue);
    return parsed.unit;
  };

  const effectiveMin = allowNegative ? -max : min;

  // Single value component
  const renderSingleInput = () => (
    <div className="space-y-3">
      {showSlider && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Slider</span>
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {localValue || '0px'}
            </span>
          </div>
          <Slider
            value={[getCurrentNumber()]}
            onValueChange={handleSliderChange}
            min={effectiveMin}
            max={max}
            step={step}
            className="w-full"
          />
        </div>
      )}
      
      <div className="flex gap-2">
        <Input
          type="number"
          value={getCurrentNumber()}
          onChange={(e) => handleNumberChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="text-xs flex-1"
          min={effectiveMin}
          max={max}
          step={step}
        />
        <Select value={getCurrentUnit()} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map(unit => (
              <SelectItem key={unit} value={unit} className="text-xs">
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {presets.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-gray-600">Presets</span>
          <div className="flex flex-wrap gap-1">
            {presets.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(preset.value)}
                className="h-6 px-2 text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Box model component (for padding/margin with 4 sides)
  const renderBoxInput = () => {
    const boxValues = parseBoxValue(localValue);
    
    const handleBoxChange = (side: string, sideValue: string) => {
      const newBoxValues = { ...boxValues, [side]: sideValue };
      const newValue = formatBoxValue(
        newBoxValues.top,
        newBoxValues.right,
        newBoxValues.bottom,
        newBoxValues.left
      );
      handleSingleValueChange(newValue);
    };

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div></div>
          <div>
            <Input
              placeholder="Top"
              value={boxValues.top}
              onChange={(e) => handleBoxChange('top', e.target.value)}
              className="text-center text-xs h-8"
            />
          </div>
          <div></div>
          
          <div>
            <Input
              placeholder="Left"
              value={boxValues.left}
              onChange={(e) => handleBoxChange('left', e.target.value)}
              className="text-center text-xs h-8"
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <Move className="h-3 w-3 text-gray-400" />
            </div>
          </div>
          <div>
            <Input
              placeholder="Right"
              value={boxValues.right}
              onChange={(e) => handleBoxChange('right', e.target.value)}
              className="text-center text-xs h-8"
            />
          </div>
          
          <div></div>
          <div>
            <Input
              placeholder="Bottom"
              value={boxValues.bottom}
              onChange={(e) => handleBoxChange('bottom', e.target.value)}
              className="text-center text-xs h-8"
            />
          </div>
          <div></div>
        </div>
        
        <div className="text-center">
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
            {localValue || '0px'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-6 w-6 p-0"
          title="Reset"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      {type === 'single' ? (
        renderSingleInput()
      ) : type === 'box' ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="slider" className="text-xs">Slider</TabsTrigger>
            <TabsTrigger value="input" className="text-xs">Input</TabsTrigger>
            <TabsTrigger value="box" className="text-xs">Box</TabsTrigger>
          </TabsList>
          
          <TabsContent value="slider" className="mt-3">
            {renderSingleInput()}
          </TabsContent>
          
          <TabsContent value="input" className="mt-3">
            <Input
              value={localValue}
              onChange={(e) => handleSingleValueChange(e.target.value)}
              placeholder={placeholder}
              className="text-xs"
            />
          </TabsContent>
          
          <TabsContent value="box" className="mt-3">
            {renderBoxInput()}
          </TabsContent>
        </Tabs>
      ) : (
        <Input
          value={localValue}
          onChange={(e) => handleSingleValueChange(e.target.value)}
          placeholder={placeholder}
          className="text-xs"
        />
      )}
    </div>
  );
};

export default SizeInput;
