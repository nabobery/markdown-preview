// Core types for the Markdown Live Previewer

export interface EditorState {
  content: string;
  cursorPosition: number;
  scrollPosition: number;
}

export interface PreviewState {
  htmlContent: string;
  scrollPosition: number;
}

export interface AppSettings {
  theme: "light" | "dark";
  previewTheme: string;
  fontSize: number;
  showLineNumbers: boolean;
  wordWrap: boolean;
}

export interface MarkdownFile {
  name: string;
  content: string;
  lastModified: Date;
}
