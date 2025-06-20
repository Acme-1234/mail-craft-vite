import { useEffect, useRef, useCallback, useState } from 'react';
import { useEditorStore } from './useEditorStore';
import { exportDocumentAsHtml, exportDocumentAsJson } from '@/lib/export';
import { importJsonToDocument, importHtmlToDocument } from '@/lib/import';
import { extractLinksFromDocument } from '@/lib/link-extraction';
import type { EditorDocument } from '@/lib/types';

// Types for the window.editor API
export interface WindowEditorConfig {
  // Button visibility configuration
  showExportHtml?: boolean;
  showExportJson?: boolean;
  showImportJson?: boolean;
  showPreview?: boolean;
  showClear?: boolean;
  showGetLinks?: boolean;
  
  // Custom button handlers (if provided, will override default behavior)
  exportHtml?: () => void | Promise<void>;
  exportJson?: () => void | Promise<void>;
  importJson?: () => void | Promise<void>;
  preview?: () => void | Promise<void>;
  clear?: () => void | Promise<void>;
  getLinks?: () => void | Promise<void>;
  
  // Image browser integration (Promise-based)
  imageBrowser?: () => Promise<string | null>;
  
  // Merge files / placeholders
  loadMergeFiles?: () => Promise<any[]> | any[];
  
  // Branding and theming (NEW)
  branding?: {
    title?: string;                    // Replace "Mailcraft" with custom title
    logoUrl?: string;                  // Custom logo image URL
    logoAlt?: string;                  // Alt text for logo
    hideTitle?: boolean;               // Hide title when using logo
    customHeaderContent?: string;      // Custom HTML content for header
  };
  
  theme?: {
    mode?: 'light' | 'dark' | 'auto';  // Theme mode
    primaryColor?: string;             // Primary brand color
    backgroundColor?: string;          // Background color
    headerBackgroundColor?: string;    // Header background
    headerTextColor?: string;          // Header text color
    borderColor?: string;              // Border colors
    customCSS?: string;                // Custom CSS styles
  };
}

export interface WindowEditorAPI extends WindowEditorConfig {
  // Direct export/import methods
  getHtml: () => string;
  setHtml: (html: string) => void;
  getJson: () => EditorDocument;
  setJson: (data: EditorDocument) => void;
  clearDocument: () => void;
  getAllLinks: () => string[];
  
  // Configuration methods
  configure: (config: Partial<WindowEditorConfig>) => void;
}

declare global {
  interface Window {
    editor?: WindowEditorAPI;
  }
}

