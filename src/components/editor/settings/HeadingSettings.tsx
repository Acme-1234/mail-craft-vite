import React, { useState, useRef, useEffect } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Heading1, Plus, Search } from 'lucide-react';
import type { HeadingSettingsProps } from './types';
import { useEditorStore } from '@/hooks/useEditorStore';

const HeadingSettings: React.FC<HeadingSettingsProps> = ({ block, onUpdate }) => {
  const { placeholders } = useEditorStore();
  const [content, setContent] = useState(block.content);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaceholderPopoverOpen, setIsPlaceholderPopoverOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [content, block.content, onUpdate]);

  // Filter placeholders based on search term
  const filteredPlaceholders = placeholders.filter(placeholder =>
    placeholder.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    placeholder.field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Insert placeholder at cursor position
  const insertPlaceholder = (placeholder: { field: string; label: string }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const placeholderText = `{{${placeholder.field}}}`;
    
    const newContent = content.substring(0, start) + placeholderText + content.substring(end);
    setContent(newContent);
    
    // Focus back to textarea and set cursor after inserted placeholder
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + placeholderText.length, start + placeholderText.length);
    }, 0);
    
    setIsPlaceholderPopoverOpen(false);
    setSearchTerm('');
  };
  const handleLevelChange = (value: string) => {
    const level = parseInt(value) as 1 | 2 | 3 | 4;
    onUpdate({ level });
  };

  const handleAlignChange = (value: string) => {
    const align = value as 'left' | 'center' | 'right';
    onUpdate({ align });
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <Heading1 className="h-5 w-5" /> Heading Block
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heading Level Selection */}
        <div className="space-y-2">
          <Label htmlFor="heading-level">Heading Level</Label>
          <Select value={block.level.toString()} onValueChange={handleLevelChange}>
            <SelectTrigger id="heading-level">
              <SelectValue placeholder="Select heading level" />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="1">H1 - Main Title</SelectItem>
              <SelectItem value="2">H2 - Section Title</SelectItem>
              <SelectItem value="3">H3 - Subsection</SelectItem>
              <SelectItem value="4">H4 - Minor Heading</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose the semantic importance of your heading
          </p>
        </div>

        {/* Text Alignment */}
        <div className="space-y-2">
          <Label htmlFor="heading-align">Text Alignment</Label>
          <Select value={block.align || 'left'} onValueChange={handleAlignChange}>
            <SelectTrigger id="heading-align">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="heading-content">Heading Content</Label>
            <Popover open={isPlaceholderPopoverOpen} onOpenChange={setIsPlaceholderPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Placeholder
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Insert Placeholder</h4>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search placeholders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredPlaceholders.length > 0 ? (
                      <div className="space-y-1">
                        {filteredPlaceholders.map((placeholder) => (
                          <div
                            key={placeholder.field}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => insertPlaceholder(placeholder)}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{placeholder.label}</p>
                              <p className="text-xs text-muted-foreground">{placeholder.field}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {`{{${placeholder.field}}}`}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No placeholders found</p>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Textarea
            ref={textareaRef}
            id="heading-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your heading text here..."
            className="min-h-[80px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Use placeholders like <code className="text-xs bg-muted px-1 rounded">{`{{user.name}}`}</code> for dynamic content
          </p>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="p-3 border rounded-md bg-background">
            {React.createElement(
              `h${block.level}`,
              {
                style: {
                  margin: 0,
                  textAlign: block.align || 'left',
                  fontSize: getHeadingSize(block.level),
                  fontWeight: getHeadingWeight(block.level),
                  lineHeight: '1.2',
                },
                dangerouslySetInnerHTML: { __html: content || 'Your heading preview' }
              }
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="p-3 bg-muted/30 rounded text-xs space-y-1">
          <p><strong>Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Use H1 for main page titles, H2-H6 for subsections</li>
            <li>Placeholders will be replaced with actual data in the final email</li>
            <li>Keep headings concise and descriptive</li>
          </ul>
        </div>
      </CardContent>
    </>
  );
};

// Helper functions
function getHeadingSize(level: number): string {
  const sizes = {
    1: '32px',
    2: '28px',
    3: '24px',
    4: '20px',
  };
  return sizes[level as keyof typeof sizes] || '20px';
}

function getHeadingWeight(level: number): string {
  const weights = {
    1: '700',
    2: '700',
    3: '600',
    4: '600',
  };
  return weights[level as keyof typeof weights] || '600';
}

export default HeadingSettings;
