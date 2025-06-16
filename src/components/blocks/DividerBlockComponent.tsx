import React from 'react';
import type { DividerBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';

interface DividerBlockProps {
  block: DividerBlockData;
}

const DividerBlockComponent: React.FC<DividerBlockProps> = ({ block }) => {
  const { selectedBlockId } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const dividerStyles: React.CSSProperties = {
    width: block.width || '100%',
    height: '0',
    border: 'none',
    borderTop: `${block.thickness || '1px'} ${block.style || 'solid'} ${block.color || '#e5e7eb'}`,
    margin: '0 auto',
  };

  const containerStyles: React.CSSProperties = {
    padding: block.styles?.padding || '10px',
    margin: block.styles?.margin || '0',
    backgroundColor: block.styles?.backgroundColor || 'transparent',
    textAlign: block.align || 'center',
    borderRadius: block.styles?.borderRadius || '0',
    border: isSelected ? '2px solid #3b82f6' : 'none',
  };

  return (
    <div
      style={containerStyles}
      className="divider-block-component"
    >
      <hr style={dividerStyles} />
    </div>
  );
};

export default DividerBlockComponent;
