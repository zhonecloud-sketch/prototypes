export const MULTIPLAYER_URL = 'https://atelier-roulette-test.zhonecloud.chatgpt.site';

export function openMultiplayer(destination = 'account') {
  const url = new URL(MULTIPLAYER_URL);
  if (['collection', 'chips', 'insights'].includes(destination)) url.searchParams.set('view', destination);
  // A new tab keeps any accepted solo wager and its settlement alive.
  window.open(url.href, '_blank', 'noopener');
}
