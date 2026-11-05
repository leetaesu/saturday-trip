import { useEffect, useState } from 'react';

const PREFIX = 'onyang-trip:v1:';

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    // 기본값이 객체면 새로 생긴 필드가 빠지지 않도록 얕게 합친다.
    if (isPlainObject(fallback) && isPlainObject(parsed)) {
      return { ...fallback, ...parsed } as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

/** useState와 같지만 값이 바뀔 때마다 localStorage에 자동 저장된다. */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStore(key, initial));

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // 사생활 보호 모드나 저장 공간 부족이면 저장만 건너뛴다.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function clearAllStore() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // 무시
  }
}
