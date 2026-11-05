# 로둥이네의 온천여행 ♨️

**우리 가족 온양온천랜드 여행** — 5살 남자아이 둘과 함께하는 따뜻한 겨울 온천 여행 플래너

- 사이트 주소: https://leetaesu.github.io/saturday-trip/
- React + TypeScript + Vite + Tailwind CSS + Lucide 아이콘
- 서버·로그인 없음. 체크/입력한 내용은 **각자 휴대폰 브라우저(localStorage)** 에 저장됩니다.

## 화면 구성 (하단 메뉴)

| 메뉴 | 내용 |
|---|---|
| 홈 | 여행 날짜·D-day·출발 카운트다운, 준비 완료율, 예상 총비용, 당일엔 지금/다음 일정 |
| 전체 일정 | 전날 준비 → 당일 아침 → 이동 → 온천랜드(A안/B안) → 귀가, 일정 수정·메모·완료 체크, 로운·로이·엄마 대화 |
| 준비물 | 카테고리별 체크, 미완료만 보기, 완료 접기, 전날/당일 구분, 항목 추가·삭제, 목록 복사·공유 |
| 비용 | 평일/주말 자동 판별, 단가·예산·할인 수정, 찜질방 토글, 실제 지출 기록과 비교 |
| 여행 정보 | 운영시간·전화하기·길찾기, 방문 전 확인 8가지, 문의 문구 복사, 안전 수칙, 출처 |

## 내 컴퓨터에서 실행

Node.js 20.19 이상(22 권장)이 필요합니다.

```bash
npm install      # 처음 한 번
npm run dev      # 개발 서버 → 터미널에 나온 주소 열기
npm run build    # 타입 검사 + 배포용 빌드 (dist 폴더)
npm run preview  # 빌드 결과 미리보기
```

## 내용 고치기

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 일정·할 일·가족 대화 | `src/data/schedule.ts` |
| 준비물 | `src/data/packing.ts` |
| 기본 요금·예산 | `src/data/budget.ts` |
| 전화번호·출발/도착 시간 | `src/data/trip.ts` |
| 확인 사항·안전 수칙·출처 | `src/data/info.ts` |
| 인트로·캐릭터 그림 | `public/family.jpg`, `public/mom.png`, `public/rowoon.png`, `public/roy.png` |

## GitHub Pages 배포 (처음 한 번만 설정)

1. GitHub 저장소 → **Settings → Pages**
2. **Build and deployment → Source** 를 **GitHub Actions** 로 바꾸기
3. 이후 `main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 이 자동으로 빌드·배포합니다.
4. 저장소 **Actions** 탭에서 초록 체크가 뜨면 1~2분 뒤 사이트에 반영됩니다.

저장소 이름을 바꾸면 `vite.config.ts` 의 `base: '/saturday-trip/'` 도 같이 바꿔야 합니다.
화면 이동은 `#/plan` 같은 해시 주소를 써서 GitHub Pages에서 새로고침해도 깨지지 않습니다.

## 정보 신뢰도

- 일정 시간은 **계획용**입니다.
- 요금·운영시간은 **과거 안내 기준**이며 실시간 확정 정보가 아닙니다.
- 식당 이용 후 어린이온천 재이용은 **과거 블로그 후기**일 뿐 현재 공식 규정이 아닙니다. 그래서 A안/B안을 모두 준비했습니다.
- 방문 전 반드시 041-541-3700 으로 확인하세요.
