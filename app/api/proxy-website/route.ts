import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 15;

/**
 * 상대 경로를 절대 경로로 변환
 * @param html - 원본 HTML
 * @param baseUrl - 기본 URL (예: https://google.com)
 * @returns 변환된 HTML
 */
function convertRelativeToAbsolutePaths(html: string, baseUrl: string): string {
  // baseUrl에서 도메인만 추출 (예: https://google.com)
  const baseUri = new URL(baseUrl);
  const origin = baseUri.origin;

  // 상대 경로 패턴들을 정규식으로 변환
  let result = html;

  // 1. src="/..." → src="https://domain..."
  result = result.replace(/src=["']\/([^"']+)["']/g, (match, path) => {
    return `src="${origin}/${path}"`;
  });

  // 2. href="/..." → href="https://domain..."
  result = result.replace(/href=["']\/([^"']+)["']/g, (match, path) => {
    return `href="${origin}/${path}"`;
  });

  // 3. srcset="/..." → srcset="https://domain..."
  result = result.replace(/srcset=["']\/([^"']+)["']/g, (match, path) => {
    return `srcset="${origin}/${path}"`;
  });

  // 4. url(/...) in style attributes (인라인 style 태그 등)
  result = result.replace(/url\(["']?\/([^"')]+)["']?\)/g, (match, path) => {
    return `url('${origin}/${path}')`;
  });

  // 5. CSS 배경이미지 속성 변환
  // background-image: url(/path/to/image.jpg)
  result = result.replace(/background-image:\s*url\(["']?\/([^"')]+)["']?\)/g, 
    (match, path) => {
      return `background-image: url('${origin}/${path}')`;
    });

  // 6. @import url() 변환
  result = result.replace(/@import\s+url\(["']?\/([^"')]+)["']?\)/g,
    (match, path) => {
      return `@import url('${origin}/${path}')`;
    });

  // 7. data: URIs with src="data:..." should be kept as-is (already absolute)
  
  // 8. protocol-relative URLs src="//..." should become "https://..."
  result = result.replace(/src=["']\/\/([^"']+)["']/g, (match, path) => {
    return `src="https://${path}"`;
  });

  result = result.replace(/href=["']\/\/([^"']+)["']/g, (match, path) => {
    return `href="https://${path}"`;
  });

  // 9. protocol-relative URLs for srcset
  result = result.replace(/srcset=["']\/\/([^"']+)["']/g, (match, path) => {
    return `srcset="https://${path}"`;
  });

  // 10. background 속성 (단축형)
  // background: url(/path/to/image.jpg)
  result = result.replace(/background:\s*url\(["']?\/([^"')]+)["']?\)/g, 
    (match, path) => {
      return `background: url('${origin}/${path}')`;
    });

  // 11. srcset 속성의 상대 경로
  // srcset="./image1.jpg 1x, ./image2.jpg 2x"
  result = result.replace(/srcset=["']([^"']+)["']/g, (match, srcsetValue) => {
    const converted = srcsetValue
      .split(',')
      .map(item => {
        const parts = item.trim().split(/\s+/);
        const url = parts[0];
        const descriptor = parts.slice(1).join(' ');
        
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return item; // 이미 절대 경로
        }
        
        if (url.startsWith('/')) {
          return `${origin}/${url.slice(1)}${descriptor ? ' ' + descriptor : ''}`;
        }
        
        if (url.startsWith('//')) {
          return `https:${url}${descriptor ? ' ' + descriptor : ''}`;
        }
        
        // 상대 경로 (./image.jpg)
        return `${origin}/${url.replace(/^\.\//, '')}${descriptor ? ' ' + descriptor : ''}`;
      })
      .join(', ');
    
    return `srcset="${converted}"`;
  });

  return result;
}

/**
 * 프록시 API: 웹사이트 HTML 가져오기
 * - 서버사이드 CORS 우회
 * - 상대 경로 → 절대 경로 변환
 * - 타임아웃 처리
 * - 에러 핸들링
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // URL 검증
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    // URL 파싱 및 검증
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // 프로토콜 확인
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP/HTTPS URLs allowed' },
        { status: 400 }
      );
    }

    // 타임아웃 설정 (8초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // 웹사이트 HTML fetch
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: controller.signal,
        // 리다이렉트 자동 따라가기
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: `HTTP ${response.status}: ${response.statusText}` },
          { status: response.status }
        );
      }

      // HTML 파싱 및 메타데이터 추출
      let html = await response.text();
      const contentType = response.headers.get('content-type') || 'text/html';

      // ✅ 상대 경로를 절대 경로로 변환
      html = convertRelativeToAbsolutePaths(html, url);

      // 기본 메타데이터 추출
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : 'Untitled';

      // 🔍 응답 헤더 분석 (iframe 호환성 확인)
      const xFrameOptions = response.headers.get('x-frame-options');
      const csp = response.headers.get('content-security-policy');
      const contentSecurityPolicyReportOnly = response.headers.get('content-security-policy-report-only');

      // iframe 차단 여부 판단
      let iframeBlocked = false;
      let blockReason = '';
      
      if (xFrameOptions?.toUpperCase() === 'DENY') {
        iframeBlocked = true;
        blockReason = 'X-Frame-Options: DENY';
      } else if (xFrameOptions?.toUpperCase() === 'SAMEORIGIN') {
        // SAMEORIGIN은 다른 도메인에서는 차단
        iframeBlocked = true;
        blockReason = 'X-Frame-Options: SAMEORIGIN (다른 도메인)';
      } else if (csp && csp.includes('frame-ancestors')) {
        iframeBlocked = true;
        blockReason = 'CSP: frame-ancestors 제한';
      }

      // 로딩 성공 응답
      return NextResponse.json(
        {
          success: true,
          html,
          metadata: {
            url: url,
            title,
            contentType,
            iframeBlocked,
            blockReason,
            xFrameOptions: xFrameOptions || 'not-set',
            cspPresent: !!csp,
            loadTime: Date.now(),
          },
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout (8s). Website took too long to load.' },
          { status: 504 }
        );
      }

      return NextResponse.json(
        { error: `Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
