export const CONFIRM_ITEMS: { id: string; title: string; desc: string }[] = [
  { id: 'open', title: '어린이온천 이용 가능 여부', desc: '방문일에 정상 운영하는지, 시설 점검 일정은 없는지' },
  { id: 'food', title: '식당과 매점 운영시간', desc: '점심 계획(A안·B안)을 정하려면 꼭 필요해요' },
  { id: 'reentry', title: '식당 이용 후 어린이온천 복귀 가능 여부', desc: '가능하면 A안, 어려우면 B안으로 일정을 바꿔요' },
  { id: 'gear', title: '구명조끼 및 수영모 규정', desc: '착용 의무, 현장 대여 여부' },
  { id: 'towel', title: '수건 제공·대여 여부', desc: '확인 전까지는 직접 챙기는 걸로 계획' },
  { id: 'sauna', title: '찜질방 추가요금', desc: '식당 이동 시 추가요금이 붙는지도 함께' },
  { id: 'gender', title: '어린이 목욕탕 성별 출입 기준', desc: '5살 남아 2명의 실제 개월 수 기준으로 확인' },
  { id: 'ticket', title: '당일 입장권 이용 및 온라인 구매 조건', desc: '사용 가능일, 환불, 현장 결제 차이' },
];

export const FACILITIES = [
  { label: '실내 어린이온천 물놀이', tone: 'mint' as const },
  { label: '어린이 놀이시설', tone: 'mint' as const },
  { label: '내부 식당 및 매점', tone: 'butter' as const },
  { label: '목욕탕', tone: 'peach' as const },
  { label: '찜질방 (별도 조건·추가요금 확인)', tone: 'lav' as const },
  { label: '외부 음식 반입 규정 확인', tone: 'lav' as const },
];

export const CALL_QUESTION =
  '안녕하세요. 성인 2명과 5살 남자아이 2명, 총 4명이 어린이온천을 이용하려고 합니다. 물놀이 중간에 내부 식당에서 점심을 먹고 다시 어린이온천에서 놀 수 있나요? 식당 이용 시 찜질방 추가요금이 발생하나요? 현재 어린이온천 운영시간과 구명조끼, 수영모 규정도 알려주세요.';

export const SAFETY_TIPS: { emoji: string; title: string; desc: string }[] = [
  { emoji: '👀', title: '항상 보호자가 함께', desc: '아이만 물에 두고 자리를 비우지 않아요.' },
  { emoji: '📏', title: '수심·신장 제한 확인', desc: '시설별 기준과 구명조끼 규정을 지켜요.' },
  { emoji: '🧦', title: '미끄러운 바닥 주의', desc: '뛰지 않기, 아쿠아슈즈 신기.' },
  { emoji: '⏸️', title: '수시로 쉬기', desc: '몸이 떨리거나 입술이 파래지면 물에서 나와 몸을 말리고 따뜻하게 쉬어요.' },
  { emoji: '💧', title: '물 자주 마시기', desc: '따뜻한 물속에서도 땀이 나요.' },
  { emoji: '🍚', title: '식사 후 바로 뛰지 않기', desc: '조금 쉬었다가 물놀이를 다시 시작해요.' },
  { emoji: '💨', title: '머리 완전히 말리기', desc: '추운 날이라 목욕 후 보온이 제일 중요해요.' },
];

/**
 * 출처는 검색 링크로 연결한다. 블로그 후기는 과거 경험일 뿐 현재 운영규정이 아니다.
 */
export const SOURCES: { kind: string; title: string; desc: string; url: string; tone: 'mint' | 'peach' | 'lav' }[] = [
  {
    kind: '공식 안내',
    title: '온양온천랜드 공식 안내 찾기',
    desc: '운영시간·요금·이용 규정은 공식 안내와 전화 문의가 기준이에요.',
    url: `https://search.naver.com/search.naver?query=${encodeURIComponent('온양온천랜드')}`,
    tone: 'mint',
  },
  {
    kind: '판매처',
    title: '온라인 입장권 판매처 최신 안내',
    desc: '판매처마다 가격·사용일·환불 조건이 다를 수 있어요.',
    url: `https://search.naver.com/search.naver?query=${encodeURIComponent('온양온천랜드 입장권')}`,
    tone: 'peach',
  },
  {
    kind: '과거 후기',
    title: '어린이온천 식당 이용 경험 블로그',
    desc: '과거 이용 사례예요. 현재 공식 규정과 다를 수 있어요.',
    url: `https://search.naver.com/search.naver?ssc=tab.blog.all&query=${encodeURIComponent('온양온천랜드 어린이온천 식당')}`,
    tone: 'lav',
  },
];
