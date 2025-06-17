import { useEffect } from 'react';
import { useEditorStore } from './useEditorStore';

export const useKeyboardShortcuts = () => {
  const { ui, toggleLeftPanel, toggleRightPanel, setDeviceMode, setCanvasZoom } = useEditorStore();

  useEffect(() => {
    if (!ui.preferences.keyboardShortcuts) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true' ||
        target.isContentEditable
      ) {
        return;
      }

      // Check for modifier keys (Ctrl/Cmd)
      const isModifier = event.ctrlKey || event.metaKey;

      if (isModifier) {
        switch (event.key) {
          case '[':
            event.preventDefault();
            toggleLeftPanel();
            break;
          case ']':
            event.preventDefault();
            toggleRightPanel();
            break;
          case '1':
            event.preventDefault();
            setDeviceMode('desktop');
            break;
          case '2':
            event.preventDefault();
            setDeviceMode('tablet');
            break;
          case '3':
            event.preventDefault();
            setDeviceMode('mobile');
            break;
          case '0':
            event.preventDefault();
            setCanvasZoom(1);
            break;
          case '=':
          case '+':
            event.preventDefault();
            const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5];
            const currentIndex = zoomLevels.indexOf(ui.canvas.zoomLevel);
            if (currentIndex < zoomLevels.length - 1) {
              setCanvasZoom(zoomLevels[currentIndex + 1]);
            }
            break;
          case '-':
            event.preventDefault();
            const zoomLevelsMin = [0.5, 0.75, 1, 1.25, 1.5];
            const currentIndexMin = zoomLevelsMin.indexOf(ui.canvas.zoomLevel);
            if (currentIndexMin > 0) {
              setCanvasZoom(zoomLevelsMin[currentIndexMin - 1]);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ui.preferences.keyboardShortcuts, ui.canvas.zoomLevel, toggleLeftPanel, toggleRightPanel, setDeviceMode, setCanvasZoom]);
};
