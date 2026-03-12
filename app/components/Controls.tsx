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
}

interface ControlsProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function Controls({ theme, onThemeChange }: ControlsProps) {
  const handleChange = (key: keyof Theme, value: any) => {
    const newTheme = { ...theme, [key]: value };
    onThemeChange(newTheme);
  };

  const SliderControl = ({
    label,
    value,
    min,
    max,
    onChange,
    unit = '',
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    unit?: string;
  }) => (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <span className="text-xs font-bold text-gray-600 min-w-[50px] text-right bg-blue-100 px-2 py-0.5 rounded">
          {value}{unit}
        </span>
      </div>
    </div>
  );

  const ColorControl = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
  }) => (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 border-2 border-gray-300 rounded cursor-pointer"
        />
        <span className="text-xs font-mono text-gray-600 flex-1 truncate">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Colors */}
      <div>
        <h4 className="text-xs font-bold text-blue-600 mb-2">🎨 Colors</h4>
        <ColorControl
          label="Primary"
          value={theme.primaryColor}
          onChange={(val) => handleChange('primaryColor', val)}
        />
        <ColorControl
          label="Secondary"
          value={theme.secondaryColor}
          onChange={(val) => handleChange('secondaryColor', val)}
        />
        <ColorControl
          label="Background"
          value={theme.backgroundColor}
          onChange={(val) => handleChange('backgroundColor', val)}
        />
        <ColorControl
          label="Text"
          value={theme.textColor}
          onChange={(val) => handleChange('textColor', val)}
        />
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-xs font-bold text-purple-600 mb-2">✍️ Typography</h4>
        <SliderControl
          label="Font Size"
          value={theme.fontSize}
          min={12}
          max={32}
          onChange={(val) => handleChange('fontSize', val)}
          unit="px"
        />
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Font Family
          </label>
          <select
            value={theme.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full p-1 border-2 border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="Georgia, serif">Georgia</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Trebuchet MS, sans-serif">Trebuchet</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Comic Sans MS, cursive">Comic Sans</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Impact, fantasy">Impact</option>
          </select>
        </div>
      </div>

      {/* Effects */}
      <div>
        <h4 className="text-xs font-bold text-green-600 mb-2">✨ Effects</h4>
        <SliderControl
          label="Border Radius"
          value={theme.borderRadius}
          min={0}
          max={30}
          onChange={(val) => handleChange('borderRadius', val)}
          unit="px"
        />
        <SliderControl
          label="Shadow"
          value={theme.shadowIntensity}
          min={0}
          max={20}
          onChange={(val) => handleChange('shadowIntensity', val)}
        />
        <SliderControl
          label="Spacing"
          value={theme.spacing}
          min={4}
          max={24}
          onChange={(val) => handleChange('spacing', val)}
          unit="px"
        />
      </div>
    </div>
  );
}
