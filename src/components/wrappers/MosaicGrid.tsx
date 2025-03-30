"use client";

import { Children, ReactElement, ReactNode, useEffect, useRef, useState, useMemo } from "react";
import { Clip } from "@/app/api/clips";
import { calculateAspectRatio, widthFromAspectRatio } from "@/lib/utils";

interface MosaicGridProps {
  children: ReactNode;
  className?: string;
  rowHeight?: number;
  gap?: number;
  maxRowItems?: number;
  minItemWidth?: number;
}

export function MosaicGrid({ 
  children, 
  className = "", 
  rowHeight = 250, 
  gap = 16, 
  maxRowItems = 4,
  minItemWidth = 200 
}: MosaicGridProps) {
  const childrenArray = Children.toArray(children) as ReactElement[];
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200); // Default fallback

  // Measure container width after mount and on resize
  useEffect(() => {
    if (!containerRef.current) return;

    let currentContainer = containerRef.current;
    
    const updateWidth = () => {
      if (currentContainer) {
        setContainerWidth(currentContainer.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();
    
    // Update on resize
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(currentContainer);
    
    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate rows based on container width
  const rows = useMemo(() => {
    if (childrenArray.length === 0) return [];
    
    const result: ReactElement[][] = [];
    let currentRow: ReactElement[] = [];
    let currentRowWidth = 0;
    const gapWidth = gap;
    
    // Calculate effective max items for current container width
    const effectiveMaxItems = Math.min(
      maxRowItems,
      Math.floor((containerWidth + gap) / (minItemWidth + gap))
    );

    // Process all children
    childrenArray.forEach((child) => {
      if (!child.props?.data) {
        // If no clip data, treat as a fixed-width item
        const isNewRow = currentRow.length >= effectiveMaxItems || 
          (currentRowWidth > 0 && currentRowWidth + minItemWidth + gapWidth > containerWidth);

        if (isNewRow) {
          result.push([...currentRow]);
          currentRow = [child];
          currentRowWidth = minItemWidth;
        } else {
          currentRow.push(child);
          currentRowWidth += (currentRowWidth > 0 ? gapWidth : 0) + minItemWidth;
        }
        return;
      }

      const clip = child.props.data as Clip;
      
      // Handle invalid dimensions by using minItemWidth as fallback
      if (!clip.width || !clip.height || clip.width <= 0 || clip.height <= 0) {
        const isNewRow = currentRow.length >= effectiveMaxItems || 
          (currentRowWidth > 0 && currentRowWidth + minItemWidth + gapWidth > containerWidth);

        if (isNewRow) {
          result.push([...currentRow]);
          currentRow = [child];
          currentRowWidth = minItemWidth;
        } else {
          currentRow.push(child);
          currentRowWidth += (currentRowWidth > 0 ? gapWidth : 0) + minItemWidth;
        }
        return;
      }
      
      const aspectRatio = calculateAspectRatio(clip.width, clip.height);
      const idealWidth = Math.max(widthFromAspectRatio(aspectRatio, rowHeight), minItemWidth);
      
      const isNewRow = currentRow.length >= effectiveMaxItems || 
        (currentRowWidth > 0 && currentRowWidth + idealWidth + gapWidth > containerWidth);

      if (isNewRow) {
        // Push current row and start a new one
        result.push([...currentRow]);
        currentRow = [child];
        currentRowWidth = idealWidth;
      } else {
        // Add to current row
        currentRow.push(child);
        currentRowWidth += (currentRowWidth > 0 ? gapWidth : 0) + idealWidth;
      }
    });

    // Add the last row if it has any items
    if (currentRow.length > 0) {
      result.push(currentRow);
    }

    return result;
  }, [childrenArray, rowHeight, gap, maxRowItems, containerWidth, minItemWidth]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {rows.map((row, rowIndex) => {
        // Calculate the total width needed for the row
        const rowWidth = row.reduce((sum, child, index) => {
          if (!child.props?.data) return sum + minItemWidth;
          
          const clip = child.props.data as Clip;
          
          // Handle invalid dimensions
          if (!clip.width || !clip.height || clip.width <= 0 || clip.height <= 0) {
            return sum + minItemWidth + (index > 0 ? gap : 0);
          }
          
          const aspectRatio = calculateAspectRatio(clip.width, clip.height);
          const idealWidth = Math.max(widthFromAspectRatio(aspectRatio, rowHeight), minItemWidth);
          
          // Add gap between items (except for the first item)
          return sum + idealWidth + (index > 0 ? gap : 0);
        }, 0);
        
        // Calculate the height adjustment to make the row fit the container width
        const heightAdjustment = Math.min(containerWidth / rowWidth, 1);
        const adjustedHeight = rowHeight * heightAdjustment;
        
        // Special handling for single-item rows to prevent overstretching
        const isSingleItemRow = row.length === 1;
        
        return (
          <div 
            key={`row-${rowIndex}`} 
            className="flex mb-4 last:mb-0"
            style={{ gap: `${gap}px` }}
          >
            {row.map((child, childIndex) => {
              let flexBasis = `${minItemWidth}px`;
              let itemHeight = adjustedHeight;
              
              if (child.props?.data) {
                const clip = child.props.data as Clip;
                
                // Handle invalid dimensions
                if (clip.width && clip.height && clip.width > 0 && clip.height > 0) {
                  const aspectRatio = calculateAspectRatio(clip.width, clip.height);
                  
                  // For single item rows, don't stretch to full width
                  if (isSingleItemRow) {
                    itemHeight = Math.min(rowHeight, containerWidth / aspectRatio);
                    flexBasis = `${Math.min(containerWidth, widthFromAspectRatio(aspectRatio, itemHeight))}px`;
                  } else {
                    const idealWidth = Math.max(widthFromAspectRatio(aspectRatio, adjustedHeight), minItemWidth);
                    flexBasis = `${idealWidth}px`;
                  }
                }
              }

              return (
                <div
                  key={`item-${rowIndex}-${childIndex}`}
                  className="flex-shrink-0"
                  style={{ 
                    flexBasis,
                    height: `${itemHeight}px`,
                  }}
                >
                  {child}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
