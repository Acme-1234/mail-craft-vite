
import React, { useEffect, useImperativeHandle, useState, useRef } from 'react';
import type {
  EmailEditorProps,
  EmailEditorRef,
  EditorDocument,
  DraggableItem,
  BlockType,
  ConditionalLayoutBlockData,
} from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';
import { useWindowEditorAPI } from '@/hooks/useWindowEditorAPI';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import SettingsPanel from './SettingsPanel';
import HeaderBranding from './HeaderBranding';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { DragDropProvider } from '@/components/editor/dnd/FriendlyDndProvider';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Download, Upload, ListChecks, Eye, Trash2, FileUp } from 'lucide-react';
import {
  exportDocumentAsHtml,
  exportDocumentAsJson,
} from '@/lib/export';
import { importJsonToDocument, importHtmlToDocument } from '@/lib/import';
import { extractLinksFromDocument } from '@/lib/link-extraction';
import PreviewModal from './PreviewModal'; // Import PreviewModal

const EmailEditor = React.forwardRef<EmailEditorRef, EmailEditorProps>(  ({ placeholders, onImageSelect, initialDocument }, ref) => {    const {
      document,
      setDocument,
      clearDocument,
      setPlaceholders,
      setOnImageSelect,
      addRow,
      addBlock: storeAddBlock,
    } = useEditorStore();    const { getButtonConfig, configure, getBranding } = useWindowEditorAPI();
    const configureRef = useRef(configure);
    const [currentBranding, setCurrentBranding] = useState(getBranding());
    
    configureRef.current = configure;
    
    // Update branding when it changes
    useEffect(() => {
      const newBranding = getBranding();
      setCurrentBranding(newBranding);
    }, [getBranding]);// Debug logging - only run once on mount
    useEffect(() => {
      console.log('EmailEditor mounted, clearDocument:', clearDocument);
      console.log('Document rows count:', document.rows.length);
    }, []); // Empty dependency array

    const [activeDragItem, setActiveDragItem] = useState<DraggableItem | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // State for preview modal

    useEffect(() => {
      setIsClient(true);
    }, []);    useEffect(() => {
      setPlaceholders(placeholders);
    }, [placeholders, setPlaceholders]);

    useEffect(() => {
      if (onImageSelect) {
        setOnImageSelect(() => onImageSelect);
      }
    }, [onImageSelect, setOnImageSelect]);    // Initialize window.editor with props-based configuration
    useEffect(() => {
      const initialConfig = {
        // Set up default image browser if onImageSelect is provided
        ...(onImageSelect && { imageBrowser: () => new Promise<string | null>((resolve) => {
          onImageSelect((imageUrl: string) => resolve(imageUrl));
        })}),
        // Set up placeholders
        ...(placeholders && { loadMergeFiles: () => placeholders }),
      };
      configureRef.current(initialConfig);
    }, [onImageSelect, placeholders]); // Use configureRef to avoid dependency issues

    // PostMessage handling for iframe integration
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        const { type, config, data } = event.data;
          switch (type) {
          case 'CONFIGURE_EDITOR':
            if (config) {
              configureRef.current(config);
            }
            break;
          case 'GET_HTML':
            const html = exportDocumentAsHtml(document);
            event.source?.postMessage({
              type: 'EDITOR_HTML_RESULT',
              html: html
            }, { targetOrigin: event.origin });
            break;
          case 'GET_JSON':
            const json = exportDocumentAsJson(document);
            event.source?.postMessage({
              type: 'EDITOR_JSON_RESULT',
              json: json
            }, { targetOrigin: event.origin });
            break;
          case 'SET_JSON':
            if (data) {
              const newDoc = importJsonToDocument(data);
              setDocument(newDoc);
            }
            break;
          case 'GET_LINKS':
            const links = extractLinksFromDocument(document);
            event.source?.postMessage({
              type: 'EDITOR_LINKS_RESULT',
              links: links
            }, { targetOrigin: event.origin });
            break;
          case 'CLEAR_DOCUMENT':
            clearDocument();
            break;
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Notify parent that editor is ready
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'EDITOR_READY'
        }, '*');
      }

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, [configure, document, setDocument, clearDocument]);useEffect(() => {
      if (initialDocument) {
        setDocument(initialDocument);
      } else {
        if (document.rows.length === 0) {
           addRow({type: 'layout-1-col'});
        }
      }
    }, [initialDocument, setDocument, addRow]); // Removed document.rows.length dependency

    const downloadFile = (content: string, fileName: string, contentType: string) => {
      if (typeof window === 'undefined' || typeof window.document === 'undefined') {
        console.error("Cannot download file: Document object is not available.");
        return;
      }

      const doc = window.document;
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = doc.createElement('a');
      a.href = url;
      a.download = fileName;
      doc.body.appendChild(a);
      a.click();
      doc.body.removeChild(a);
      URL.revokeObjectURL(url);
    };    const handleExportHtml = () => {
      const exportHtmlConfig = getButtonConfig('exportHtml');
      if (exportHtmlConfig.customHandler) {
        exportHtmlConfig.customHandler();
      } else {
        const htmlContent = exportDocumentAsHtml(document);
        downloadFile(htmlContent, 'email.html', 'text/html');
      }
    };

    const handleExportJson = () => {
      const exportJsonConfig = getButtonConfig('exportJson');
      if (exportJsonConfig.customHandler) {
        exportJsonConfig.customHandler();
      } else {
        const jsonContent = exportDocumentAsJson(document);
        downloadFile(JSON.stringify(jsonContent, null, 2), 'email.json', 'application/json');
      }
    };

    const handleClearDocument = () => {
      const clearConfig = getButtonConfig('clear');
      if (clearConfig.customHandler) {
        clearConfig.customHandler();
      } else {
        console.log('Clear button clicked');
        console.log('clearDocument function:', clearDocument);
        console.log('typeof clearDocument:', typeof clearDocument);
        // Temporarily remove confirm dialog for testing
        console.log('Calling clearDocument() directly');
        clearDocument();
        console.log('clearDocument() called');
      }
    };

    const handleImportJson = () => {
      const importJsonConfig = getButtonConfig('importJson');
      if (importJsonConfig.customHandler) {
        importJsonConfig.customHandler();
      } else {
        const input = window.document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e: Event) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const jsonContent = JSON.parse(e.target?.result as string);
                const newDoc = importJsonToDocument(jsonContent);
                setDocument(newDoc);
              } catch (error) {
                alert('Error importing JSON file. Please make sure it\'s a valid email document.');
                console.error('Import error:', error);
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      }
    };

    const handlePreview = () => {
      const previewConfig = getButtonConfig('preview');
      if (previewConfig.customHandler) {
        previewConfig.customHandler();
      } else {
        setIsPreviewModalOpen(true);
      }
    };

    const handleGetLinks = () => {
      const getLinksConfig = getButtonConfig('getLinks');
      if (getLinksConfig.customHandler) {
        getLinksConfig.customHandler();
      } else {
        console.log(extractLinksFromDocument(document));
      }
    };useImperativeHandle(ref, () => ({
      exportHtml: () => exportDocumentAsHtml(document),
      importHtml: (html: string) => {
        const newDoc = importHtmlToDocument(html);
        setDocument(newDoc);
      },
      exportJson: () => exportDocumentAsJson(document),
      importJson: (data: EditorDocument) => {
        const newDoc = importJsonToDocument(data);
        setDocument(newDoc);
      },
      clearDocument: () => clearDocument(),
      getAllLinks: () => extractLinksFromDocument(document),
    }));

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      })
    );

    const handleDragStart = (event: any) => {
      if (event.active.data.current) {
        setActiveDragItem(event.active.data.current as DraggableItem);
      }
    };

    const handleDragEnd = (event: DragEndEvent) => {
      setActiveDragItem(null);
      const { active, over } = event;

      if (!active || !over || !active.data.current) {
        return;
      }

      const draggedItem = active.data.current as DraggableItem;
      const overData = over.data.current as {
        rowId?: string;
        columnId?: string;
        type?: string;
        blockId?: string;
        isCanvas?: boolean;
        parentConditionalBlockId?: string;
      };

      if (draggedItem.type.startsWith('layout-')) {
        if (overData?.isCanvas || overData?.type === 'row') {
           addRow({ type: draggedItem.type as 'layout-1-col' | 'layout-2-col' | 'layout-3-col' }, undefined, overData.parentConditionalBlockId);
        } else if (overData?.type === 'column' && overData.parentConditionalBlockId) {
           addRow({ type: draggedItem.type as 'layout-1-col' | 'layout-2-col' | 'layout-3-col' }, undefined, overData.parentConditionalBlockId);
        }
      } else if (['text', 'image', 'button', 'conditionalLayout'].includes(draggedItem.type)) {
        if (overData?.type === 'column' && overData.columnId && overData.rowId) {
          storeAddBlock(overData.rowId, overData.columnId, draggedItem.type as BlockType, undefined, overData.parentConditionalBlockId);
        } else if (overData?.isCanvas && document.rows.length > 0) {
          const lastRow = document.rows[document.rows.length - 1];
          if (lastRow.columns.length > 0) {
            const lastCol = lastRow.columns[lastRow.columns.length - 1];
            storeAddBlock(lastRow.id, lastCol.id, draggedItem.type as BlockType);
          }
        } else if (overData?.type === 'row' && overData.rowId) {
            const targetRow = document.rows.find(r => r.id === overData.rowId) ||
                              document.rows.flatMap(r => (r.columns.flatMap(c => c.blocks.filter(b => b.type === 'conditionalLayout') as ConditionalLayoutBlockData[]))).flatMap(cb => cb.rows).find(r => r.id === overData.rowId);
            if (targetRow && targetRow.columns.length > 0) {
                storeAddBlock(targetRow.id, targetRow.columns[0].id, draggedItem.type as BlockType, undefined, overData.parentConditionalBlockId);
            }
        }
      }
    };


    return (
      <DndContext id="mailcraft-dnd-context-editor" sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DragDropProvider>
          <div className="flex flex-col h-screen bg-background text-foreground">            <header className="p-4 border-b border-border flex justify-between items-center" style={{ backgroundColor: 'var(--header-bg, hsl(var(--background)))', color: 'var(--header-text, hsl(var(--foreground)))' }}>
              <HeaderBranding branding={currentBranding} />              <div className="flex gap-2">
                {getButtonConfig('preview').isVisible && (
                  <Button variant="outline" size="sm" onClick={handlePreview}>
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Button>
                )}
                {getButtonConfig('importJson').isVisible && (
                  <Button variant="outline" size="sm" onClick={handleImportJson}>
                    <FileUp className="mr-2 h-4 w-4" /> Import JSON
                  </Button>
                )}
                {getButtonConfig('exportJson').isVisible && (
                  <Button variant="outline" size="sm" onClick={handleExportJson}>
                    <Upload className="mr-2 h-4 w-4" /> Export JSON
                  </Button>
                )}
                {getButtonConfig('exportHtml').isVisible && (
                  <Button variant="outline" size="sm" onClick={handleExportHtml}>
                    <Download className="mr-2 h-4 w-4" /> Export HTML
                  </Button>
                )}
                {getButtonConfig('clear').isVisible && (
                  <Button variant="destructive" size="sm" onClick={handleClearDocument}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear
                  </Button>
                )}
                {getButtonConfig('getLinks').isVisible && (
                  <Button variant="outline" size="sm" onClick={handleGetLinks}>
                    <ListChecks className="mr-2 h-4 w-4" /> Get Links
                  </Button>
                )}
              </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
              <Toolbar />
              <Canvas />
              <SettingsPanel />
            </div>
             {isClient && typeof window !== 'undefined' && window.document && window.document.body && createPortal(
              <DragOverlay>
                {activeDragItem ? (
                  <div className="p-2 bg-primary/20 border border-primary rounded-md shadow-lg">
                    Dragging: {activeDragItem.type}
                  </div>
                ) : null}
              </DragOverlay>,
              window.document.body
            )}
          </div>
        </DragDropProvider>
        {isPreviewModalOpen && (
          <PreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            document={document}
            placeholders={placeholders} // Pass the placeholders from EmailEditorProps
          />
        )}
      </DndContext>
    );
  }
);

EmailEditor.displayName = 'EmailEditor';
export default EmailEditor;

    
