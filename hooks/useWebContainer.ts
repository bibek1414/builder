import { useState, useEffect, useRef } from "react";
import { WebContainer } from "@webcontainer/api"; // This is a singleton usually? No, api exports WebContainer class.
// Actually @webcontainer/api exports `WebContainer` which has `boot()`.

interface UseWebContainerProps {
  files: Record<string, string>;
}

export const useWebContainer = ({ files }: UseWebContainerProps) => {
  const [instance, setInstance] = useState<WebContainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string>("");
  
  // Ref to track if we've already booted to avoid double boot in strict mode
  const isBooting = useRef(false);

  useEffect(() => {
    async function boot() {
      if (instance || isBooting.current) return;
      
      console.log("🚀 Booting WebContainer...");
      isBooting.current = true;
      try {
        const webcontainer = await WebContainer.boot({
          coep: 'require-corp'
        });
        setInstance(webcontainer);
        
        // Listen for server-ready
        webcontainer.on("server-ready", (port, url) => {
          console.log(`🌍 Server ready at ${url}:${port}`);
          setServerUrl(url);
          // If server is ready, we can assume setup is mostly complete if it was triggered
          // But we'll let the component manage the exact flag.
        });

      } catch (err) {
        console.error("❌ Failed to boot WebContainer:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    boot();
  }, [instance]);

  // Sync files when `files` prop changes
  // ...
  
  return {
    instance,
    isLoading,
    isSetupComplete,
    setIsSetupComplete,
    error,
    serverUrl,
  };
};
