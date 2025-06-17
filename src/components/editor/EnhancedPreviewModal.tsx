import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area-simple';
import type { EditorDocument, Placeholder } from '@/lib/types';
import { generatePreviewHtmlWithMockData } from '@/lib/preview';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RefreshCw,
  Settings,
  Code2,
  Eye,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MockData {
  [key: string]: string;
}

interface PreviewDevice {
  id: 'desktop' | 'tablet' | 'mobile';
  name: string;
  width: number;
  icon: React.ComponentType<any>;
}

interface EnhancedPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: EditorDocument | null;
  placeholders: Placeholder[];
}

const PREVIEW_DEVICES: PreviewDevice[] = [
  { id: 'desktop', name: 'Desktop', width: 600, icon: Monitor },
  { id: 'tablet', name: 'Tablet', width: 480, icon: Tablet },
  { id: 'mobile', name: 'Mobile', width: 320, icon: Smartphone },
];

const EnhancedPreviewModal: React.FC<EnhancedPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  document, 
  placeholders 
}) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [currentDevice, setCurrentDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mockData, setMockData] = useState<MockData>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activePanel, setActivePanel] = useState<'data' | 'code' | 'settings'>('data');

  // Initialize mock data with placeholder defaults
  useEffect(() => {
    if (placeholders.length > 0) {
      const initialMockData: MockData = {};
      placeholders.forEach(placeholder => {
        initialMockData[placeholder.field] = getSampleData(placeholder.field);
      });
      setMockData(initialMockData);
    }
  }, [placeholders]);
  // Generate preview HTML with mock data
  useEffect(() => {
    if (isOpen && document) {
      setIsRefreshing(true);
      
      // Handle async Liquid template processing
      generatePreviewHtmlWithMockData(document, placeholders, mockData)
        .then(html => {
          setPreviewHtml(html);
        })
        .catch(error => {
          console.error('Error generating preview HTML:', error);
          setPreviewHtml('<p>Error generating preview</p>');
        })
        .finally(() => {
          // Simulate loading time for better UX
          setTimeout(() => setIsRefreshing(false), 300);
        });
    }
  }, [isOpen, document, placeholders, mockData]);

  const getSampleData = (field: string): string => {
    const sampleMap: { [key: string]: string } = {
      'firstName': 'John',
      'lastName': 'Doe',
      'email': 'john.doe@example.com',
      'company': 'Acme Corp',
      'phone': '+1 (555) 123-4567',
      'address': '123 Main St',
      'city': 'New York',
      'state': 'NY',
      'zipCode': '10001',
      'country': 'United States',
      'website': 'https://example.com',
      'jobTitle': 'Marketing Manager',
      'department': 'Marketing',
      'username': 'johndoe',
    };

    // Check for nested fields (e.g., user.firstName)
    const lowerField = field.toLowerCase();
    if (sampleMap[lowerField]) {
      return sampleMap[lowerField];
    }

    // Handle nested field patterns
    if (lowerField.includes('name')) return 'John Doe';
    if (lowerField.includes('email')) return 'user@example.com';
    if (lowerField.includes('company')) return 'Sample Company';
    if (lowerField.includes('phone')) return '+1 (555) 123-4567';
    if (lowerField.includes('address')) return '123 Sample Street';
    if (lowerField.includes('url') || lowerField.includes('link')) return 'https://example.com';
    if (lowerField.includes('date')) return new Date().toLocaleDateString();
    if (lowerField.includes('price') || lowerField.includes('amount')) return '$99.99';
    if (lowerField.includes('code') || lowerField.includes('id')) return 'ABC123';
    
    return `[${field}]`; // Fallback to field name in brackets
  };

  const updateMockData = (field: string, value: string) => {
    setMockData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetMockData = () => {
    const resetData: MockData = {};
    placeholders.forEach(placeholder => {
      resetData[placeholder.field] = getSampleData(placeholder.field);
    });
    setMockData(resetData);
  };

  const getCurrentDevice = () => PREVIEW_DEVICES.find(d => d.id === currentDevice) || PREVIEW_DEVICES[0];

  if (!document) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-full h-screen p-0 gap-0">
        <div className="flex h-full bg-gray-50">
          {/* Left Panel - Mock Data & Controls */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Preview Controls</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Panel Navigation */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActivePanel('data')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                    activePanel === 'data' 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <FileText className="h-4 w-4" />
                  Data
                </button>
                <button
                  onClick={() => setActivePanel('code')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                    activePanel === 'code' 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Code2 className="h-4 w-4" />
                  Code
                </button>
                <button
                  onClick={() => setActivePanel('settings')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                    activePanel === 'settings' 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {activePanel === 'data' && (
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Mock Data</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetMockData}
                      className="text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="space-y-4 pr-2">
                      {placeholders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No merge fields available</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Add placeholders to test dynamic content
                          </p>
                        </div>
                      ) : (
                        placeholders.map((placeholder, index) => (
                          <div key={index} className="space-y-2">
                            <Label className="text-xs font-medium text-gray-700">
                              {placeholder.label}
                            </Label>
                            <div className="relative">
                              <Input
                                value={mockData[placeholder.field] || ''}
                                onChange={(e) => updateMockData(placeholder.field, e.target.value)}
                                placeholder={`Enter ${placeholder.label.toLowerCase()}...`}
                                className="text-sm"
                              />
                              <div className="absolute right-2 top-2 text-xs text-gray-400 font-mono">
                                {placeholder.field}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  
                  {placeholders.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Changes update the preview in real-time
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activePanel === 'code' && (
                <div className="p-4 h-full flex flex-col">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Generated HTML</h3>
                  <ScrollArea className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                        {previewHtml ? 
                          previewHtml.substring(0, 2000) + (previewHtml.length > 2000 ? '\n\n... (truncated)' : '')
                          : 'Loading...'
                        }
                      </pre>
                    </div>
                  </ScrollArea>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      HTML is generated with inline styles for email compatibility
                    </p>
                  </div>
                </div>
              )}

              {activePanel === 'settings' && (
                <div className="p-4 h-full flex flex-col">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Preview Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-2 block">
                        Test Conditions
                      </Label>
                      <p className="text-xs text-gray-500 mb-3">
                        Conditional blocks will be evaluated based on mock data values
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">
                            Conditional Logic Active
                          </span>
                        </div>
                        <p className="text-xs text-blue-700">
                          Blocks with conditions will show/hide based on your mock data
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Email Preview */}
          <div className="flex-1 flex flex-col">
            {/* Preview Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold text-gray-900">Email Preview</h1>
                  {isRefreshing && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  )}
                </div>
                
                {/* Device Selection */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                  {PREVIEW_DEVICES.map((device) => {
                    const Icon = device.icon;
                    return (
                      <button
                        key={device.id}
                        onClick={() => setCurrentDevice(device.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                          currentDevice === device.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {device.name}
                        <span className="text-xs text-gray-500">
                          {device.width}px
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
              <div 
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-all duration-300"
                style={{ 
                  width: getCurrentDevice().width,
                  maxWidth: '100%',
                  height: 'calc(100vh - 200px)',
                  maxHeight: '800px'
                }}
              >
                {previewHtml ? (
                  <iframe
                    srcDoc={previewHtml}
                    title={`Email Preview - ${getCurrentDevice().name}`}
                    className="w-full h-full border-0"
                    style={{ backgroundColor: 'white' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                      <p>Loading preview...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Footer */}
            <div className="bg-white border-t border-gray-200 p-3">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <span>
                  Viewing in {getCurrentDevice().name} mode ({getCurrentDevice().width}px width)
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPreviewModal;
