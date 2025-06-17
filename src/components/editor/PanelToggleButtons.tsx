import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';

interface PanelToggleButtonsProps {
  className?: string;
}

const PanelToggleButtons: React.FC<PanelToggleButtonsProps> = ({ className }) => {
  const { ui, toggleLeftPanel, toggleRightPanel } = useEditorStore();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Left Panel Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLeftPanel}
        className={cn(
          "h-9 w-9 p-0 border border-gray-200 bg-white backdrop-blur-sm transition-all duration-200 shadow-md",
          "hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg",
          ui.leftPanel.isCollapsed && "bg-blue-50 border-blue-300"
        )}
        title={ui.leftPanel.isCollapsed ? "Expand Toolbar (Ctrl+[)" : "Collapse Toolbar (Ctrl+[)"}
      >
        {ui.leftPanel.isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Right Panel Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleRightPanel}
        className={cn(
          "h-9 w-9 p-0 border border-gray-200 bg-white backdrop-blur-sm transition-all duration-200 shadow-md",
          "hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg",
          !ui.rightPanel.isVisible && "bg-blue-50 border-blue-300"
        )}
        title={ui.rightPanel.isVisible ? "Hide Settings (Ctrl+])" : "Show Settings (Ctrl+])"}
      >
        {ui.rightPanel.isVisible ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <Settings className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default PanelToggleButtons;
