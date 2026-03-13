# 🚀 DEPLOYMENT-CHECKLIST.md
## CSS Theme Generator v2 배포 전 필수 체크리스트

**목표:** 배포 전에 모든 문제를 발견하고 해결하기 (배포 후 문제 방지)

---

## ✅ Phase 1: 로컬 테스트 (필수!)

### 1.1 빌드 테스트
```bash
# ✅ 빌드 성공 확인
npm run build

# ❌ 빌드 에러 → 해결 필수
# - TypeScript 에러 확인
# - 의존성 버전 호환성 확인
# - 메모리 부족 여부 확인
```

**빌드 실패 시 해결책:**
- `node_modules` 삭제 + `npm install` 재실행
- `tsconfig.json`에서 엄격한 타입 체크 비활성화 (필요시)
- 의존성 버전 다운그레이드 (특히 Puppeteer)

### 1.2 로컬 서버 테스트
```bash
# ✅ 개발 서버 실행
npm run dev

# ✅ 로컬에서 모든 기능 테스트
# - 페이지 로드 (http://localhost:3000)
# - 25개 테마 모두 변경
# - CSS 복사 기능
# - Random Theme
# - 웹사이트 로드 (Google, Wikipedia 등)
```

**테스트 항목:**
- [ ] 페이지 로드 완료
- [ ] 25개 프리셋 모두 렌더링
- [ ] 테마 변경 (Ocean Blue → Neon) 즉시 반응
- [ ] CSS 복사 버튼 작동
- [ ] Random Theme 버튼 작동
- [ ] 에러 메시지 표시

### 1.3 성능 테스트
```bash
# ✅ 빌드 결과물 크기 확인
ls -lh .next/static/

# ❌ 과도한 번들 크기 → 최적화 필요
# 목표: JavaScript < 500KB, CSS < 100KB
```

---

## ✅ Phase 2: 의존성 검증 (필수!)

### 2.1 Puppeteer 호환성
```bash
# ✅ Puppeteer가 설치되었는지 확인
npm list puppeteer

# ✅ Puppeteer Chrome이 다운로드되었는지 확인
ls -la node_modules/puppeteer/.local-chromium/
```

**Puppeteer 문제 시 해결책:**
1. `package.json`에서 Puppeteer 버전 확인
   ```json
   "puppeteer": "^21.0.0"  // 최신 버전 권장
   ```

2. Chrome 다운로드 여부 확인
   ```bash
   npx puppeteer browsers install chrome
   ```

3. Vercel에서 작동하려면 `@sparticuz/chromium` 사용
   ```bash
   npm install @sparticuz/chromium
   ```

### 2.2 Next.js 호환성
```bash
# ✅ Next.js 버전 확인 (14.2.35 이상 권장)
npm list next

# ✅ React 버전 확인 (18 이상)
npm list react
```

### 2.3 TypeScript 검증
```bash
# ✅ TypeScript 컴파일 에러 확인
npx tsc --noEmit

# ❌ 에러 있으면 모두 해결 필수
```

---

## ✅ Phase 3: Git 커밋 체크

### 3.1 코드 품질
```bash
# ✅ 모든 파일이 .gitignore에 있는지 확인
git status

# ❌ node_modules, .next 등이 커밋되면 안 됨!
cat .gitignore
```

### 3.2 커밋 메시지
```bash
# ✅ 명확한 커밋 메시지
# 형식: feat/fix: [기능] 설명

# 예:
git commit -m "feat: Puppeteer 통합 + 실시간 CSS 변경"
git commit -m "fix: Vercel 빌드 최적화"
```

### 3.3 Git Push
```bash
# ✅ GitHub에 정상 푸시되었는지 확인
git log --oneline -5
# → GitHub에서도 같은 커밋 확인
```

---

## ✅ Phase 4: Vercel 배포 전 준비

### 4.1 package.json 확인
```json
{
  "name": "css-theme-generator",
  "version": "2.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",  // ✅ 이 스크립트 반드시 있어야 함
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.35",
    "react": "^18",
    "puppeteer": "^21.0.0",  // ✅ Vercel 호환 버전
    "@sparticuz/chromium": "^latest"  // ✅ Vercel serverless용
  }
}
```

### 4.2 Environment Variables
```bash
# ✅ Vercel에 필요한 환경변수 설정
# .env.local 파일 확인
cat .env.local

# 필요한 변수:
# - DATABASE_URL (없으면 생략)
# - API_KEY (없으면 생략)
```

