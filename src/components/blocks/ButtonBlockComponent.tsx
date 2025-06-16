

import React from 'react';
import type { ButtonBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';
import { Button as ShadButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonBlockProps {
  block: ButtonBlockData;
}

const ButtonBlockComponent: React.FC<ButtonBlockProps> = ({ block }) => {
  const { selectedBlockId } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const containerStyles: React.CSSProperties = {
    padding: block.styles?.padding,
    margin: block.styles?.margin,
    backgroundColor: block.styles?.backgroundColor,
    border: block.styles?.border,
    borderRadius: block.styles?.borderRadius, // Container's border radius
    textAlign: block.align || 'center', // Apply alignment to the container
  };
  const buttonInlineStyles: React.CSSProperties = {
    color: block.buttonStyles?.color,
    backgroundColor: block.buttonStyles?.backgroundColor,
    borderRadius: block.buttonStyles?.borderRadius, // Button element's border radius
    padding: block.buttonStyles?.padding,
    fontWeight: block.buttonStyles?.fontWeight,
    fontSize: block.buttonStyles?.fontSize,
    border: block.buttonStyles?.border, // Button element's border
    width: block.buttonStyles?.width, // Button width control
    display: 'inline-flex', 
    alignItems: 'center',
    lineHeight: 'normal', 
    textDecoration: 'none', // Ensure links don't get underlined by default
  };

  const imageStyles: React.CSSProperties = {
    height: '1.2em', 
    width: 'auto',   
    verticalAlign: 'middle', 
  };

  return (
    <div 
      className={cn(isSelected ? 'ring-2 ring-primary' : '')}
      style={containerStyles}
    >
      <ShadButton
        variant="default" 
        size="lg" 
        className="pointer-events-none" 
        style={buttonInlineStyles}
        asChild={false} 
      >
        <>
          {block.imageUrl && block.imagePosition === 'left' && (
            <img 
              src={block.imageUrl} 
              alt="" 
              style={{ ...imageStyles, marginRight: '8px' }}
              data-ai-hint="icon decoration"
            />
          )}
          <span>{block.text || 'Button Text'}</span>
          {block.imageUrl && block.imagePosition === 'right' && (
            <img 
              src={block.imageUrl} 
              alt="" 
              style={{ ...imageStyles, marginLeft: '8px' }}
              data-ai-hint="icon decoration"
            />
          )}
        </>
      </ShadButton>
    </div>
  );
};

export default ButtonBlockComponent;
