"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchBoards } from "@/app/api/boards";
import { Board } from "../cards/Board";

interface Board {
  id: string;
  title: string;
  thumbnails?: string[];
}

export function BoardsSection() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const { data } = await fetchBoards();
        setBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBoards();
  }, []);

  return (
    <section className="py-4">
      <div>
        <div 
          className="inline-flex items-center cursor-pointer mb-6 group px-2 py-1 rounded-md hover:bg-gray-100 w-fit"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-sm font-bold text-gray-500">BOARDS {isLoading ? '' : `(${boards.length})`}</h2>
          <ChevronRight 
            className={`h-4 w-4 text-gray-500 transition-transform ml-1 opacity-0 group-hover:opacity-100 ${isExpanded ? 'rotate-90' : ''}`}
          />
        </div>
        
        {isExpanded && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {boards.map((board) => (
              <Board 
                key={board.id}
                id={board.id}
                title={board.title}
                thumbnails={board.thumbnails}
              />
            ))}
          </div>
        )}

        {isLoading && isExpanded && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </section>
  );
}
