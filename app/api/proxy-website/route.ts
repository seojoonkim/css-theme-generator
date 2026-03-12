import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 15;

/**
 * 프록시 API: 웹사이트 HTML 가져오기
 * - 서버사이드 CORS 우회
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
      const html = await response.text();
      const contentType = response.headers.get('content-type') || 'text/html';

      // 기본 메타데이터 추출
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : 'Untitled';

      // 로딩 성공 응답
      return NextResponse.json(
        {
          success: true,
          html,
          metadata: {
            url: url,
            title,
            contentType,
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
