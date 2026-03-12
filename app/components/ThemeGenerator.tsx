'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ThemePresets from './ThemePresets';

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

type IframeLoadState = 'idle' | 'loading' | 'success' | 'error';

// 기본 테마 프리셋
const DEFAULT_PRESETS: Theme[] = [
  {
    name: 'Ocean Blue',
    primaryColor: '#0077BE',
    secondaryColor: '#00D4FF',
    backgroundColor: '#F0F9FF',
    textColor: '#1F2937',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 4,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: 'Sunset',
    primaryColor: '#FF6B35',
    secondaryColor: '#FFA500',
    backgroundColor: '#FFF8F0',
    textColor: '#2C3E50',
    fontSize: 16,
    borderRadius: 12,
    shadowIntensity: 6,
    spacing: 14,
    fontFamily: 'Georgia, serif',
  },
  {
    name: 'Forest Green',
    primaryColor: '#2D6A4F',
    secondaryColor: '#52B788',
    backgroundColor: '#F1FAEE',
    textColor: '#1B4332',
    fontSize: 16,
    borderRadius: 6,
    shadowIntensity: 3,
    spacing: 10,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: 'Purple Haze',
    primaryColor: '#7209B7',
    secondaryColor: '#B5179E',
    backgroundColor: '#F8F7FF',
    textColor: '#2A0845',
    fontSize: 16,
    borderRadius: 10,
    shadowIntensity: 5,
    spacing: 12,
    fontFamily: 'Trebuchet MS, sans-serif',
  },
  {
    name: 'Coral Reef',
    primaryColor: '#FF006E',
    secondaryColor: '#FF6B9D',
    backgroundColor: '#FFF0F6',
    textColor: '#370617',
    fontSize: 16,
    borderRadius: 14,
    shadowIntensity: 6,
    spacing: 13,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: 'Midnight',
    primaryColor: '#1F2937',
    secondaryColor: '#6366F1',
    backgroundColor: '#0F172A',
    textColor: '#E5E7EB',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 8,
    spacing: 12,
    fontFamily: 'Courier New, monospace',
  },
  {
    name: 'Mint Fresh',
    primaryColor: '#06B6D4',
    secondaryColor: '#10B981',
    backgroundColor: '#F0FDFA',
    textColor: '#164E63',
    fontSize: 16,
    borderRadius: 12,
    shadowIntensity: 4,
    spacing: 11,
    fontFamily: 'Verdana, sans-serif',
  },
  {
    name: 'Vintage',
    primaryColor: '#A16207',
    secondaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    textColor: '#451A03',
    fontSize: 16,
    borderRadius: 4,
    shadowIntensity: 2,
    spacing: 10,
    fontFamily: 'Georgia, serif',
  },
  {
    name: 'Neon',
    primaryColor: '#00FFF5',
    secondaryColor: '#FF006E',
    backgroundColor: '#0A0E27',
    textColor: '#FFFFFF',
    fontSize: 16,
    borderRadius: 16,
    shadowIntensity: 10,
    spacing: 15,
    fontFamily: 'Impact, fantasy',
  },
  {
    name: 'Pastel Dream',
    primaryColor: '#F472B6',
    secondaryColor: '#A78BFA',
    backgroundColor: '#FDF2F8',
    textColor: '#581C87',
    fontSize: 16,
    borderRadius: 20,
    shadowIntensity: 3,
    spacing: 13,
    fontFamily: 'Arial, sans-serif',
  },
];

const generateCSSCode = (t: Theme): string => {
  const shadowValue = `0 ${4 + t.shadowIntensity}px ${8 + t.shadowIntensity * 2}px rgba(0, 0, 0, 0.1)`;
  return `/* Generated CSS Theme: ${t.name} */
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

* {
  box-sizing: border-box;
}

html, body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

button, a.btn, input[type="button"], input[type="submit"] {
  background-color: var(--primary-color);
  color: white;
  padding: calc(var(--spacing-unit) * 0.75) var(--spacing-unit);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  text-decoration: none;
  font-family: inherit;
  font-size: inherit;
}

button:hover, a.btn:hover, input[type="button"]:hover, input[type="submit"]:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 ${8 + t.shadowIntensity * 2}px ${12 + t.shadowIntensity * 3}px rgba(0, 0, 0, 0.15);
}

.card, [class*="card"], [class*="box"], article {
  background-color: white;
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 1.5);
  box-shadow: var(--shadow);
  margin-bottom: var(--spacing-unit);
}

h1, h2, h3, h4, h5, h6 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-unit);
}

input, textarea, select {
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 0.5);
  font-family: inherit;
  font-size: inherit;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-color)33;
}

a {
  color: var(--primary-color);
  text-decoration: underline;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--secondary-color);
}`;
};