export const useWindowEditorAPI = () => {
  const {
    document: editorDocument,
    setDocument,
    clearDocument: storeClearDocument,
    setPlaceholders,
    setOnImageSelect,
  } = useEditorStore();
    // Start with empty config - will be populated from window.editor
  const [config, setConfig] = useState<WindowEditorConfig>({});
  
  const configRef = useRef<WindowEditorConfig>(config);
  
  // Keep configRef in sync with state
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Initialize from window.editor if it exists
  useEffect(() => {
    const initializeFromWindow = () => {
      if (window.editor && typeof window.editor === 'object') {
        // Extract config from existing window.editor
        const externalConfig: WindowEditorConfig = {
          showExportHtml: window.editor.showExportHtml,
          showExportJson: window.editor.showExportJson,
          showImportJson: window.editor.showImportJson,
          showPreview: window.editor.showPreview,
          showClear: window.editor.showClear,
          showGetLinks: window.editor.showGetLinks,
          exportHtml: window.editor.exportHtml,
          exportJson: window.editor.exportJson,
          importJson: window.editor.importJson,
          preview: window.editor.preview,
          clear: window.editor.clear,
          getLinks: window.editor.getLinks,
          imageBrowser: window.editor.imageBrowser,
          loadMergeFiles: window.editor.loadMergeFiles,
          branding: window.editor.branding,
          theme: window.editor.theme,
        };
          // Filter out undefined values
        const cleanConfig = Object.fromEntries(
          Object.entries(externalConfig).filter(([_, value]) => value !== undefined)
        ) as WindowEditorConfig;
          console.log('cleanConfig.imageBrowser:', typeof cleanConfig.imageBrowser, cleanConfig.imageBrowser?.toString().substring(0, 200));
        setConfig(cleanConfig);
        
        // Apply initial configuration
        // Don't wrap the imageBrowser function, just keep the original
        
        if (cleanConfig.loadMergeFiles) {
          Promise.resolve(cleanConfig.loadMergeFiles())
            .then((mergeFiles) => {
              if (Array.isArray(mergeFiles)) {
                setPlaceholders(mergeFiles);
              }
            })
            .catch((error) => {
              console.error('Error loading merge files:', error);
            });
        }
          if (cleanConfig.theme) {
          applyTheme(cleanConfig.theme);
        }
      } else {
        // No external config, use defaults    
        setConfig({
          showExportHtml: true,
          showExportJson: true,
          showImportJson: true,
          showPreview: true,
          showClear: true,
          showGetLinks: true,
        });
      }
    };

    // Try to initialize immediately
    initializeFromWindow();
    
    // Also listen for delayed initialization
    const timeoutId = setTimeout(initializeFromWindow, 100);
      return () => clearTimeout(timeoutId);
  }, [setOnImageSelect, setPlaceholders]); // Remove applyTheme dependency for now

  // Theme application function
  const applyTheme = useCallback((theme: NonNullable<WindowEditorConfig['theme']>) => {
    const root = document.documentElement;
    
    // Handle theme mode
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else if (theme.mode === 'light') {
      root.classList.remove('dark');
    } else if (theme.mode === 'auto') {
      // Auto mode: follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Apply custom colors via CSS variables
    if (theme.primaryColor) {
      root.style.setProperty('--color-primary', theme.primaryColor);
    }
    if (theme.backgroundColor) {
      root.style.setProperty('--color-bg', theme.backgroundColor);
    }
    if (theme.headerBackgroundColor) {
      root.style.setProperty('--header-bg', theme.headerBackgroundColor);
    }
    if (theme.headerTextColor) {
      root.style.setProperty('--header-text', theme.headerTextColor);
    }
    if (theme.borderColor) {
      root.style.setProperty('--color-border', theme.borderColor);
    }
    
    // Apply custom CSS
    if (theme.customCSS) {
      let customStyleElement = document.getElementById('mailcraft-custom-styles');
      if (!customStyleElement) {
        customStyleElement = document.createElement('style');
        customStyleElement.id = 'mailcraft-custom-styles';
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = theme.customCSS;
    }
  }, []);
  // Get current HTML
  const getHtml = useCallback(() => {
    return exportDocumentAsHtml(editorDocument);
  }, [editorDocument]);

  // Set HTML content
  const setHtml = useCallback((html: string) => {
    try {
      const newDoc = importHtmlToDocument(html);
      setDocument(newDoc);
    } catch (error) {
      console.error('Error importing HTML:', error);
      throw error;
    }
  }, [setDocument]);

  // Get current JSON
  const getJson = useCallback(() => {
    return exportDocumentAsJson(editorDocument);
  }, [editorDocument]);

  // Set JSON content
  const setJson = useCallback((data: EditorDocument) => {
    try {
      const newDoc = importJsonToDocument(data);
      setDocument(newDoc);
    } catch (error) {
      console.error('Error importing JSON:', error);
      throw error;
    }
  }, [setDocument]);

  // Clear document
  const clearDocument = useCallback(() => {
    storeClearDocument();
  }, [storeClearDocument]);

  // Get all links
  const getAllLinks = useCallback(() => {
    return extractLinksFromDocument(editorDocument);
  }, [editorDocument]);// Configure the editor
  const configure = useCallback((newConfig: Partial<WindowEditorConfig>) => {
    setConfig(prevConfig => {
      const updatedConfig = { ...prevConfig, ...newConfig };
      configRef.current = updatedConfig;
      
      // Apply theme changes
      if (newConfig.theme) {
        applyTheme(newConfig.theme);
      }
      
      return updatedConfig;
    });
      // If a new image browser is provided, don't wrap it
    // if (newConfig.imageBrowser) {
    //   setOnImageSelect((callback) => {
    //     newConfig.imageBrowser!()
    //       .then((imageUrl) => {
    //         if (imageUrl) {
    //           callback(imageUrl);
    //         }
    //       })
    //       .catch((error) => {
    //         console.error('Image browser error:', error);
    //       });
    //   });
    // }
    
    // If loadMergeFiles is provided, load placeholders
    if (newConfig.loadMergeFiles) {
      Promise.resolve(newConfig.loadMergeFiles())
        .then((mergeFiles) => {
          if (Array.isArray(mergeFiles)) {
            setPlaceholders(mergeFiles);
          }
        })
        .catch((error) => {
          console.error('Error loading merge files:', error);
        });
    }  }, [setOnImageSelect, setPlaceholders, applyTheme]);  // Initialize window.editor API
  useEffect(() => {
    // Save the original window.editor before we modify it
    const originalEditor = window.editor ? { ...window.editor } : {};
    
    const api: WindowEditorAPI = {
      // Configuration - preserve original config and overlay our current config
      ...originalEditor,
      ...config,
      
      // Core methods
      getHtml,
      setHtml,
      getJson,
      setJson,
      clearDocument,
      getAllLinks,
      configure,
    };    // Set the complete API
    window.editor = api;

    console.log('Window.editor API initialized:', Object.keys(window.editor));
    console.log('imageBrowser function exists:', typeof window.editor.imageBrowser);
    console.log('originalEditor had imageBrowser:', typeof (originalEditor as any).imageBrowser);

    // Cleanup on unmount
    return () => {
      // Don't delete window.editor completely as external code might rely on it
      // Just remove our methods
      if (window.editor && typeof window.editor === 'object') {
        delete (window.editor as any).getHtml;
        delete (window.editor as any).setHtml;
        delete (window.editor as any).getJson;
        delete (window.editor as any).setJson;
        delete (window.editor as any).clearDocument;
        delete (window.editor as any).getAllLinks;
        delete (window.editor as any).configure;
      }
    };
  }, [getHtml, setHtml, getJson, setJson, clearDocument, getAllLinks, configure, config]);// Helper functions for components to check configuration and get handlers
  const getButtonConfig = useCallback((buttonType: string) => {
    // Fix the property name mapping
    const showKey = `show${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}` as keyof WindowEditorConfig;
    
    // Default to true if not explicitly set to false, but respect false values
    const isVisible = config[showKey] !== false;
    
    // Get custom handler
    const handlerKey = buttonType as keyof WindowEditorConfig;
    const customHandler = config[handlerKey] as (() => void | Promise<void>) | undefined;
    
    return {
      isVisible,
      customHandler,
    };
  }, [config]);  const getImageBrowser = useCallback(() => {
    console.log('getImageBrowser called, using window.editor.imageBrowser directly');
    return window.editor?.imageBrowser;
  }, []);
  const getConfig = useCallback(() => {
    return { ...config };
  }, [config]);

  const getBranding = useCallback(() => {
    return config.branding;
  }, [config]);

  const getTheme = useCallback(() => {
    return config.theme;
  }, [config]);

  return {
    getButtonConfig,
    getImageBrowser,
    getConfig,
    getBranding,
    getTheme,
    configure,
  };
};
