import type { FileNode } from "@/types/types";

interface WebContainerFile {
  file: {
    contents: string;
  };
}

interface WebContainerDirectory {
  directory: {
    [key: string]: WebContainerFile | WebContainerDirectory;
  };
}

export type WebContainerFileSystem = Record<string, WebContainerFile | WebContainerDirectory>;

export function transformToWebContainerFormat(nodes: FileNode[]): WebContainerFileSystem {
  const result: WebContainerFileSystem = {};

  nodes.forEach(node => {
     if (node.type === 'folder') {
        const directoryContents = node.children ? transformToWebContainerFormat(node.children) : {};
        result[node.name] = { directory: directoryContents };
     } else if (node.type === 'file') {
        // Find content for file? The FileNode from useWebSocket might include content or we might need to fetch it.
        // Assuming FileNode was updated to include content or we merge it from somewhere else.
        // For now, if content is missing, we might use empty string or a placeholder.
        // HOWEVER, useWebSocket's fileTree structure (FileNode) doesn't strictly guarantee content presence on all nodes.
        // BUT, for the WebContainer to work, we absolutely need the content.
        
        // If the 'content' property exists on FileNode
        // @ts-ignore
        const content = node.content || "";
        result[node.name] = {
           file: {
              contents: content
           }
        }
     }
  });

  return result;
}

// Helper to merge flat file map into tree structure if needed
// Or simpler: Convert flat map to WebContainer structure
export function transformFlatMapToWebContainer(files: Record<string, string>): WebContainerFileSystem {
   const root: WebContainerFileSystem = {};

   Object.entries(files).forEach(([path, content]) => {
      const parts = path.split('/');
      let current = root;

      parts.forEach((part, index) => {
         const isFile = index === parts.length - 1;
         
         if (isFile) {
            current[part] = {
               file: {
                  contents: content
               }
            };
         } else {
            if (!current[part]) {
               current[part] = {
                  directory: {}
               };
            }
            // Move pointer deeper
            // @ts-ignore
            current = current[part].directory;
         }
      });
   });

   return root;
}
