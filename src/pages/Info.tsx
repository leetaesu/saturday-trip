import { Clock, Copy, ExternalLink, MapPin, Phone } from 'lucide-react';
import { CHARACTERS } from '../components/FamilyTalk';
import { Badge, Button, Card, CheckRow, LinkButton, SectionHeader } from '../components/ui';
import { CALL_QUESTION, CONFIRM_ITEMS, FACILITIES, SAFETY_TIPS, SOURCES } from '../data/info';
import { MAP_LINKS, TRIP } from '../data/trip';
import { copyText } from '../lib/share';
import { useTrip } from '../state/TripContext';

export function Info() {
  const { confirmChecks, toggleConfirm, notify } = useTrip();
  const done = CONFIRM_ITEMS.filter((c) => confirmChecks[c.id]).length;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-b from-mint/70 to-card">
        <Badge tone="peach">가기 전에 이것만 확인해요!</Badge>
        <h1 className="mt-2 text-[22px] font-extrabold text-ink-strong">온천랜드 이용 가이드 ♨️</h1>
        <p className="mt-1 text-[14px] text-ink">아이들과 안전하고 포근한 추억을 만들기 위한 정보 모음이에요.</p>
      </Card>

      <Card>
        <Badge tone="mint">충남 아산</Badge>
        <h2 className="mt-2 text-[20px] font-extrabold text-ink-strong">{TRIP.to}</h2>
        <p className="text-[13px] text-taupe">{TRIP.toFull}</p>

        <div className="mt-4 space-y-2 rounded-2xl bg-well p-4">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden />
            <div>
              <p className="text-[12.5px] text-taupe">어린이온천 운영시간</p>
              <p className="text-[16px] font-extrabold">{TRIP.kidsSpaHours}</p>
              <p className="mt-0.5 text-[12px] text-peach-deep">기존 안내 기준 · 방문 전 최신 운영시간 재확인</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden />
            <div>
              <p className="text-[12.5px] text-taupe">대표 문의</p>
              <p className="text-[16px] font-extrabold">{TRIP.phone}</p>
            </div>
          </div>
        </div>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {FACILITIES.map((f) => (
            <li key={f.label}>
              <Badge tone={f.tone} className="py-1 text-[12.5px]">
                {f.label}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <LinkButton href={TRIP.tel} variant="primary">
            <Phone className="size-4" aria-hidden /> 전화하기
          </LinkButton>
          <LinkButton href={MAP_LINKS.naverTo} variant="peach" external>
            <MapPin className="size-4" aria-hidden /> 길찾기
          </LinkButton>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <a href={MAP_LINKS.naverTo} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center rounded-pill-lg bg-[#03c75a] text-[13.5px] font-bold text-white">
            네이버지도
          </a>
          <a href={MAP_LINKS.kakaoTo} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center rounded-pill-lg bg-[#fee500] text-[13.5px] font-bold text-[#191919]">
            카카오맵
          </a>
        </div>
      </Card>

      <Card id="confirm">
        <SectionHeader
          emoji="✅"
          title="가기 전 꼭 확인!"
          subtitle="5살 남아 2명의 실제 개월 수 기준으로 확인해요"
          right={
            <Badge tone={done === CONFIRM_ITEMS.length ? 'mint' : 'peach'}>
              {done}/{CONFIRM_ITEMS.length}
            </Badge>
          }
        />
        <div className="space-y-1.5">
          {CONFIRM_ITEMS.map((c, i) => (
            <CheckRow
              key={c.id}
              checked={!!confirmChecks[c.id]}
              onChange={() => toggleConfirm(c.id)}
              sub={c.desc}
            >
              {i + 1}. {c.title}
            </CheckRow>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <img src={CHARACTERS.mom.img} alt="" className="h-20 w-auto shrink-0" />
          <div>
            <h2 className="text-[17px] font-extrabold text-ink-strong">전화 문의 꿀팁</h2>
            <p className="text-[13px] text-taupe">말하기 쑥스러우면 이 문구를 그대로 읽으세요!</p>
          </div>
        </div>
        <blockquote className="mt-3 rounded-2xl bg-well p-4 text-[14.5px] leading-relaxed text-ink">“{CALL_QUESTION}”</blockquote>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="peach" onClick={async () => notify((await copyText(CALL_QUESTION)) ? '문의 문구를 복사했어요.' : '복사에 실패했어요.')}>
            <Copy className="size-4" aria-hidden /> 문구 복사
          </Button>
          <LinkButton href={TRIP.tel} variant="primary">
            <Phone className="size-4" aria-hidden /> 전화 걸기
          </LinkButton>
        </div>
      </Card>

      <Card>
        <SectionHeader emoji="🛟" title="아이 안전 안심 수칙" subtitle="겁먹지 말고, 이것만 기억해요" />
        <ul className="space-y-2">
          {SAFETY_TIPS.map((t) => (
            <li key={t.title} className="flex gap-3 rounded-2xl bg-well p-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-xl" aria-hidden>
                {t.emoji}
              </span>
              <div>
                <p className="text-[14.5px] font-bold text-ink-strong">{t.title}</p>
                <p className="text-[13px] leading-snug text-taupe">{t.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionHeader emoji="📚" title="정보 출처와 신뢰도" subtitle="검색 결과로 연결돼요" />
        <ul className="mb-3 space-y-1 text-[13px] leading-relaxed text-ink">
          <li>
            <Badge tone="mint">계획용</Badge> 일정 시간은 우리 가족이 정한 계획이에요.
          </li>
          <li>
            <Badge tone="butter">과거 안내</Badge> 요금·운영시간은 이전 안내 기준이에요.
          </li>
          <li>
            <Badge tone="lav">과거 후기</Badge> 블로그 이용 사례는 현재 규정이 아니에요.
          </li>
        </ul>
        <div className="space-y-2">
          {SOURCES.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-well p-3 active:bg-line">
              <Badge tone={s.tone}>{s.kind}</Badge>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink-strong">{s.title}</span>
                <span className="block text-[12px] leading-snug text-taupe">{s.desc}</span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-taupe" aria-hidden />
            </a>
          ))}
        </div>
      </Card>

      <section className="rounded-card bg-peach/50 p-5 text-center">
        <div className="flex items-end justify-center gap-1">
          <img src={CHARACTERS.rowoon.img} alt="로운" className="h-20 w-auto" />
          <img src={CHARACTERS.roy.img} alt="로이" className="h-24 w-auto" />
        </div>
        <p className="mt-2 text-[15px] font-extrabold text-peach-deep">“우리 가족의 소중한 하루, 따뜻하고 안전하게 즐겨요 ♡”</p>
      </section>
    </div>
  );
}
