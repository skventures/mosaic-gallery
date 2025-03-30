"use client";

import Image from "next/image";
import { useRef } from "react";

import { Clip } from "@/app/api/clips";
import { AssetContextMenu } from "@/components/dropdown-menus/ContextMenu";
import { OverflowMenu } from "@/components/dropdown-menus/OverflowMenu";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize, formatDuration } from "@/lib/utils";

interface AssetProps {
  data: Clip;
}

export function Asset({ data: { assets, ext, height, importedName, size, title, width, type, duration } }: AssetProps) {
  const formattedSize = formatFileSize(Number(size));
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleMouseEnter = () => {
    if (videoRef.current && assets.previewVideo) {
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
    }
  };
  
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };
  
  return (
    <AssetContextMenu>
      <Card 
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full"
        onMouseEnter={type === "video" && assets.previewVideo ? handleMouseEnter : undefined}
        onMouseLeave={type === "video" && assets.previewVideo ? handleMouseLeave : undefined}
      >
        <CardContent className="p-0 h-full">
          <div className="h-full relative">
            <Image
              src={assets.image}
              alt={title || "Clip"}
              fill
              className={`object-cover ${type === "video" && assets.previewVideo ? "group-hover:opacity-0" : ""}`}
              sizes={`(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw`}
            />
            {type === "video" && assets.previewVideo && (
              <video
                ref={videoRef}
                src={assets.previewVideo}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                muted
                playsInline
                loop
              />
            )}
            {type === "video" && duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-xs text-white font-medium z-10 group-hover:opacity-0 transition-opacity">
                {formatDuration(duration)}
              </div>
            )}
            
            {/* Action Menu Button */}
            <OverflowMenu />
            
            <div className="absolute left-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="bg-gradient-to-t from-black/50 to-transparent pt-16 pb-4 px-4">
                <h3 className="text-white text-md font-semibold line-clamp-1 hover:underline cursor-pointer">
                  {importedName}
                </h3>
                <span className="text-white/80 text-xs">
                  {ext.toUpperCase()} • {formattedSize} • {width} x {height}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AssetContextMenu>
  );
}
