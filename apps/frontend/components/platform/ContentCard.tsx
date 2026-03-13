import React from 'react';
import { Play, Mic, Clock, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ContentCardProps {
  title: string;
  author: string;
  category: string;
  thumbnail: string;
  duration?: string;
  views?: string;
  type: 'video' | 'podcast' | 'short';
}

const ContentCard = ({ title, author, category, thumbnail, duration, views, type }: ContentCardProps) => {
  return (
    <div className={cn(
      "group cursor-pointer flex flex-col gap-3",
      type === 'short' ? "aspect-[9/16]" : ""
    )}>
      <div className={cn(
        "relative rounded-xl overflow-hidden bg-gray-100",
        type === 'short' ? "h-full" : "aspect-video"
      )}>
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {duration}
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {type === 'podcast' ? (
            <div className="bg-white p-3 rounded-full text-indigo-600 shadow-xl">
              <Mic className="w-6 h-6 fill-current" />
            </div>
          ) : (
            <div className="bg-white p-3 rounded-full text-indigo-600 shadow-xl">
              <Play className="w-6 h-6 fill-current" />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        {type !== 'short' && (
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold">
            {author[0]}
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{author}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{category}</span>
            {views && (
              <>
                <span>•</span>
                <span>{views}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
