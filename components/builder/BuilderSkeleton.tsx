"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const BuilderSkeleton: React.FC = () => {
    return (
        <div className="h-screen w-full bg-[#0d1117] flex flex-col overflow-hidden">
            {/* Header Skeleton */}
            <div className="h-12 border-b border-gray-800 bg-[#0d1117] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 bg-gray-800" />
                    <Skeleton className="h-8 w-24 bg-gray-800 rounded-md" />
                    <Skeleton className="h-4 w-32 bg-gray-800 hidden md:block" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-20 bg-gray-800 rounded-md" />
                    <Skeleton className="h-8 w-24 bg-purple-900/30 rounded-md" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex min-h-0">
                {/* Chat Pane Skeleton */}
                <div className="w-[400px] border-r border-gray-800 bg-gray-900 flex flex-col p-4 gap-4">
                    <Skeleton className="h-8 w-3/4 bg-gray-800" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-20 w-full bg-gray-800" />
                        <Skeleton className="h-24 w-full bg-gray-800" />
                        <Skeleton className="h-16 w-5/6 bg-gray-800" />
                    </div>
                    <Skeleton className="h-12 w-full bg-gray-800 mt-auto" />
                </div>

                {/* Preview Pane Skeleton */}
                <div className="flex-1 bg-[#0d1117] flex flex-col p-6 animate-pulse">
                    <div className="flex-1 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-4">
                        <div className="h-12 w-12 rounded-full border-4 border-gray-800 border-t-blue-500/50 animate-spin" />
                        <div className="space-y-2 flex flex-col items-center">
                            <Skeleton className="h-4 w-32 bg-gray-800" />
                            <Skeleton className="h-3 w-48 bg-gray-800" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
