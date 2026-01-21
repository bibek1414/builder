"use client";

import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import WebContainerPreview from './WebContainerPreview';

interface CodePreviewProps {
  files: Record<string, string>;
  activeFile: string;
  webContainerState: {
    instance: any;
    isLoading: boolean;
    isSetupComplete: boolean;
    setIsSetupComplete: (complete: boolean) => void;
    error: string | null;
    serverUrl: string;
  };
  isProduction?: boolean;
  onTerminalError?: (error: string) => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  files,
  webContainerState,
  isProduction = false,
  onTerminalError,
}) => {
  const {
    instance,
    isLoading,
    isSetupComplete,
    setIsSetupComplete,
    error,
    serverUrl
  } = webContainerState;

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
        <p className="text-gray-600 font-medium">Booting WebContainer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-6">
        <AlertCircle className="text-red-600 w-12 h-12 mb-4" />
        <h3 className="text-lg font-bold text-red-700 mb-2">Failed to start WebContainer</h3>
        <p className="text-red-600 text-center">{error}</p>
        <p className="text-gray-500 text-sm mt-4 max-w-md text-center">
          Note: WebContainer requires a secure context (HTTPS) and specific headers (COOP/COEP) to function correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white relative  overflow-hidden flex flex-col">
      <WebContainerPreview
        files={files}
        webContainerInstance={instance}
        serverUrl={serverUrl}
        isProduction={isProduction}
        isSetupComplete={isSetupComplete}
        setIsSetupComplete={setIsSetupComplete}
        onTerminalError={onTerminalError}
      />
    </div>
  );
};