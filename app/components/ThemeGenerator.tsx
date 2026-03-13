'use client';

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { flushSync } from 'react-dom';
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

interface LoadMetadata {
  url: string;
  title: string;
  iframeBlocked?: boolean;
  blockReason?: string;
  xFrameOptions?: string;
  cspPresent?: boolean;
}

// 기본 테마 프리셋 (확장: 20개+)
const DEFAULT_PRESETS: Theme[] = [
  // 카테고리 1: 원본 (10개)
  {
    name: '🌊 Ocean Blue',
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
    name: '🌅 Sunset',
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
    name: '🌲 Forest Green',
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
    name: '💜 Purple Haze',
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
    name: '🪸 Coral Reef',
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
    name: '🌙 Midnight',
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
    name: '🌿 Mint Fresh',
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
    name: '📖 Vintage',
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
    name: '⚡ Neon',
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
    name: '🍰 Pastel Dream',
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

  // 카테고리 2: Material Design (5개)
  {
    name: '🔴 Material Red',
    primaryColor: '#F44336',
    secondaryColor: '#E91E63',
    backgroundColor: '#FFEBEE',
    textColor: '#212121',
    fontSize: 16,
    borderRadius: 4,
    shadowIntensity: 4,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '🟦 Material Blue',
    primaryColor: '#2196F3',
    secondaryColor: '#03A9F4',
    backgroundColor: '#E3F2FD',
    textColor: '#212121',
    fontSize: 16,
    borderRadius: 4,
    shadowIntensity: 4,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '🟩 Material Green',
    primaryColor: '#4CAF50',
    secondaryColor: '#8BC34A',
    backgroundColor: '#F1F8E9',
    textColor: '#212121',
    fontSize: 16,
    borderRadius: 4,
    shadowIntensity: 4,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '🟧 Material Orange',
    primaryColor: '#FF9800',
    secondaryColor: '#FFC107',
    backgroundColor: '#FFF3E0',
    textColor: '#212121',
    fontSize: 16,
    borderRadius: 4,
    shadowIntensity: 4,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '🟪 Material Purple',
    primaryColor: '#9C27B0',
    secondaryColor: '#673AB7',
    backgroundColor: '#F3E5F5',
    textColor: '#212121',
    fontSize: 16,
    borderRadius: 4,
    shadowIntensity: 4,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },

  // 카테고리 3: Dark Mode (5개)
  {
    name: '⬛ Dark Slate',
    primaryColor: '#64748B',
    secondaryColor: '#475569',
    backgroundColor: '#0F172A',
    textColor: '#F1F5F9',
    fontSize: 16,
    borderRadius: 6,
    shadowIntensity: 6,
    spacing: 12,
    fontFamily: 'Courier New, monospace',
  },
  {
    name: '🖤 Dark Charcoal',
    primaryColor: '#60A5FA',
    secondaryColor: '#3B82F6',
    backgroundColor: '#1F2937',
    textColor: '#F3F4F6',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 8,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '💚 Dark Green',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#111827',
    textColor: '#F3F4F6',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 8,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '🔥 Dark Fire',
    primaryColor: '#EF4444',
    secondaryColor: '#DC2626',
    backgroundColor: '#1F2937',
    textColor: '#F3F4F6',
    fontSize: 16,
    borderRadius: 6,
    shadowIntensity: 8,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '✨ Dark Minimal',
    primaryColor: '#FFFFFF',
    secondaryColor: '#E5E7EB',
    backgroundColor: '#000000',
    textColor: '#F3F4F6',
    fontSize: 16,
    borderRadius: 4,
    shadowIntensity: 10,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },

  // 카테고리 4: Tailwind Colors (5개)
  {
    name: '💚 Tailwind Emerald',
    primaryColor: '#10B981',
    secondaryColor: '#34D399',
    backgroundColor: '#F0FDF4',
    textColor: '#064E3B',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 3,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '💙 Tailwind Cyan',
    primaryColor: '#06B6D4',
    secondaryColor: '#22D3EE',
    backgroundColor: '#F0F9FB',
    textColor: '#164E63',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 3,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '💜 Tailwind Violet',
    primaryColor: '#7C3AED',
    secondaryColor: '#A78BFA',
    backgroundColor: '#F5F3FF',
    textColor: '#4C1D95',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 3,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '❤️ Tailwind Rose',
    primaryColor: '#FB7185',
    secondaryColor: '#F472B6',
    backgroundColor: '#FFF1F2',
    textColor: '#831843',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 3,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
  {
    name: '⭐ Tailwind Amber',
    primaryColor: '#F59E0B',
    secondaryColor: '#FBBF24',
    backgroundColor: '#FFFBEB',
    textColor: '#78350F',
    fontSize: 16,
    borderRadius: 8,
    shadowIntensity: 3,
    spacing: 12,
    fontFamily: 'Arial, sans-serif',
  },
];

const generateCSSCode = (t: Theme): string => {
  const shadowValue = `0 ${4 + t.shadowIntensity}px ${8 + t.shadowIntensity * 2}px rgba(0, 0, 0, 0.1)`;
  return `/* Generated CSS Theme: ${t.name} */
/* 🎨 CSS 변수 정의 — 다른 CSS와 충돌 최소화 */
:root {
  --raon-primary-color: ${t.primaryColor};
  --raon-secondary-color: ${t.secondaryColor};
  --raon-bg-color: ${t.backgroundColor};
  --raon-text-color: ${t.textColor};
  --raon-font-size-base: ${t.fontSize}px;
  --raon-border-radius: ${t.borderRadius}px;
  --raon-shadow: ${shadowValue};
  --raon-spacing-unit: ${t.spacing}px;
  --raon-font-family: ${t.fontFamily};
}

/* 📌 버튼 — 색상만 변경 */
button,
input[type="button"],
input[type="submit"],
a.btn,
[role="button"] {
  background-color: var(--raon-primary-color) !important;
  color: white !important;
}

button:hover,
input[type="button"]:hover,
input[type="submit"]:hover,
a.btn:hover,
[role="button"]:hover {
  opacity: 0.9;
}

/* 📌 링크 — 색상만 변경 */
a {
  color: var(--raon-primary-color) !important;
}

a:hover {
  color: var(--raon-secondary-color) !important;
}

/* 📌 헤딩 — 색상만 변경 */
h1, h2, h3, h4, h5, h6 {
  color: var(--raon-primary-color) !important;
}

/* 📌 입력 필드 — 테두리 색상만 변경 */
input:not([type="button"]):not([type="submit"]),
textarea,
select {
  border-color: var(--raon-primary-color) !important;
}

input:focus,
textarea:focus,
select:focus {
  outline: none !important;
  border-color: var(--raon-primary-color) !important;
  box-shadow: 0 0 0 3px var(--raon-primary-color)33 !important;
}`;
};

export default function ThemeGenerator() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(DEFAULT_PRESETS[0]);
  const [cssCode, setCssCode] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [livePreviewActive, setLivePreviewActive] = useState<boolean>(false);
  const [presets, setPresets] = useState<Theme[]>(DEFAULT_PRESETS);
  const [iframeLoadState, setIframeLoadState] = useState<IframeLoadState>('idle');
  const [metadata, setMetadata] = useState<LoadMetadata | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // CSS 코드 생성
  useEffect(() => {
    setCssCode(generateCSSCode(currentTheme));
  }, [currentTheme]);

  // 테마 변경 시 iframe에 CSS 주입 (contentDocument 직접 접근)
  const injectCssToIframe = useCallback((theme: Theme) => {
    try {
      if (!iframeRef.current) {
        console.warn('iframe not mounted yet');
        return;
      }

      const iframe = iframeRef.current;
      // contentDocument에 직접 접근 (srcdoc는 same-origin이므로 접근 가능)
      const doc = iframe.contentDocument;
      
      if (!doc) {
        console.warn('Cannot access iframe.contentDocument');
        return;
      }

      const styleId = 'raon-theme-style';
      let styleElement = doc.getElementById(styleId) as HTMLStyleElement | null;
      
      if (!styleElement) {
        // head가 없으면 만들기
        if (!doc.head) {
          const head = doc.createElement('head');
          doc.insertBefore(head, doc.firstChild);
        }
        
        styleElement = doc.createElement('style');
        styleElement.id = styleId;
        styleElement.type = 'text/css';
        // 끝에 추가해서 기존 스타일과 섞이게 함 (우선순위는 !important로)
        doc.head.appendChild(styleElement);
      }
      
      const cssCode = generateCSSCode(theme);
      styleElement.textContent = cssCode;
      
      console.log('✅ CSS injected successfully:', theme.name);
    } catch (error) {
      console.error('❌ CSS injection failed:', error);
    }
  }, []);

  // 웹사이트 로드 및 CSS 분석 (프록시 기반)
  // 펫칭한 HTML을 저장할 상태
  const [pendingHtml, setPendingHtml] = useState<string | null>(null);

  // HTML 주입 헬퍼 함수
  const injectHtmlToIframe = useCallback((html: string, theme: Theme) => {
    try {
      if (!iframeRef.current) {
        console.warn('❌ iframe not mounted yet');
        return false;
      }
      
      console.log('💉 Injecting HTML into iframe');
      let htmlWithCSS = html;
      const cssCode = generateCSSCode(theme);
      
      if (htmlWithCSS.includes('</head>')) {
        htmlWithCSS = htmlWithCSS.replace(
          /<\/head>/i,
          `<style id="raon-theme-style">${cssCode}</style></head>`
        );
      } else if (htmlWithCSS.includes('<body')) {
        htmlWithCSS = htmlWithCSS.replace(
          /<body/i,
          `<head><style id="raon-theme-style">${cssCode}</style></head><body`
        );
      } else {
        htmlWithCSS = `<html><head><style id="raon-theme-style">${cssCode}</style></head><body>${htmlWithCSS}</body></html>`;
      }
      
      // srcdoc 직접 설정
      iframeRef.current.srcdoc = htmlWithCSS;
      
      console.log('✅ HTML injected successfully');
      return true;
    } catch (error) {
      console.error('❌ HTML injection failed:', error);
      return false;
    }
  }, []);

  // ✨ callback ref로 iframe DOM 연결 확인
  const setIframeRef = useCallback((iframe: HTMLIFrameElement | null) => {
    if (!iframe) {
      iframeRef.current = null;
      return;
    }
    
    // iframe이 DOM에 마운트된 것을 확인하고 ref 저장
    console.log('📌 iframe mounted to DOM');
    iframeRef.current = iframe;
    
    // 이전에 HTML이 fetch되었다면 즉시 주입
    if (pendingHtml) {
      console.log('⏳ pendingHtml exists, injecting immediately...');
      injectHtmlToIframe(pendingHtml, currentTheme);
    }
  }, [pendingHtml, currentTheme, injectHtmlToIframe]);

  // pendingHtml 변경 시 주입 (iframe이 있다면)
  useEffect(() => {
    if (iframeRef.current && pendingHtml) {
      console.log('🔄 useEffect: injecting pending HTML');
      injectHtmlToIframe(pendingHtml, currentTheme);
    }
  }, [pendingHtml, currentTheme, injectHtmlToIframe]);

  const handleLoadLivePreview = useCallback(async () => {
    console.log('🔍 handleLoadLivePreview called');
    if (!targetUrl.trim()) {
      alert('Please enter a target URL');
      return;
    }
    
    // URL에 프로토콜이 없으면 https:// 추가
    let finalUrl = targetUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    console.log('📱 Setting livePreviewActive=true, loadState=loading');
    setLivePreviewActive(true);
    setIframeLoadState('loading');
    setPendingHtml(null); // 이전 상태 초기화

    try {
      console.log('🌐 Fetching:', finalUrl);
      // 프록시 API를 통해 HTML fetch
      const response = await fetch('/api/proxy-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: finalUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Proxy error:', errorData);
        setIframeLoadState('error');
        return;
      }

      const data = await response.json();
      if (!data.success) {
        console.error('❌ API returned success=false');
        setIframeLoadState('error');
        return;
      }

      console.log('✅ HTML received, size:', data.html?.length);
      
      // 메타데이터 저장
      setMetadata(data.metadata);
      
      // iframe이 차단되었으면 에러 상태로
      if (data.metadata?.iframeBlocked) {
        console.warn('❌ iframe blocked:', data.metadata?.blockReason);
        setIframeLoadState('error');
        return;
      }
      
      // HTML을 상태에 저장
      setPendingHtml(data.html);
      // 나중에 useEffect에서 iframe에 주입됨
      setIframeLoadState('success');
    } catch (error) {
      console.error('❌ Failed to load website:', error);
      setIframeLoadState('error');
    }
  }, [targetUrl]);

  // iframe 로드 완료 시
  const handleIframeLoad = useCallback(() => {
    try {
      if (livePreviewActive && iframeRef.current) {
        console.log('✅ iframe loaded');
        // 로드 후 특별한 처리 필요 없음 (srcdoc은 이미 HTML을 포함)
      }
    } catch (error) {
      console.error('Error loading iframe:', error);
    }
  }, [livePreviewActive]);

  // iframe 로드 에러
  const handleIframeError = useCallback(() => {
    if (iframeLoadState !== 'success') {
      setIframeLoadState('error');
    }
  }, [iframeLoadState]);

  // 테마 선택 시
  const handleThemeSelect = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    if (livePreviewActive && iframeLoadState === 'success' && pendingHtml && iframeRef.current) {
      // 라이브 프리뷰 활성화 상태면 즉시 CSS 주입
      console.log('🎨 Theme selected, injecting CSS:', theme.name);
      injectHtmlToIframe(pendingHtml, theme);
    }
  }, [livePreviewActive, iframeLoadState, pendingHtml, injectHtmlToIframe]);

  // Random 테마 선택
  const handleRandomTheme = useCallback(() => {
    const randomTheme = presets[Math.floor(Math.random() * presets.length)];
    handleThemeSelect(randomTheme);
  }, [presets, handleThemeSelect]);

  // CSS 복사 기능
  const handleCopyCss = useCallback(() => {
    navigator.clipboard.writeText(cssCode).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 1500);
    }).catch((err) => {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다.');
    });
  }, [cssCode]);

  return (
    <div className="w-screen h-screen bg-gray-100 flex overflow-hidden">
      {/* Main Content: Left 15% | Right 85% */}
      <div className="flex w-full h-full gap-0">
        {/* Left Panel: Theme Presets (15%) - Scrollable */}
        <div className="w-[15%] h-screen bg-white border-r border-gray-300 overflow-y-scroll overflow-x-hidden p-3 flex flex-col space-y-3">
          {/* URL Input Section */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex-shrink-0">
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
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-gray-800">Generated CSS</h3>
                <button
                  onClick={handleCopyCss}
                  className={`text-xs px-2 py-1 rounded font-semibold transition-all ${
                    showCopySuccess
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {showCopySuccess ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-2 rounded overflow-x-auto text-xs leading-relaxed max-h-48 overflow-y-auto font-mono">
                <code>{cssCode.substring(0, 400)}...</code>
              </pre>
            </div>
          )}
        </div>

        {/* Right Panel: Preview/Live (85%) - Full Screen */}
        <div className="w-[85%] h-screen bg-gray-50 overflow-hidden flex flex-col">
          {!livePreviewActive ? (
            /* Static Preview Mode */
            <div className="flex-1 bg-white overflow-y-auto p-6">
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
            <div className="flex-1 bg-white overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">
                    📱 Live Preview
                  </p>
                  <span className="text-white text-xs px-2 py-0.5 bg-white/20 rounded truncate max-w-xs">
                    {targetUrl}
                  </span>
                </div>
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
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100">
                      <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg mb-1">Loading website...</p>
                    <p className="text-sm text-gray-500 mb-4">Server is fetching content (max 10 seconds)</p>
                    <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {iframeLoadState === 'error' && (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50">
                  <div className="text-center px-6 max-w-lg">
                    <div className="text-5xl mb-4">⚠️</div>
                    
                    {metadata?.iframeBlocked ? (
                      <>
                        <p className="text-gray-800 font-bold text-lg mb-2">
                          이 사이트는 iframe을 지원하지 않습니다
                        </p>
                        {metadata?.blockReason && (
                          <p className="text-xs text-gray-600 bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4 font-mono">
                            원인: <strong>{metadata.blockReason}</strong>
                          </p>
                        )}
                        <p className="text-sm text-gray-700 mb-4">
                          이는 보안 정책으로 인한 것으로, 우회할 수 없습니다. 대신 다른 사이트를 시도해보세요.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-800 font-bold text-lg mb-2">웹사이트 로드 실패</p>
                        <p className="text-sm text-gray-600 mb-4">
                          다음 중 하나의 이유로 실패했을 수 있습니다:
                        </p>
                        <ul className="text-xs text-gray-600 text-left bg-yellow-100 rounded-lg p-3 mb-4 space-y-1">
                          <li>✗ 웹사이트 응답 시간 초과 (10초)</li>
                          <li>✗ 서버 에러 발생</li>
                          <li>✗ 네트워크 연결 문제</li>
                          <li>✗ URL 형식 오류</li>
                        </ul>
                      </>
                    )}
                    
                    <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-xs font-semibold mb-3 text-blue-900">✅ 작동하는 사이트 시도:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                        <button
                          onClick={() => {
                            setTargetUrl('google.com');
                          }}
                          className="text-left hover:underline hover:text-blue-600 transition-all"
                        >
                          • google.com
                        </button>
                        <button
                          onClick={() => {
                            setTargetUrl('wikipedia.org');
                          }}
                          className="text-left hover:underline hover:text-blue-600 transition-all"
                        >
                          • wikipedia.org
                        </button>
                        <button
                          onClick={() => {
                            setTargetUrl('github.com');
                          }}
                          className="text-left hover:underline hover:text-blue-600 transition-all"
                        >
                          • github.com
                        </button>
                        <button
                          onClick={() => {
                            setTargetUrl('example.com');
                          }}
                          className="text-left hover:underline hover:text-blue-600 transition-all"
                        >
                          • example.com
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIframeLoadState('idle');
                        setTargetUrl('');
                        setMetadata(null);
                      }}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded transition-all font-semibold"
                    >
                      다른 URL 시도하기
                    </button>
                  </div>
                </div>
              )}

              {/* Success State - Single iframe */}
              {iframeLoadState === 'success' && (
                <div className="flex-1 overflow-hidden relative">
                  <iframe
                    ref={setIframeRef}
                    title="Live Preview"
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    // ⚠️ sandbox 없음 - CSS 주입을 위해 필요
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
