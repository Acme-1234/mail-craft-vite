

import React from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';
import type { EditorRow, EditorColumn, EditorBlockData, ConditionalLayoutBlockData } from '@/lib/types';
import TextBlockComponent from '@/components/blocks/TextBlockComponent';
import ImageBlockComponent from '@/components/blocks/ImageBlockComponent';
import ButtonBlockComponent from '@/components/blocks/ButtonBlockComponent';
import ConditionalLayoutBlockComponent from '@/components/blocks/ConditionalLayoutBlockComponent';
import HeadingBlockComponent from '@/components/blocks/HeadingBlockComponent';
import AvatarBlockComponent from '@/components/blocks/AvatarBlockComponent';
import DividerBlockComponent from '@/components/blocks/DividerBlockComponent';
import SpacerBlockComponent from '@/components/blocks/SpacerBlockComponent';
import HtmlBlockComponent from '@/components/blocks/HtmlBlockComponent';
import { ScrollArea } from '@/components/ui/scroll-area-simple';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface BlockWrapperProps {
  block: EditorBlockData;
  rowId: string;
  columnId: string;
  parentConditionalBlockId?: string; // For blocks inside conditional layouts
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, rowId, columnId, parentConditionalBlockId }) => {
  const { selectedBlockId, setSelectedBlockId, removeBlock, moveBlockInColumn } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const handleSelectBlock = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSelectedBlockId(block.id);
  };

  const handleRemoveBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeBlock(block.id, parentConditionalBlockId);
  }

  const handleMoveBlock = (e: React.MouseEvent, direction: 'up' | 'down') => {
    e.stopPropagation();
    moveBlockInColumn(rowId, columnId, block.id, direction, parentConditionalBlockId);
  }
  let blockComponent;
  switch (block.type) {
    case 'text':
      blockComponent = <TextBlockComponent block={block} />;
      break;
    case 'heading':
      blockComponent = <HeadingBlockComponent block={block} />;
      break;
    case 'image':
      blockComponent = <ImageBlockComponent block={block} />;
      break;
    case 'avatar':
      blockComponent = <AvatarBlockComponent block={block} />;
      break;
    case 'button':
      blockComponent = <ButtonBlockComponent block={block} />;
      break;
    case 'divider':
      blockComponent = <DividerBlockComponent block={block} />;
      break;
    case 'spacer':
      blockComponent = <SpacerBlockComponent block={block} />;
      break;
    case 'html':
      blockComponent = <HtmlBlockComponent block={block} />;
      break;
    case 'conditionalLayout':
      blockComponent = <ConditionalLayoutBlockComponent block={block as ConditionalLayoutBlockData} />;
      break;
    default:
      return null;
  }
  return (
    <div
      className={cn(
        'relative border border-dashed border-transparent hover:border-primary transition-colors group', 
        isSelected && 'border-primary border-solid shadow-lg'
      )}
      onClick={handleSelectBlock}
    >
      <div className="absolute top-1 -left-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 bg-background p-1 rounded shadow">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleMoveBlock(e, 'up')} title="Move up">
           <ArrowUp className="h-4 w-4" />
        </Button>
         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleMoveBlock(e, 'down')} title="Move down">
           <ArrowDown className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={handleRemoveBlock} title="Delete block">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {blockComponent}
    </div>
  );
};

