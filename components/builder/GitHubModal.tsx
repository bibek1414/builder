"use client";

import React, { useState } from "react";
import { GitBranch, Upload, Download, Github } from "lucide-react";

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  onClone: () => void;
  onReclone: () => void;
  onPush: (message: string) => void;
  isCloning?: boolean;
  isPushing?: boolean;
  commitMessage: string;
  setCommitMessage: (msg: string) => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  repoUrl,
  setRepoUrl,
  onClone,
  onReclone,
  onPush,
  isCloning = false,
  isPushing = false,
  commitMessage,
  setCommitMessage,
}) => {
  const [activeTab, setActiveTab] = useState<"clone" | "push" | "reclone">("clone");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-2xl w-[450px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#252526] px-5 py-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-200">
            <Github size={20} />
            <h3 className="font-medium text-lg">GitHub Integration</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("clone")}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "clone"
                ? "bg-[#1e1e1e] text-blue-400 border-b-2 border-blue-400"
                : "bg-[#252526] text-gray-400 hover:text-gray-200"
            }`}
          >
            <Download size={16} />
            Clone New
          </button>
          <button
            onClick={() => setActiveTab("reclone")}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "reclone"
                ? "bg-[#1e1e1e] text-orange-400 border-b-2 border-orange-400"
                : "bg-[#252526] text-gray-400 hover:text-gray-200"
            }`}
          >
            <GitBranch size={16} />
            Re-clone
          </button>
          <button
            onClick={() => setActiveTab("push")}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "push"
                ? "bg-[#1e1e1e] text-green-400 border-b-2 border-green-400"
                : "bg-[#252526] text-gray-400 hover:text-gray-200"
            }`}
          >
            <Upload size={16} />
            Push Changes
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "clone" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Repository URL
                </label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full bg-[#2d2d2d] border border-gray-600 text-gray-200 px-3 py-2.5 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600 font-mono text-sm"
                />
              </div>
              
              <div className="pt-2">
                <button
                    onClick={() => onClone()}
                    disabled={!repoUrl || isCloning}
                    className={`w-full py-2.5 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        !repoUrl || isCloning
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
                    }`}
                >
                    {isCloning ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            Cloning...
                        </>
                    ) : (
                        <>
                            <GitBranch size={16} />
                            Clone Repository
                        </>
                    )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "reclone" && (
            <div className="space-y-4">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                 <p className="text-yellow-200 text-xs leading-relaxed">
                    <span className="font-bold block mb-1">⚠️ Warning:</span>
                    This will delete the current project and re-clone the repository from the source configuration. 
                    Any unpushed changes will be lost.
                 </p>
              </div>
              
              <div className="pt-2">
                <button
                    onClick={() => onReclone()}
                    disabled={isCloning}
                    className={`w-full py-2.5 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        isCloning
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]"
                    }`}
                >
                    {isCloning ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            Re-cloning...
                        </>
                    ) : (
                        <>
                            <GitBranch size={16} />
                            Re-clone Project
                        </>
                    )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "push" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Commit Message
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Update code"
                  className="w-full bg-[#2d2d2d] border border-gray-600 text-gray-200 px-3 py-2.5 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder:text-gray-600 text-sm"
                />
                <p className="text-[10px] text-gray-500 mt-1">Updates will be pushed to the current branch.</p>
              </div>

              <div className="pt-2">
                <button
                    onClick={() => onPush(commitMessage)}
                    disabled={!commitMessage || isPushing}
                    className={`w-full py-2.5 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        !commitMessage || isPushing
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-500 active:scale-[0.98]"
                    }`}
                >
                    {isPushing ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            Pushing...
                        </>
                    ) : (
                        <>
                           <Upload size={16} />
                           Commit & Push
                        </>
                    )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
