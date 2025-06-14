import { useEffect, useRef, useCallback } from 'react';
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
    document,
    setDocument,
    clearDocument: storeClearDocument,
    setPlaceholders,
    setOnImageSelect,
  } = useEditorStore();
  
  const configRef = useRef<WindowEditorConfig>({
    // Default configuration - all buttons shown
    showExportHtml: true,
    showExportJson: true,
    showImportJson: true,
    showPreview: true,
    showClear: true,
    showGetLinks: true,
  });

  // Get current HTML
  const getHtml = useCallback(() => {
    return exportDocumentAsHtml(document);
  }, [document]);

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
    return exportDocumentAsJson(document);
  }, [document]);

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
    return extractLinksFromDocument(document);
  }, [document]);

  // Configure the editor
  const configure = useCallback((config: Partial<WindowEditorConfig>) => {
    configRef.current = { ...configRef.current, ...config };
    
    // If a new image browser is provided, update the onImageSelect handler
    if (config.imageBrowser) {
      setOnImageSelect((callback) => {
        config.imageBrowser!()
          .then((imageUrl) => {
            if (imageUrl) {
              callback(imageUrl);
            }
          })
          .catch((error) => {
            console.error('Image browser error:', error);
          });
      });
    }
    
    // If loadMergeFiles is provided, load placeholders
    if (config.loadMergeFiles) {
      Promise.resolve(config.loadMergeFiles())
        .then((mergeFiles) => {
          if (Array.isArray(mergeFiles)) {
            setPlaceholders(mergeFiles);
          }
        })
        .catch((error) => {
          console.error('Error loading merge files:', error);
        });
    }
  }, [setOnImageSelect, setPlaceholders]);

  // Initialize window.editor API
  useEffect(() => {
    const api: WindowEditorAPI = {
      // Configuration
      ...configRef.current,
      
      // Core methods
      getHtml,
      setHtml,
      getJson,
      setJson,
      clearDocument,
      getAllLinks,
      configure,
    };

    window.editor = api;

    // Cleanup on unmount
    return () => {
      delete window.editor;
    };
  }, [getHtml, setHtml, getJson, setJson, clearDocument, getAllLinks, configure]);

  // Helper functions for components to check configuration and get handlers
  const getButtonConfig = useCallback((buttonType: keyof WindowEditorConfig) => {
    const showKey = `show${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}` as keyof WindowEditorConfig;
    const isVisible = configRef.current[showKey] !== false;
    const customHandler = configRef.current[buttonType] as (() => void | Promise<void>) | undefined;
    
    return {
      isVisible,
      customHandler,
    };
  }, []);

  const getImageBrowser = useCallback(() => {
    return configRef.current.imageBrowser;
  }, []);

  const getConfig = useCallback(() => {
    return { ...configRef.current };
  }, []);

  return {
    getButtonConfig,
    getImageBrowser,
    getConfig,
    configure,
  };
};