export default function ThemeGenerator() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(DEFAULT_PRESETS[0]);
  const [cssCode, setCssCode] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [livePreviewActive, setLivePreviewActive] = useState<boolean>(false);
  const [presets, setPresets] = useState<Theme[]>(DEFAULT_PRESETS);
  const [iframeLoadState, setIframeLoadState] = useState<IframeLoadState>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // CSS 코드 생성
  useEffect(() => {
    setCssCode(generateCSSCode(currentTheme));
  }, [currentTheme]);

  // 테마 변경 시 iframe에 CSS 주입
  const injectCssToIframe = useCallback((theme: Theme) => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const styleId = 'injected-theme-style';
      let styleElement = doc.getElementById(styleId) as HTMLStyleElement | null;
      
      if (!styleElement) {
        styleElement = doc.createElement('style');
        styleElement.id = styleId;
        doc.head.appendChild(styleElement);
      }
      
      styleElement.textContent = generateCSSCode(theme);
    }
  }, []);

  // 웹사이트 로드 및 CSS 분석
  const handleLoadLivePreview = useCallback(async () => {
    if (!targetUrl.trim()) {
      alert('Please enter a target URL');
      return;
    }
    
    setLivePreviewActive(true);
    setIframeLoadState('loading');
  }, [targetUrl]);

  // iframe 로드 완료 시 CSS 주입
  const handleIframeLoad = useCallback(() => {
    try {
      setIframeLoadState('success');
      injectCssToIframe(currentTheme);
    } catch (error) {
      setIframeLoadState('error');
      console.error('Error loading iframe:', error);
    }
  }, [currentTheme, injectCssToIframe]);

  // iframe 로드 에러
  const handleIframeError = useCallback(() => {
    setIframeLoadState('error');
  }, []);

  // 테마 선택 시
  const handleThemeSelect = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    if (livePreviewActive) {
      injectCssToIframe(theme);
    }
  }, [livePreviewActive, injectCssToIframe]);

  // Random 테마 선택
  const handleRandomTheme = useCallback(() => {
    const randomTheme = presets[Math.floor(Math.random() * presets.length)];
    handleThemeSelect(randomTheme);
  }, [presets, handleThemeSelect]);

  return (
    <div className="w-screen h-screen bg-gray-100 flex overflow-hidden">
      {/* Main Content: Left 15% | Right 85% */}
      <div className="flex w-full h-full">
        {/* Left Panel: Theme Presets (15%) */}
        <div className="w-[15%] bg-white border-r border-gray-300 overflow-y-auto p-3 space-y-3">
          {/* URL Input Section */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 sticky top-0">
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
          </div>

          {/* Theme Presets */}
          <ThemePresets
            presets={presets}
            currentTheme={currentTheme}
            onThemeSelect={handleThemeSelect}
            onRandomClick={handleRandomTheme}
          />

          {/* CSS Code Preview */}
          {!livePreviewActive && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h3 className="text-xs font-bold mb-2 text-gray-800">Generated CSS</h3>
              <pre className="bg-gray-900 text-green-400 p-2 rounded overflow-x-auto text-xs leading-relaxed max-h-48 overflow-y-auto font-mono">
                <code>{cssCode.substring(0, 400)}...</code>
              </pre>
            </div>
          )}
        </div>

        {/* Right Panel: Preview/Live (85%) */}
        <div className="w-[85%] bg-gray-50 overflow-hidden flex flex-col p-4">
          {!livePreviewActive ? (
            /* Static Preview Mode */
            <div className="flex-1 bg-white rounded-lg shadow-lg overflow-y-auto p-6">
              <div style={{
                backgroundColor: currentTheme.backgroundColor,
                color: currentTheme.textColor,
                fontFamily: currentTheme.fontFamily,
                fontSize: `${currentTheme.fontSize}px`,
              }} className="h-full">
                <h1 style={{ color: currentTheme.primaryColor }} className="text-2xl font-bold mb-4">
                  Theme Preview: {currentTheme.name}
                </h1>
                
                {/* Color Palette */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3">Color Palette</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div
                        style={{
                          backgroundColor: currentTheme.primaryColor,
                          borderRadius: `${currentTheme.borderRadius}px`,
                        }}
                        className="h-16 mb-2 shadow-lg"
                      />
                      <p className="text-sm font-semibold">Primary: {currentTheme.primaryColor}</p>
                    </div>
                    <div>
                      <div
                        style={{
                          backgroundColor: currentTheme.secondaryColor,
                          borderRadius: `${currentTheme.borderRadius}px`,
                        }}
                        className="h-16 mb-2 shadow-lg"
                      />
                      <p className="text-sm font-semibold">Secondary: {currentTheme.secondaryColor}</p>
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3">Components</h2>
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: `${currentTheme.borderRadius}px`,
                      padding: `${currentTheme.spacing * 1.5}px`,
                      boxShadow: `0 ${4 + currentTheme.shadowIntensity}px ${8 + currentTheme.shadowIntensity * 2}px rgba(0, 0, 0, 0.1)`,
                    }}
                    className="mb-3"
                  >
                    <h3 style={{ color: currentTheme.primaryColor }} className="font-bold mb-2">
                      Card Example
                    </h3>
                    <p className="text-sm">This is how your theme looks on cards and components.</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3">Buttons</h2>
                  <div className="flex gap-3">
                    <button
                      style={{
                        backgroundColor: currentTheme.primaryColor,
                        borderRadius: `${currentTheme.borderRadius}px`,
                        padding: `${currentTheme.spacing * 0.75}px ${currentTheme.spacing}px`,
                      }}
                      className="text-white font-bold text-sm transition-all hover:opacity-90"
                    >
                      Primary
                    </button>
                    <button
                      style={{
                        backgroundColor: currentTheme.secondaryColor,
                        borderRadius: `${currentTheme.borderRadius}px`,
                        padding: `${currentTheme.spacing * 0.75}px ${currentTheme.spacing}px`,
                      }}
                      className="text-white font-bold text-sm transition-all hover:opacity-90"
                    >
                      Secondary
                    </button>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h2 className="text-lg font-bold mb-3">Typography</h2>
                  <p style={{ fontSize: `${currentTheme.fontSize}px`, fontWeight: 700 }} className="mb-2">
                    Large Text ({currentTheme.fontSize}px)
                  </p>
                  <p style={{ fontSize: `${currentTheme.fontSize - 2}px` }} className="text-sm mb-2">
                    Regular Text ({currentTheme.fontSize - 2}px)
                  </p>
                  <p style={{ fontSize: `${currentTheme.fontSize - 4}px` }} className="text-xs opacity-75">
                    Small Text ({currentTheme.fontSize - 4}px)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Live Preview Mode */
            <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-800">
                  📱 Live: <span className="text-blue-600 truncate">{targetUrl}</span>
                </p>
                <span
                  style={{
                    backgroundColor: currentTheme.primaryColor,
                  }}
                  className="text-white text-xs px-2 py-1 rounded font-bold ml-2 whitespace-nowrap"
                >
                  {currentTheme.name}
                </span>
              </div>
              
              {/* Loading State */}
              {iframeLoadState === 'loading' && (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100">
                      <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 font-semibold">Loading website...</p>
                    <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {iframeLoadState === 'error' && (
                <div className="flex-1 flex items-center justify-center bg-red-50">
                  <div className="text-center px-6">
                    <div className="text-4xl mb-3">🚫</div>
                    <p className="text-gray-800 font-semibold mb-2">Unable to Load Website</p>
                    <p className="text-sm text-gray-600 mb-4">
                      This website may have blocked iframe access for security reasons (CORS/X-Frame-Options).
                    </p>
                    <p className="text-xs text-gray-500 bg-yellow-100 rounded p-3">
                      💡 Try websites like: naver.com, wikipedia.org, or your own website
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {iframeLoadState === 'success' && (
                <div className="flex-1 overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    src={targetUrl}
                    title="Live Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-top-navigation"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                </div>
              )}

              {/* Always show iframe for loading (hidden initially) */}
              <iframe
                ref={iframeRef}
                src={iframeLoadState === 'idle' ? '' : targetUrl}
                title="Live Preview"
                className={`w-full h-full border-0 ${iframeLoadState !== 'success' ? 'hidden' : ''}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-top-navigation"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
