import type { PackCategory, PackItem, When } from '../types';

export const PACK_CATEGORIES: PackCategory[] = [
  { id: 'kidswim', title: '아이들 물놀이', subtitle: '5살 둥이 물놀이 필수품', emoji: '🐥' },
  { id: 'parswim', title: '엄마·아빠 물놀이', subtitle: '부모님 물놀이 용품', emoji: '🥽' },
  {
    id: 'bath',
    title: '샤워 및 목욕용품',
    subtitle: '온천 후 보송보송 케어',
    emoji: '🧼',
    note: '수건·샤워용품은 현장 제공 여부가 확인되지 않아 직접 챙기는 걸로 계획했어요.',
  },
  { id: 'kidcloth', title: '아이들 여벌옷', subtitle: '목욕 후 따뜻하게', emoji: '👕' },
  { id: 'parcloth', title: '부모님 여벌옷', subtitle: '엄마·아빠 갈아입을 옷', emoji: '🧥' },
  { id: 'health', title: '상비약·안전', subtitle: '혹시 모를 상황 대비', emoji: '🩹' },
  { id: 'car', title: '차량 준비물', subtitle: '왕복 드라이브', emoji: '🚗' },
  { id: 'pay', title: '결제·전자기기', subtitle: '결제와 입장권', emoji: '📱' },
];

type Row = [id: string, text: string, qty: string, when?: When, optional?: boolean];

const rows: Record<string, Row[]> = {
  kidswim: [
    ['kid-swim', '아이 수영복 또는 래쉬가드', '2벌'],
    ['kid-cap', '아이 수영모', '2개'],
    ['kid-vest', '아이 구명조끼', '2개'],
    ['kid-shoes', '아이 아쿠아슈즈', '2켤레'],
    ['kid-bag', '물놀이용 가방', '1개'],
    ['kid-pouch', '방수팩', '1~2개'],
    ['kid-swim2', '아이 여벌 수영복 (A안 2차 물놀이용)', '2벌'],
    ['spa-snack', '물놀이 중 먹을 간식 (B안이면 꼭, 반입 규정 확인)', '', 'day', true],
    ['tumbler', '텀블러·빨대컵', '2개', 'day', true],
  ],
  parswim: [
    ['mom-swim', '엄마 수영복', '1벌'],
    ['dad-swim', '아빠 수영복', '1벌'],
    ['mom-cap', '엄마 수영모', '1개'],
    ['dad-cap', '아빠 수영모', '1개'],
    ['par-shoes', '부모님 아쿠아슈즈 (필요 시)', '2켤레'],
    ['par-etc', '개인용 물놀이 용품', ''],
  ],
  bath: [
    ['towel-kid', '아이 수건', '2~4장'],
    ['towel-par', '부모님 수건', '2장'],
    ['kid-shampoo', '어린이 샴푸', '1개'],
    ['kid-wash', '어린이 바디워시', '1개'],
    ['adult-wash', '어른 세면용품', '1세트'],
    ['kid-lotion', '아이 로션', '1개'],
    ['cream', '보습크림', '1개'],
    ['comb', '빗', '1개'],
    ['wet-bag', '젖은 수영복 담을 비닐봉지', '3~4장'],
    ['lipbalm', '립밤·핸드크림', '1개씩', 'eve', true],
  ],
  kidcloth: [
    ['kid-under', '아이 속옷', '2세트 이상'],
    ['kid-socks', '아이 양말', '2세트 이상'],
    ['kid-top', '아이 여벌 상의', '2벌'],
    ['kid-bottom', '아이 여벌 하의', '2벌'],
    ['kid-coat', '따뜻한 외투', '2벌'],
    ['kid-hat', '모자', '2개'],
    ['kid-thermal', '여벌 내복 (필요 시)', '2벌'],
  ],
  parcloth: [
    ['mom-under', '엄마 속옷', '1세트'],
    ['dad-under', '아빠 속옷', '1세트'],
    ['par-cloth', '부모님 여벌 옷', '2벌'],
    ['par-coat', '따뜻한 외투', '2벌'],
  ],
  health: [
    ['fever', '어린이 해열제', '1개'],
    ['bandage', '밴드', '1통'],
    ['motion', '어린이 멀미약 (필요 시)', '', 'eve', true],
    ['nametag', '미아 방지 이름표·팔찌 (부모 연락처)', '2개'],
  ],
  car: [
    ['carseat', '카시트', '2개'],
    ['water', '생수', '4병', 'day'],
    ['car-snack', '차량에서 먹을 간식', '', 'day'],
    ['wipes', '물티슈', '1팩', 'day'],
    ['tissue', '휴지', '1개'],
    ['trash', '쓰레기봉투', '2장'],
    ['sick-bag', '멀미 대비 봉투', '2장'],
    ['toy', '아이들이 좋아하는 작은 장난감', '2개', 'day'],
    ['music', '차 안에서 들을 음악', ''],
    ['blanket', '차량용 담요', '1~2장', 'eve', true],
    ['pillow', '아이 목베개', '2개', 'eve', true],
    ['tablet', '태블릿 + 아이 영상 (전날 충전)', '1대', 'eve', true],
  ],
  pay: [
    ['phone', '휴대폰', '2대', 'day'],
    ['wallet', '지갑', '1개', 'day'],
    ['card', '신용카드', '1장', 'day'],
    ['ticket', '입장권 QR 또는 예약 내역', '', 'day'],
    ['battery', '보조배터리 (전날 충전)', '1개'],
    ['cable', '충전케이블', '1개'],
    ['car-charger', '차량 충전기', '1개'],
    ['ziplock', '방수 지퍼백 (휴대폰·QR 보호)', '2~3장'],
    ['cash', '현금 조금 (사물함·매점 대비)', '', 'day', true],
  ],
};

export const DEFAULT_PACK_ITEMS: PackItem[] = Object.entries(rows).flatMap(([cat, list]) =>
  list.map(([id, text, qty, when, optional]) => ({ id, cat, text, qty, when: when ?? 'eve', optional })),
);

export const WHEN_LABEL: Record<When, string> = { eve: '전날 챙기기', day: '당일 챙기기' };
