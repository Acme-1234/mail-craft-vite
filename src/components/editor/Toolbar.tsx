

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area-simple';
import { Type, Image as ImageIcon, MousePointerSquareDashed, Columns, Rows, GripVertical, TerminalSquare, Heading1, User, Minus, Square, Code } from 'lucide-react';
import type { DraggableItem } from '@/lib/types';
import { useDraggable } from '@dnd-kit/core';

interface DraggableToolbarItemProps {
  id: string;
  item: DraggableItem;
  children: React.ReactNode;
}

const DraggableToolbarItem: React.FC<DraggableToolbarItemProps> = ({ id, item, children }) => {
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
    <Button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      variant="outline"
      className="w-full justify-start px-3 py-2 mb-2 cursor-grab active:cursor-grabbing flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      {children}
    </Button>
  );
};


const Toolbar: React.FC = () => {  const draggableBlocks: { id: string; item: DraggableItem; label: string; icon: React.ReactNode }[] = [
    { id: 'tb-heading', item: { type: 'heading' }, label: 'Heading', icon: <Heading1 className="h-5 w-5" /> },
    { id: 'tb-text', item: { type: 'text' }, label: 'Text', icon: <Type className="h-5 w-5" /> },
    { id: 'tb-button', item: { type: 'button' }, label: 'Button', icon: <MousePointerSquareDashed className="h-5 w-5" /> },
    { id: 'tb-image', item: { type: 'image' }, label: 'Image', icon: <ImageIcon className="h-5 w-5" /> },
    { id: 'tb-avatar', item: { type: 'avatar' }, label: 'Avatar', icon: <User className="h-5 w-5" /> },
    { id: 'tb-divider', item: { type: 'divider' }, label: 'Divider', icon: <Minus className="h-5 w-5" /> },
    { id: 'tb-spacer', item: { type: 'spacer' }, label: 'Spacer', icon: <Square className="h-5 w-5" /> },
    { id: 'tb-html', item: { type: 'html' }, label: 'Html', icon: <Code className="h-5 w-5" /> },
    { id: 'tb-conditional', item: { type: 'conditionalLayout' }, label: 'Conditional Layout', icon: <TerminalSquare className="h-5 w-5" /> },
  ];

  const draggableLayouts: { id: string; item: DraggableItem; label: string; icon: React.ReactNode }[] = [
    { id: 'tb-layout-1', item: { type: 'layout-1-col' }, label: '1 Column Row', icon: <Rows className="h-5 w-5" /> },
    { id: 'tb-layout-2', item: { type: 'layout-2-col' }, label: '2 Columns Row', icon: <Columns className="h-5 w-5 rotate-90 transform scale-y-[-1]" /> },
    { id: 'tb-layout-3', item: { type: 'layout-3-col' }, label: '3 Columns Row', icon: <Columns className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-72 border-r border-border p-4 bg-card flex flex-col space-y-6">
      <ScrollArea className="flex-1">
        <Card className="shadow-none border-none">
          <CardHeader className="p-2">
            <CardTitle className="text-lg font-headline">Layouts</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {draggableLayouts.map((layoutItem) => (
              <DraggableToolbarItem key={layoutItem.id} id={layoutItem.id} item={layoutItem.item}>
                {layoutItem.icon}
                <span>{layoutItem.label}</span>
              </DraggableToolbarItem>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-none border-none">
          <CardHeader className="p-2">
            <CardTitle className="text-lg font-headline">Blocks</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {draggableBlocks.map((blockItem) => (
              <DraggableToolbarItem key={blockItem.id} id={blockItem.id} item={blockItem.item}>
                {blockItem.icon}
                <span>{blockItem.label}</span>
              </DraggableToolbarItem>
            ))}
          </CardContent>
        </Card>
      </ScrollArea>
    </aside>
  );
};

export default Toolbar;
