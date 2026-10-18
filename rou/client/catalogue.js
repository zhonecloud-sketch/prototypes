// Prices are the owner's accepted Phase 00 catalogue; these are virtual goods.
export const COLLECTIBLES = Object.freeze([
  { id: 'watch', name: 'Luxury watch', price: 200_000, category: 'Jewellery', description: 'A mechanical timepiece in warm gold and platinum, finished with an emerald dial.' },
  { id: 'pendant', name: 'Emerald pendant', price: 400_000, category: 'Jewellery', description: 'An emerald-cut centrepiece, a fine gold chain and a halo of diamonds.' },
  { id: 'limo', name: 'Limousine', price: 500_000, category: 'Motoring', description: 'Understated black coachwork. An arrival worth remembering.' },
  { id: 'yacht', name: 'Private yacht', price: 25_000_000, category: 'On the water', description: 'Open decks, quiet coves and a Mediterranean horizon.' },
  { id: 'mansion', name: 'Coastal mansion', price: 80_000_000, category: 'Estates', description: 'Limestone, glass and an infinity pool above the sea.' },
  { id: 'golf-course', name: 'Luxury golf course', price: 160_000_000, category: 'Estates', description: 'Sculpted fairways and ocean views, all the way to the eighteenth.' },
  { id: 'jet', name: 'Private jet', price: 300_000_000, category: 'Above it all', description: 'A long-range business jet, ready for the next horizon.' },
  { id: 'island', name: 'Private island', price: 500_000_000, category: 'Estates', description: 'Your own palm-lined retreat, surrounded by turquoise shallows.' },
  { id: 'shuttle', name: 'Space shuttle', price: 5_000_000_000, category: 'Above it all', description: 'A winged orbital explorer. The collection reaches beyond Earth.' },
].map(item => Object.freeze({ ...item, image: `assets/collectibles/${item.id}.png` })));

export const CHIP_PACKS = Object.freeze([
  { id: 'chips-100k', chips: 100_000, cents: 490 },
  { id: 'chips-1m', chips: 1_000_000, cents: 990 },
  { id: 'chips-50m', chips: 50_000_000, cents: 4990 },
  { id: 'chips-500m', chips: 500_000_000, cents: 9990 },
  { id: 'chips-5b', chips: 5_000_000_000, cents: 49990 },
]);
// Test price only. Production billing and provider approval are still pending.
export const INSIGHTS_PASS = Object.freeze({ id: 'insights-30d', cents: 490, days: 30 });

export function newProfile(now = Date.now()) {
  return { version: 1, epoch: crypto.randomUUID(), resetAt: now, items: [], showcase: null, insightsUntil: 0, orders: [] };
}

export function restoreProfile(value, now = Date.now()) {
  if (!value) return newProfile(now);
  if (value.version !== 1 || typeof value.epoch !== 'string' || !Number.isFinite(value.resetAt) ||
      !Array.isArray(value.items) || !Array.isArray(value.orders) || !Number.isFinite(value.insightsUntil)) {
    throw new Error('The saved collection is invalid. Your save has not been overwritten.');
  }
  const ids = new Set();
  for (const item of value.items) {
    if (!COLLECTIBLES.some(c => c.id === item.id) || !Number.isSafeInteger(item.paid) || item.paid < 0) {
      throw new Error('The saved collectible ownership is invalid.');
    }
    ids.add(item.id);
  }
  if (value.showcase !== null && !ids.has(value.showcase)) throw new Error('The saved showcase is invalid.');
  return structuredClone(value);
}

export function acquire(profile, balance, id, now = Date.now()) {
  const item = COLLECTIBLES.find(c => c.id === id);
  if (!item) throw new Error('This collectible is not in the catalogue.');
  if (!Number.isSafeInteger(balance) || balance < item.price) throw new Error('You need more play chips for this collectible.');
  const next = structuredClone(profile);
  next.items.push({ id, paid: item.price, acquiredAt: now });
  next.showcase = id;
  return { profile: next, balance: balance - item.price };
}

// Each acquisition is a separate copy. Spending converts chips to item value.
export function collectionWealth(profile, balance) {
  const itemValue = (profile?.items || []).reduce((sum, item) => sum + item.paid, 0);
  const total = balance + itemValue;
  if (!Number.isSafeInteger(total) || total < 0) throw new Error('Invalid wealth total.');
  return { chips: balance, itemValue, total, copies: profile?.items.length || 0 };
}

export function simulatePurchase(profile, balance, productId, orderId, result, now = Date.now()) {
  if (!['success', 'decline', 'pending'].includes(result)) throw new Error('Unknown simulator result.');
  const product = CHIP_PACKS.find(p => p.id === productId) || (productId === INSIGHTS_PASS.id ? INSIGHTS_PASS : null);
  if (!product || typeof orderId !== 'string' || !orderId || !Number.isSafeInteger(balance) || balance < 0) throw new Error('Invalid test purchase.');
  const next = structuredClone(profile);
  const existing = next.orders.find(o => o.id === orderId);
  if (existing && existing.productId !== productId) throw new Error('That order ID belongs to another product.');
  if (existing?.status === 'success' || existing?.status === 'decline') return { profile: next, balance };
  const order = existing || { id: orderId, productId, createdAt: now, cents: product.cents, mode: 'simulated' };
  if (!existing) next.orders.push(order);
  order.status = result;
  if (result === 'success') {
    if (product.chips) {
      if (!Number.isSafeInteger(balance + product.chips)) throw new Error('This purchase exceeds the supported balance.');
      balance += product.chips;
    } else next.insightsUntil = Math.max(now, next.insightsUntil) + product.days * 86_400_000;
    order.completedAt = now;
  }
  return { profile: next, balance };
}
