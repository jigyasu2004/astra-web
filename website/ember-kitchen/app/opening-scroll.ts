/** Keep the first frame in place, including iOS touch scrolling and restored scroll positions. */
export function holdOpeningScroll() {
  const root = document.documentElement;
  const restoration = history.scrollRestoration;
  let locked = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: (() => void) | undefined;
  let touching = false;
  const quietTime = 350;

  history.scrollRestoration = 'manual';
  root.classList.add('opening-locked');
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  function settle() {
    clearTimeout(timer);
    if (!pending || touching) return;
    timer = setTimeout(() => {
      const done = pending;
      release();
      done?.();
    }, quietTime);
  }
  function block(event: Event) {
    if (event.cancelable) event.preventDefault();
    settle();
  }
  function touchStart() { touching = true; clearTimeout(timer); }
  function touchEnd() { touching = false; settle(); }
  function keyDown(event: KeyboardEvent) {
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [contenteditable="true"]')) return;
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) block(event);
  }
  function resetScroll() {
    if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  window.addEventListener('wheel', block, { passive: false });
  window.addEventListener('touchmove', block, { passive: false });
  window.addEventListener('touchstart', touchStart, { passive: true });
  window.addEventListener('touchend', touchEnd, { passive: true });
  window.addEventListener('touchcancel', touchEnd, { passive: true });
  window.addEventListener('keydown', keyDown);
  window.addEventListener('scroll', resetScroll);

  function release() {
    if (!locked) return;
    locked = false;
    clearTimeout(timer);
    pending = undefined;
    window.removeEventListener('wheel', block);
    window.removeEventListener('touchmove', block);
    window.removeEventListener('touchstart', touchStart);
    window.removeEventListener('touchend', touchEnd);
    window.removeEventListener('touchcancel', touchEnd);
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('scroll', resetScroll);
    root.classList.remove('opening-locked');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    history.scrollRestoration = restoration;
  }
  return {
    get locked() { return locked; },
    release,
    releaseWhenIdle(done: () => void) {
      if (!locked) { done(); return; }
      pending = done;
      settle();
    },
  };
}
