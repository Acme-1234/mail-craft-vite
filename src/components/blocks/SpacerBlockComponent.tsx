import React from 'react';
import type { SpacerBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';

interface SpacerBlockProps {
  block: SpacerBlockData;
}

const SpacerBlockComponent: React.FC<SpacerBlockProps> = ({ block }) => {
  const { selectedBlockId } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const spacerStyles: React.CSSProperties = {
    height: block.height || '20px',
    width: '100%',
    backgroundColor: 'transparent',
    ...(isSelected && {
      backgroundColor: '#f3f4f6',
      border: '1px dashed #9ca3af',
    }),
  };

  const containerStyles: React.CSSProperties = {
    padding: block.styles?.padding || '0',
    margin: block.styles?.margin || '0',
    backgroundColor: block.styles?.backgroundColor || 'transparent',
    borderRadius: block.styles?.borderRadius || '0',
    border: isSelected ? '2px solid #3b82f6' : 'none',
  };

  return (
    <div
      style={containerStyles}
      className="spacer-block-component"
    >
      <div style={spacerStyles}>
        {isSelected && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: '12px',
            color: '#6b7280',
            fontFamily: 'system-ui, sans-serif'
          }}>
            Spacer ({block.height || '20px'})
          </div>
        )}
      </div>
    </div>
  );
};

export default SpacerBlockComponent;
