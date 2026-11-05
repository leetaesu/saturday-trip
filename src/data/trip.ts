export const TRIP = {
  name: '우리 가족 온양온천랜드 여행 ♨️',
  subtitle: '5살 남자아이 둘과 함께하는 따뜻한 겨울 온천 여행',
  slogan: '추운 겨울, 따뜻한 온천에서 신나게 놀자!',
  from: '범계역',
  fromFull: '경기도 안양시 범계역',
  to: '온양온천랜드',
  toFull: '충청남도 아산시 온양온천랜드',
  adults: 2,
  kids: 2,
  departFirst: '08:00',
  departFinal: '08:20',
  arrive: '10:30',
  goHome: '16:00',
  phone: '041-541-3700',
  tel: 'tel:0415413700',
  kidsSpaHours: '10:00~18:00',
} as const;

export const PEOPLE = TRIP.adults + TRIP.kids;

/**
 * 지도 앱의 공식 검색 링크만 쓴다. (좌표·경로 파라미터를 임의로 만들지 않음)
 * 검색 결과에서 장소를 고른 뒤 '길찾기'를 누르면 현재 위치 또는 출발지를 지정할 수 있다.
 */
export const MAP_LINKS = {
  naverTo: `https://map.naver.com/p/search/${encodeURIComponent(TRIP.to)}`,
  kakaoTo: `https://map.kakao.com/link/search/${encodeURIComponent(TRIP.to)}`,
  naverFrom: `https://map.naver.com/p/search/${encodeURIComponent('범계역')}`,
  kakaoFrom: `https://map.kakao.com/link/search/${encodeURIComponent('범계역')}`,
};
