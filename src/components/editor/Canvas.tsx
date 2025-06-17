

import React from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';
import type { EditorRow, EditorColumn, EditorBlockData, ConditionalLayoutBlockData } from '@/lib/types';
import TextBlockComponent from '@/components/blocks/TextBlockComponent';
import ImageBlockComponent from '@/components/blocks/ImageBlockComponent';
import ButtonBlockComponent from '@/components/blocks/ButtonBlockComponent';
import ConditionalLayoutBlockComponent from '@/components/blocks/ConditionalLayoutBlockComponent';
import HeadingBlockComponent from '@/components/blocks/HeadingBlockComponent';
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
      break;    case 'image':
      blockComponent = <ImageBlockComponent block={block} />;
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
  }  return (
    <div      className={cn(
        'relative border-2 border-dashed border-transparent hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 group overflow-visible', 
        isSelected && 'border-blue-500 border-solid bg-blue-50/50 shadow-lg shadow-blue-200/50'
      )}
      onClick={handleSelectBlock}
    ><div className="absolute top-1 -left-10 z-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 bg-background p-1 shadow rounded border">
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
      ref={setNodeRef}      className={cn(
        'border-2 border-dashed border-transparent min-h-[60px] transition-all duration-300 relative overflow-visible', 
        getColumnWidthClass(column.span),
        'hover:border-blue-300 hover:bg-blue-50/20',
        isOver && 'bg-gradient-to-br from-blue-100/80 to-blue-200/60 border-blue-400 border-solid shadow-lg shadow-blue-200/50 transform scale-[1.02]'
      )}
      onClick={(e) => e.stopPropagation()} 
      style={{padding: column.blocks.length === 0 ? '1rem' : '0'}}
    >
      {column.blocks.length === 0 && (
        <div className={cn(
          "flex items-center justify-center text-center h-full min-h-[60px] transition-all duration-300",
          isOver ? "text-blue-700 font-semibold" : "text-blue-400 font-medium"
        )} onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300",
              isOver ? "border-blue-600 bg-blue-100 scale-110" : "border-blue-300"
            )}>
              <PlusCircle className={cn("h-4 w-4", isOver ? "text-blue-700" : "text-blue-400")} />
            </div>
            <span className="text-xs">{isOver ? "Drop here!" : "Drop block here"}</span>
          </div>
        </div>
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
  };
  return (    <div
      className={cn(
        "relative border-2 border-dashed border-gray-200 transition-all duration-300 group bg-card overflow-visible",
        "hover:border-blue-400 hover:bg-blue-50/20",
        isOver && "border-blue-500 bg-blue-50/40 shadow-lg shadow-blue-200/30"
      )}
      onClick={(e) => e.stopPropagation()} 
    ><div className="absolute top-2 -left-10 z-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1 bg-background p-1 shadow-md rounded border">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleMoveRow(e, 'up')} title="Move row up">
           <ArrowUp className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleMoveRow(e, 'down')} title="Move row down">
           <ArrowDown className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={handleRemoveRow} title="Delete row">
          <Trash2 className="h-5 w-5" />
        </Button>
      </div><div ref={setDroppableRowRef} className={cn(
        "flex flex-wrap transition-all duration-300", 
        isOver && 'bg-gradient-to-r from-blue-100/30 to-blue-200/20 border-2 border-blue-300 border-dashed'
      )}>
        {row.columns.map((col) => (
          <ColumnComponent key={col.id} column={col} rowId={row.id} parentConditionalBlockId={parentConditionalBlockId} />
        ))}
      </div>
    </div>
  );
};


