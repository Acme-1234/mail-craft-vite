import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { TextBlockData } from '@/lib/types';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';
import { Editor } from '@tinymce/tinymce-react';

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
    inline: false,
    menubar: false,
    toolbar: 'bold italic underline alignleft aligncenter alignright bullist numlist link placeholders',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'charmap',
      'anchor', 'searchreplace', 'wordcount'
    ],
    toolbar_mode: 'wrap',
    toolbar_sticky: false,
    toolbar_persist: true,
    height: 200,
    min_height: 120,
    content_style: 
      'body { font-family: ' + globalFontFamily + '; font-size: 14px; line-height: 1.6; margin: 8px; padding: 8px; min-height: 60px; background: white; color: #333; } ' +
      'p { margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; }',
    setup: (editor: any) => {
      editor.ui.registry.addMenuButton('placeholders', {
        text: 'Placeholders',
        icon: 'code-sample',
        fetch: (callback: any) => {
          const items = availablePlaceholders.map((p) => ({
            type: 'menuitem',
            text: p.label + ' ({{' + p.field + '}})',
            onAction: () => {
              editor.insertContent('{{ ' + p.field + ' }}');
            },
          }));
          callback(items);
        },
      });
      
      editor.on('init', () => {
        setTimeout(() => {
          const container = editor.getContainer();
          if (container) {
            const toolbars = container.querySelectorAll('.tox-toolbar, .tox-toolbar-overlord, .mce-toolbar-grp, .mce-toolbar');
            toolbars.forEach((toolbar: Element) => {
              const toolbarEl = toolbar as HTMLElement;
              toolbarEl.style.zIndex = '9999';
              toolbarEl.style.position = 'relative';
              toolbarEl.style.visibility = 'visible';
              toolbarEl.style.display = 'block';
            });
          }
        }, 50);
      });
    },
    object_resizing: false,
    resize: false,
    elementpath: false,
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
    position: 'relative',
    zIndex: 1,
  };

  const toolbarStyles = `
    .tox-toolbar-overlord,
    .tox-toolbar,
    .tox-editor-header,
    .mce-toolbar-grp,
    .mce-toolbar {
      z-index: 10000 !important;
      position: relative !important;
      visibility: visible !important;
      display: block !important;
    }
    .tox-editor-header,
    .tox-toolbar-overlord,
    .mce-toolbar-grp {
      background: white !important;
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      margin-bottom: 4px !important;
    }
    .tox-tinymce {
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
    }
  `;

  return (
    <div
      className={cn(
        "relative w-full transition-all duration-200", 
        isSelected && "ring-2 ring-primary ring-offset-1"
      )}
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
      {isSelected && (
        <style dangerouslySetInnerHTML={{ __html: toolbarStyles }} />
      )}
      
      {isSelected ? (
        <div className="relative" style={{ zIndex: 2 }}>
          <Editor
            apiKey={tinyMceApiKey}
            onInit={(_evt, editor) => {
              editorRef.current = editor;
              setTimeout(() => {
                editor.focus();
              }, 100);
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
        </div>
      ) : (
        <div
          className={cn(
            "min-h-[20px] w-full prose prose-sm max-w-none dark:prose-invert",
            "font-body cursor-pointer" 
          )}
          style={{ 
            fontFamily: globalFontFamily,
            fontSize: '14px',
            lineHeight: '1.6',
            padding: '8px',
          }}
          dangerouslySetInnerHTML={{ __html: editText || 'Type your text here...' }}
        />
      )}
    </div>
  );
};

export default TextBlockComponent;
