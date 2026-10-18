// Shared controls for the standalone About, Privacy and Terms pages.
const bar = document.createElement('nav');
bar.setAttribute('aria-label', 'Page controls');
bar.innerHTML = '<button type="button">Wide view ↗</button><a href="index.html" aria-label="Menu — return to launch" title="Menu">⚙</a>';
bar.style.cssText = 'position:sticky;top:0;z-index:20;display:flex;justify-content:flex-end;align-items:center;gap:10px;padding:10px 18px;background:#101a16;color:#ede9da';
const button = bar.querySelector('button'), menu = bar.querySelector('a');
for (const control of [button, menu]) control.style.cssText = 'color:#ede9da;background:#182b20;border:1px solid #c4b48255;border-radius:6px;padding:8px 12px;font:13px Arial,sans-serif;text-decoration:none;cursor:pointer';
menu.style.fontSize = '22px';
button.onclick = async () => {
  try { await document.documentElement.requestFullscreen(); }
  catch { button.textContent = 'Use browser fullscreen'; }
};
document.addEventListener('fullscreenchange', () => { button.hidden = !!document.fullscreenElement; });
document.body.prepend(bar);
