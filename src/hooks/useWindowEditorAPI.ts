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
    const [config, setConfig] = useState<WindowEditorConfig>({
    // Default configuration - all buttons shown
    showExportHtml: true,
    showExportJson: true,
    showImportJson: true,
    showPreview: true,
    showClear: true,
    showGetLinks: true,
  });
  
  const configRef = useRef<WindowEditorConfig>(config);
  
  // Keep configRef in sync with state
  useEffect(() => {
    configRef.current = config;
  }, [config]);

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
  }, [document]);  // Configure the editor
  const configure = useCallback((newConfig: Partial<WindowEditorConfig>) => {
    setConfig(prevConfig => {
      const updatedConfig = { ...prevConfig, ...newConfig };
      configRef.current = updatedConfig;
      return updatedConfig;
    });
    
    // If a new image browser is provided, update the onImageSelect handler
    if (newConfig.imageBrowser) {
      setOnImageSelect((callback) => {
        newConfig.imageBrowser!()
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
    }
  }, [setOnImageSelect, setPlaceholders]);

  // Initialize window.editor API
  useEffect(() => {    const api: WindowEditorAPI = {
      // Configuration
      ...config,
      
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
  }, [getHtml, setHtml, getJson, setJson, clearDocument, getAllLinks, configure, config]);  // Helper functions for components to check configuration and get handlers
  const getButtonConfig = useCallback((buttonType: keyof WindowEditorConfig) => {
    const showKey = `show${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}` as keyof WindowEditorConfig;
    // Default to true if not explicitly set to false
    const isVisible = config[showKey] !== false;
    const customHandler = config[buttonType] as (() => void | Promise<void>) | undefined;
    
    return {
      isVisible,
      customHandler,
    };
  }, [config]);
  const getImageBrowser = useCallback(() => {
    return config.imageBrowser;
  }, [config]);

  const getConfig = useCallback(() => {
    return { ...config };
  }, [config]);

  return {
    getButtonConfig,
    getImageBrowser,
    getConfig,
    configure,
  };
};