const Canvas: React.FC = () => {
  const { document, addRow, setSelectedBlockId, ui } = useEditorStore();
  const { setNodeRef: setCanvasDroppableRef, isOver: isCanvasOver } = useDroppable({
    id: 'canvas-droppable', 
    data: { type: 'canvas', isCanvas: true },
  });

  const handleCanvasClick = () => {
    setSelectedBlockId(null);
  };

  const canvasBackgroundColor = document.settings?.backgroundColor || 'hsl(var(--background))'; // Fallback to theme  // Calculate device area width (fixed based on device mode)
  const getDeviceWidth = () => {
    switch (ui.canvas.deviceMode) {
      case 'mobile':
        return 320;
      case 'tablet':
        return 480;
      case 'desktop':
        return 600; // Fixed desktop width for email standard
      case 'custom':
        // For custom mode, device area uses document width but constrained
        const customWidth = parseInt(document.settings?.contentWidth || '600');
        return Math.max(320, Math.min(customWidth, 1200));
      default:
        return 600;
    }
  };

  // Calculate content area width (variable, from document settings)
  const getContentWidth = () => {
    return parseInt(document.settings?.contentWidth || '600');
  };

  const deviceWidth = getDeviceWidth();
  const contentWidth = getContentWidth();
  const transform = `scale(${ui.canvas.zoomLevel})`;
  const transformOrigin = 'top center';
  
  // Check if content width is constrained in custom mode
  const isCustomModeConstrained = ui.canvas.deviceMode === 'custom' && contentWidth > 1200;
  
  return (
    <main 
      ref={setCanvasDroppableRef} 
      className={cn(
        "flex-1 overflow-auto transition-all duration-300 bg-slate-50", 
        isCanvasOver && "bg-gradient-to-br from-blue-50/60 to-blue-100/40 ring-2 ring-blue-300 ring-inset"
      )} 
      onClick={handleCanvasClick}
    >      <ScrollArea className="h-full">        {/* Canvas Area - Full workspace container */}
        <div className="flex justify-center p-4 min-h-full relative">
          
          {/* Visual Width Legend */}
          {ui.preferences.showWidthIndicators && (
            <div className="absolute top-2 left-4 z-30 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
              <div className="font-semibold mb-2 text-gray-700">Width Indicators:</div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-2 border border-yellow-400 border-dashed bg-yellow-50"></div>
                <span className="text-gray-600">Device Area ({ui.canvas.deviceMode}: {deviceWidth}px)</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-2 border border-blue-400 border-dashed bg-blue-50"></div>
                <span className="text-gray-600">Content Area ({contentWidth}px)</span>
              </div>
              {contentWidth > deviceWidth && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 border border-green-500 border-dashed bg-green-50"></div>
                  <span className="text-gray-600">Overflow Area</span>
                </div>
              )}
            </div>
          )}

          {/* Visual Width Indicators */}
          {ui.preferences.showWidthIndicators && (
            <div className="absolute top-0 bottom-0 flex justify-center w-full pointer-events-none z-10">
              <div className="relative" style={{ width: `${deviceWidth}px`, transform: transform, transformOrigin: transformOrigin }}>
                {/* Device Area boundary indicator (yellow) */}
                <div className="absolute inset-0 border-2 border-yellow-400 border-dashed opacity-60" />
                
                {/* Content Area boundary indicator (blue) */}
                <div 
                  className="absolute top-0 bottom-0 border-2 border-blue-400 border-dashed opacity-70 bg-blue-50/10"
                  style={{ 
                    left: '50%',
                    transform: `translateX(-50%)`,
                    width: `${Math.min(contentWidth, deviceWidth)}px`
                  }}
                />
                
                {/* Overflow indicator (green) when content exceeds device width */}
                {contentWidth > deviceWidth && (
                  <div 
                    className="absolute top-0 bottom-0 border-2 border-green-500 border-dashed opacity-70 bg-green-50/10"
                    style={{ 
                      left: '50%',
                      transform: `translateX(-50%)`,
                      width: `${contentWidth}px`
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Warning indicator for constrained custom width */}
          {isCustomModeConstrained && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded text-xs shadow-lg">
                Content width {contentWidth}px constrained to {deviceWidth}px (device maximum)
              </div>
            </div>
          )}

          {/* Device Area - Fixed width container */}          <div 
            className={cn(
              "transition-all duration-300 bg-white shadow-lg border border-gray-200 rounded-lg relative z-20",
              ui.preferences.showDeviceFrame && "border-2 border-gray-400"
            )}
            style={{ 
              width: `${deviceWidth}px`,
              transform: transform,
              transformOrigin: transformOrigin,
              backgroundColor: canvasBackgroundColor
            }}
          >
            {/* Content Area - Variable width area where blocks live */}            <div 
              className="mx-auto transition-all duration-300 overflow-visible"
              style={{ 
                width: `${Math.min(contentWidth, deviceWidth)}px`,
                maxWidth: '100%'
              }}
            >
              <div className="p-3 overflow-visible">
              {document.rows.length === 0 && (
            <div 
              className={cn(
                "flex flex-col items-center justify-center h-[calc(100vh-200px)] border-2 border-dashed transition-all duration-300 p-8 rounded-lg",
                isCanvasOver 
                  ? "border-blue-400 bg-gradient-to-br from-blue-100/80 to-blue-200/60 text-blue-800 shadow-lg shadow-blue-200/50 scale-105" 
                  : "border-border text-muted-foreground bg-card"
              )}
              onClick={(e) => e.stopPropagation()} 
            >
              <div className={cn(
                "w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center mb-4 transition-all duration-300",
                isCanvasOver ? "border-blue-500 bg-blue-200/50 scale-110" : "border-muted-foreground/30"
              )}>
                <PlusCircle className={cn(
                  "h-8 w-8 transition-all duration-300",
                  isCanvasOver ? "text-blue-600" : "text-muted-foreground"
                )} />
              </div>
              <p className={cn(
                "text-lg mb-2 font-semibold transition-all duration-300",
                isCanvasOver ? "text-blue-800" : "text-muted-foreground"
              )}>
                {isCanvasOver ? "Drop to add content!" : "Canvas is empty."}
              </p>
              <p className="mb-4 text-center max-w-md">
                {isCanvasOver 
                  ? "Release to add your layout or block here." 
                  : "Drag layouts or blocks from the toolbar here to start building your email."
                }
              </p>
              {!isCanvasOver && (
                <Button onClick={() => addRow({ type: 'layout-1-col' })} variant="outline" className="mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add 1 Column Row
                </Button>
              )}
            </div>
          )}              {document.rows.map((row) => (
                 <RowComponent key={row.id} row={row} />
              ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default Canvas;

    
