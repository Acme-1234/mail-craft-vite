
export type BlockType = 'text' | 'image' | 'button' | 'conditionalLayout' | 'heading' | 'avatar' | 'divider' | 'spacer' | 'html';

export interface Placeholder {
  label: string;
  field: string;
}

export interface BlockStyles {
  padding?: string; // e.g., "10px", "10px 20px"
  margin?: string;  // e.g., "10px", "10px 0"
  backgroundColor?: string; // e.g., "#FFFFFF", "blue"
  border?: string; // e.g., "1px solid #000000"
  borderRadius?: string; // e.g., "8px"
  textAlign?: 'left' | 'center' | 'right'; // Text alignment
  fontFamily?: string; // Font family
  fontSize?: string; // Font size
  fontWeight?: string; // Font weight
  color?: string; // Text color
  lineHeight?: string; // Line height
}

export interface ButtonSpecificStyles {
  color?: string;
  backgroundColor?: string;
  borderRadius?: string; // Border radius for the button element itself
  padding?: string; // Padding for the button element itself
  fontWeight?: string; // e.g., "normal", "bold", "600"
  fontSize?: string; // e.g., "16px"
  border?: string; // Border for the button element itself, e.g., "1px solid #000000"
}

export interface ImageElementStyles {
  border?: string; // e.g., "2px solid #ff0000"
  borderRadius?: string; // e.g., "12px"
}

// Data for individual blocks
export interface BaseBlockData {
  id: string;
  type: BlockType;
  styles?: BlockStyles; // Styles for the block's container
}

export interface TextBlockData extends BaseBlockData {
  type: 'text';
  content: string; // HTML content or text with {{field}} placeholders
}

export interface ImageBlockData extends BaseBlockData {
  type: 'image';
  src: string;
  alt: string;
  align?: 'left' | 'center' | 'right'; // Alignment of the image within its container
  linkHref?: string; // Optional URL to make the image a link
  imageElementStyles?: ImageElementStyles; // Styles for the <img> element itself
}

export interface ButtonBlockData extends BaseBlockData {
  type: 'button';
  text: string;
  href: string;
  align?: 'left' | 'center' | 'right'; // Alignment of the button's container/wrapper div
  buttonStyles?: ButtonSpecificStyles; // Styles specific to the button HTML element
  imageUrl?: string; // Optional image URL for an icon/image within the button
  imagePosition?: 'left' | 'right' | 'none'; // Position of the image relative to text
}

export interface ConditionalLayoutBlockData extends BaseBlockData {
  type: 'conditionalLayout';
  condition: string; // e.g., "{{ user.is_premium }} == true" or "user.tags contains 'newsletter_subscriber'"
  rows: EditorRow[]; // Nested rows for the content to be rendered if condition is true
}

export interface HeadingBlockData extends BaseBlockData {
  type: 'heading';
  content: string; // HTML content or text with {{field}} placeholders
  level: 1 | 2 | 3 | 4 | 5 | 6; // Heading level (h1, h2, h3, etc.)
  align?: 'left' | 'center' | 'right'; // Text alignment
}

export interface AvatarBlockData extends BaseBlockData {
  type: 'avatar';
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large' | 'custom'; // Predefined sizes or custom
  customSize?: string; // Custom size when size is 'custom' (e.g., "80px")
  shape?: 'circle' | 'square' | 'rounded'; // Avatar shape
  align?: 'left' | 'center' | 'right'; // Alignment within container
  linkHref?: string; // Optional URL to make the avatar a link
}

export interface DividerBlockData extends BaseBlockData {
  type: 'divider';
  thickness?: string; // e.g., "1px", "2px"
  color?: string; // Divider color
  style?: 'solid' | 'dashed' | 'dotted'; // Line style
  width?: string; // Width of the divider (e.g., "100%", "50%")
  align?: 'left' | 'center' | 'right'; // Alignment of the divider
}

export interface SpacerBlockData extends BaseBlockData {
  type: 'spacer';
  height?: string; // Height of the spacer (e.g., "20px", "40px")
}

export interface HtmlBlockData extends BaseBlockData {
  type: 'html';
  content: string; // Raw HTML content
}

export type EditorBlockData = TextBlockData | ImageBlockData | ButtonBlockData | ConditionalLayoutBlockData | HeadingBlockData | AvatarBlockData | DividerBlockData | SpacerBlockData | HtmlBlockData;

export interface EditorColumn {
  id: string;
  span: 4 | 6 | 12; // Represents col-4, col-6, col-12 like spans
  blocks: EditorBlockData[];
  parentId?: string; // ID of the parent ConditionalLayoutBlockData, if nested
}

export interface EditorRow {
  id:string;
  columns: EditorColumn[];
  parentId?: string; // ID of the parent ConditionalLayoutBlockData, if nested
}

export interface DocumentSettings {
  contentWidth?: string; // e.g., "600px"
  backgroundColor?: string; // e.g., "#F0F4F8"
  fontFamily?: string; // e.g., "'Roboto', sans-serif"
}

export interface EditorDocument {
  rows: EditorRow[];
  settings?: DocumentSettings;
}

// For props of EmailEditor component
export interface EmailEditorProps {
  placeholders: Placeholder[];
  onImageSelect: (callback: (imageUrl: string) => void) => void;
  initialDocument?: EditorDocument; // For importing
}

// For the ref exposed by EmailEditor
export interface EmailEditorRef {
  importHtml: (html: string) => void;
  exportHtml: () => string;
  exportJson: () => EditorDocument;
  importJson: (data: EditorDocument) => void;
  clearDocument: () => void;
  getAllLinks: () => string[];
}

// Types for draggable items
export type DraggableItemType = BlockType | 'layout-1-col' | 'layout-2-col' | 'layout-3-col';

export interface DraggableItem {
  type: DraggableItemType;
  // For blocks, this might contain default data
  defaultData?: Partial<EditorBlockData>;
}

// Type for the GenAI placeholder suggestions
export type AISuggestion = Placeholder;
