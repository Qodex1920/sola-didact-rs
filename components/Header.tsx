import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-sola-beige border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sola-brick rounded-md flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="text-xl font-bold text-sola-text tracking-tight">
            Sola Didact <span className="font-light text-gray-500">Studio</span>
          </h1>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          Internal Build v1.0
        </div>
      </div>
    </header>
  );
};