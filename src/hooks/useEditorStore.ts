
import { create } from 'zustand';
import type {
  EditorDocument,
  EditorRow,
  EditorBlockData,
  Placeholder,
  BlockType,
  BlockStyles,
  ButtonBlockData,
  ButtonSpecificStyles,
  DocumentSettings,
  ConditionalLayoutBlockData,
  TextBlockData,  ImageBlockData,
  ImageElementStyles,
  HeadingBlockData,
  DividerBlockData,
  SpacerBlockData,
  HtmlBlockData,
} from '@/lib/types';
import { DEFAULT_PLACEHOLDERS } from '@/config/editorConfig';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Default document settings
const defaultDocumentSettings: DocumentSettings = {
  contentWidth: '600px',
  backgroundColor: '#F0F4F8', 
  fontFamily: "'PT Sans', sans-serif", 
};

const createDefaultTextBlock = (): TextBlockData => ({
  id: generateId(),
  type: 'text',
  content: '<p>Type your conditional text here...</p>',
  styles: {},
});

const createDefaultConditionalRows = (): EditorRow[] => [
  {
    id: generateId(),
    columns: [
      {
        id: generateId(),
        span: 12,
        blocks: [createDefaultTextBlock()],
      },
    ],
  },
];

interface EmailEditorState {
  document: EditorDocument;
  selectedBlockId: string | null;
  placeholders: Placeholder[];
  onImageSelect?: (callback: (imageUrl: string) => void) => void;
  // Actions
  setDocument: (document: EditorDocument) => void;
  clearDocument: () => void;
  updateDocumentSettings: (newSettings: Partial<DocumentSettings>) => void;
  
  addRow: (config: { type: 'layout-1-col' | 'layout-2-col' | 'layout-3-col' | 'layout-4-col' }, rowIndex?: number, parentConditionalBlockId?: string) => void;
  removeRow: (rowId: string, parentConditionalBlockId?: string) => void;
  moveRow: (rowId: string, direction: 'up' | 'down', parentConditionalBlockId?: string) => void;
  
  addBlock: (rowId: string, columnId: string, blockType: BlockType, blockIndex?: number, parentConditionalBlockId?: string) => EditorBlockData;
  updateBlock: (blockId: string, updates: Partial<EditorBlockData> | { styles?: Partial<BlockStyles>, buttonStyles?: Partial<ButtonSpecificStyles>, imageElementStyles?: Partial<ImageElementStyles> }, parentConditionalBlockId?: string) => void;
  removeBlock: (blockId: string, parentConditionalBlockId?: string) => void;
  moveBlockInColumn: (rowId: string, columnId: string, blockId: string, direction: 'up' | 'down', parentConditionalBlockId?: string) => void;

  setSelectedBlockId: (blockId: string | null) => void;
  setPlaceholders: (placeholders: Placeholder[]) => void;
  setOnImageSelect: (onImageSelect: (callback: (imageUrl: string) => void) => void) => void;

  getBlockById: (blockId: string) => EditorBlockData | undefined;
}

