import React from 'react';
import { ASPECT_RATIO_OPTIONS } from '@/constants';
import type { AppMode, AspectRatio } from '@/types';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
  appMode: AppMode;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  value,
  onChange,
  appMode,
}) => {
  const isVideoMode = appMode === 'VIDEO';

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
        Format d'image
      </label>
      <div className="grid grid-cols-4 gap-2">
        {ASPECT_RATIO_OPTIONS.map((option) => {
          const disabled = isVideoMode && option.disabledInVideo;
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className={`p-2 rounded-lg border text-center transition-all ${
                disabled
                  ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50'
                  : selected
                    ? 'border-sola-primary bg-sola-primary/10 ring-1 ring-sola-primary'
                    : 'border-gray-200 bg-white hover:border-sola-primary/50'
              }`}
            >
              <span className={`block text-sm font-bold ${selected ? 'text-sola-primary' : 'text-gray-700'}`}>
                {option.value}
              </span>
              <span className="block text-[10px] text-gray-400 mt-0.5">{option.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
