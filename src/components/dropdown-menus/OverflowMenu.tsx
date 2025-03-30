"use client";

import { useState } from "react";
import { MoreHorizontal, Share, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function OverflowMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = () => {
    console.log("Share clicked");
  };

  const handleDownload = () => {
    console.log("Download clicked");
  };
  
  return (
    <div 
      className={`absolute top-2 right-2 z-20 ${
        isOpen 
          ? "opacity-100" 
          : "opacity-0 group-hover:opacity-100"
      } transition-opacity`}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              handleShare();
            }}
          >
            <Share className="h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              handleDownload();
            }}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 