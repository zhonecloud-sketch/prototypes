const addonPaths = [
  'controls/OrbitControls.js',
  'postprocessing/EffectComposer.js',
  'postprocessing/RenderPass.js',
  'postprocessing/UnrealBloomPass.js',
  'postprocessing/OutputPass.js',
  'postprocessing/ShaderPass.js',
  'utils/BufferGeometryUtils.js'
];

function loadAddons(baseUrl) {
  return Promise.all(addonPaths.map(path => import(baseUrl + path)));
}

const [
  { OrbitControls },
  { EffectComposer },
  { RenderPass },
  { UnrealBloomPass },
  { OutputPass },
  { ShaderPass },
  { mergeGeometries, mergeVertices }
] = await loadAddons('../../lib/three/').catch(error => {
  console.warn('Local Three.js add-ons failed to load. Trying the CDN.', error);
  return loadAddons('https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/');
});

export { OrbitControls, EffectComposer, RenderPass, UnrealBloomPass, OutputPass, ShaderPass, mergeGeometries, mergeVertices };
