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

interface PreviewProps {
  theme: Theme;
}

export default function Preview({ theme }: PreviewProps) {
  const shadowValue = `0 ${4 + theme.shadowIntensity}px ${8 + theme.shadowIntensity * 2}px rgba(0, 0, 0, 0.1)`;

  const previewStyle = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    fontSize: `${theme.fontSize}px`,
  };

  const buttonStyle = {
    backgroundColor: theme.primaryColor,
    color: 'white',
    padding: `${theme.spacing / 2}px ${theme.spacing}px`,
    borderRadius: `${theme.borderRadius}px`,
    boxShadow: shadowValue,
    border: 'none',
    cursor: 'pointer',
    fontSize: `${theme.fontSize - 2}px`,
    fontWeight: '600',
    transition: 'all 0.3s ease',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: `${theme.borderRadius}px`,
    padding: `${theme.spacing * 2}px`,
    boxShadow: shadowValue,
    borderLeft: `4px solid ${theme.secondaryColor}`,
    marginBottom: `${theme.spacing}px`,
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-8 min-h-[600px] overflow-hidden"
      style={previewStyle}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.textColor }}>
        Live Preview
      </h2>

      {/* Card Examples */}
      <div style={cardStyle}>
        <h3 className="font-bold mb-2" style={{ color: theme.primaryColor }}>
          Card Title
        </h3>
        <p style={{ fontSize: `${theme.fontSize - 2}px` }}>
          This is a themed card with custom styling. Watch it change in real-time!
        </p>
      </div>

      <div style={cardStyle}>
        <h3 className="font-bold mb-2" style={{ color: theme.secondaryColor }}>
          Another Card
        </h3>
        <p style={{ fontSize: `${theme.fontSize - 2}px` }}>
          Explore different theme combinations to find your perfect design.
        </p>
      </div>

      {/* Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <button style={buttonStyle} className="hover:opacity-90">
          Primary Button
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: theme.secondaryColor,
          }}
          className="hover:opacity-90"
        >
          Secondary Button
        </button>
      </div>

      {/* Color Showcase */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">Color Palette</h3>
        <div className="flex gap-3 flex-wrap">
          <div
            style={{
              backgroundColor: theme.primaryColor,
              width: '80px',
              height: '80px',
              borderRadius: `${theme.borderRadius}px`,
              boxShadow: shadowValue,
            }}
            title="Primary Color"
          />
          <div
            style={{
              backgroundColor: theme.secondaryColor,
              width: '80px',
              height: '80px',
              borderRadius: `${theme.borderRadius}px`,
              boxShadow: shadowValue,
            }}
            title="Secondary Color"
          />
          <div
            style={{
              backgroundColor: theme.backgroundColor,
              width: '80px',
              height: '80px',
              borderRadius: `${theme.borderRadius}px`,
              boxShadow: shadowValue,
              border: `2px solid ${theme.textColor}`,
            }}
            title="Background Color"
          />
        </div>
      </div>

      {/* Typography Showcase */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">Typography</h3>
        <p style={{ fontSize: `${theme.fontSize}px`, fontWeight: '700' }}>
          Large Heading {theme.fontSize}px
        </p>
        <p style={{ fontSize: `${theme.fontSize - 2}px` }} className="text-gray-600">
          Regular Text {theme.fontSize - 2}px
        </p>
        <p style={{ fontSize: `${theme.fontSize - 4}px` }} className="text-gray-500">
          Small Text {theme.fontSize - 4}px
        </p>
      </div>

      {/* Theme Stats */}
      <div
        style={{
          ...cardStyle,
          backgroundColor: theme.primaryColor + '15',
          borderLeft: `4px solid ${theme.primaryColor}`,
        }}
      >
        <h4 className="font-bold mb-2">Current Theme Settings</h4>
        <div style={{ fontSize: `${theme.fontSize - 3}px` }} className="space-y-1">
          <p>Border Radius: {theme.borderRadius}px</p>
          <p>Shadow Intensity: {theme.shadowIntensity}</p>
          <p>Spacing Unit: {theme.spacing}px</p>
          <p>Font: {theme.fontFamily}</p>
        </div>
      </div>
    </div>
  );
}
