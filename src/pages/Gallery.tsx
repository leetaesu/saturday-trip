import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Card, SectionHeader } from '../components/ui';
import { TRIP } from '../data/trip';

const q = (s: string) => encodeURIComponent(s);
const naverImage = (s: string) => `https://search.naver.com/search.naver?where=image&query=${q(s)}`;
const googleImage = (s: string) => `https://www.google.com/search?tbm=isch&q=${q(s)}`;
const naverBlog = (s: string) => `https://search.naver.com/search.naver?ssc=tab.blog.all&query=${q(s)}`;

/** 시설별 사진 검색. 남의 사진을 복사하지 않고 검색 결과로 연결한다. */
const SPOTS: { emoji: string; title: string; desc: string; keyword: string }[] = [
  { emoji: '🌊', title: '어린이온천 물놀이장', desc: '오늘의 메인! 아이들이 노는 곳', keyword: '온양온천랜드 어린이온천' },
  { emoji: '🛝', title: '미끄럼틀·놀이시설', desc: '슬라이드, 물놀이 기구', keyword: '온양온천랜드 키즈풀 미끄럼틀' },
  { emoji: '🍚', title: '식당·매점', desc: '점심과 간식 메뉴 미리 보기', keyword: '온양온천랜드 식당 메뉴' },
  { emoji: '🛁', title: '목욕탕', desc: '물놀이 후 씻는 곳', keyword: '온양온천랜드 목욕탕' },
  { emoji: '🔥', title: '찜질방', desc: '추가요금 여부는 현장 확인', keyword: '온양온천랜드 찜질방' },
  { emoji: '🅿️', title: '외관·주차장', desc: '도착했을 때 헤매지 않게', keyword: '온양온천랜드 주차장' },
];

function SearchLinks({ keyword }: { keyword: string }) {
  const links = [
    { label: '네이버 이미지', href: naverImage(keyword), cls: 'bg-[#03c75a] text-white' },
    { label: '구글 이미지', href: googleImage(keyword), cls: 'bg-card text-ink ring-1 ring-line' },
    { label: '블로그 후기', href: naverBlog(keyword), cls: 'bg-mint text-teal-deep' },
  ];
  return (
    <div className="mt-3 grid grid-cols-3 gap-1.5">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex min-h-11 items-center justify-center rounded-2xl px-1 text-center text-[12.5px] font-bold ${l.cls}`}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

export function Gallery() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <img
          src={`${import.meta.env.BASE_URL}kids-spa.jpg`}
          alt="온양온천랜드 어린이온천 물놀이장. 주황색 미끄럼틀과 넓은 실내 풀"
          className="aspect-[3/2] w-full object-cover"
          width={920}
          height={613}
        />
        <div className="p-5">
          <p className="text-[13px] font-bold text-teal">♨️ 미리 구경하기</p>
          <h1 className="mt-0.5 text-[22px] font-extrabold text-ink-strong">{TRIP.to} 사진보기</h1>
          <p className="mt-1 text-[14px] leading-relaxed text-ink">
            아이들한테 “여기 가는 거야!” 하고 미리 보여 주세요. 미끄럼틀 보면 아침에 벌떡 일어날지도 몰라요 😆
          </p>
        </div>
      </Card>

      <Card>
        <SectionHeader emoji="📸" title="시설별 사진 찾아보기" subtitle="누르면 검색 결과가 새 창으로 열려요" />
        <div className="space-y-3">
          {SPOTS.map((s) => (
            <div key={s.title} className="rounded-3xl bg-well p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-xl shadow-soft" aria-hidden>
                  {s.emoji}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[16px] font-extrabold text-ink-strong">{s.title}</h2>
                  <p className="text-[12.5px] text-taupe">{s.desc}</p>
                </div>
              </div>
              <SearchLinks keyword={s.keyword} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader emoji="🎞️" title="더 보기" />
        <div className="space-y-2">
          {[
            { label: '인스타그램 #온양온천랜드', href: `https://www.instagram.com/explore/tags/${q('온양온천랜드')}/` },
            { label: '유튜브 방문 영상', href: `https://www.youtube.com/results?search_query=${q('온양온천랜드 어린이온천')}` },
            { label: '네이버 지도 사진·리뷰', href: `https://map.naver.com/p/search/${q(TRIP.to)}` },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center gap-3 rounded-2xl bg-well px-4 active:bg-line"
            >
              <ImageIcon className="size-4 text-teal" aria-hidden />
              <span className="flex-1 text-[14.5px] font-bold">{l.label}</span>
              <ExternalLink className="size-4 text-taupe" aria-hidden />
            </a>
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-taupe">
          블로그·SNS 사진은 찍은 사람의 것이라 이 사이트에 옮겨 오지 않고 원래 페이지로 연결했어요. 사진은 촬영 시점의 모습이라 지금과 다를 수 있어요.
        </p>
      </Card>
    </div>
  );
}