interface ColumnComponentProps {
  column: EditorColumn;
  rowId: string;
  parentConditionalBlockId?: string; 
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({ column, rowId, parentConditionalBlockId }) => {
  const droppableId = parentConditionalBlockId 
    ? `col-${column.id}-parent-${parentConditionalBlockId}` 
    : `col-${column.id}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: { type: 'column', columnId: column.id, rowId: rowId, parentConditionalBlockId },
  });

  const getColumnWidthClass = (span: number) => {
    if (span === 12) return 'w-full';
    if (span === 6) return 'w-1/2';
    if (span === 4) return 'w-1/3';
    // Add other spans if necessary or default
    if (span === 1) return 'w-1/12';
    if (span === 2) return 'w-2/12';
    if (span === 3) return 'w-3/12';
    if (span === 5) return 'w-5/12';
    if (span === 7) return 'w-7/12';
    if (span === 8) return 'w-8/12';
    if (span === 9) return 'w-9/12';
    if (span === 10) return 'w-10/12';
    if (span === 11) return 'w-11/12';
    return 'w-full'; 
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'border border-dashed border-transparent min-h-[50px]', 
        getColumnWidthClass(column.span),
        isOver && 'bg-primary/10 border-primary'
      )}
      onClick={(e) => e.stopPropagation()} 
      style={{padding: column.blocks.length === 0 ? '0.5rem' : '0'}}
    >
      {column.blocks.length === 0 && (
         <div className="flex items-center justify-center text-muted-foreground h-full text-sm p-2" onClick={(e) => e.stopPropagation()} >Drop block here</div> 
      )}
      {column.blocks.map((block) => (
        <BlockWrapper key={block.id} block={block} rowId={rowId} columnId={column.id} parentConditionalBlockId={parentConditionalBlockId}/>
      ))}
    </div>
  );
};


interface RowComponentProps {
  row: EditorRow;
  parentConditionalBlockId?: string; 
}
const RowComponent: React.FC<RowComponentProps> = ({ row, parentConditionalBlockId }) => {
  const { removeRow, moveRow } = useEditorStore();
  
  const droppableId = parentConditionalBlockId 
    ? `row-${row.id}-parent-${parentConditionalBlockId}` 
    : `row-${row.id}`;

  const { setNodeRef: setDroppableRowRef, isOver } = useDroppable({
    id: droppableId,
    data: { type: 'row', rowId: row.id, parentConditionalBlockId },
  });

  const handleRemoveRow = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeRow(row.id, parentConditionalBlockId);
  }

  const handleMoveRow = (e: React.MouseEvent, direction: 'up' | 'down') => {
    e.stopPropagation();
    moveRow(row.id, direction, parentConditionalBlockId);
  }
  return (
    <div
      className={cn(
        "relative hover:border-primary transition-colors group bg-card"
      )}
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="absolute top-2 -left-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1 bg-background p-1 rounded shadow-md">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleMoveRow(e, 'up')} title="Move row up">
           <ArrowUp className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleMoveRow(e, 'down')} title="Move row down">
           <ArrowDown className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={handleRemoveRow} title="Delete row">
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      <div ref={setDroppableRowRef} className={cn("flex flex-wrap gap-0", isOver && 'bg-primary/5')}>
        {row.columns.map((col) => (
          <ColumnComponent key={col.id} column={col} rowId={row.id} parentConditionalBlockId={parentConditionalBlockId} />
        ))}
      </div>
    </div>
  );
};


const Canvas: React.FC = () => {
  const { document, addRow, setSelectedBlockId } = useEditorStore();
  const { setNodeRef: setCanvasDroppableRef, isOver: isCanvasOver } = useDroppable({
    id: 'canvas-droppable', 
    data: { type: 'canvas', isCanvas: true },
  });

  const handleCanvasClick = () => {
    setSelectedBlockId(null);
  };

  const canvasBackgroundColor = document.settings?.backgroundColor || 'hsl(var(--background))'; // Fallback to theme

  return (
    <main 
      ref={setCanvasDroppableRef} 
      className={cn(
        "flex-1 overflow-auto", // Removed bg-background, will be set by inline style or default
        isCanvasOver && "bg-accent/10" // Keep hover effect distinct
      )} 
      style={{ backgroundColor: canvasBackgroundColor }}
      onClick={handleCanvasClick}
    >      <ScrollArea className="h-full">        <div 
          className="mx-auto p-6 pl-20" 
          style={{ 
            width: document.settings?.contentWidth || '600px',
            maxWidth: 'none' // Remove max-width constraint
          }} 
        >
          {document.rows.length === 0 && (
            <div 
              className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-muted-foreground border-2 border-dashed border-border rounded-lg p-8"
              onClick={(e) => e.stopPropagation()} 
            >
              <p className="text-lg mb-2">Canvas is empty.</p>
              <p className="mb-4">Drag layouts or blocks from the toolbar here to start building your email.</p>
              <Button onClick={() => addRow({ type: 'layout-1-col' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add 1 Column Row
              </Button>
            </div>
          )}
          {document.rows.map((row) => (
             <RowComponent key={row.id} row={row} />
          ))}
        </div>
      </ScrollArea>
    </main>
  );
};

export default Canvas;

    
