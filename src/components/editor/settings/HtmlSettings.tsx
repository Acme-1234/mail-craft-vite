import React, { useState, useRef, useEffect } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Code2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type { HtmlSettingsProps } from './types';

const HtmlSettings: React.FC<HtmlSettingsProps> = ({ block, onUpdate }) => {
  const [content, setContent] = useState(block.content);
  const editorRef = useRef<any>(null);

  // Update content when block changes
  useEffect(() => {
    setContent(block.content);
  }, [block.content]);

  // Save content when user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content !== block.content) {
        onUpdate({ content });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [content, block.content, onUpdate]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const insertTemplate = (templateContent: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      const operation = {
        range: selection,
        text: templateContent,
        forceMoveMarkers: true,
      };
      editorRef.current.executeEdits('insert-template', [operation]);
    }
  };

  const templates = [
    {
      name: 'Basic',
      content: '<div style="padding: 20px; font-family: Arial, sans-serif;">\n  <h2>Your Content Here</h2>\n  <p>Add your text content here.</p>\n</div>'
    },
    {
      name: 'Button',
      content: '<div style="text-align: center; padding: 20px;">\n  <a href="#" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Click Me</a>\n</div>'
    },
    {
      name: 'Card',
      content: '<div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 10px 0; background-color: #f9f9f9;">\n  <h3 style="margin-top: 0;">Card Title</h3>\n  <p>Card content goes here.</p>\n</div>'
    }
  ];

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          HTML Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Quick Templates</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {templates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                size="sm"
                onClick={() => insertTemplate(template.content)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">HTML Content</Label>
          <div className="mt-2 border rounded-md overflow-hidden">
            <Editor
              height="300px"
              language="html"
              value={content}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                theme: 'vs-light'
              }}
            />
          </div>
        </div>

        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <p><strong>Tip:</strong> Use inline styles for best email client compatibility. The canvas will show your changes in real-time.</p>
        </div>
      </CardContent>
    </>
  );
};

export default HtmlSettings;
