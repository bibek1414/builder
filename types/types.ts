export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory" | "folder";
  children?: FileNode[];
}

export interface Message {
  role: 'user' | 'model' | 'ai';
  text?: string;
  content?: string; // For backward compatibility / user request match
  timestamp?: number;
  files_modified?: string[];
}

export type FileMap = Record<string, string>;

export interface ProjectState {
  files: FileMap;
  activeFile: string;
}

export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE',
  SPLIT = 'SPLIT'
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
export interface AuthUser {
  user_id: number;
  email: string;
  store_name: string;
  has_profile: boolean;
  role: string;
  phone_number: string;
  domain: string;
  sub_domain: string;
  has_profile_completed: boolean;
  is_template_account?: boolean;
  first_login: boolean;
  is_onboarding_complete: boolean;
  website_type: string;
}

export interface DecodedToken extends AuthUser {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
}
