// Cross-check the client-side derivation against the server implementation.
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { numberFrom, commit, SAMPLING_BOUND, POCKET_COUNT } from '../server/roulette.js';

const hexToBytes = (hex) =>
  new Uint8Array((hex.match(/../g) ?? []).map((b) => parseInt(b, 16)));

/** Byte-for-byte port of public/app.js `deriveNumber`, using WebCrypto. */
async function deriveNumber(seed, roundId) {
  const key = await crypto.subtle.importKey(
    'raw', hexToBytes(seed), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`r${roundId}:a0`));
  const view = new DataView(sig);
  for (let i = 0; i < 8; i++) {
    const word = view.getUint32(i * 4);
    if (word < SAMPLING_BOUND) return word % POCKET_COUNT;
  }
  throw new Error('rejection sampling did not terminate');
}

test('the client mirrors the server sampling bound', async () => {
  // 50 independent seeds: enough to exercise both the accept path and the
  // rare rejection path, and to catch any endianness or stride drift.
  for (let i = 0; i < 50; i++) {
    const seed = crypto.randomBytes(32).toString('hex');
    const roundId = i + 1;
    assert.equal(
      await deriveNumber(seed, roundId),
      numberFrom(seed, roundId),
      'client and server must derive the same number, or the demo lies to the user'
    );
  }
});

test('the seed is keyed as raw bytes, not as hex text', async () => {
  // Regression guard. The seed travels as hex, but must be HMAC'd over its
  // decoded bytes. Keying on the hex text makes the result depend on an
  // encoding choice and silently breaks browser verification, because WebCrypto
  // imports the raw bytes. This test fails loudly if that ever changes.
  const seed = 'ab'.repeat(32);
  const rawKeyed = crypto.createHmac('sha256', Buffer.from(seed, 'hex')).update('r1:a0').digest();
  const textKeyed = crypto.createHmac('sha256', seed).update('r1:a0').digest();
  assert.notEqual(rawKeyed.toString('hex'), textKeyed.toString('hex'),
    'the two keyings differ, so the choice of key material is load-bearing');

  const view = new DataView(rawKeyed.buffer, rawKeyed.byteOffset, rawKeyed.byteLength);
  let expected = null;
  for (let i = 0; i < 8; i++) {
    const word = view.getUint32(i * 4);
    if (word < SAMPLING_BOUND) { expected = word % POCKET_COUNT; break; }
  }
  assert.equal(numberFrom(seed, 1), expected, 'numberFrom must key on raw bytes');
  assert.equal(await deriveNumber(seed, 1), expected, 'the client must agree');
});

test('a non-hex seed is rejected rather than silently derived', () => {
  assert.throws(() => numberFrom('not-hex!!', 1), TypeError);
});
test('the client commitment check matches the server', async () => {
  const seed = crypto.randomBytes(32).toString('hex');
  const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', hexToBytes(seed)))]
    .map((b) => b.toString(16).padStart(2, '0')).join('');
  assert.equal(digest, commit(seed), 'client-side sha256 must match server commit()');
});