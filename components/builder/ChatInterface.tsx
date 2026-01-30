"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { getSubDomain } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  SendHorizontal,
  Loader2,
  AlertCircle,
  History,
  Plus,
  Bot,
  Copy,
  Check,
  Key
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { AIStatusBoard } from "./AIStatusBoard";
import { ApiKeyDialog } from "./ApiKeyDialog";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  files_modified?: string[];
  isApiKeyError?: boolean;
}

interface ApiError extends Error {
  response?: {
    error?: {
      message?: string;
      code?: number;
      status?: string;
    } | string;
    message?: string;
  };
  status?: number;
}

const API_BASE_URL = siteConfig.apiBuildUrl;

interface ChatInterfaceProps {
  workspaceId: string;
  onTaskCompleted?: (files: string[]) => void;
  terminalError?: string;
  onClearError?: () => void;
  aiStatus?: {
    message: string;
    status_type: "info" | "loading" | "success" | "error";
    timestamp: number;
  } | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onTaskCompleted,
  terminalError,
  onClearError,
  aiStatus
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content: "Hi! I'm your AI coding assistant. Tell me what you want to build or change in your project, and I'll help you make it happen.",
    },
  ]);
  const [input, setInput] = useState("");
  const [tenantName] = useState<string>(() => getSubDomain() || "luminous-glow");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await fetch(`${API_BASE_URL}/api/web-builder/build/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          tenant_name: tenantName,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
        error.response = errorData;
        error.status = response.status;
        throw error;
      }
      return response.json() as Promise<{
        status: string;
        final_answer?: string;
        files_modified?: string[];
        message?: string;
      }>;
    },
    onSuccess: (data) => {
      if (data.status === "success" || data.status === "completed") {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.final_answer || "Task completed successfully.",
            files_modified: data.files_modified,
          },
        ]);

        if (data.files_modified && data.files_modified.length > 0) {
          if (onTaskCompleted) {
            onTaskCompleted(data.files_modified);
          }
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: `❌ Error: ${data.message || "Task failed."}`,
          },
        ]);
      }
    },
    onError: (error: ApiError) => {
      // Check if it's an API key error
      const errorResponse = error.response;

      // Try to extract error message from various possible structures
      const errorMsg =
        (typeof errorResponse?.error === 'object' ? errorResponse.error.message : null) ||
        errorResponse?.message ||
        errorResponse?.error ||
        error.message;

      const errorStr = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);

      // Check if it's an API key error (more comprehensive check)
      const isApiKeyError =
        errorStr.toLowerCase().includes('api key') ||
        errorStr.toLowerCase().includes('invalid_argument') ||
        (typeof errorResponse?.error === 'object' && errorResponse.error.code === 400) ||
        (typeof errorResponse?.error === 'object' && errorResponse.error.status === 'INVALID_ARGUMENT') ||
        (error.status === 500 && errorStr.toLowerCase().includes('api'));

      let errorMessage = '';

      if (isApiKeyError) {
        errorMessage = '🔑 API Key Error: Your API key is missing or invalid. Please add a valid API key to continue.';
      } else if (typeof errorResponse?.error === 'object' && errorResponse.error.message) {
        errorMessage = `❌ Error: ${errorResponse.error.message}`;
      } else if (errorResponse?.message) {
        errorMessage = `❌ Error: ${errorResponse.message}`;
      } else if (errorResponse?.error) {
        errorMessage = `❌ Error: ${typeof errorResponse.error === 'string' ? errorResponse.error : JSON.stringify(errorResponse.error)}`;
      } else {
        errorMessage = `❌ Network Error: ${error.message}. Please check your API configuration.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: errorMessage,
          isApiKeyError: isApiKeyError,
        },
      ]);
    },
  });

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || mutation.isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setInput("");

    mutation.mutate(textToSend);
  };

  const handleFixIssue = () => {
    if (terminalError) {
      const fixPrompt = `I encountered the following error in the terminal. Please fix it:\n\n${terminalError}`;
      sendMessage(fixPrompt);
      if (onClearError) onClearError();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-[#2b2b2b] text-[#d4d4d4]">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#2b2b2b] bg-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-[#007acc]" />
          <span className="text-sm font-medium tracking-tight">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-[#2d2d2d] text-[#888] transition-colors" title="History">
            <History className="size-3.5" />
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-[#2d2d2d] text-[#888] transition-colors"
            title="New Chat"
            onClick={() => setMessages([messages[0]])}
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-2 max-w-[85%]",
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >


            <div
              className={cn(
                "group/bubble relative p-3 rounded-xl text-[13px] leading-relaxed shadow-sm",
                msg.role === "user"
                  ? "bg-[#007acc] text-white rounded-tr-none"
                  : "bg-[#252526] text-[#cccccc] border border-[#333] rounded-tl-none"
              )}
            >
              <div
                className="whitespace-pre-wrap break-words word-break overflow-wrap-anywhere"
                dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\n/g, "<br/>"),
                }}
              />

              {/* API Key Error Action Button */}
              {msg.isApiKeyError && (
                <button
                  onClick={() => setIsApiKeyDialogOpen(true)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#007acc] hover:bg-[#006bb3] text-white rounded-lg text-[12px] font-medium transition-all duration-200 shadow-[0_0_10px_rgba(0,122,204,0.3)] hover:shadow-[0_0_15px_rgba(0,122,204,0.5)]"
                >
                  <Key className="size-4" />
                  Add API Key
                </button>
              )}

              {msg.role === "ai" && (
                <button
                  onClick={() => copyToClipboard(msg.content, index)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-md bg-[#1e1e1e] border border-[#333] text-[#888] opacity-0 group-hover/bubble:opacity-100 transition-all duration-200 hover:text-white"
                  title="Copy message"
                >
                  {copiedIndex === index ? (
                    <Check className="size-3 text-green-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              )}

              {msg.files_modified && msg.files_modified.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[#333] flex items-center gap-2 text-[11px] text-[#888]">
                  <div className="px-1.5 py-0.5 rounded bg-[#2d2d2d] border border-[#3d3d3d]">
                    {msg.files_modified.length} files modified
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {mutation.isPending && (
          <div className="flex flex-col gap-2 max-w-[85%] mr-auto items-start animate-pulse mb-4">
            <div className="flex items-center gap-2 px-1">
              <Loader2 className="size-3 text-[#007acc] animate-spin" />
              <span className="text-[11px] font-semibold uppercase text-[#888] tracking-wider">Thinking...</span>
            </div>
            {aiStatus ? (
              <div className="w-full">
                <AIStatusBoard status={aiStatus} />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#252526] border border-[#333] rounded-tl-none size-8 flex items-center justify-center">
                <div className="size-1 rounded-full bg-[#007acc] animate-bounce" />
                <div className="size-1 rounded-full bg-[#007acc] animate-bounce [animation-delay:-.3s] mx-1" />
                <div className="size-1 rounded-full bg-[#007acc] animate-bounce [animation-delay:-.5s]" />
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Terminal Error Banner */}
      {terminalError && (
        <div className="mx-4 mb-2">
          <button
            onClick={handleFixIssue}
            className="w-full bg-red-500/10 border border-red-500/20 text-red-200 p-2.5 rounded-lg text-[12px] flex items-center justify-between group hover:bg-red-500/20 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-red-400" />
              <span>Terminal error detected</span>
            </div>
            <span className="font-bold underline group-hover:no-underline decoration-red-500/50">Auto-Fix</span>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-[#1e1e1e] border-t border-[#2b2b2b]">
        <div className="relative group flex items-end gap-2 bg-[#252526] border border-[#333] rounded-lg p-2 focus-within:border-[#007acc] transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to build or edit..."
            className={`
    flex-1 bg-transparent text-white px-2 py-1 text-[13px]
    resize-none focus:outline-none placeholder:text-[#555]
    overflow-y-auto custom-scrollbar
    min-h-[40px] max-h-[200px]
  `}
            rows={1}
          />

          <button
            onClick={() => sendMessage()}
            disabled={mutation.isPending || !input.trim()}
            className={cn(
              "flex items-center justify-center size-8 rounded-md transition-all duration-200 shrink-0",
              input.trim() && !mutation.isPending
                ? "bg-[#007acc] text-white hover:bg-[#006bb3] shadow-[0_0_10px_rgba(0,122,204,0.3)]"
                : "bg-[#2d2d2d] text-[#555] cursor-not-allowed"
            )}
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendHorizontal className="size-4" />
            )}
          </button>
        </div>
        <div className="mt-2 text-[10px] text-[#555] text-center italic">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d3d3d;
        }
        
        .word-break {
          word-break: break-word;
          overflow-wrap: anywhere;
        }
      `}</style>

      {/* API Key Dialog */}
      <ApiKeyDialog
        open={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
      />
    </div>
  );
};