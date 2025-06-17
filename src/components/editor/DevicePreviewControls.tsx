import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ZoomIn, 
  ZoomOut, 
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';

interface DevicePreviewControlsProps {
  className?: string;
}

const DevicePreviewControls: React.FC<DevicePreviewControlsProps> = ({ className }) => {
  const { ui, setDeviceMode, setCanvasZoom, toggleWidthIndicators } = useEditorStore();
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
    { 
      key: 'custom' as const, 
      label: 'Custom', 
      icon: Settings, 
      width: 0, // Will use document width
      description: 'Custom' 
    },
  ];

  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5];
  const handleDeviceChange = (mode: 'desktop' | 'tablet' | 'mobile' | 'custom') => {
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
  };  return (
    <div className={cn(
      "flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm",
      className
    )}>
      {/* Device Mode Buttons */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
        {deviceModes.map(({ key, label, icon: Icon, description }) => (
          <Button
            key={key}
            variant={ui.canvas.deviceMode === key ? "default" : "ghost"}
            size="sm"
            onClick={() => handleDeviceChange(key)}
            className={cn(
              "h-8 px-3 gap-2 text-xs font-medium transition-all duration-200",
              ui.canvas.deviceMode === key 
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
                : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
            )}
            title={`${label} (${description}) - ${key === 'desktop' ? 'Ctrl+1' : key === 'tablet' ? 'Ctrl+2' : key === 'mobile' ? 'Ctrl+3' : key === 'custom' ? 'Ctrl+4' : ''}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{label}</span>
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6 bg-gray-300" />      {/* Zoom Controls */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={ui.canvas.zoomLevel <= zoomLevels[0]}
          className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all duration-200"
          title="Zoom Out (Ctrl+-)"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetZoom}
          className="h-8 px-3 min-w-[60px] text-xs font-mono text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all duration-200"
          title="Reset Zoom (Ctrl+0)"
        >
          {Math.round(ui.canvas.zoomLevel * 100)}%
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={ui.canvas.zoomLevel >= zoomLevels[zoomLevels.length - 1]}
          className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all duration-200"
          title="Zoom In (Ctrl++)"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>      <Separator orientation="vertical" className="h-6 bg-gray-300" />

      {/* Width Indicators Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleWidthIndicators}
        className={cn(
          "h-8 w-8 p-0 transition-all duration-200",
          ui.preferences.showWidthIndicators 
            ? "text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm" 
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-sm"
        )}
        title={ui.preferences.showWidthIndicators ? "Hide Width Indicators" : "Show Width Indicators"}
      >
        {ui.preferences.showWidthIndicators ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>

      {/* Settings Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
        title="Preview Settings"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DevicePreviewControls;
