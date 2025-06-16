import React from 'react';
import type { AvatarBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';

interface AvatarBlockProps {
  block: AvatarBlockData;
}

const AvatarBlockComponent: React.FC<AvatarBlockProps> = ({ block }) => {
  const { selectedBlockId } = useEditorStore();
  const isSelected = selectedBlockId === block.id;  const getAvatarSize = (): string => {
    switch (block.size) {
      case 'small': return '40px';
      case 'medium': return '60px';
      case 'large': return '80px';
      case 'custom': return block.customSize || '60px';
      default: return '60px';
    }
  };

  const avatarSize = getAvatarSize();

  const avatarStyles: React.CSSProperties = {
    width: avatarSize,
    height: avatarSize,
    objectFit: 'cover',
    border: block.styles?.border || 'none',
    borderRadius: getShapeRadius(block.shape || 'circle'),
    display: 'block',
  };

  const containerStyles: React.CSSProperties = {
    padding: block.styles?.padding || '10px',
    margin: block.styles?.margin || '0',
    backgroundColor: block.styles?.backgroundColor || 'transparent',
    textAlign: block.align || 'center',
    borderRadius: block.styles?.borderRadius || '0',
    border: isSelected ? '2px solid #3b82f6' : 'none',
  };

  const renderAvatar = () => {
    const avatarElement = (
      <img
        src={block.src}
        alt={block.alt}
        style={avatarStyles}
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          (e.target as HTMLImageElement).src = `data:image/svg+xml;base64,${btoa(`
            <svg width="${avatarSize}" height="${avatarSize}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#e5e7eb"/>
              <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
                Avatar
              </text>
            </svg>
          `)}`;
        }}
      />
    );

    // If there's a link, wrap the avatar in an anchor tag
    if (block.linkHref) {
      return (
        <a href={block.linkHref} style={{ textDecoration: 'none' }}>
          {avatarElement}
        </a>
      );
    }

    return avatarElement;
  };

  return (
    <div
      style={containerStyles}
      className="avatar-block-component"
    >
      {renderAvatar()}
    </div>
  );
};

// Helper function to get border radius based on shape
function getShapeRadius(shape: 'circle' | 'square' | 'rounded'): string {
  switch (shape) {
    case 'circle': return '50%';
    case 'square': return '0';
    case 'rounded': return '8px';
    default: return '50%';
  }
}

export default AvatarBlockComponent;
