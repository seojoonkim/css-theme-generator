'use client';

import { useState, useCallback, useRef } from 'react';
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
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [livePreviewActive, setLivePreviewActive] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const injectCssToIframe = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const styleId = 'injected-theme-style';
      let styleElement = doc.getElementById(styleId) as HTMLStyleElement | null;
      
      if (!styleElement) {
        styleElement = doc.createElement('style');
        styleElement.id = styleId;
        doc.head.appendChild(styleElement);
      }
      
      styleElement.textContent = cssCode;
    }
  }, [cssCode]);

  const handleLoadLivePreview = useCallback(async () => {
    if (!targetUrl.trim()) {
      alert('Please enter a target URL');
      return;
    }
    
    setLivePreviewActive(true);
    
    // Small delay to ensure iframe is loaded
    setTimeout(() => {
      injectCssToIframe();
    }, 500);
  }, [targetUrl, injectCssToIframe]);

  // Auto-inject CSS when theme changes (if live preview is active)
  if (livePreviewActive) {
    setTimeout(() => injectCssToIframe(), 100);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          🎨 CSS Theme Generator v2
        </h1>
      </div>

      {/* Main Content: Left 15% | Right 85% */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Controls (15%) */}
        <div className="w-1/6 bg-white border-r border-gray-300 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* Controls Section */}
            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <h3 className="text-sm font-bold mb-3 text-gray-800">⚙️ Theme Controls</h3>
              <Controls theme={theme} onThemeChange={handleThemeChange} />
            </div>

            {/* Generate Theme Button */}
            <button
              onClick={handleGenerateNewTheme}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-3 rounded text-sm hover:shadow-lg transition-all"
            >
              ✨ Random Theme
            </button>

            {/* Live Preview URL Input */}
            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <h3 className="text-sm font-bold mb-2 text-gray-800">🌐 Live Preview</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLoadLivePreview();
                    }
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleLoadLivePreview}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs transition-all"
                >
                  Load Website
                </button>
                {livePreviewActive && (
                  <button
                    onClick={() => {
                      setLivePreviewActive(false);
                      setTargetUrl('');
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs transition-all"
                  >
                    Close Preview
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Enter any URL to test theme. CSS injected in real-time!
              </p>
            </div>

            {/* CSS Code Preview (when not in live preview) */}
            {!livePreviewActive && (
              <div className="bg-gray-50 rounded p-3 border border-gray-200">
                <h3 className="text-xs font-bold mb-2 text-gray-800">Generated CSS</h3>
                <pre className="bg-gray-900 text-green-400 p-2 rounded overflow-x-auto text-xs leading-relaxed max-h-48 overflow-y-auto font-mono">
                  <code>{cssCode.substring(0, 300)}...</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Preview/Live (85%) */}
        <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col p-4">
          {!livePreviewActive ? (
            <>
              {/* Default Preview */}
              <div className="flex-1 bg-white rounded-lg shadow-lg overflow-y-auto">
                <Preview theme={theme} />
              </div>

              {/* Full CSS Code Display */}
              <div className="mt-4 bg-white rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto">
                <h2 className="text-lg font-bold mb-3 text-gray-800">Generated CSS Code</h2>
                <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-xs leading-relaxed font-mono">
                  <code>{cssCode}</code>
                </pre>
              </div>
            </>
          ) : (
            /* Live Preview Mode */
            <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                  📱 Live Preview: <span className="text-blue-600">{targetUrl}</span>
                </p>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={targetUrl}
                  title="Live Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
                  onLoad={() => {
                    injectCssToIframe();
                  }}
                />
              </div>
              <div className="bg-yellow-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-600">
                ⚠️ Some websites may block iframe loading due to CORS/X-Frame-Options headers.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
