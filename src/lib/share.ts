export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 아래 예전 방식으로 다시 시도
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** 스마트폰 공유창이 있으면 공유, 없으면 클립보드 복사 */
export async function shareOrCopy(title: string, text: string): Promise<'shared' | 'copied' | 'cancelled' | 'failed'> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
      // 공유 실패 시 복사로 대체
    }
  }
  return (await copyText(text)) ? 'copied' : 'failed';
}
