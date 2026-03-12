'use client';

import React from 'react';

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  borderRadius: number;
  shadowIntensity: number;
  spacing: number;
  fontFamily: string;
  name?: string;
}

interface ThemePresetsProps {
  presets: Theme[];
  currentTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
  onRandomClick: () => void;
}

export default function ThemePresets({
  presets,
  currentTheme,
  onThemeSelect,
  onRandomClick,
}: ThemePresetsProps) {
  return (
    <div className="space-y-2">
      {/* Random Button */}
      <button
        onClick={onRandomClick}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
      >
        🎲 Random Theme
      </button>

      {/* Theme Presets Grid */}
      <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-800 px-1 sticky top-0 bg-white pt-1">
          Themes
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {presets.map((preset, index) => {
            const isSelected = currentTheme.name === preset.name;
            return (
              <button
                key={index}
                onClick={() => onThemeSelect(preset)}
                onMouseEnter={() => onThemeSelect(preset)}
                className={`group relative overflow-hidden rounded-lg p-2 transition-all transform ${
                  isSelected
                    ? 'ring-2 ring-offset-1 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
              >
                {/* Background */}
                <div
                  style={{ backgroundColor: preset.backgroundColor }}
                  className="absolute inset-0 -z-10"
                />

                {/* Content */}
                <div className="relative z-10 space-y-1">
                  {/* Theme Name */}
                  <p
                    style={{ color: preset.primaryColor }}
                    className="text-xs font-bold truncate"
                  >
                    {preset.name}
                  </p>

                  {/* Color Swatches */}
                  <div className="flex gap-1 h-6">
                    <div
                      style={{
                        backgroundColor: preset.primaryColor,
                        borderRadius: `${preset.borderRadius}px`,
                      }}
                      className="flex-1 border border-gray-200 shadow-sm"
                      title="Primary"
                    />
                    <div
                      style={{
                        backgroundColor: preset.secondaryColor,
                        borderRadius: `${preset.borderRadius}px`,
                      }}
                      className="flex-1 border border-gray-200 shadow-sm"
                      title="Secondary"
                    />
                    <div
                      style={{
                        backgroundColor: preset.textColor,
                        borderRadius: `${preset.borderRadius}px`,
                      }}
                      className="flex-1 border border-gray-200 shadow-sm"
                      title="Text"
                    />
                  </div>

                  {/* Extra Info */}
                  <div className="flex justify-between items-center text-xs">
                    <span
                      style={{ color: preset.textColor }}
                      className="text-xs opacity-75"
                    >
                      {preset.fontSize}px
                    </span>
                    <span
                      style={{ color: preset.secondaryColor }}
                      className="text-xs opacity-75"
                    >
                      r{preset.borderRadius}
                    </span>
                  </div>
                </div>

                {/* Hover Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
