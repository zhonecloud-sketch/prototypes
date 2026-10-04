import test from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode, PHASE } from '../server/protocol.js';

const snap = {
  roundId: 7,
  number: 17,
  phase: PHASE.BETTING,
  hash: 'abc123',
  seed: 'deadbeef',
  deadline: 1_700_000_030_000,
  msLeft: 12_345,
  heartbeatMs: 20_000,
};

test('draw omits the seed until the round is revealed', () => {
  const revealed = encode.draw(snap);
  assert.equal(revealed.sv, 'deadbeef');

  const pending = encode.draw({ ...snap, seed: undefined });
  assert.ok(!('sv' in pending), 'an unrevealed seed must not be serialised');
});

test('hello carries the heartbeat so clients need no hardcoded config', () => {
  assert.equal(encode.hello(snap).hb, 20_000);
});

test('messages stay small enough to broadcast every 30s', () => {
  for (const [name, msg] of Object.entries({
    hello: encode.hello(snap), draw: encode.draw(snap), close: encode.close(snap),
  })) {
    const bytes = Buffer.byteLength(JSON.stringify(msg));
    assert.ok(bytes < 160, `${name} is ${bytes} bytes, expected a compact payload`);
  }
});

test('presentation data is never on the wire', () => {
  const wire = JSON.stringify(encode.draw(snap));
  // Colour, dozens and columns are derivable from `n`; sending them would be
  // wasted bytes and a second source of truth for the client.
  for (const forbidden of ['color', 'red', 'black', 'dozen', 'column']) {
    assert.ok(!wire.includes(forbidden), `wire format must not carry "${forbidden}"`);
  }
});

test('decode rejects malformed and oversized input without throwing', () => {
  for (const bad of ['', 'not json', '[]', 'null', '"str"', '{"t":', 'x'.repeat(513), undefined, 42]) {
    assert.equal(decode(bad), null, `should reject: ${String(bad).slice(0, 20)}`);
  }
});

test('decode accepts well-formed control messages', () => {
  assert.deepEqual(decode('{"t":"ping"}'), { t: 'ping' });
  assert.deepEqual(decode('{"t":"bye"}'), { t: 'bye' });
  assert.deepEqual(decode('{"t":"last","r":12}'), { t: 'last', r: 12 });
});

test('decode tolerates unknown fields for forward compatibility', () => {
  // A newer server may add keys; an older client must not crash on them.
  assert.deepEqual(decode('{"t":"ping","future":1}'), { t: 'ping', future: 1 });
});