
import React, { useState, useRef, useEffect } from 'react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  return (
    <div ref={containerRef} className="relative w-full max-w-xl aspect-square mx-auto rounded-lg overflow-hidden shadow-lg select-none group">
        <img
            src={beforeImage}
            alt="Original"
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        />
        <img
            src={afterImage}
            alt="Resultado"
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        />
        <div 
            className="absolute top-0 left-0 w-px h-full bg-white/50 cursor-ew-resize"
            style={{ left: `calc(${sliderPosition}% - 1px)` }}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-75 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
            </div>
        </div>
        <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-full cursor-ew-resize opacity-0"
            aria-label="Image Comparison Slider"
        />
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Original
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Resultado
        </div>
    </div>
  );
};