### 4.3 Vercel 설정
```bash
# ✅ vercel.json 확인
cat vercel.json

# 권장 설정:
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "envPrefix": "",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## ✅ Phase 5: Vercel 배포 후 검증 (필수!)

### 5.1 배포 상태 확인
```bash
# ✅ Vercel 대시보드에서 확인
# https://vercel.com/dashboard

# 확인 항목:
# - [ ] Build 성공 (Status: Ready)
# - [ ] Build logs에 에러 없음
# - [ ] Deployment time < 60초
```

### 5.2 배포된 URL 테스트
```bash
# ✅ Production URL 접속
https://css-theme-generator-six.vercel.app

# 테스트 항목:
# - [ ] 페이지 로드
# - [ ] 25개 테마 모두 변경
# - [ ] CSS 복사 기능
# - [ ] 웹사이트 로드 (Google.com)
```

### 5.3 성능 모니터링
```bash
# ✅ Lighthouse 성능 확인
# Chrome DevTools → Lighthouse

# 목표:
# - Performance: > 80
# - Accessibility: > 90
# - Best Practices: > 90
```

### 5.4 에러 모니터링
```bash
# ✅ 브라우저 콘솔 에러 확인
# Production URL 열기 → F12 → Console

# ❌ 에러가 있으면:
# 1. 에러 메시지 기록
# 2. 로컬에서 재현 시도
# 3. 원인 분석 + 수정
# 4. 다시 배포
```

---

## 🔴 일반적인 배포 문제 & 해결책

### 문제 1: Puppeteer 빌드 실패
```
❌ Error: ENOSPC: no space left on device
```
**해결:**
```bash
# 1. node_modules 삭제
rm -rf node_modules
npm install --no-save

# 2. package-lock.json 재생성
rm package-lock.json
npm install

# 3. Vercel에서 Build logs 확인
# → Storage 부족하면 npm ci --only=prod 사용
```

### 문제 2: TypeScript 에러
```
❌ Type 'X' is not assignable to type 'Y'
```
**해결:**
```bash
# 1. 에러 메시지 완전히 읽기
# 2. 해당 파일의 타입 확인
# 3. 필요시 tsconfig.json에서:
{
  "compilerOptions": {
    "strict": false,  // 엄격 타입 비활성화 (필요시만!)
    "skipLibCheck": true
  }
}
```

### 문제 3: 배포 일시 중지
```
❌ This deployment is temporarily paused
```
**해결:**
```bash
# 1. Vercel 대시보드에서 "Redeploy" 클릭
# 2. 또는 GitHub에 새로운 커밋 푸시
git commit --allow-empty -m "chore: redeploy"
git push origin main

# 3. 빌드 로그 확인
# → 문제가 있으면 수정 후 다시 푸시
```

### 문제 4: 로컬에서는 되는데 배포에서 안 됨
```
❌ Production에서만 에러 발생
```
**해결:**
```bash
# 1. 로컬에서 프로덕션 빌드 테스트
npm run build
npm run start  # ← 프로덕션 모드로 실행

# 2. 로컬 프로덕션과 Vercel 환경 비교
# → 환경 변수 확인
# → Node.js 버전 확인
# → 메모리 제약 확인 (Vercel: 512MB)
```

---

## 📋 배포 전 최종 체크리스트

### 배포 1시간 전:
- [ ] `npm run build` 로컬 빌드 성공
- [ ] `npm run start` 로컬 프로덕션 모드 테스트
- [ ] 모든 기능 테스트 (25개 테마, CSS 복사, Random Theme)
- [ ] TypeScript 에러 없음 (`npx tsc --noEmit`)
- [ ] .gitignore 확인 (node_modules 제외)
- [ ] package.json 의존성 확인
- [ ] vercel.json 설정 확인

### 배포 후:
- [ ] Vercel 대시보드에서 배포 상태 확인 (Status: Ready)
- [ ] Production URL 접속 + 페이지 로드 확인
- [ ] 25개 테마 변경 테스트
- [ ] 웹사이트 로드 (Google.com) 테스트
- [ ] 브라우저 콘솔 에러 확인
- [ ] Lighthouse 성능 확인

---

## 🎯 앞으로의 규칙

**모든 배포 전에:**
1. ✅ 로컬 빌드 + 테스트 (반드시!)
2. ✅ Git 커밋 + 푸시
3. ✅ Vercel 배포 상태 모니터링
4. ✅ Production URL에서 기능 테스트
5. ✅ 문제 발견 시 바로 수정 + 재배포

**이 체크리스트를 매번 사용하면, 배포 후 문제가 안 생깁니다!** 🚀

---

**라온 ☀️ 올림**
