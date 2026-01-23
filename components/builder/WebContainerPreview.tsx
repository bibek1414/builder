"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { transformFlatMapToWebContainer } from "../../utils/webcontainerUtils";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
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

interface BuildStatus {
  isCompiling: boolean;
  message?: string;
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
  const [currentStep, setCurrentStep] = useState<"mounting" | "installing" | "building" | "starting" | "compiling" | "ready">("mounting");

  // Simple compile status
  const [compileMessage, setCompileMessage] = useState<string>("");

  // Refs
  const setupStartedRef = useRef(false);
  const initialLoadCompleteRef = useRef(false);
  const devProcessRef = useRef<any>(null);
  const errorRegex = useRef(/(error:|exception:|failed:|fatal:|syntax failure|build failed|err_|node_modules\/.*\.js:\d+|module not found|cannot find module|uncaught|referenced by the type)/i);
  const errorBuffer = useRef<string>("");
  const errorTimeout = useRef<NodeJS.Timeout | null>(null);

  // Simple log processor for status updates
  const processLog = useCallback((data: string) => {
    console.log(`[dev server]: ${data}`);

    // Update current step based on logs
    if (data.includes("Compiling /")) {
      // Only show compiling state for initial load, not for subsequent page navigations
      if (!initialLoadCompleteRef.current) {
        setCurrentStep("compiling");
        setCompileMessage("Compiling application...");
      }
    }

    if (data.includes("Compiled /") || data.includes("Compiled in")) {
      initialLoadCompleteRef.current = true;

      // Extract time if available
      const timeMatch = data.match(/in\s+([\d.]+(s|ms))/);
      if (timeMatch) {
        setCompileMessage(`Compiled in ${timeMatch[1]}`);
      } else {
        setCompileMessage("Compilation complete");
      }

      // Keep showing compile message for 3 seconds, then go back to ready
      setTimeout(() => {
        setCurrentStep("ready");
        setCompileMessage("");
      }, 3000);
    }

    if (data.includes("[Fast Refresh] rebuilding")) {
      // Optional: decide if we want to show hot reload. 
      // Logic suggests hiding it if we want to be less intrusive, 
      // but hot reload usually updates in place without overlay.
      // If the overlay checks currentStep === 'compiling', and we set it here, it will show.
      // User asked "only on the first load".
      if (!initialLoadCompleteRef.current) {
        setCurrentStep("compiling");
        setCompileMessage("Hot reloading...");
      }
    }

    if (data.includes("[Fast Refresh] done")) {
      const timeMatch = data.match(/done in ([\d.]+ms)/);
      if (timeMatch) {
        setCompileMessage(`Hot reloaded in ${timeMatch[1]}`);
      } else {
        setCompileMessage("Hot reload complete");
      }

      setTimeout(() => {
        setCurrentStep("ready");
        setCompileMessage("");
      }, 2000);
    }

    if (data.includes("Ready in")) {
      initialLoadCompleteRef.current = true;
      const timeMatch = data.match(/Ready in\s+([\d.]+s)/);
      if (timeMatch) {
        setCompileMessage(`Ready in ${timeMatch[1]}`);
      }
    }

    // Error handling
    if (errorRegex.current.test(data)) {
      errorBuffer.current += data;
      if (errorBuffer.current.length > 2000) {
        errorBuffer.current = errorBuffer.current.slice(-1000);
      }

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
      if (!webContainerInstance || isSetupComplete || setupStartedRef.current) return;

      if (serverUrl) {
        console.log("🌍 Server already running, skipping setup sequence");
        setIsSetupComplete(true);
        setCurrentStep("ready");
        initialLoadCompleteRef.current = true;
        return;
      }

      if (!files['package.json'] && !files['/package.json']) {
        console.log("⏳ Waiting for package.json before setup...");
        return;
      }

      setupStartedRef.current = true;
      initialLoadCompleteRef.current = false;
      try {
        setSetupError(null);
        setCurrentStep("mounting");

        // Mount files
        let filesMounted = false;
        try {
          await webContainerInstance.fs.readFile('/package.json');
          filesMounted = true;
          console.log("📄 /package.json found in FS, skipping mount");
        } catch { }

        if (!filesMounted) {
          console.log("📁 Mounting files to WebContainer...");
          const webContainerFiles = transformFlatMapToWebContainer(files);
          await webContainerInstance.mount(webContainerFiles);
          console.log("✅ Files mounted successfully");
        } else {
          console.log("📁 Files already mounted in this session, skipping...");
        }

        // Install dependencies
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
          setCurrentStep("installing");
          console.log("📦 Installing dependencies with pnpm...");

          const installProcess = await webContainerInstance.spawn("pnpm", [
            "install",
            "--prefer-offline",
          ]);

          installProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                console.log(`[pnpm install]: ${data}`);
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

        // Build or start
        if (isProduction) {
          setCurrentStep("building");
          console.log("🏗️ Building for production...");

          const buildProcess = await webContainerInstance.spawn("pnpm", ["run", "build"]);
          buildProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                console.log(`[build]: ${data}`);
                processLog(data);
              },
            })
          );

          const buildExitCode = await buildProcess.exit;
          if (buildExitCode !== 0) {
            throw new Error(`Build failed with exit code: ${buildExitCode}`);
          }
          console.log("✅ Build complete");

          const serveProcess = await webContainerInstance.spawn("pnpm", ["dlx", "serve", "dist"]);
          serveProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                console.log(`[serve]: ${data}`);
              },
            })
          );
        } else {
          setCurrentStep("starting");
          console.log("🚀 Starting development server...");

          const startProcess = await webContainerInstance.spawn("pnpm", ["run", "dev"]);
          devProcessRef.current = startProcess;

          startProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                processLog(data);
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
        setupStartedRef.current = false;
      }
    }

    setupContainer();
  }, [webContainerInstance, isSetupComplete, isProduction, serverUrl, files, setIsSetupComplete, processLog]);

  // File sync effect
  const prevFilesRef = useRef(files);
  useEffect(() => {
    if (!webContainerInstance || !isSetupComplete) return;

    const changedFiles: Record<string, string> = {};
    const deletedFiles: string[] = [];

    Object.keys(files).forEach(path => {
      if (files[path] !== prevFilesRef.current[path]) {
        changedFiles[path] = files[path];
      }
    });

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

      // Show compiling status when files change
      if (Object.keys(changedFiles).length > 0) {
        setCurrentStep("compiling");
        setCompileMessage("Detected file changes. Recompiling...");
      }

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
      case "compiling": return compileMessage || "Compiling...";
      case "ready": return compileMessage || "Application ready!";
      default: return "Initializing environment...";
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case "mounting":
      case "installing":
      case "building":
      case "starting":
      case "compiling":
        return <div className="h-12 w-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />;
      case "ready":
        return (
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        );
      default:
        return <div className="h-12 w-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />;
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
              {getStepIcon()}
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-medium text-gray-700">{getStepMessage()}</p>
                <p className="text-xs text-gray-400">Please wait while we prepare your environment</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={cn(
          "flex-1 flex flex-col min-h-0 bg-white overflow-hidden relative "
        )}>
          {/* Simple status overlay for compiling */}
          {currentStep === "compiling" && (
            <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6  flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium text-gray-700">{compileMessage}</p>
                  <p className="text-xs text-gray-400">Please wait...</p>
                </div>
              </div>
            </div>
          )}

          {/* Iframe Preview Container */}
          <div className="flex-1 relative bg-white overflow-hidden">
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