const createNewBlock = (type: BlockType): EditorBlockData => {
  const id = generateId();
  const baseBlock = { id, type, styles: {} };
  switch (type) {
    case 'text':
      return { ...baseBlock, type: 'text', content: '<p>Type your text here...</p>' } as TextBlockData;    case 'heading':
      return { ...baseBlock, type: 'heading', content: 'Your Heading Here', level: 2, align: 'left' } as HeadingBlockData;
    case 'image':
      return { ...baseBlock, type: 'image', src: 'https://placehold.co/600x400.png', alt: 'Placeholder Image', imageElementStyles: {} } as ImageBlockData;
    case 'button':
      return { 
        ...baseBlock, 
        type: 'button',
        text: 'Click Me', 
        href: '#', 
        align: 'center', 
        buttonStyles: { backgroundColor: '#64B5F6', color: '#FFFFFF', padding: '10px 25px', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }, 
        imageUrl: undefined, 
        imagePosition: 'none',
      } as ButtonBlockData;
    case 'divider':
      return { ...baseBlock, type: 'divider', thickness: '1px', color: '#e5e7eb', style: 'solid', width: '100%', align: 'center' } as DividerBlockData;
    case 'spacer':
      return { ...baseBlock, type: 'spacer', height: '20px' } as SpacerBlockData;
    case 'html':
      return { ...baseBlock, type: 'html', content: '<div>Custom HTML content goes here...</div>' } as HtmlBlockData;
    case 'conditionalLayout':
      return {
        ...baseBlock,
        type: 'conditionalLayout',
        condition: '', 
        rows: createDefaultConditionalRows(),
      } as ConditionalLayoutBlockData;
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

export const useEditorStore = create<EmailEditorState>((set, get) => ({
  document: { rows: [], settings: { ...defaultDocumentSettings } },
  selectedBlockId: null,
  placeholders: DEFAULT_PLACEHOLDERS,
  onImageSelect: undefined,  setDocument: (document) => set({ 
    document: { 
      ...document, 
      settings: document.settings ? { ...defaultDocumentSettings, ...document.settings } : { ...defaultDocumentSettings } 
    } 
  }),

  clearDocument: () => {
    console.log('Store clearDocument called');
    set({ 
      document: { rows: [], settings: { ...defaultDocumentSettings } },
      selectedBlockId: null,
    });
    console.log('Store state updated');
  },

  updateDocumentSettings: (newSettings) =>
    set((state) => ({
      document: {
        ...state.document,
        settings: {
          ...(state.document.settings || defaultDocumentSettings),
          ...newSettings,
        },
      },
    })),

  addRow: (config, rowIndex, targetParentConditionalBlockId) => {
    const newRow: EditorRow = { id: generateId(), columns: [] };
    if (config.type === 'layout-1-col') {
      newRow.columns.push({ id: generateId(), span: 12, blocks: [] });
    } else if (config.type === 'layout-2-col') {
      newRow.columns.push({ id: generateId(), span: 6, blocks: [] });
      newRow.columns.push({ id: generateId(), span: 6, blocks: [] });    } else if (config.type === 'layout-3-col') {
      newRow.columns.push({ id: generateId(), span: 4, blocks: [] });
      newRow.columns.push({ id: generateId(), span: 4, blocks: [] });
      newRow.columns.push({ id: generateId(), span: 4, blocks: [] });
    } else if (config.type === 'layout-4-col') {
      newRow.columns.push({ id: generateId(), span: 3, blocks: [] });
      newRow.columns.push({ id: generateId(), span: 3, blocks: [] });
      newRow.columns.push({ id: generateId(), span: 3, blocks: [] });
      newRow.columns.push({ id: generateId(), span: 3, blocks: [] });
    }

    set((state) => {
      const processRows = (rowsToProcess: EditorRow[], currentNestingParentId?: string): EditorRow[] => {
         if (currentNestingParentId === targetParentConditionalBlockId) {
          const updatedRows = [...rowsToProcess];
          if (rowIndex === undefined || rowIndex < 0 || rowIndex > updatedRows.length) {
            updatedRows.push(newRow);
          } else {
            updatedRows.splice(rowIndex, 0, newRow);
          }
          return updatedRows;
        }

        return rowsToProcess.map(row => {
          if (row.columns) {
            return {
              ...row,
              columns: row.columns.map(col => ({
                ...col,
                blocks: col.blocks.map(block => {
                  if (block.type === 'conditionalLayout') {
                    const conditionalBlock = block as ConditionalLayoutBlockData;
                    return {
                      ...conditionalBlock,
                      rows: processRows(conditionalBlock.rows, conditionalBlock.id)
                    };
                  }
                  return block;
                })
              }))
            };
          }
          return row; 
        });
      };
      
      const updatedDocumentRows = processRows(state.document.rows, undefined); // Start with undefined for top-level
      return { document: { ...state.document, rows: updatedDocumentRows } };
    });
  },
  
  removeRow: (rowIdToRemove, targetParentConditionalBlockId) => {
    set(state => {
      const processRows = (rowsToProcess: EditorRow[], currentNestingParentId?: string): EditorRow[] => {
        if (currentNestingParentId === targetParentConditionalBlockId) {
          return rowsToProcess.filter(r => r.id !== rowIdToRemove);
        }
        return rowsToProcess.map(row => ({
          ...row,
          columns: row.columns.map(col => ({
            ...col,
            blocks: col.blocks.map(block => {
              if (block.type === 'conditionalLayout') {
                const conditionalBlock = block as ConditionalLayoutBlockData;
                return {
                  ...conditionalBlock,
                  rows: processRows(conditionalBlock.rows, conditionalBlock.id)
                };
              }
              return block;
            })
          }))
        }));
      };

      const updatedDocumentRows = processRows(state.document.rows, undefined);
      return { document: { ...state.document, rows: updatedDocumentRows } };
    });
  },

  moveRow: (rowIdToMove, direction, targetParentConditionalBlockId) => {
    set(state => {
      const processRows = (rowsToProcess: EditorRow[], currentNestingParentId?: string): EditorRow[] => {
        if (currentNestingParentId === targetParentConditionalBlockId) {
          const newRows = [...rowsToProcess];
          const rowIndex = newRows.findIndex(r => r.id === rowIdToMove);
          if (rowIndex === -1) return newRows;

          const newIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1;
          if (newIndex < 0 || newIndex >= newRows.length) return newRows;

          const [movedRow] = newRows.splice(rowIndex, 1);
          newRows.splice(newIndex, 0, movedRow);
          return newRows;
        }
        
        return rowsToProcess.map(row => ({
          ...row,
          columns: row.columns.map(col => ({
            ...col,
            blocks: col.blocks.map(block => {
              if (block.type === 'conditionalLayout') {
                const conditionalBlock = block as ConditionalLayoutBlockData;
                return {
                  ...conditionalBlock,
                  rows: processRows(conditionalBlock.rows, conditionalBlock.id)
                };
              }
              return block;
            })
          }))
        }));
      };
      const updatedDocumentRows = processRows(state.document.rows, undefined);
      return { document: { ...state.document, rows: updatedDocumentRows } };
    });
  },

  addBlock: (targetRowId, targetColumnId, blockType, blockIndex, targetParentConditionalBlockId) => {
    const newBlock = createNewBlock(blockType);
    set((state) => {
      const processRows = (rowsToProcess: EditorRow[], currentNestingParentId?: string): EditorRow[] => {
        return rowsToProcess.map((row) => {
          if (row.id === targetRowId && currentNestingParentId === targetParentConditionalBlockId) {
            return {
              ...row, 
              columns: row.columns.map((col) => {
                if (col.id === targetColumnId) {
                  const newBlocksArray = [...col.blocks]; 
                  if (blockIndex === undefined || blockIndex < 0 || blockIndex > newBlocksArray.length) {
                    newBlocksArray.push(newBlock);
                  } else {
                    newBlocksArray.splice(blockIndex, 0, newBlock);
                  }
                  return { ...col, blocks: newBlocksArray }; 
                }
                return col;
              }),
            };
          }
          
          return {
            ...row, 
            columns: row.columns.map(col => ({
              ...col, 
              blocks: col.blocks.map(block => {
                if (block.type === 'conditionalLayout') {
                  const conditionalBlock = block as ConditionalLayoutBlockData;
                  return {
                    ...conditionalBlock, 
                    rows: processRows(conditionalBlock.rows, conditionalBlock.id) 
                  };
                }
                return block;
              })
            }))
          };
        });
      };
      
      const updatedDocumentRows = processRows(state.document.rows, undefined);
      return { document: { ...state.document, rows: updatedDocumentRows } };
    });
    return newBlock; 
  },

  updateBlock: (blockIdToUpdate, updates) => {
    set(state => {      const processRows = (rowsToProcess: EditorRow[]): EditorRow[] => {
        return rowsToProcess.map(row => ({
          ...row,
          columns: row.columns.map(col => ({
            ...col,            blocks: col.blocks.map(block => {
              if (block.id === blockIdToUpdate) {
                let newBlockData = { ...block };
                let remainingUpdates = { ...updates };

                if ('styles' in remainingUpdates && typeof remainingUpdates.styles === 'object' && remainingUpdates.styles !== undefined) {
                  newBlockData.styles = { ...newBlockData.styles, ...remainingUpdates.styles };
                  delete remainingUpdates.styles;
                }
                if (newBlockData.type === 'button' && 'buttonStyles' in remainingUpdates && typeof remainingUpdates.buttonStyles === 'object' && remainingUpdates.buttonStyles !== undefined) {
                  const currentButtonBlock = newBlockData as ButtonBlockData;
                  currentButtonBlock.buttonStyles = { ...currentButtonBlock.buttonStyles, ...remainingUpdates.buttonStyles };
                  delete remainingUpdates.buttonStyles;
                }
                if (newBlockData.type === 'image' && 'imageElementStyles' in remainingUpdates && typeof remainingUpdates.imageElementStyles === 'object' && remainingUpdates.imageElementStyles !== undefined) {
                  const currentImageBlock = newBlockData as ImageBlockData;
                  currentImageBlock.imageElementStyles = { ...(currentImageBlock.imageElementStyles || {}), ...remainingUpdates.imageElementStyles };
                  delete remainingUpdates.imageElementStyles;
                }
                if (newBlockData.type === 'conditionalLayout' && 'condition' in remainingUpdates) {
                    (newBlockData as ConditionalLayoutBlockData).condition = remainingUpdates.condition as string;
                    delete remainingUpdates.condition;
                }
                if (newBlockData.type === 'conditionalLayout' && 'rows' in remainingUpdates) {
                    (newBlockData as ConditionalLayoutBlockData).rows = remainingUpdates.rows as EditorRow[];
                    delete remainingUpdates.rows;
                }
                return { ...newBlockData, ...remainingUpdates } as EditorBlockData;
              }
              if (block.type === 'conditionalLayout') {
                const conditionalBlock = block as ConditionalLayoutBlockData;
                return {
                  ...conditionalBlock,
                  rows: processRows(conditionalBlock.rows) 
                } as EditorBlockData;
              }
              return block;
            }) as EditorBlockData[]
          }))
        }));
      };
      return { document: { ...state.document, rows: processRows(state.document.rows) } };
    });
  },

  removeBlock: (blockIdToRemove, targetParentConditionalBlockId) => {
    set(state => {
      const processRows = (rowsToProcess: EditorRow[], currentNestingParentId?: string): EditorRow[] => {
         return rowsToProcess.map(row => ({
          ...row,
          columns: row.columns.map(col => {
            let newBlocks = col.blocks;
            if(currentNestingParentId === targetParentConditionalBlockId || (targetParentConditionalBlockId === undefined && currentNestingParentId === undefined)) {
                newBlocks = newBlocks.filter(block => block.id !== blockIdToRemove);
            }
            return {
              ...col,
              blocks: newBlocks.map(block => {
                if (block.type === 'conditionalLayout') {
                  const conditionalBlock = block as ConditionalLayoutBlockData;
                  return {
                    ...conditionalBlock,
                    rows: processRows(conditionalBlock.rows, conditionalBlock.id) 
                  };
                }
                return block;
              })
            };
          })
        }));
      };
      
      let updatedDocumentRows = processRows(state.document.rows, undefined);
      if (targetParentConditionalBlockId === undefined) { // also filter top-level if needed (though block removal might be specific to column)
        // This top-level filtering logic might be redundant if blocks are always removed from within a specific column context.
        // The main filtering happens based on currentNestingParentId matching targetParentConditionalBlockId.
      }

      return {
        document: { ...state.document, rows: updatedDocumentRows },
        selectedBlockId: state.selectedBlockId === blockIdToRemove ? null : state.selectedBlockId,
      };
    });
  },
  
  moveBlockInColumn: (targetRowId, targetColumnId, blockIdToMove, direction, targetParentConditionalBlockId) => {
    set(state => {
      const processRows = (rowsToProcess: EditorRow[], currentNestingParentId?: string): EditorRow[] => {
        return rowsToProcess.map(row => {
          if (row.id === targetRowId && currentNestingParentId === targetParentConditionalBlockId) {
            return {
              ...row,
              columns: row.columns.map(col => {
                if (col.id === targetColumnId) {
                  const blocks = [...col.blocks];
                  const blockIdx = blocks.findIndex(b => b.id === blockIdToMove);
                  if (blockIdx === -1) return col;

                  const newIdx = direction === 'up' ? blockIdx - 1 : blockIdx + 1;
                  if (newIdx < 0 || newIdx >= blocks.length) return col;
                  
                  const [movedBlock] = blocks.splice(blockIdx, 1);
                  blocks.splice(newIdx, 0, movedBlock);
                  return { ...col, blocks };
                }
                return col;
              })
            };
          }
           return {
            ...row,
            columns: row.columns.map(col => ({
              ...col,
              blocks: col.blocks.map(block => {
                if (block.type === 'conditionalLayout') {
                  const conditionalBlock = block as ConditionalLayoutBlockData;
                  return {
                    ...conditionalBlock,
                    rows: processRows(conditionalBlock.rows, conditionalBlock.id) 
                  };
                }
                return block;
              })
            }))
          };
        });
      };
      const updatedDocumentRows = processRows(state.document.rows, undefined);
      return { document: { ...state.document, rows: updatedDocumentRows } };
    });
  },

  setSelectedBlockId: (blockId) => set({ selectedBlockId: blockId }),
  setPlaceholders: (placeholders) => set({ placeholders }),
  setOnImageSelect: (onImageSelect) => set({ onImageSelect }),

  getBlockById: (blockId: string): EditorBlockData | undefined => {
    const { rows } = get().document;
    const findRecursive = (searchRows: EditorRow[]): EditorBlockData | undefined => {
      for (const row of searchRows) {
        for (const col of row.columns) {
          const foundBlock = col.blocks.find(b => b.id === blockId);
          if (foundBlock) return foundBlock;
          for (const block of col.blocks) {
            if (block.type === 'conditionalLayout') {
              const conditionalBlock = block as ConditionalLayoutBlockData;
              const foundInConditional = findRecursive(conditionalBlock.rows);
              if (foundInConditional) return foundInConditional;
            }
          }
        }
      }
      return undefined;
    };
    return findRecursive(rows);
  }
}));
