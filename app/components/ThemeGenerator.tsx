'use client';

import { useState, useCallback } from 'react';
import Preview from './Preview';
import Controls from './Controls';

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

const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#52C0A1',
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateRandomFont = () => {
  const fonts = [
    'Georgia, serif',
    'Courier New, monospace',
    'Trebuchet MS, sans-serif',
    'Verdana, sans-serif',
    'Comic Sans MS, cursive',
    'Arial, sans-serif',
    'Impact, fantasy',
  ];
  return fonts[Math.floor(Math.random() * fonts.length)];
};

const generateRandomTheme = (): Theme => ({
  primaryColor: generateRandomColor(),
  secondaryColor: generateRandomColor(),
  backgroundColor: '#FFFFFF',
  textColor: '#333333',
  fontSize: 16,
  borderRadius: Math.floor(Math.random() * 20) + 4,
  shadowIntensity: Math.floor(Math.random() * 10) + 2,
  spacing: Math.floor(Math.random() * 10) + 8,
  fontFamily: generateRandomFont(),
});

export default function ThemeGenerator() {
  const [theme, setTheme] = useState<Theme>(generateRandomTheme());
  const [cssCode, setCssCode] = useState<string>('');

  const generateCSSCode = useCallback((t: Theme) => {
    const shadowValue = `0 ${4 + t.shadowIntensity}px ${8 + t.shadowIntensity * 2}px rgba(0, 0, 0, 0.1)`;
    const css = `/* Generated CSS Theme */
:root {
  --primary-color: ${t.primaryColor};
  --secondary-color: ${t.secondaryColor};
  --bg-color: ${t.backgroundColor};
  --text-color: ${t.textColor};
  --font-size-base: ${t.fontSize}px;
  --border-radius: ${t.borderRadius}px;
  --shadow: ${shadowValue};
  --spacing-unit: ${t.spacing}px;
  --font-family: ${t.fontFamily};
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
}

button, a {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 ${8 + t.shadowIntensity * 2}px ${12 + t.shadowIntensity * 3}px rgba(0, 0, 0, 0.15);
}

.card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 2);
  box-shadow: var(--shadow);
  border-left: 4px solid var(--secondary-color);
}

input[type="range"] {
  width: 100%;
  margin: 0.5rem 0;
}

.slider-value {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  display: inline-block;
}`;
    setCssCode(css);
  }, []);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    generateCSSCode(newTheme);
  }, [generateCSSCode]);

  const handleGenerateNewTheme = useCallback(() => {
    const newTheme = generateRandomTheme();
    handleThemeChange(newTheme);
  }, [handleThemeChange]);

  // Initialize CSS code
  if (!cssCode) {
    generateCSSCode(theme);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          🎨 CSS Theme Generator
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Controls theme={theme} onThemeChange={handleThemeChange} />
            <button
              onClick={handleGenerateNewTheme}
              className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
            >
              ✨ Generate New Theme
            </button>
          </div>

          {/* Right: Preview + Code */}
          <div className="space-y-6">
            <Preview theme={theme} />
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Generated CSS</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-xs leading-relaxed max-h-96 overflow-y-auto">
                <code>{cssCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
