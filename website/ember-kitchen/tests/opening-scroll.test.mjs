import { test } from 'node:test';
import assert from 'node:assert/strict';
import { holdOpeningScroll } from '../app/opening-scroll.ts';

function browser() {
  const classes = new Set();
  const events = new EventTarget();
  class Element { closest() { return null; } }
  globalThis.Element = Element;
  globalThis.document = { documentElement: { classList: { add: name => classes.add(name), remove: name => classes.delete(name) } } };
  globalThis.history = { scrollRestoration: 'auto' };
  globalThis.window = Object.assign(events, {
    scrollY: 800,
    scrollTo({ top }) { this.scrollY = top; },
  });
  function dispatch(type, props = {}) {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, props);
    events.dispatchEvent(event);
    return event;
  }
  return { classes, dispatch };
}

test('loading blocks wheel, touch, keyboard and restored scroll; releasing restores native navigation', () => {
  const { classes, dispatch } = browser();
  const opening = holdOpeningScroll();
  assert.equal(window.scrollY, 0);
  assert.equal(history.scrollRestoration, 'manual');
  assert.ok(classes.has('opening-locked'));
  for (const [type, props] of [['wheel', {}], ['touchmove', {}], ['keydown', { key: 'PageDown' }]]) {
    assert.equal(dispatch(type, props).defaultPrevented, true);
  }
  assert.equal(dispatch('keydown', { key: 'Tab' }).defaultPrevented, false);
  window.scrollY = 600;
  dispatch('scroll');
  assert.equal(window.scrollY, 0);
  opening.release();
  assert.equal(opening.locked, false);
  assert.equal(classes.has('opening-locked'), false);
  assert.equal(history.scrollRestoration, 'auto');
  assert.equal(dispatch('wheel').defaultPrevented, false);
  window.scrollY = 600;
  dispatch('scroll');
  assert.equal(window.scrollY, 600);
});

test('first frame waits for the current touch and wheel momentum to finish before unlocking', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { dispatch } = browser();
  const opening = holdOpeningScroll();
  let released = 0;
  dispatch('touchstart');
  opening.releaseWhenIdle(() => released++);
  t.mock.timers.tick(1000);
  assert.equal(opening.locked, true);
  dispatch('touchend');
  t.mock.timers.tick(349);
  dispatch('wheel');
  t.mock.timers.tick(349);
  assert.equal(opening.locked, true);
  t.mock.timers.tick(1);
  assert.equal(opening.locked, false);
  assert.equal(released, 1);
  assert.equal(window.scrollY, 0);
});

test('a menu bypass cancels pending release without jumping back when the model finishes', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  browser();
  const opening = holdOpeningScroll();
  let callbacks = 0;
  opening.releaseWhenIdle(() => callbacks++);
  opening.release();
  window.scrollY = 2000;
  t.mock.timers.tick(1000);
  assert.equal(callbacks, 0);
  opening.releaseWhenIdle(() => callbacks++);
  opening.release();
  assert.equal(callbacks, 1);
  assert.equal(window.scrollY, 2000);
});
