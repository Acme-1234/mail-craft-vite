import React from 'react';
import { Type, Image as ImageIcon, MousePointerSquareDashed, Columns, Rows, Heading1, Minus, Square, Code, TerminalSquare } from 'lucide-react';
import type { DraggableItem } from '@/lib/types';

interface DragPreviewProps {
  item: DraggableItem;
}

const DragPreview: React.FC<DragPreviewProps> = ({ item }) => {
  const getPreviewContent = () => {
    switch (item.type) {
      case 'layout-1-col':
        return {
          icon: <Rows className="h-6 w-6" />,
          title: '1 Column Layout',
          description: 'Single column row'
        };
      case 'layout-2-col':
        return {
          icon: <Columns className="h-6 w-6 rotate-90 transform scale-y-[-1]" />,
          title: '2 Column Layout',
          description: 'Two equal columns'
        };
      case 'layout-3-col':
        return {
          icon: <Columns className="h-6 w-6" />,
          title: '3 Column Layout',
          description: 'Three equal columns'
        };
      case 'layout-4-col':
        return {
          icon: <Columns className="h-6 w-6 scale-x-110" />,
          title: '4 Column Layout',
          description: 'Four equal columns'
        };
      case 'heading':
        return {
          icon: <Heading1 className="h-6 w-6" />,
          title: 'Heading Block',
          description: 'Add a heading'
        };
      case 'text':
        return {
          icon: <Type className="h-6 w-6" />,
          title: 'Text Block',
          description: 'Add text content'
        };
      case 'button':
        return {
          icon: <MousePointerSquareDashed className="h-6 w-6" />,
          title: 'Button Block',
          description: 'Add a clickable button'
        };
      case 'image':
        return {
          icon: <ImageIcon className="h-6 w-6" />,
          title: 'Image Block',
          description: 'Add an image'
        };
      case 'divider':
        return {
          icon: <Minus className="h-6 w-6" />,
          title: 'Divider Block',
          description: 'Add a divider line'
        };
      case 'spacer':
        return {
          icon: <Square className="h-6 w-6" />,
          title: 'Spacer Block',
          description: 'Add vertical spacing'
        };
      case 'html':
        return {
          icon: <Code className="h-6 w-6" />,
          title: 'HTML Block',
          description: 'Add custom HTML'
        };
      case 'conditionalLayout':
        return {
          icon: <TerminalSquare className="h-6 w-6" />,
          title: 'Conditional Block',
          description: 'Add conditional content'
        };
      default:
        return {
          icon: <Square className="h-6 w-6" />,
          title: 'Block',
          description: 'Drag to add'
        };
    }
  };

  const { icon, title, description } = getPreviewContent();
  return (
    <div className="relative bg-white/95 backdrop-blur-md border-2 border-blue-500 shadow-2xl rounded-xl p-4 min-w-[220px] max-w-[260px] transform rotate-1 scale-105">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 p-2.5 rounded-xl shadow-sm border border-blue-200">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{title}</h3>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-200">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-bold text-blue-700 tracking-wide">DRAG TO DROP</span>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
    </div>
  );
};

export default DragPreview;
