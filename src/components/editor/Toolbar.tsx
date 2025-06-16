

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area-simple';
import { Type, Image as ImageIcon, MousePointerSquareDashed, Columns, Rows, Heading1, Minus, Square, Code } from 'lucide-react';
import type { DraggableItem } from '@/lib/types';
import { useDraggable } from '@dnd-kit/core';

interface DraggableToolbarItemProps {
  id: string;
  item: DraggableItem;
  label: string;
  icon: React.ReactNode;
}

const DraggableToolbarItem: React.FC<DraggableToolbarItemProps> = ({ id, item, label, icon }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: item,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-3 aspect-square group"
    >
      <div className="text-gray-600 group-hover:text-blue-600 transition-colors mb-1">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 transition-colors text-center leading-tight">
        {label}
      </span>
    </div>
  );
};


const Toolbar: React.FC = () => {
  const draggableBlocks: { id: string; item: DraggableItem; label: string; icon: React.ReactNode }[] = [
    { id: 'tb-heading', item: { type: 'heading' }, label: 'Heading', icon: <Heading1 className="h-5 w-5" /> },
    { id: 'tb-text', item: { type: 'text' }, label: 'Text', icon: <Type className="h-5 w-5" /> },
    { id: 'tb-button', item: { type: 'button' }, label: 'Button', icon: <MousePointerSquareDashed className="h-5 w-5" /> },
    { id: 'tb-image', item: { type: 'image' }, label: 'Image', icon: <ImageIcon className="h-5 w-5" /> },
    { id: 'tb-divider', item: { type: 'divider' }, label: 'Divider', icon: <Minus className="h-5 w-5" /> },
    { id: 'tb-spacer', item: { type: 'spacer' }, label: 'Spacer', icon: <Square className="h-5 w-5" /> },
    { id: 'tb-html', item: { type: 'html' }, label: 'Html', icon: <Code className="h-5 w-5" /> },
  ];

  const draggableLayouts: { id: string; item: DraggableItem; label: string; icon: React.ReactNode }[] = [
    { id: 'tb-layout-1', item: { type: 'layout-1-col' }, label: '1 Column', icon: <Rows className="h-5 w-5" /> },
    { id: 'tb-layout-2', item: { type: 'layout-2-col' }, label: '2 Columns', icon: <Columns className="h-5 w-5 rotate-90 transform scale-y-[-1]" /> },
    { id: 'tb-layout-3', item: { type: 'layout-3-col' }, label: '3 Columns', icon: <Columns className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-72 border-r border-border p-4 bg-card flex flex-col space-y-6">
      <ScrollArea className="flex-1">
        <Card className="shadow-none border-none">
          <CardHeader className="p-3">
            <CardTitle className="text-lg font-headline">Layouts</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3">
              {draggableLayouts.map((layoutItem) => (
                <DraggableToolbarItem 
                  key={layoutItem.id} 
                  id={layoutItem.id} 
                  item={layoutItem.item}
                  label={layoutItem.label}
                  icon={layoutItem.icon}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-none border-none">
          <CardHeader className="p-3">
            <CardTitle className="text-lg font-headline">Blocks</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3">
              {draggableBlocks.map((blockItem) => (
                <DraggableToolbarItem 
                  key={blockItem.id} 
                  id={blockItem.id} 
                  item={blockItem.item}
                  label={blockItem.label}
                  icon={blockItem.icon}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </aside>
  );
};

export default Toolbar;
