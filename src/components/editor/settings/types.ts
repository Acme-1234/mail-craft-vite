import type { EditorBlockData, ImageBlockData, ButtonBlockData, ConditionalLayoutBlockData, BlockStyles } from '@/lib/types';

export interface BaseSettingsProps {
  block: EditorBlockData;
  onUpdate: (updates: Partial<EditorBlockData>) => void;
}

export interface TextSettingsProps extends BaseSettingsProps {
  block: EditorBlockData & { type: 'text' };
}

export interface ImageSettingsProps extends BaseSettingsProps {
  block: ImageBlockData;
  onImageSelect?: (callback: (imageUrl: string) => void) => void;
}

export interface ButtonSettingsProps extends BaseSettingsProps {
  block: ButtonBlockData;
  onImageSelect?: (callback: (imageUrl: string) => void) => void;
}

export interface ConditionalLayoutSettingsProps extends BaseSettingsProps {
  block: ConditionalLayoutBlockData;
  placeholders?: Array<{ label: string; field: string }>;
}

export interface ContainerStylesProps {
  block: EditorBlockData;
  onUpdate: (updates: { styles?: Partial<BlockStyles> }) => void;
}

export interface DocumentSettingsProps {
  settings: any;
  onUpdate: (settings: any) => void;
}
