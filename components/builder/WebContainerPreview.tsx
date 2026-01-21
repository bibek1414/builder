"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { transformFlatMapToWebContainer } from "../../utils/webcontainerUtils";
import { Loader2, AlertCircle } from "lucide-react";
import { WebContainer } from "@webcontainer/api";

import { cn } from "@/lib/utils";

interface WebContainerPreviewProps {
  files: Record<string, string>;
  webContainerInstance: WebContainer | null;
  serverUrl: string;
  isProduction?: boolean;
  isSetupComplete: boolean;
  setIsSetupComplete: (complete: boolean) => void;
  onTerminalError?: (error: string) => void;
}

const WebContainerPreview: React.FC<WebContainerPreviewProps> = ({
  files,
  webContainerInstance,
  serverUrl,
  isProduction = false,
  isSetupComplete,
  setIsSetupComplete,
  onTerminalError,
}) => {
  const [setupError, setSetupError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"mounting" | "installing" | "building" | "starting" | "ready">("mounting");

  // Ref to prevent double setup execution in Concurrent Mode/Strict Mode
  const setupStartedRef = useRef(false);

  // Error scanning logic
  const errorRegex = useRef(/(error:|exception:|failed:|fatal:|syntax failure|build failed|err_|node_modules\/.*\.js:\d+|module not found|cannot find module|uncaught|referenced by the type)/i);
  const errorBuffer = useRef<string>("");
  const errorTimeout = useRef<NodeJS.Timeout | null>(null);

  const scanForErrors = useCallback((text: string) => {
    // Simple buffer to catch split errors (keep last 2000 chars)
    errorBuffer.current += text;
    if (errorBuffer.current.length > 2000) {
      errorBuffer.current = errorBuffer.current.slice(-1000);
    }

    // Check recent text or buffer
    if (errorRegex.current.test(text) || errorRegex.current.test(errorBuffer.current)) {
      // Debounce error reporting
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        if (onTerminalError) {
          onTerminalError(errorBuffer.current);
          errorBuffer.current = "";
        }
      }, 1000);
    }
  }, [onTerminalError]);

  // Initial setup effect
  useEffect(() => {
    async function setupContainer() {
      // Don't start if we're already complete or already started
      if (!webContainerInstance || isSetupComplete || setupStartedRef.current) return;

      // If server is already running, we can skip setup but we should still
      // set the flag so sync logic works.
      if (serverUrl) {
        console.log("🌍 Server already running, skipping setup sequence");
        setIsSetupComplete(true);
        setCurrentStep("ready");
        return;
      }

      // Check if we have the necessary files to start (at least package.json)
      if (!files['package.json'] && !files['/package.json']) {
        console.log("⏳ Waiting for package.json before setup...");
        return;
      }

      setupStartedRef.current = true;
      try {
        setSetupError(null);
        setCurrentStep("mounting");

        // Check if files are already mounted by checking if package.json exists in FS
        let filesMounted = false;
        try {
          // Use absolute path for robustness
          await webContainerInstance.fs.readFile('/package.json');
          filesMounted = true;
          console.log("📄 /package.json found in FS, skipping mount");
        } catch {
          // package.json doesn't exist, need to mount
        }

        if (!filesMounted) {
          // Step 1: Mount files
          console.log("📁 Mounting files to WebContainer...");
          const webContainerFiles = transformFlatMapToWebContainer(files);
          await webContainerInstance.mount(webContainerFiles);
          console.log("✅ Files mounted successfully");
        } else {
          console.log("📁 Files already mounted in this session, skipping...");
        }

        // Check if node_modules exists to skip install
        let dependenciesInstalled = false;
        try {
          const entries = await webContainerInstance.fs.readdir('/', { withFileTypes: true });
          if (entries.some(entry => entry.name === 'node_modules' && entry.isDirectory())) {
            dependenciesInstalled = true;
            console.log("📦 node_modules found in FS, skipping install");
          }
        } catch (e) {
          console.error("Error checking node_modules:", e);
        }

        if (!dependenciesInstalled) {
          // Step 2: Install dependencies
          setCurrentStep("installing");
          console.log("📦 Installing dependencies with pnpm...");

          // Use pnpm as requested
          const installProcess = await webContainerInstance.spawn("pnpm", [
            "install",
            "--prefer-offline",
          ]);

          // Stream install output to terminal
          installProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                console.log(`[pnpm install]: ${data}`); // Optional logging
                scanForErrors(data);
              },
            })
          );

          const installExitCode = await installProcess.exit;

          if (installExitCode !== 0) {
            throw new Error(`Failed to install dependencies. Exit code: ${installExitCode}`);
          }
          console.log("✅ Dependencies installed successfully");
        } else {
          console.log("📦 Dependencies already exist in this session, skipping install...");
        }

        if (isProduction) {
          setCurrentStep("building");
          console.log("🏗️ Building for production...");

          const buildProcess = await webContainerInstance.spawn("pnpm", ["run", "build"]);
          buildProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                console.log(`[build]: ${data}`);
                scanForErrors(data);
              },
            })
          );

          const buildExitCode = await buildProcess.exit;
          if (buildExitCode !== 0) {
            throw new Error(`Build failed with exit code: ${buildExitCode}`);
          }
          console.log("✅ Build complete");
          console.log("🚀 Serving production build...");

          const serveProcess = await webContainerInstance.spawn("pnpm", ["dlx", "serve", "dist"]);
          serveProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                console.log(`[serve]: ${data}`);
                scanForErrors(data);
              },
            })
          );
        } else {
          // Step 3: Start the server
          setCurrentStep("starting");
          console.log("🚀 Starting development server...");

          const startProcess = await webContainerInstance.spawn("pnpm", ["run", "dev"]);
          startProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                // Log and scan
                console.log(`[dev server]: ${data}`);
                scanForErrors(data);
              },
            })
          );
        }

        setIsSetupComplete(true);
        setCurrentStep("ready");

      } catch (err) {
        console.error("Error setting up container:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setSetupError(errorMessage);
        scanForErrors(`Fatal Error: ${errorMessage}`);
        setupStartedRef.current = false; // Allow retry
      }
    }

    setupContainer();
  }, [webContainerInstance, isSetupComplete, isProduction, serverUrl, files, setIsSetupComplete, scanForErrors]);


  // Handle file updates WITHOUT full re-setup
  const prevFilesRef = useRef(files);
  useEffect(() => {
    if (!webContainerInstance || !isSetupComplete) return;

    // Find changed and deleted files
    const changedFiles: Record<string, string> = {};
    const deletedFiles: string[] = [];

    // Check for changes and new files
    Object.keys(files).forEach(path => {
      if (files[path] !== prevFilesRef.current[path]) {
        changedFiles[path] = files[path];
      }
    });

    // Check for deletions
    Object.keys(prevFilesRef.current).forEach(path => {
      if (!(path in files)) {
        deletedFiles.push(path);
      }
    });

    if (Object.keys(changedFiles).length > 0 || deletedFiles.length > 0) {
      console.log("Syncing changes to WebContainer...", {
        updated: Object.keys(changedFiles),
        deleted: deletedFiles
      });

      const sync = async () => {
        // Handle deletions
        for (const path of deletedFiles) {
          try {
            await webContainerInstance.fs.rm(path, { recursive: true });
          } catch (e) {
            console.error(`Failed to delete ${path}:`, e);
          }
        }

        // Handle updates/creations
        for (const [path, content] of Object.entries(changedFiles)) {
          try {
            // Ensure parent directory exists
            const parts = path.split('/');
            if (parts.length > 1) {
              const dirPath = parts.slice(0, -1).join('/');
              await webContainerInstance.fs.mkdir(dirPath, { recursive: true });
            }
            await webContainerInstance.fs.writeFile(path, content);
          } catch (e) {
            console.error(`Failed to write ${path}:`, e);
          }
        }

        prevFilesRef.current = files;
        console.log("Synced changes to WebContainer");
      };

      sync();
    }
  }, [files, webContainerInstance, isSetupComplete]);

  const getStepMessage = () => {
    switch (currentStep) {
      case "mounting": return "Mounting files...";
      case "installing": return "Installing dependencies...";
      case "building": return "Building for production...";
      case "starting": return "Starting development server...";
      case "ready": return "Application ready!";
      default: return "Initializing environment...";
    }
  };

  return (
    <div className={cn(
      "h-full w-full flex flex-col bg-gray-50 transition-all duration-300 ease-in-out relative overflow-hidden"
    )}>
      {!serverUrl ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          {setupError ? (
            <div className="flex flex-col items-center gap-3 p-6 text-center max-w-md">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Setup Failed</h3>
              <p className="text-sm text-gray-500">{setupError}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-medium text-gray-700">{getStepMessage()}</p>
                <p className="text-xs text-gray-400">Please wait while we prepare your environment</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={cn(
          "flex-1 flex flex-col min-h-0 bg-white overflow-hidden relative shadow-sm"
        )}>
          {/* Iframe Preview Container - Clean, no header */}
          <div className={cn(
            "flex-1 relative bg-white overflow-hidden"
          )}>
            <iframe
              src={serverUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
              allow="cross-origin-isolated"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;
