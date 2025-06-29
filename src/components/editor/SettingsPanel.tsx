
import React, { useCallback } from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';
import type { 
  EditorBlockData, 
  ImageBlockData, 
  ButtonBlockData,
  HeadingBlockData,
  HtmlBlockData,
  ConditionalLayoutBlockData,
  BlockStyles, 
  ButtonSpecificStyles, 
  ImageElementStyles 
} from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area-simple';
import { Separator } from '@/components/ui/separator';
import {
  TextSettings,
  HeadingSettings,
  HtmlSettings,
  ImageSettings,
  ButtonSettings,
  ConditionalLayoutSettings,
  ContainerStyles,
  DocumentSettings
} from './settings';

const SettingsPanel: React.FC = () => {
  const { 
    selectedBlockId, 
    getBlockById,
    updateBlock, 
    onImageSelect: globalOnImageSelect,
    document: editorDocument,
    updateDocumentSettings,
    placeholders
  } = useEditorStore();
  
  const selectedBlock = selectedBlockId ? getBlockById(selectedBlockId) : null;
  const handleUpdateBlock = useCallback((updates: Partial<EditorBlockData> | { styles?: Partial<BlockStyles>, buttonStyles?: Partial<ButtonSpecificStyles>, imageElementStyles?: Partial<ImageElementStyles> }) => {
    if (selectedBlockId) {
      updateBlock(selectedBlockId, updates);
    }
  }, [selectedBlockId, updateBlock]);
  // No block selected - show document settings
  if (!selectedBlockId || !selectedBlock) {
    return (
      <aside className="w-96 border-l border-gray-200 bg-white flex flex-col shadow-sm">
        <ScrollArea className="flex-1 p-0">
          <div className="shadow-none border-none rounded-none h-full">
            <DocumentSettings 
              settings={editorDocument.settings || {}}
              onUpdate={updateDocumentSettings}
            />
          </div>
        </ScrollArea>
      </aside>
    );
  }
  // Block selected - show block settings and container styles
  const renderBlockSettings = () => {
    switch (selectedBlock.type) {
      case 'text':
        return (
          <TextSettings
            block={selectedBlock}
            onUpdate={handleUpdateBlock}
          />
        );
      case 'heading':
        return (
          <HeadingSettings
            block={selectedBlock as HeadingBlockData}
            onUpdate={handleUpdateBlock}
          />        );      case 'html':
        return (
          <HtmlSettings
            block={selectedBlock as HtmlBlockData}
            onUpdate={handleUpdateBlock}
          />
        );
      case 'image':
        return (
          <ImageSettings
            block={selectedBlock as ImageBlockData}
            onUpdate={handleUpdateBlock}
            onImageSelect={globalOnImageSelect}
          />
        );
      case 'button':
        return (
          <ButtonSettings
            block={selectedBlock as ButtonBlockData}
            onUpdate={handleUpdateBlock}
            onImageSelect={globalOnImageSelect}
          />
        );
      case 'conditionalLayout':
        return (
          <ConditionalLayoutSettings
            block={selectedBlock as ConditionalLayoutBlockData}
            onUpdate={handleUpdateBlock}
            placeholders={placeholders}
          />
        );
      default:
        return null;
    }
  };
  return (
    <aside className="w-96 border-l border-gray-200 bg-white flex flex-col shadow-sm">
      <ScrollArea className="flex-1 p-0">
        <div className="shadow-none border-none rounded-none h-full">
          {renderBlockSettings()}
          {selectedBlock && <Separator className="my-4" />}
          {selectedBlock && (
            <ContainerStyles
              block={selectedBlock}
              onUpdate={handleUpdateBlock}
            />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default SettingsPanel;
