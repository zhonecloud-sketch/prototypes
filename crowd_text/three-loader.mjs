export async function loadThree() {
  try {
    return await import('../lib/three.module.js');
  } catch {
    return import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js');
  }
}
