"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Allotment } from 'allotment';
import { useWebSocket } from '@/hooks/useWebSocket';
import { CodePreview } from '@/components/builder/CodePreview';
import { ChatInterface } from '@/components/builder/ChatInterface';
import { GitHubModal } from '@/components/builder/GitHubModal';
import { useWebContainer } from '@/hooks/useWebContainer';
import { useUseRealData } from '@/hooks/use-templates';
import { FileNode } from '@/types/types';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { BuilderSkeleton } from '@/components/builder/BuilderSkeleton';

interface BuilderViewProps {
    workspaceId: string;
}

export const BuilderView: React.FC<BuilderViewProps> = ({ workspaceId }) => {
    const currentWorkspaceId = workspaceId;

    const {
        fileTree,
        status,
        openFile,
        refreshFileTree,
        activeFile,
        lastReceivedFile,
        lastDeletedPath,
        lastRenamedFile,
        aiStatus,
        cloneRepo,
        pushChanges,
        recloneProject
    } = useWebSocket(currentWorkspaceId);

    // Local state for the UI
    const [filesMap, setFilesMap] = useState<Record<string, string>>({});
    const [terminalError, setTerminalError] = useState<string | null>(null);
    const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
    const [showChat, setShowChat] = useState(true);

    // GitHub States
    const [repoUrl, setRepoUrl] = useState("");
    const [commitMessage, setCommitMessage] = useState("");

    // Track previous values for effect-based synchronization
    const prevLastReceivedFileRef = useRef<{ path: string, content: string } | null>(null);
    const prevLastDeletedPathRef = useRef<{ path: string } | null>(null);
    const prevLastRenamedFileRef = useRef<{ oldPath: string, newPath: string } | null>(null);

    const { mutate: mutateRealData, isPending: isUsingRealData } = useUseRealData();

    const handleUseRealData = () => {
        mutateRealData(undefined, {
            onSuccess: () => {
                alert("Success: Use real data request sent!");
            },
            onError: (error) => {
                alert(`Error: ${error instanceof Error ? error.message : "Failed to use real data"} `);
            }
        });
    };

    const handleTerminalError = (error: string) => {
        console.log("Terminal Error Detected:", error);
        setTerminalError(error);
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'webcontainer:connected') {
                console.log("✅ WebContainer connection verified.");
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // WebContainer state
    const webContainerState = useWebContainer({ files: filesMap });

    // Effect-based synchronization for filesMap
    useEffect(() => {
        if (!lastReceivedFile && !lastDeletedPath && !lastRenamedFile) return;

        setFilesMap(prev => {
            const nextFilesMap = { ...prev };
            let hasChanges = false;

            // Sync new/updated files
            if (lastReceivedFile !== prevLastReceivedFileRef.current) {
                if (lastReceivedFile) {
                    nextFilesMap[lastReceivedFile.path] = lastReceivedFile.content;
                    hasChanges = true;
                }
                prevLastReceivedFileRef.current = lastReceivedFile;
            }

            // Sync deletions
            if (lastDeletedPath !== prevLastDeletedPathRef.current) {
                if (lastDeletedPath) {
                    delete nextFilesMap[lastDeletedPath.path];
                    hasChanges = true;
                }
                prevLastDeletedPathRef.current = lastDeletedPath;
            }

            // Sync renames
            if (lastRenamedFile !== prevLastRenamedFileRef.current) {
                if (lastRenamedFile) {
                    if (nextFilesMap[lastRenamedFile.oldPath]) {
                        nextFilesMap[lastRenamedFile.newPath] = nextFilesMap[lastRenamedFile.oldPath];
                        delete nextFilesMap[lastRenamedFile.oldPath];
                        hasChanges = true;
                    }
                }
                prevLastRenamedFileRef.current = lastRenamedFile;
            }

            return hasChanges ? nextFilesMap : prev;
        });
    }, [lastReceivedFile, lastDeletedPath, lastRenamedFile]);

    // Sync filesMap from initial fileTree
    useEffect(() => {
        if (fileTree.length > 0) {
            const newFiles: Record<string, string> = {};
            const traverse = (nodes: FileNode[]) => {
                nodes.forEach(node => {
                    if (node.type === 'file' && 'content' in node && node.content) {
                        newFiles[node.path] = node.content as string;
                    }
                    if (node.children) traverse(node.children);
                });
            };
            traverse(fileTree);

            setFilesMap(prev => {
                const updated = { ...prev, ...newFiles };
                // Check if there's any actual difference to avoid cascading renders
                const keys1 = Object.keys(prev);
                const keys2 = Object.keys(updated);
                if (keys1.length === keys2.length && keys1.every(k => prev[k] === updated[k])) {
                    return prev;
                }
                return updated;
            });
        }
    }, [fileTree]);

    // Minimal pre-fetch: request active file content if not cached
    useEffect(() => {
        if (status === 'Connected' && fileTree.length > 0 && activeFile && !filesMap[activeFile]) {
            openFile(activeFile, true);
        }
    }, [status, fileTree, activeFile, filesMap, openFile]);

    // Initial loading state
    if (status === 'Connecting' || (status === 'Disconnected' && fileTree.length === 0)) {
        return <BuilderSkeleton />;
    }

    return (
        <div className="h-screen w-full font-sans flex flex-col">
            <BuilderHeader
                status={status}
                activeFile={activeFile || undefined}
                isUsingRealData={isUsingRealData}
                onUseRealData={handleUseRealData}
                onOpenGitHub={() => setIsGithubModalOpen(true)}
                showChat={showChat}
                onToggleChat={() => setShowChat(!showChat)}
            />

            <div className="flex-1 min-h-0">
                <Allotment>
                    <Allotment.Pane
                        visible={showChat}
                        minSize={280}
                        snap
                        preferredSize={400}
                    >
                        <div className="h-full border-r border-gray-800 bg-gray-900 flex flex-col">
                            <ChatInterface
                                workspaceId={currentWorkspaceId}
                                onTaskCompleted={(files) => {
                                    files.forEach(path => {
                                        openFile(path);
                                    });
                                    refreshFileTree();
                                }}
                                terminalError={terminalError || undefined}
                                onClearError={() => setTerminalError(null)}
                                aiStatus={aiStatus}
                            />
                        </div>
                    </Allotment.Pane>

                    <Allotment.Pane snap>
                        <div className="h-full bg-white flex flex-col relative">
                            <CodePreview
                                key={0}

                                files={filesMap}
                                activeFile={activeFile || ''}
                                webContainerState={webContainerState}
                                onTerminalError={handleTerminalError}
                            />
                        </div>
                    </Allotment.Pane>
                </Allotment>
            </div>

            <GitHubModal
                isOpen={isGithubModalOpen}
                onClose={() => setIsGithubModalOpen(false)}
                repoUrl={repoUrl}
                setRepoUrl={setRepoUrl}
                onClone={() => cloneRepo(repoUrl)}
                onReclone={() => {
                    recloneProject();
                    setIsGithubModalOpen(false);
                }}
                onPush={pushChanges}
                commitMessage={commitMessage}
                setCommitMessage={setCommitMessage}
            />
        </div>
    );
};
