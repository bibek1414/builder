"use client";

import { Info, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIStatusBoardProps {
    status: {
        message: string;
        status_type: "info" | "loading" | "success" | "error";
        timestamp: number;
    } | null;
}

export const AIStatusBoard = ({ status }: AIStatusBoardProps) => {
    if (!status) return null;

    const getIcon = () => {
        switch (status.status_type) {
            case "loading":
                return <Loader2 className="size-3.5 animate-spin text-blue-400" />;
            case "success":
                return <CheckCircle2 className="size-3.5 text-emerald-400" />;
            case "error":
                return <AlertCircle className="size-3.5 text-rose-400" />;
            default:
                return <Info className="size-3.5 text-blue-400" />;
        }
    };

    const getStatusColor = () => {
        switch (status.status_type) {
            case "loading":
                return "bg-blue-500/10 border-blue-500/20 text-blue-200";
            case "success":
                return "bg-emerald-500/10 border-emerald-500/20 text-emerald-200";
            case "error":
                return "bg-rose-500/10 border-rose-500/20 text-rose-200";
            default:
                return "bg-gray-500/10 border-gray-500/20 text-gray-200";
        }
    };

    return (
        <div className={cn(
            "mx-2 my-2 p-2 rounded-lg border flex items-start gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-top-2",
            getStatusColor()
        )}>
            <div className="mt-0.5 shrink-0">
                {getIcon()}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] font-medium leading-tight break-words">
                    {status.message}
                </span>
                <span className="text-[9px] opacity-40 tabular-nums">
                    {new Date(status.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            </div>
        </div>
    );
};
