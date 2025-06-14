

import React from 'react';
import type { ConditionalLayoutBlockData, EditorRow, EditorColumn, EditorBlockData as LibEditorBlockData, TextBlockData as LibTextBlockData, ImageBlockData as LibImageBlockData, ButtonBlockData as LibButtonBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import TextBlockComponent from '@/components/blocks/TextBlockComponent';
import ImageBlockComponent from '@/components/blocks/ImageBlockComponent';
import ButtonBlockComponent from '@/components/blocks/ButtonBlockComponent';
import { Button } from '@/components/ui/button';
import { GripVertical, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

// Helper function for column widths
const getColumnWidthClass = (span: number): string => {
  if (span === 1) return 'w-1/12';
  if (span === 2) return 'w-2/12';
  if (span === 3) return 'w-3/12';
  if (span === 4) return 'w-4/12';
  if (span === 5) return 'w-5/12';
  if (span === 6) return 'w-6/12'; // 1/2
  if (span === 7) return 'w-7/12';
  if (span === 8) return 'w-8/12'; // 2/3
  if (span === 9) return 'w-9/12'; // 3/4
  if (span === 10) return 'w-10/12';
  if (span === 11) return 'w-11/12';
  if (span === 12) return 'w-full';
  return 'w-full'; // Default to full width
};

interface InteractiveBlockRendererProps {
  block: LibEditorBlockData;
  rowId: string;
  columnId: string;
  parentConditionalBlockId: string;
}

const InteractiveBlockRenderer: React.FC<InteractiveBlockRendererProps> = ({ block, rowId, columnId, parentConditionalBlockId }) => {
  const { selectedBlockId, setSelectedBlockId, removeBlock, moveBlockInColumn } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const { attributes, listeners, setNodeRef: draggableRef, transform, isDragging } = useDraggable({
    id: `block-${block.id}-parent-${parentConditionalBlockId}`, // Unique ID for DND within conditional
    data: { type: 'block', blockId: block.id, rowId, columnId, parentConditionalBlockId },
  });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: isDragging ? 100 : 'auto' } : {};

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
      blockComponent = <TextBlockComponent block={block as LibTextBlockData} />;
      break;
    case 'image':
      blockComponent = <ImageBlockComponent block={block as LibImageBlockData} />;
      break;
    case 'button':
      blockComponent = <ButtonBlockComponent block={block as LibButtonBlockData} />;
      break;
    case 'conditionalLayout': // For nested conditionals
      blockComponent = <ConditionalLayoutBlockComponent block={block as ConditionalLayoutBlockData} />;
      break;
    default:
      return null;
  }

  return (
    <div
      ref={draggableRef}
      style={style}
      className={cn(
        'relative border border-dashed border-transparent hover:border-primary transition-colors group/inner-block my-1', // Added my-1 for spacing
        isSelected && 'border-primary border-solid shadow-lg',
        isDragging && 'opacity-50'
      )}
      onClick={handleSelectBlock}
    >
      <div className="absolute top-1 right-1 z-10 opacity-0 group-hover/inner-block:opacity-100 transition-opacity flex gap-1 bg-background p-1 rounded shadow">
        <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab" {...listeners} {...attributes} title="Move block">
           <GripVertical className="h-4 w-4" />
        </Button>
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


interface ConditionalColumnRendererProps {
  column: EditorColumn;
  rowId: string;
  parentConditionalBlockId: string;
}

const ConditionalColumnRenderer: React.FC<ConditionalColumnRendererProps> = ({ column, rowId, parentConditionalBlockId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${column.id}-parent-${parentConditionalBlockId}`,
    data: {
      type: 'column',
      columnId: column.id,
      rowId: rowId,
      parentConditionalBlockId: parentConditionalBlockId,
    },
  });

  return (
    <div
      className={cn(
        getColumnWidthClass(column.span),
        "p-0.5" 
      )}
    >
      <div
        ref={setNodeRef}
        className={cn(
          "border border-dashed border-muted-foreground/20 rounded-sm p-2 min-h-[70px] flex flex-col justify-start bg-card/30", // Increased min-height
          isOver && "bg-primary/10 ring-1 ring-primary outline-none"
        )}
      >
        {(column.blocks as LibEditorBlockData[]).map((b: LibEditorBlockData) => (
           <InteractiveBlockRenderer 
             key={b.id} 
             block={b} 
             rowId={rowId} 
             columnId={column.id} 
             parentConditionalBlockId={parentConditionalBlockId} 
           />
        ))}
        {column.blocks.length === 0 && (
          <div className="text-center text-muted-foreground text-xs py-1 flex-grow flex items-center justify-center">
            {isOver ? "Drop block here" : `Col (${column.span})`}
          </div>
        )}
      </div>
    </div>
  );
};

interface ConditionalRowRendererProps {
  row: EditorRow;
  parentConditionalBlockId: string;
}

const ConditionalRowRenderer: React.FC<ConditionalRowRendererProps> = ({ row, parentConditionalBlockId }) => {
  // DND for rows *within* conditional layout (simplified: no dragging for now, just rendering)
   const { removeRow, moveRow } = useEditorStore(); // Access store for row operations

    const handleRemoveRow = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeRow(row.id, parentConditionalBlockId);
    };

    const handleMoveRow = (e: React.MouseEvent, direction: 'up' | 'down') => {
        e.stopPropagation();
        moveRow(row.id, direction, parentConditionalBlockId);
    };


  return (
    <div className="p-1 border border-dashed border-muted-foreground/20 my-0.5 rounded-sm bg-background/30 relative group/conditional-row">
       <div className="absolute top-1 right-1 z-20 opacity-0 group-hover/conditional-row:opacity-100 transition-opacity flex items-center gap-0.5 bg-background/70 p-0.5 rounded shadow-md">
            {/* No drag handle for inner rows for now to keep it simple */}
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => handleMoveRow(e, 'up')} title="Move row up">
               <ArrowUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => handleMoveRow(e, 'down')} title="Move row down">
               <ArrowDown className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:text-destructive" onClick={handleRemoveRow} title="Delete row">
              <Trash2 className="h-3 w-3" />
            </Button>
        </div>
      <div className="flex flex-wrap -m-0.5"> 
        {row.columns.map((col: EditorColumn) => (
          <ConditionalColumnRenderer
            key={col.id}
            column={col}
            rowId={row.id}
            parentConditionalBlockId={parentConditionalBlockId}
          />
        ))}
      </div>
    </div>
  );
};

interface ConditionalLayoutBlockProps {
  block: ConditionalLayoutBlockData;
}

const ConditionalLayoutBlockComponent: React.FC<ConditionalLayoutBlockProps> = ({ block }) => {
  const { selectedBlockId, setSelectedBlockId } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const containerStyles: React.CSSProperties = {
    padding: block.styles?.padding || '8px',
    margin: block.styles?.margin || '0px',
    backgroundColor: block.styles?.backgroundColor || 'hsla(var(--accent-hsl) / 0.05)',
    border: isSelected ? `2px solid hsl(var(--primary))` : `1px dashed hsl(var(--border))`,
    borderRadius: '4px',
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSelectedBlockId(block.id);
  };

  return (
    <div style={containerStyles} onClick={handleSelect} className="min-h-[60px] group/conditional-block relative">
      <div className="mb-1 p-1.5 bg-muted/40 rounded-sm border border-transparent group-hover/conditional-block:border-purple-300/50 transition-colors">
        <p className="text-xs font-semibold text-foreground font-code">
          <span className="font-bold text-purple-500">{"{% if"}</span> <span className="text-purple-700">{block.condition || 'your_condition_here'}</span> <span className="font-bold text-purple-500">{"%}"}</span>
        </p>
      </div>
      
      <div className="pl-3 border-l-2 border-purple-300/70 space-y-1">
        {block.rows.map(itemRow => (
          <ConditionalRowRenderer key={itemRow.id} row={itemRow} parentConditionalBlockId={block.id} />
        ))}
        {block.rows.length === 0 && (
           <div 
            className="p-3 text-center text-xs text-muted-foreground italic border border-dashed border-muted-foreground/30 rounded-sm min-h-[50px] flex items-center justify-center"
            // This inner div could also be a drop target for new rows if needed in the future
           >
            Conditional content is empty. Drag blocks into columns or add new rows via settings.
          </div>
        )}
      </div>

      <div className="mt-1 p-1.5 bg-muted/40 rounded-sm border border-transparent group-hover/conditional-block:border-purple-300/50 transition-colors">
        <p className="text-xs font-semibold text-foreground font-code">
          <span className="font-bold text-purple-500">{"{% endif %}"}</span>
        </p>
      </div>
    </div>
  );
};

export default ConditionalLayoutBlockComponent;
