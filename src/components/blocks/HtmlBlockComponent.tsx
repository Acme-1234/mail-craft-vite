import React from 'react';
import type { HtmlBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';

interface HtmlBlockProps {
  block: HtmlBlockData;
}

const HtmlBlockComponent: React.FC<HtmlBlockProps> = ({ block }) => {
  const { selectedBlockId } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const containerStyles: React.CSSProperties = {
    padding: block.styles?.padding || '10px',
    margin: block.styles?.margin || '0',
    backgroundColor: block.styles?.backgroundColor || 'transparent',
    border: isSelected ? '2px solid #3b82f6' : (block.styles?.border || 'none'),
    borderRadius: block.styles?.borderRadius || '0',
  };

  return (
    <div
      style={containerStyles}
      className="html-block-component"
    >
      <div 
        dangerouslySetInnerHTML={{ __html: block.content }}
        style={{
          fontFamily: block.styles?.fontFamily,
          fontSize: block.styles?.fontSize,
          color: block.styles?.color,
          lineHeight: block.styles?.lineHeight,
          textAlign: block.styles?.textAlign,
        }}
      />
    </div>
  );
};

export default HtmlBlockComponent;
