import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const maxDuration = 30;

/**
 * Puppeteer 인스턴스 캐싱 (재사용 성능 최적화)
 */
let browserInstance: any = null;

async function getBrowser() {
  if (browserInstance) {
    return browserInstance;
  }

  // Vercel 환경에서는 커스텀 Chromium 사용
  const isVercel = process.env.VERCEL === '1';
  
  browserInstance = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process', // Vercel 환경에서 메모리 절감
    ],
    // Vercel 환경에서 executablePath 설정 (optional, 자동 감지도 가능)
  });

  return browserInstance;
}

/**
 * CSS를 페이지에 주입하고 스크린샷 생성
 */
async function generateScreenshot(url: string, cssCode: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // 페이지 타임아웃 설정
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);

    // 사용자 에이전트 설정 (일부 사이트에서 요구)
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // 뷰포트 설정
    await page.setViewport({
      width: 1280,
      height: 720,
    });

    // 페이지 로드
    await page.goto(url, {
      waitUntil: 'networkidle2', // 네트워크 유휴 상태까지 대기
    });

    // ✅ CSS 주입 (페이지 head에 <style> 태그 추가)
    await page.addStyleTag({
      content: cssCode,
    });

    // 렌더링 대기 (DOM 업데이트 완료)
    await page.waitForTimeout(500);

    // 스크린샷 생성 (PNG 형식, base64 인코딩 필요)
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false, // 현재 뷰포트만 캡처
      encoding: 'binary',
    }) as Buffer;

    return screenshot;
  } finally {
    // 페이지 종료
    await page.close();
  }
}

/**
 * POST /api/screenshot
 * 
 * Request body:
 * {
 *   "url": "https://google.com",
 *   "css": "body { background-color: #ff0000; }"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "image": "data:image/png;base64,iVBORw0KGgo..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { url, css } = await request.json();

    // 입력 검증
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    if (!css || typeof css !== 'string') {
      return NextResponse.json(
        { error: 'Invalid CSS' },
        { status: 400 }
      );
    }

    // URL 검증
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // CSS 크기 제한 (악의적 요청 방지)
    if (css.length > 50000) {
      return NextResponse.json(
        { error: 'CSS too large (max 50KB)' },
        { status: 400 }
      );
    }

    console.log(`[Puppeteer] Generating screenshot for ${url}`);

    // 스크린샷 생성
    const screenshot = await generateScreenshot(url, css);

    // Base64 인코딩
    const base64Image = screenshot.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json(
      {
        success: true,
        image: dataUrl,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('[Puppeteer Error]', error);

    // 특정 에러 메시지 분류
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { error: 'Page load timeout. Website took too long to respond.' },
        { status: 504 }
      );
    }

    if (errorMessage.includes('ERR_NAME_NOT_RESOLVED')) {
      return NextResponse.json(
        { error: 'Domain not found (ERR_NAME_NOT_RESOLVED)' },
        { status: 400 }
      );
    }

    if (errorMessage.includes('ERR_CONNECTION_REFUSED')) {
      return NextResponse.json(
        { error: 'Connection refused (ERR_CONNECTION_REFUSED)' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Puppeteer error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
