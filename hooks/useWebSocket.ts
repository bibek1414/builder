import { useState, useEffect, useRef, useCallback } from "react";
import type { FileNode } from "../types/types";
import { siteConfig } from "@/config/site";
interface WebSocketMessage {
  action: string;
  items?: FileNode[];
  path?: string;
  content?: string;
  error?: string;
  message?: string;
  status_type?: "info" | "loading" | "success" | "error";
  repo_url?: string;
  token?: string;
  tree?: { items: FileNode[] };
  old_path?: string;
  new_path?: string;
  timestamp?: number;
}

const normalizePath = (path: string) => path.replace(/^\/+/, "");

export const useWebSocket = (workspaceId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [status, setStatus] = useState<string>("Connecting");
  const [statusColor, setStatusColor] = useState<string>("#FFA500");
  const [currentFileContent, setCurrentFileContent] = useState<string>("");
  const [lastReceivedFile, setLastReceivedFile] = useState<{
    path: string;
    content: string;
  } | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [isTreeLoading, setIsTreeLoading] = useState<boolean>(true);
  const [silentRequestCount, setSilentRequestCount] = useState<number>(0);
  const [lastDeletedPath, setLastDeletedPath] = useState<{
    path: string;
  } | null>(null);
  const [lastRenamedFile, setLastRenamedFile] = useState<{
    oldPath: string;
    newPath: string;
  } | null>(null);
  const [aiStatus, setAiStatus] = useState<{
    message: string;
    status_type: "info" | "loading" | "success" | "error";
    timestamp: number;
  } | null>(null);
  const activeFileRef = useRef<string | null>(null);
  const silentRequests = useRef<Set<string>>(new Set());

  // Sync ref with state
  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  const messageCount = useRef(0);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<() => void>(() => {});

  // Custom console logging with styling
  const logSocketMessage = useCallback(
    (direction: "📤 SENT" | "📥 RECEIVED", data: any) => {
      const count = ++messageCount.current;
      const timestamp = new Date().toISOString().split("T")[1].slice(0, -1);
      const style =
        direction === "📤 SENT"
          ? "background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;"
          : "background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;";

      console.groupCollapsed(`%c${direction} #${count} ${timestamp}`, style);

      if (data.action) console.log("Action:", data.action);
      if (data.path) console.log("Path:", data.path);
      if (data.content !== undefined) {
        console.log("Content length:", data.content.length, "characters");
        if (data.content.length < 500) {
          console.log(
            "Content preview:",
            data.content.substring(0, 200) + "..."
          );
        }
      }
      if (data.items) console.log("Items count:", data.items.length);
      if (data.error) console.error("Error:", data.error);

      console.groupEnd();
    },
    []
  );

  const connect = useCallback(() => {
    // Construct WebSocket URL
    const apiUrl = siteConfig.apiBuildUrl || "https://builder-api.nepdora.com";
    let wsUrl = "";

    try {
      const url = new URL(apiUrl);
      const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
      wsUrl = `${wsProtocol}//${url.host}/ws/workspace/${workspaceId}/`;
    } catch (e) {
      console.error("Invalid API URL:", apiUrl);
    }

    console.log(`🚀 Connecting to WebSocket: ${wsUrl}`);
    setStatus("Connecting");
    setStatusColor("#FFA500");

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ WebSocket Connection Established");
      setStatus("Connected");
      setStatusColor("#4CAF50");
      reconnectAttempts.current = 0;
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
      setStatus("Connection Error");
      setStatusColor("#EF4444");
    };

    ws.onclose = (event) => {
      console.log(
        `🔌 WebSocket Closed - Code: ${event.code}, Reason: ${
          event.reason || "No reason"
        }`
      );
      setStatus("Disconnected");
      setStatusColor("#888");

      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttempts.current),
          30000
        );
        console.log(
          `🔄 Reconnecting in ${delay}ms (attempt ${
            reconnectAttempts.current + 1
          }/${maxReconnectAttempts})`
        );

        reconnectTimeout.current = setTimeout(() => {
          reconnectAttempts.current++;
          connectRef.current();
        }, delay);
      } else {
        console.error("❌ Max reconnection attempts reached");
        setStatus("Connection Failed");
        setStatusColor("#EF4444");
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg: WebSocketMessage = JSON.parse(event.data);
        logSocketMessage("📥 RECEIVED", msg);

        switch (msg.action) {
          case "tree":
            console.log(
              `🌳 File tree received with ${
                msg.items?.length || msg.tree?.items?.length || 0
              } items`
            );
            const items = msg.items || msg.tree?.items;
            if (items) {
              setFileTree(items);
              setIsTreeLoading(false);
            }
            break;

          case "file_content":
            if (msg.content !== undefined && msg.path) {
              const normPath = normalizePath(msg.path);
              setLastReceivedFile({ path: normPath, content: msg.content });

              // Check if this was a silent request
              if (silentRequests.current.has(normPath)) {
                silentRequests.current.delete(normPath);
                setSilentRequestCount((prev) => Math.max(0, prev - 1));
                console.log(`🔇 Silent fetch completed for: ${normPath}`);
              } else {
                // For non-silent requests (explicit user clicks or AI tasks),
                // always update content and set as active
                setCurrentFileContent(msg.content);
                setActiveFile(normPath);
                setIsFileLoading(false);
              }
            }
            break;

          case "file_updated":
            console.log(`✅ File successfully updated: ${msg.path}`);
            // If content is provided, update it (from broadcast)
            if (msg.content !== undefined && msg.path) {
              setLastReceivedFile({ path: msg.path, content: msg.content });
              // If this is the active file, update the editor content
              if (msg.path === activeFileRef.current) {
                setCurrentFileContent(msg.content);
              }
            }
            break;

          case "file_created":
            console.log(`✅ File created: ${msg.path}`);
            // Update tree if provided
            const createdTreeItems = msg.items || msg.tree?.items;
            if (createdTreeItems) {
              setFileTree(createdTreeItems);
            }
            // If content is provided (e.g. from backend generation), update it
            if (msg.content !== undefined && msg.path) {
              setLastReceivedFile({ path: msg.path, content: msg.content });
            }
            break;

          case "file_deleted":
            console.log(`🗑️ File deleted: ${msg.path}`);
            // Update tree if provided
            const deletedTreeItems = msg.items || msg.tree?.items;
            if (deletedTreeItems) {
              setFileTree(deletedTreeItems);
            }
            if (msg.path) {
              setLastDeletedPath({ path: msg.path });
            }
            // Clear active file if it was deleted
            if (msg.path === activeFileRef.current) {
              setActiveFile(null);
              setCurrentFileContent("");
            }
            break;

          case "file_renamed":
            console.log(`📝 File renamed: ${msg.old_path} -> ${msg.new_path}`);
            // Update tree if provided
            const renamedTreeItems = msg.items || msg.tree?.items;
            if (renamedTreeItems) {
              setFileTree(renamedTreeItems);
            }
            if (msg.old_path && msg.new_path) {
              setLastRenamedFile({
                oldPath: msg.old_path,
                newPath: msg.new_path,
              });
            }
            // Update active file if it was renamed
            if (msg.old_path === activeFileRef.current) {
              setActiveFile(msg.new_path || null);
            }
            break;

          case "folder_created":
            console.log(`📁 Folder created: ${msg.path}`);
            const folderTreeItems = msg.items || msg.tree?.items;
            if (folderTreeItems) {
              setFileTree(folderTreeItems);
            }
            break;

          case "file_uploaded":
            console.log(`📁 File uploaded: ${msg.path}`);
            const uploadedTreeItems = msg.items || msg.tree?.items;
            if (uploadedTreeItems) {
              setFileTree(uploadedTreeItems);
            }
            break;

          case "notification":
            console.log(`📢 Notification: ${msg.message}`);
            // You can add a toast notification here if you have a notification system
            break;

          case "component_selected":
            console.log(`🎯 Component selected: ${msg.path}`);
            if (msg.path) setActiveFile(msg.path);
            break;

          case "workspace_deleted":
            console.log("🗑️ Workspace deleted");
            alert("Workspace has been deleted!");
            window.location.href = "https://nepdora.com/admin";
            break;

          case "error":
            console.error("🚨 Server error:", msg.error || msg.message);
            alert(`Server Error: ${msg.error || msg.message}`);
            break;

          case "ai_status":
            console.log(`🤖 AI Status: ${msg.message} (${msg.status_type})`);
            if (msg.message && msg.status_type) {
              setAiStatus({
                message: msg.message,
                status_type: msg.status_type,
                timestamp: msg.timestamp || Date.now() / 1000,
              });
            }
            break;

          default:
            console.log(`🔹 Unhandled action: ${msg.action}`, msg);
        }
      } catch (error) {
        console.error("❌ Failed to parse WebSocket message:", error);
        console.log("Raw message:", event.data);
      }
    };

    setSocket(ws);

    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.close();
    };
  }, [workspaceId, logSocketMessage]);

  // Update the ref whenever connect changes
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Initial connection
  useEffect(() => {
    if (workspaceId) {
      const cleanup = connect();
      return cleanup;
    }
  }, [workspaceId, connect]);

  // Send message with error handling
  const send = useCallback(
    (data: any) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        logSocketMessage("📤 SENT", data);
        socket.send(JSON.stringify(data));
        return true;
      } else {
        console.error(
          `⚠️ Cannot send message - WebSocket not connected. State: ${
            socket?.readyState === WebSocket.CONNECTING
              ? "CONNECTING"
              : socket?.readyState === WebSocket.CLOSING
              ? "CLOSING"
              : socket?.readyState === WebSocket.CLOSED
              ? "CLOSED"
              : "UNKNOWN"
          }`
        );
        return false;
      }
    },
    [socket, logSocketMessage]
  );

  // API Methods
  const openFile = useCallback(
    (path: string, silent: boolean = false) => {
      const normPath = normalizePath(path);
      console.log(
        `📂 Requesting file: ${normPath}${silent ? " (silent)" : ""}`
      );

      if (!silent) {
        setIsFileLoading(true);
      } else {
        // Idempotent: Only track as silent if not already being fetched silently
        if (!silentRequests.current.has(normPath)) {
          silentRequests.current.add(normPath);
          setSilentRequestCount((prev) => prev + 1);
        }
      }
      return send({ action: "open_file", path: normPath });
    },
    [send]
  );

  const updateFile = useCallback(
    (path: string, content: string) => {
      console.log(`✏️ Updating file: ${path} (${content.length} chars)`);
      return send({ action: "update_file", path, content });
    },
    [send]
  );

  const createFile = useCallback(
    (path: string, content: string = "") => {
      console.log(`➕ Creating file: ${path}`);
      return send({ action: "create_file", path, content });
    },
    [send]
  );

  const deleteFile = useCallback(
    (path: string) => {
      console.log(`🗑️ Deleting file: ${path}`);
      return send({ action: "delete_file", path });
    },
    [send]
  );

  const createDirectory = useCallback(
    (path: string) => {
      console.log(`📁 Creating directory: ${path}`);
      return send({ action: "create_folder", path });
    },
    [send]
  );

  const renameFile = useCallback(
    (oldPath: string, newPath: string) => {
      console.log(`📝 Renaming: ${oldPath} -> ${newPath}`);
      return send({
        action: "rename_file",
        old_path: oldPath,
        new_path: newPath,
      });
    },
    [send]
  );

  const recloneProject = useCallback(() => {
    console.log(`♻️ Re-cloning project request`);
    return send({ action: "reclone_project" });
  }, [send]);

  const cloneRepo = useCallback(
    (url: string) => {
      console.log(`🐙 Cloning repository: ${url}`);
      return send({ action: "github_clone", repo_url: url });
    },
    [send]
  );

  const pushChanges = useCallback(
    (message: string) => {
      console.log(`📤 Pushing changes: ${message}`);
      return send({ action: "github_push", message });
    },
    [send]
  );

  const uploadFile = useCallback(
    (path: string, content: string) => {
      console.log(`📤 Uploading file: ${path} (${content.length} chars)`);
      return send({ action: "upload_file", path, content });
    },
    [send]
  );

  const refreshFileTree = useCallback(() => {
    console.log("🌲 Requesting file tree refresh");
    setIsTreeLoading(true);
    return send({ action: "get_tree" });
  }, [send]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    console.log("🔄 Manual reconnect triggered");
    reconnectAttempts.current = 0;
    if (socket) {
      socket.close();
    }
    connect();
  }, [socket, connect]);

  return {
    socket,
    fileTree,
    status,
    statusColor,
    currentFileContent,
    setCurrentFileContent,
    lastReceivedFile,
    activeFile,
    lastDeletedPath,
    lastRenamedFile,
    openFile,
    updateFile,
    createFile,
    deleteFile,
    createDirectory,
    renameFile,
    recloneProject,
    cloneRepo,
    pushChanges,
    uploadFile,
    refreshFileTree,
    reconnect,
    isFileLoading,
    isTreeLoading,
    isPreFetching: silentRequestCount > 0,
    isConnected: status === "Connected",
    aiStatus,
  };
};
