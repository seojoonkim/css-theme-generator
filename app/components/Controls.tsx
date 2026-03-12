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
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <span className="text-sm font-bold text-gray-600 min-w-[60px] text-right">
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
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 border-2 border-gray-300 rounded cursor-pointer"
        />
        <span className="text-sm font-mono text-gray-600">{value}</span>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Theme Controls</h2>

      <div className="space-y-6">
        {/* Colors */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Colors</h3>
          <ColorControl
            label="Primary Color"
            value={theme.primaryColor}
            onChange={(val) => handleChange('primaryColor', val)}
          />
          <ColorControl
            label="Secondary Color"
            value={theme.secondaryColor}
            onChange={(val) => handleChange('secondaryColor', val)}
          />
          <ColorControl
            label="Background Color"
            value={theme.backgroundColor}
            onChange={(val) => handleChange('backgroundColor', val)}
          />
          <ColorControl
            label="Text Color"
            value={theme.textColor}
            onChange={(val) => handleChange('textColor', val)}
          />
        </div>

        {/* Typography */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Typography</h3>
          <SliderControl
            label="Font Size"
            value={theme.fontSize}
            min={12}
            max={32}
            onChange={(val) => handleChange('fontSize', val)}
            unit="px"
          />
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={theme.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="Georgia, serif">Georgia (Serif)</option>
              <option value="Courier New, monospace">Courier New (Monospace)</option>
              <option value="Trebuchet MS, sans-serif">Trebuchet MS (Sans-serif)</option>
              <option value="Verdana, sans-serif">Verdana (Sans-serif)</option>
              <option value="Comic Sans MS, cursive">Comic Sans (Cursive)</option>
              <option value="Arial, sans-serif">Arial (Sans-serif)</option>
              <option value="Impact, fantasy">Impact (Fantasy)</option>
            </select>
          </div>
        </div>

        {/* Effects */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Effects</h3>
          <SliderControl
            label="Border Radius"
            value={theme.borderRadius}
            min={0}
            max={30}
            onChange={(val) => handleChange('borderRadius', val)}
            unit="px"
          />
          <SliderControl
            label="Shadow Intensity"
            value={theme.shadowIntensity}
            min={0}
            max={20}
            onChange={(val) => handleChange('shadowIntensity', val)}
          />
          <SliderControl
            label="Spacing Unit"
            value={theme.spacing}
            min={4}
            max={24}
            onChange={(val) => handleChange('spacing', val)}
            unit="px"
          />
        </div>
      </div>
    </div>
  );
}
