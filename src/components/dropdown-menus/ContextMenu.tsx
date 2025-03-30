"use client";

import { 
  ExternalLink, 
  Share, 
  Copy, 
  Download 
} from "lucide-react";
import { ReactNode } from "react";

import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger 
} from "@/components/ui/context-menu";

interface AssetContextMenuProps {
  children: ReactNode;
}

export function AssetContextMenu({ children }: AssetContextMenuProps) {
  const handleOpen = () => {
    console.log("Open clicked");
  };

  const handleShare = () => {
    console.log("Share clicked");
  };

  const handleCopy = () => {
    console.log("Copy clicked");
  };

  const handleDownload = () => {
    console.log("Download clicked");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleOpen}
        >
          <ExternalLink className="h-4 w-4" />
          <span>Open</span>
        </ContextMenuItem>
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleShare}
        >
          <Share className="h-4 w-4" />
          <span>Share</span>
        </ContextMenuItem>
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
          <span>Copy</span>
        </ContextMenuItem>
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
} 