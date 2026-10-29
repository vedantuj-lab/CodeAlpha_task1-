import React from 'react';

export const LoadingState: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
      role="status"
      aria-label="Loading photographs"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border border-[#DDD8CE] shadow-xs flex flex-col"
        >
          <div className="w-full aspect-4/3 skeleton-shimmer" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/3 bg-[#EDE9E1] rounded skeleton-shimmer" />
            <div className="h-5 w-3/4 bg-[#EDE9E1] rounded skeleton-shimmer" />
            <div className="h-3 w-full bg-[#EDE9E1] rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};
