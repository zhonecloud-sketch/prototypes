import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

function harness(width,height,phone=true){
  const properties=new Map(),classes=new Set(),events=new Map();
  const root={classList:{contains:name=>classes.has(name),remove:(...names)=>names.forEach(n=>classes.delete(n)),toggle:(name,on)=>on?classes.add(name):classes.delete(name)},
    style:{setProperty:(name,value)=>properties.set(name,String(value)),getPropertyValue:name=>properties.get(name)||'',removeProperty:name=>properties.delete(name)}};
  const elements={gamePage:{scrollTop:0,scrollTo(){}},bettingView:{dataset:{}},betTable:{setAttribute(){}}};
  const visualViewport={width,height,offsetLeft:0,offsetTop:0};
  const document={documentElement:root,body:{},fullscreenElement:null,querySelectorAll:()=>[],
    addEventListener:(name,fn)=>events.set(name,fn)};
  const source=readFileSync(new URL('../index.html',import.meta.url),'utf8').match(/^function updateLayout\(\).*$/m)[0];
  const wide=readFileSync(new URL('../client/wide-view.js',import.meta.url),'utf8').replaceAll('export ','');
  const api=vm.runInNewContext(source+'\n'+wide+';({updateLayout,toggleWideView})',{
    document,window:{visualViewport},navigator:{userAgent:phone?'Android':''},matchMedia:()=>({matches:phone}),
    screen:{orientation:{lock:async()=>{},unlock(){}}},getComputedStyle:()=>root.style,
    MutationObserver:class{observe(){}},requestAnimationFrame(){},$:id=>elements[id],state:{french:true},engine:null
  });
  root.requestFullscreen=async()=>{document.fullscreenElement=root;events.get('fullscreenchange')();api.updateLayout();};
  document.exitFullscreen=async()=>{document.fullscreenElement=null;events.get('fullscreenchange')();api.updateLayout();};
  api.updateLayout();
  const number=name=>parseFloat(properties.get('--'+name));
  return {...api,root,document,number,resize(w,h){visualViewport.width=w;visualViewport.height=h;api.updateLayout();}};
}
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} differs from ${expected}`);

test('Wide view retains Default-view text scale while using the full new surface',async()=>{
  const h=harness(997,540),scale=h.number('desktop-scale');
  await h.toggleWideView();h.resize(1200,540);
  close(h.number('desktop-scale'),scale);
  assert.ok(h.number('surface-width')>1120);
  close(h.number('surface-width')*scale,1200);
  close(h.number('surface-height')*scale,540);
  close(h.number('page-height')+44,h.number('surface-height'));
});

test('switching from the rotated Default view to landscape keeps the same sizing',async()=>{
  const h=harness(540,997),scale=h.number('desktop-scale');
  assert.equal(h.root.classList.contains('portrait-landscape'),true);
  await h.toggleWideView();h.resize(1200,540);
  assert.equal(h.root.classList.contains('portrait-landscape'),false);
  close(h.number('desktop-scale'),scale);
  close(h.number('surface-width')*scale,1200);
});

test('extra fullscreen height remains available and exiting restores normal sizing',async()=>{
  const h=harness(844,390),height=h.number('surface-height'),scale=h.number('desktop-scale');
  await h.toggleWideView();h.resize(915,480);
  close(h.number('desktop-scale'),scale);
  assert.ok(h.number('surface-height')>height);
  await h.toggleWideView();h.resize(844,390);
  assert.equal(h.root.style.getPropertyValue('--default-desktop-scale'),'');
  close(h.number('desktop-scale'),844/1120);
  close(h.number('surface-width'),1120);
  close(h.number('surface-height'),height);
});

test('desktop fullscreen retains its normal scale and a narrower mobile screen still fits',async()=>{
  const desktop=harness(1280,720,false);await desktop.toggleWideView();desktop.resize(1920,1080);
  assert.equal(desktop.number('desktop-scale'),1);
  assert.equal(desktop.root.style.getPropertyValue('--default-desktop-scale'),'');
  const phone=harness(997,540);await phone.toggleWideView();phone.resize(844,390);
  close(phone.number('surface-width')*phone.number('desktop-scale'),844);
  close(phone.number('surface-height')*phone.number('desktop-scale'),390);
});
