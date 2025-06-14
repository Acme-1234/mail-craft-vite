import React, { useState, useEffect, useCallback } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TerminalSquare } from 'lucide-react';
import RuleBuilder from '../RuleBuilder';
import type { ConditionalLayoutSettingsProps } from './types';
import type { ConditionalLayoutBlockData } from '@/lib/types';

const ConditionalLayoutSettings: React.FC<ConditionalLayoutSettingsProps> = ({ 
  block, 
  onUpdate, 
  placeholders 
}) => {
  const [localConditionalCondition, setLocalConditionalCondition] = useState('');

  useEffect(() => {
    const conditionalBlock = block as ConditionalLayoutBlockData;
    setLocalConditionalCondition(conditionalBlock.condition || '');
  }, [block]);
  const handleConditionalConditionChange = useCallback((value: string) => {
    setLocalConditionalCondition(value);
    onUpdate({ condition: value } as Partial<ConditionalLayoutBlockData>);
  }, [onUpdate]);

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <TerminalSquare className="h-5 w-5" /> Conditional Layout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="conditional-condition" className="text-xs">Condition Rules</Label>
          <div className="mt-2">
            {placeholders ? (
              <RuleBuilder
                value={localConditionalCondition}
                onChange={handleConditionalConditionChange}
                placeholders={placeholders}
              />
            ) : (
              <div className="text-xs text-muted-foreground">Loading rule builder...</div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use the visual builder to create complex conditions, or switch to code mode for advanced Liquid syntax.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Blocks inside this conditional layout can be selected and edited on the canvas.
        </p>
      </CardContent>
    </>
  );
};

export default ConditionalLayoutSettings;
