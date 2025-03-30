"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

import { Clip, fetchAssets } from "@/app/api/clips";

import { Asset } from "../cards/Asset";
import { InfiniteScroll } from "../wrappers/InfiniteScroll";
import { MosaicGrid } from "../wrappers/MosaicGrid";

export function AssetsSection() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const totalAssets = useRef(0);
  
  // Calculate responsive row height based on screen size
  const [rowHeight, setRowHeight] = useState(240);
  
  useEffect(() => {
    const updateRowHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRowHeight(180); // Small screens
      } else if (width < 1024) {
        setRowHeight(210); // Medium screens
      } else {
        setRowHeight(240); // Large screens
      }
    };
    
    updateRowHeight();
    window.addEventListener('resize', updateRowHeight);
    return () => window.removeEventListener('resize', updateRowHeight);
  }, []);

  const loadClips = async (currentCursor: string | null = null) => {
    const response = await fetchAssets({ cursor: currentCursor });
    const { clips: newClips, total } = response.data;
    const { cursor: newCursor, hasMore: hasMoreItems } = response.pagination;
    
    totalAssets.current = total;
    setClips(prev => currentCursor ? [...prev, ...newClips] : newClips);
    setCursor(newCursor);
    setHasMore(hasMoreItems);
  };

  useEffect(() => {
    loadClips();
  }, []);

  return (
    <section className="py-4">
      <div>
        <div 
          className="inline-flex items-center cursor-pointer mb-6 group px-2 py-1 rounded-md hover:bg-gray-100 w-fit"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-sm font-bold text-gray-500">ASSETS {clips.length > 0 ? `(${totalAssets.current})` : ''}</h2>
          <ChevronRight 
            className={`h-4 w-4 text-gray-500 transition-transform ml-1 opacity-0 group-hover:opacity-100 ${isExpanded ? 'rotate-90' : ''}`}
          />
        </div>
        {isExpanded && (
          <InfiniteScroll onLoadMore={() => loadClips(cursor)} hasMore={hasMore}>
            <MosaicGrid rowHeight={rowHeight} gap={12} maxRowItems={8}>
              {clips.map((clip) => (
                <Asset
                  key={clip.id}
                  data={clip}
                />
              ))}
            </MosaicGrid>
          </InfiniteScroll>
        )}
      </div>
    </section>
  );
}
