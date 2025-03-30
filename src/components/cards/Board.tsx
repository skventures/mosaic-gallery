"use client";

import Image from "next/image";
import { OverflowMenu } from "@/components/dropdown-menus/OverflowMenu";
import { AssetContextMenu } from "@/components/dropdown-menus/ContextMenu";

interface BoardProps {
  id: string;
  title: string;
  thumbnails?: string[];
}

export function Board({ title, thumbnails }: BoardProps) {
  return (
    <AssetContextMenu>
      <div
        className="relative w-full h-[216px] rounded-lg overflow-hidden cursor-pointer group"
      >
        {thumbnails && thumbnails.length > 0 ? (
          <Image
            src={thumbnails[0]}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Action Menu Button */}
        <OverflowMenu />
        
        <div className="absolute inset-0 p-4 flex items-end">
          <h3 className="text-white text-lg font-semibold group-hover:underline">
            {title}
          </h3>
        </div>
      </div>
    </AssetContextMenu>
  );
} 