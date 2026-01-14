# 삼행시 생성기

Claude AI를 사용하여 세 글자로 재미있는 삼행시를 자동으로 생성하는 웹 애플리케이션입니다.

## 기능

- 세 글자 입력을 통한 삼행시 생성
- Claude Sonnet 4.5 API를 활용한 고품질 삼행시
- 깔끔하고 모던한 UI/UX
- 반응형 디자인 (모바일 지원)
- 로딩 애니메이션
- Vercel serverless function을 통한 안전한 API 키 관리

## 기술 스택

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Backend**: Vercel Serverless Functions
- **AI**: Claude Sonnet 4.5 API
- **배포**: Vercel

## 설치 방법

### 1. 저장소 클론 및 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성합니다:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 Anthropic API 키를 입력합니다:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 3. API 키 발급

[Anthropic Console](https://console.anthropic.com/)에서 API 키를 발급받습니다.

## 로컬 개발

Vercel CLI를 사용하여 로컬 개발 서버를 실행합니다:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## Vercel 배포

### 1. Vercel CLI 로그인

```bash
npx vercel login
```

### 2. 프로젝트 배포

```bash
npm run deploy
```

### 3. Vercel 대시보드에서 환경변수 설정

1. [Vercel 대시보드](https://vercel.com/dashboard)에 접속
2. 프로젝트 선택
3. Settings > Environment Variables로 이동
4. 다음 환경변수를 추가:
   - Name: `ANTHROPIC_API_KEY`
   - Value: 실제 API 키
   - Environment: Production, Preview, Development 모두 선택

### 4. 재배포

환경변수를 설정한 후, 프로젝트를 재배포합니다:

```bash
npm run deploy
```

## 프로젝트 구조

```
threeline/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # 프론트엔드 JavaScript
├── api/
│   └── generate.js     # Vercel serverless function (API 엔드포인트)
├── package.json        # 프로젝트 설정 및 의존성
├── .env.example        # 환경변수 예시 파일
└── README.md           # 프로젝트 문서
```

## API 엔드포인트

### POST /api/generate

삼행시를 생성합니다.

**Request Body:**

```json
{
  "word": "김태경"
}
```

**Response:**

```json
{
  "result": "김: 김치처럼 매콤하게 살아가는\n태: 태양같이 밝은 미소로\n경: 경이로운 하루를 만들어가네"
}
```

## 주의사항

- API 키는 절대 프론트엔드 코드에 직접 포함하지 마세요
- `.env.local` 파일은 `.gitignore`에 추가되어야 합니다
- Vercel 환경변수를 통해 안전하게 API 키를 관리하세요

## 라이센스

MIT
