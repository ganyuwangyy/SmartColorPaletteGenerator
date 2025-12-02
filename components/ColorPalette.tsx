import React, { useState } from 'react';

interface ColorPaletteProps {
  colors: string[];
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const renderSwatch = (color: string, index: number) => (
    <div
      key={index}
      className="w-20 h-40 rounded-2xl shadow-md flex flex-col justify-between p-2 text-center overflow-hidden transition-transform transform hover:scale-105 border border-black/10"
      style={{ backgroundColor: color }}
      aria-label={`Color swatch for ${color}`}
    >
      {/* Container for Hex Code */}
      <div className="bg-white/80 backdrop-blur-sm p-1 rounded-md">
        <span className="font-mono text-[11px] text-slate-700 font-medium tracking-wide">
          {color}
        </span>
      </div>

      {/* Container for Copy Button with relative positioning for the tooltip */}
      <div className="relative">
        <button
          onClick={() => handleCopy(color)}
          className="px-3 py-1 bg-black/20 text-white text-[10px] font-semibold rounded-lg hover:bg-black/40 focus:outline-none focus:ring-1 focus:ring-white/50 transition shadow-sm"
          aria-label={`Copy hex code ${color}`}
        >
          Copy Hex
        </button>
        {copiedColor === color && (
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded-md z-10 whitespace-nowrap">
            Copied!
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      {colors.map(renderSwatch)}
    </div>
  );
};

export default ColorPalette;