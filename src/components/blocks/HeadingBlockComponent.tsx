import React, { useState, useRef, useEffect } from 'react';
import type { HeadingBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';

interface HeadingBlockProps {
  block: HeadingBlockData;
}

const HeadingBlockComponent: React.FC<HeadingBlockProps> = ({ block }) => {
  const { selectedBlockId, updateBlock } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);
  const contentRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedBlockId === block.id;
  
  // Update editContent when block content changes
  useEffect(() => {
    setEditContent(block.content);
  }, [block.content]);

  // Handle double-click to edit
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  // Handle blur to save content
  const handleBlur = () => {
    setIsEditing(false);
    if (editContent !== block.content) {
      updateBlock(block.id, { content: editContent });
    }
  };

  // Handle key press (Enter to save, Escape to cancel)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditContent(block.content);
      setIsEditing(false);
    }
  };

  // Focus on the content div when editing starts
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      // Place cursor at the end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);
    const renderHeading = () => {
    const headingStyles: React.CSSProperties = {
      margin: 0,
      padding: '8px',
      textAlign: block.align || 'left',
      fontSize: getHeadingSize(block.level),
      fontWeight: getHeadingWeight(block.level),
      lineHeight: '1.2',
      fontFamily: block.styles?.fontFamily,
      color: block.styles?.color,
      outline: isEditing ? '2px solid #3b82f6' : 'none',
      background: isEditing ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
      borderRadius: isEditing ? '4px' : '0',
      cursor: isSelected && !isEditing ? 'text' : 'inherit',
      ...parseStyleString(block.styles),
    };

    const commonProps = {
      ref: contentRef,
      style: headingStyles,
      onDoubleClick: handleDoubleClick,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      contentEditable: isEditing,
      suppressContentEditableWarning: true,
      dangerouslySetInnerHTML: isEditing ? undefined : { __html: editContent || 'Double-click to edit' }
    };

    // If editing, show text content for editing
    if (isEditing) {
      const EditableHeading = `h${block.level}` as keyof JSX.IntrinsicElements;
      return React.createElement(EditableHeading, {
        ...commonProps,
        dangerouslySetInnerHTML: undefined,
        children: editContent
      });
    }

    // Normal display mode
    switch (block.level) {
      case 1: return <h1 {...commonProps} />;
      case 2: return <h2 {...commonProps} />;
      case 3: return <h3 {...commonProps} />;
      case 4: return <h4 {...commonProps} />;
      case 5: return <h5 {...commonProps} />;
      case 6: return <h6 {...commonProps} />;
      default: return <h2 {...commonProps} />;
    }
  };

  const containerStyles: React.CSSProperties = {
    padding: block.styles?.padding || '10px',
    margin: block.styles?.margin || '0',
    backgroundColor: block.styles?.backgroundColor || 'transparent',
    border: block.styles?.border || (isSelected ? '2px solid #3b82f6' : 'none'),
    borderRadius: block.styles?.borderRadius || '0',
    textAlign: block.align || 'left',
  };

  return (
    <div
      style={containerStyles}
      className="heading-block-component"
    >
      {renderHeading()}
    </div>
  );
};

// Helper function to get default font size for heading levels
function getHeadingSize(level: number): string {
  const sizes = {
    1: '32px',
    2: '28px',
    3: '24px',
    4: '20px',
    5: '18px',
    6: '16px',
  };
  return sizes[level as keyof typeof sizes] || '16px';
}

// Helper function to get default font weight for heading levels
function getHeadingWeight(level: number): string {
  const weights = {
    1: '700',
    2: '700',
    3: '600',
    4: '600',
    5: '500',
    6: '500',
  };
  return weights[level as keyof typeof weights] || '500';
}

// Helper function to parse style properties from BlockStyles
function parseStyleString(styles?: any): React.CSSProperties {
  if (!styles) return {};
  
  return {
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    color: styles.color,
    lineHeight: styles.lineHeight,
  };
}

export default HeadingBlockComponent;
