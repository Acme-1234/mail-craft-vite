import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ZoomIn, 
  ZoomOut, 
  Settings
} from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';

interface DevicePreviewControlsProps {
  className?: string;
}

const DevicePreviewControls: React.FC<DevicePreviewControlsProps> = ({ className }) => {
  const { ui, setDeviceMode, setCanvasZoom } = useEditorStore();
  
  const deviceModes = [
    { 
      key: 'desktop' as const, 
      label: 'Desktop', 
      icon: Monitor, 
      width: 600,
      description: '600px' 
    },
    { 
      key: 'tablet' as const, 
      label: 'Tablet', 
      icon: Tablet, 
      width: 480,
      description: '480px' 
    },
    { 
      key: 'mobile' as const, 
      label: 'Mobile', 
      icon: Smartphone, 
      width: 320,
      description: '320px' 
    },
  ];

  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5];

  const handleDeviceChange = (mode: 'desktop' | 'tablet' | 'mobile') => {
    setDeviceMode(mode);
  };

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(ui.canvas.zoomLevel);
    if (currentIndex < zoomLevels.length - 1) {
      setCanvasZoom(zoomLevels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(ui.canvas.zoomLevel);
    if (currentIndex > 0) {
      setCanvasZoom(zoomLevels[currentIndex - 1]);
    }
  };

  const handleResetZoom = () => {
    setCanvasZoom(1);
  };

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 bg-background border border-border rounded-lg shadow-sm",
      className
    )}>
      {/* Device Mode Buttons */}
      <div className="flex items-center gap-1">
        {deviceModes.map(({ key, label, icon: Icon, description }) => (
          <Button
            key={key}
            variant={ui.canvas.deviceMode === key ? "default" : "ghost"}
            size="sm"
            onClick={() => handleDeviceChange(key)}
            className={cn(
              "h-8 px-3 gap-2",
              ui.canvas.deviceMode === key && "bg-blue-100 text-blue-900 border-blue-300"
            )}
            title={`${label} (${description}) - Ctrl+${key === 'desktop' ? '1' : key === 'tablet' ? '2' : '3'}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={ui.canvas.zoomLevel <= zoomLevels[0]}
          className="h-8 w-8 p-0"
          title="Zoom Out (Ctrl+-)"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetZoom}
          className="h-8 px-3 min-w-[60px] text-xs font-mono"
          title="Reset Zoom (Ctrl+0)"
        >
          {Math.round(ui.canvas.zoomLevel * 100)}%
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={ui.canvas.zoomLevel >= zoomLevels[zoomLevels.length - 1]}
          className="h-8 w-8 p-0"
          title="Zoom In (Ctrl++)"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Settings Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="Preview Settings"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DevicePreviewControls;
