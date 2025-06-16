
import React from 'react';
import type { ImageBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';

interface ImageBlockProps {
  block: ImageBlockData;
}

const ImageBlockComponent: React.FC<ImageBlockProps> = ({ block }) => {
  const { selectedBlockId } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const blockStyles: React.CSSProperties = {
    padding: block.styles?.padding,
    margin: block.styles?.margin,
    backgroundColor: block.styles?.backgroundColor,
    border: block.styles?.border, // Container border
    borderRadius: block.styles?.borderRadius, // Container border radius
    textAlign: block.align || 'center', // Apply alignment to the container for the image
  };

  const imageInlineStyles: React.CSSProperties = {
    border: block.imageElementStyles?.border,
    borderRadius: block.imageElementStyles?.borderRadius,
    // Width/Height could be set here if specific image styles were added for it
  };

  // Conditionally apply Tailwind classes for default border/radius if not overridden by inline styles
  const imageTailwindClasses = cn(
    "max-w-full h-auto inline-block", // inline-block for alignment
    !block.imageElementStyles?.border && "border border-border", // Default border if no specific border
    !block.imageElementStyles?.borderRadius && "rounded-sm" // Default radius if no specific radius
  );
  const imageElement = (
    <img
      src={block.src || 'https://placehold.co/600x400.png'}
      alt={block.alt || 'Email image'}
      className={imageTailwindClasses}
      style={imageInlineStyles}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400.png/FF0000/FFFFFF?text=Error+Loading+Image';
      }}
    />
  );

  return (
    <div 
      className={cn(isSelected ? 'ring-2 ring-primary' : '', 'block-element-image')}
      style={blockStyles}
    >
      {block.linkHref ? (
        <a href={block.linkHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
    </div>
  );
};

export default ImageBlockComponent;
