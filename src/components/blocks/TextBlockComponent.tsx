

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { TextBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';
import { Editor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';

interface TextBlockProps {
  block: TextBlockData;
}

const TextBlockComponent: React.FC<TextBlockProps> = ({ block }) => {
  const {
    updateBlock,
    placeholders: availablePlaceholders,
    selectedBlockId,
    setSelectedBlockId,
    document: editorDocument, 
  } = useEditorStore();
  const editorRef = useRef<any>(null); 
  const isSelected = selectedBlockId === block.id;
  const tinyMceApiKey = 'bal6yk2mr5urd0v63ugnz6nr4eolnxcj74actknewv0y295e';

  const [editText, setEditText] = useState<string>(block.content);
  const isEditorFocused = useRef(false);

  useEffect(() => {
    if (!isEditorFocused.current && block.content !== editText) {
      setEditText(block.content);
    }
  }, [block.content, editText]);

  const globalFontFamily = editorDocument.settings?.fontFamily || "'PT Sans', sans-serif";

  const initOptions = useMemo(() => ({
    inline: true, 
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: `
      bold italic underline strikethrough |
      alignleft aligncenter alignright alignjustify |
      bullist numlist outdent indent |
      link image media table | forecolor backcolor | removeformat | fullscreen | help | placeholders
    `,
    content_style: `
      body { font-family: ${globalFontFamily}; font-size:14px; line-height: 1.6; margin: 0; padding: 0;}
      p { margin: 0 0 10px 0; }
      table { border-collapse: collapse; width: 100%; }
      td, th { border: 1px solid #ccc; padding: 8px; }
      .mce-content-body { padding: 10px; } 
    `,
    setup: (editor: any) => {
      editor.ui.registry.addMenuButton('placeholders', {
        text: 'Placeholders',
        fetch: (callback: any) => {
          const items = availablePlaceholders.map((p) => ({
            type: 'menuitem',
            text: p.label,
            onAction: () => {
              editor.insertContent(`{{${p.field}}}`);
            },
          }));
          callback(items);
        },
      });
    },
    convert_urls: false,
    relative_urls: false,
    remove_script_host: false,
    branding: false,
    promotion: false,
    statusbar: false, 
    paste_data_images: true,
    link_default_target: '_blank',
    link_assume_external_targets: 'http',
  }), [availablePlaceholders, globalFontFamily]);

  const blockStyles: React.CSSProperties = {
    padding: block.styles?.padding || (isSelected ? '1px' : '0px'), 
    margin: block.styles?.margin,
    backgroundColor: block.styles?.backgroundColor,
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: globalFontFamily, 
    fontSize: '14px', 
    lineHeight: '1.6', 
  };

  return (
    <div
      className={cn("relative w-full", isSelected && "ring-2 ring-primary")}
      style={blockStyles}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelected) {
          setSelectedBlockId(block.id);
           if (block.content !== editText) {
            setEditText(block.content);
           }
        }
      }}
    >
      {isSelected ? (
        <Editor
          apiKey={tinyMceApiKey}
          onInit={(_evt, editor) => {
            editorRef.current = editor;
          }}
          value={editText} 
          onEditorChange={(content, _editor) => {
            setEditText(content); 
          }}
          onFocus={() => {
            isEditorFocused.current = true;
            setSelectedBlockId(block.id); 
            if (block.content !== editText) {
               setEditText(block.content);
            }
          }}
          onBlur={(_evt, editor) => {
            isEditorFocused.current = false;
            const currentEditorContent = editor.getContent();
            if (block.content !== currentEditorContent) {
              updateBlock(block.id, { content: currentEditorContent });
            }
          }}
          init={initOptions}
        />
      ) : (
        <div
          className={cn(
            "min-h-[20px] w-full prose prose-sm max-w-none dark:prose-invert",
            "font-body" 
          )}
           style={{ 
            // Removed padding: '10px' from here, container style handles padding
           }}
          dangerouslySetInnerHTML={{ __html: block.content || '<p>&nbsp;</p>' }} 
        />
      )}
    </div>
  );
};

export default TextBlockComponent;
