"use client";

import React from 'react';
import {
    Database,
    GitBranch,
    PanelLeft,
    PanelLeftClose
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getSubDomain } from "@/lib/auth-client";

interface BuilderHeaderProps {
    status: string;
    activeFile?: string;
    isUsingRealData: boolean;
    onUseRealData: () => void;
    onOpenGitHub: () => void;
    showChat: boolean;
    onToggleChat: () => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
    status,
    activeFile,
    isUsingRealData,
    onUseRealData,
    onOpenGitHub,
    showChat,
    onToggleChat,
}) => {
    return (
        <header className="h-12 border-b border-gray-800 bg-[#0d1117] flex items-center justify-between px-4 z-10 shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleChat}
                    className="p-1.5 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-gray-200"
                    title={showChat ? "Hide Chat" : "Show Chat"}
                >
                    {showChat ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-md border border-gray-700/50">
                    <span className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'Connected' ? 'bg-green-500' : 'bg-red-500'
                    )} />
                    <span className="text-xs font-medium text-gray-300">{status}</span>
                </div>

                {activeFile && (
                    <span className="text-sm text-gray-400 font-mono hidden md:block truncate max-w-[200px]">
                        {activeFile}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Link href={`https://${getSubDomain()}.nepdora.com`} target='_blank'>
                    <button
                        className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors shadow-sm shadow-purple-900/20 disabled:opacity-50'
                    >
                        Preview
                    </button>
                </Link>
                <button
                    onClick={onOpenGitHub}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-md border border-gray-700 transition-colors"
                >
                    <GitBranch size={14} />
                    GitHub
                </button>

                <button
                    onClick={onUseRealData}
                    disabled={isUsingRealData}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors shadow-sm shadow-purple-900/20 disabled:opacity-50"
                >
                    <Database size={14} className={isUsingRealData ? "animate-spin" : ""} />
                    {isUsingRealData ? "Processing..." : "Real Data"}
                </button>
            </div>
        </header>
    );
};
