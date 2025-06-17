

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area-simple';
import { Type, Image as ImageIcon, MousePointerSquareDashed, Columns, Rows, Heading1, Minus, Square, Code, TerminalSquare } from 'lucide-react';
import type { DraggableItem } from '@/lib/types';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  isCollapsed?: boolean;
}

interface DraggableToolbarItemProps {
  id: string;
  item: DraggableItem;
  label: string;
  icon: React.ReactNode;
  isCollapsed?: boolean;
}

const DraggableToolbarItem: React.FC<DraggableToolbarItemProps> = ({ id, item, label, icon, isCollapsed = false }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: item,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex cursor-grab active:cursor-grabbing rounded-lg p-3 transition-all duration-200",
        "border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-md",
        "items-center gap-3",
        isCollapsed ? "w-12 h-12 justify-center p-2" : "min-h-[60px]"
      )}
      title={isCollapsed ? label : undefined}
    >
      <div className={cn(
        "text-gray-600 transition-colors flex-shrink-0",
        isCollapsed ? "w-5 h-5" : "w-6 h-6"
      )}>
        {icon}
      </div>
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 leading-tight truncate">{label}</h3>
        </div>
      )}
    </div>
  );
};


const Toolbar: React.FC<ToolbarProps> = ({ isCollapsed = false }) => {
  const draggableBlocks: { id: string; item: DraggableItem; label: string; icon: React.ReactNode }[] = [
    { id: 'tb-heading', item: { type: 'heading' }, label: 'Heading', icon: <Heading1 className="h-5 w-5" /> },
    { id: 'tb-text', item: { type: 'text' }, label: 'Text', icon: <Type className="h-5 w-5" /> },
    { id: 'tb-button', item: { type: 'button' }, label: 'Button', icon: <MousePointerSquareDashed className="h-5 w-5" /> },
    { id: 'tb-image', item: { type: 'image' }, label: 'Image', icon: <ImageIcon className="h-5 w-5" /> },
    { id: 'tb-divider', item: { type: 'divider' }, label: 'Divider', icon: <Minus className="h-5 w-5" /> },
    { id: 'tb-spacer', item: { type: 'spacer' }, label: 'Spacer', icon: <Square className="h-5 w-5" /> },
    { id: 'tb-html', item: { type: 'html' }, label: 'Html', icon: <Code className="h-5 w-5" /> },
    { id: 'tb-conditional', item: { type: 'conditionalLayout' }, label: 'Conditional', icon: <TerminalSquare className="h-5 w-5" /> },
  ];
  const draggableLayouts: { id: string; item: DraggableItem; label: string; icon: React.ReactNode }[] = [
    { id: 'tb-layout-1', item: { type: 'layout-1-col' }, label: '1 Column', icon: <Rows className="h-5 w-5" /> },
    { id: 'tb-layout-2', item: { type: 'layout-2-col' }, label: '2 Columns', icon: <Columns className="h-5 w-5 rotate-90 transform scale-y-[-1]" /> },
    { id: 'tb-layout-3', item: { type: 'layout-3-col' }, label: '3 Columns', icon: <Columns className="h-5 w-5" /> },
    { id: 'tb-layout-4', item: { type: 'layout-4-col' }, label: '4 Columns', icon: <Columns className="h-5 w-5 scale-x-110" /> },
  ];  return (
    <aside className={cn(
      "border-r border-gray-200 p-4 bg-white flex flex-col space-y-6 transition-all duration-300 h-full",
      isCollapsed ? "w-16 items-center" : "w-72"
    )}>
      <ScrollArea className="flex-1">
        <div className="shadow-none border-none">
          <div className={cn("pb-2", isCollapsed && "hidden")}>
            <h2 className="text-base font-semibold text-gray-900">Layouts</h2>
          </div>
          <div className={cn("", isCollapsed && "")}>
            <div className={cn(
              "gap-3",
              isCollapsed ? "flex flex-col items-center" : "grid grid-cols-2"
            )}>
              {draggableLayouts.map((layoutItem) => (
                <DraggableToolbarItem 
                  key={layoutItem.id} 
                  id={layoutItem.id} 
                  item={layoutItem.item}
                  label={layoutItem.label}
                  icon={layoutItem.icon}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 shadow-none border-none">
          <div className={cn("pb-2", isCollapsed && "hidden")}>
            <h2 className="text-base font-semibold text-gray-900">Blocks</h2>
          </div>
          <div className={cn("", isCollapsed && "")}>
            <div className={cn(
              "gap-3",
              isCollapsed ? "flex flex-col items-center" : "grid grid-cols-2"
            )}>
              {draggableBlocks.map((blockItem) => (
                <DraggableToolbarItem 
                  key={blockItem.id} 
                  id={blockItem.id} 
                  item={blockItem.item}
                  label={blockItem.label}
                  icon={blockItem.icon}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Toolbar;
