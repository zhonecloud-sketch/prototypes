import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

function harness({phone=true,rotated=false,scale=.75,wide=false}={}){
  const events=new Map(),page={addEventListener:(name,fn,options)=>events.set(name,{fn,options})};
  const document={fullscreenElement:wide?{}:null,documentElement:{classList:{contains:name=>name==='phone-layout'?phone:name==='portrait-landscape'&&rotated}}};
  const content={parentElement:page,isConnected:true,scrollTop:0,scrollHeight:1400,clientHeight:400,offsetHeight:400,
    getBoundingClientRect:()=>({width:(rotated?400:1120)*scale,height:(rotated?1120:400)*scale})};
  const source=readFileSync(new URL('../client/account-scroll.js',import.meta.url),'utf8').replace('export ','');
  vm.runInNewContext(source+';installAccountScroll(page)',{document,page});
  function dispatch(name,touches=[],extra={}){
    const e={touches,target:{closest:()=>content},cancelable:true,detail:1,prevented:false,stopped:false,
      preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...extra};
    events.get(name).fn(e);return e;
  }
  return {content,document,events,dispatch};
}
const finger=(x,y,identifier=1)=>({clientX:x,clientY:y,identifier});

test('Default-view finger swipes scroll content by the displayed distance at different scales',()=>{
  for(const scale of [.55,.75,1]){
    const h=harness({scale});
    h.dispatch('touchstart',[finger(120,300)]);
    assert.equal(h.dispatch('touchmove',[finger(120,180)]).prevented,true);
    assert.equal(h.content.scrollTop,120/scale);
    h.dispatch('touchend');
    h.dispatch('touchstart',[finger(120,180)]);
    h.dispatch('touchmove',[finger(120,240)]);
    assert.equal(h.content.scrollTop,60/scale);
    assert.equal(h.events.get('touchmove').options.passive,false);
  }
});

test('the portrait fallback converts screen swipes into the rotated content axis',()=>{
  const h=harness({rotated:true});
  h.dispatch('touchstart',[finger(100,200)]);
  h.dispatch('touchmove',[finger(220,200)]);
  assert.equal(h.content.scrollTop,160);
  h.dispatch('touchend');
  h.dispatch('touchstart',[finger(220,200)]);
  h.dispatch('touchmove',[finger(160,200)]);
  assert.equal(h.content.scrollTop,80);
});

test('a swipe reaches each end without scrolling past the available content',()=>{
  const h=harness();
  h.dispatch('touchstart',[finger(100,300)]);
  h.dispatch('touchmove',[finger(100,-1000)]);
  assert.equal(h.content.scrollTop,1000);
  h.dispatch('touchend');
  h.dispatch('touchstart',[finger(100,100)]);
  h.dispatch('touchmove',[finger(100,2000)]);
  assert.equal(h.content.scrollTop,0);
});

test('taps work and dragging over a button cannot activate its action',()=>{
  const h=harness();
  h.dispatch('touchstart',[finger(100,200)]);
  assert.equal(h.dispatch('touchmove',[finger(100,198)]).prevented,false);
  h.dispatch('touchend');
  assert.equal(h.dispatch('click').prevented,false);
  h.dispatch('touchstart',[finger(100,200)]);
  h.dispatch('touchmove',[finger(100,100)]);
  h.dispatch('touchend');
  assert.equal(h.dispatch('click',[],{pointerType:'mouse'}).prevented,false);
  assert.equal(h.dispatch('click',[],{detail:0}).prevented,false);
  const click=h.dispatch('click');
  assert.equal(click.prevented,true);assert.equal(click.stopped,true);
  h.dispatch('touchstart',[finger(100,200)]);h.dispatch('touchend');
  assert.equal(h.dispatch('click').prevented,false);
});

test('pinch zoom and cancelled or replaced content do not continue a one-finger scroll',()=>{
  const h=harness();
  h.dispatch('touchstart',[finger(100,200)]);
  assert.equal(h.dispatch('touchmove',[finger(100,100),finger(200,100,2)]).prevented,false);
  h.dispatch('touchmove',[finger(100,50)]);assert.equal(h.content.scrollTop,0);
  h.dispatch('touchstart',[finger(100,200)]);h.dispatch('touchcancel');
  h.dispatch('touchmove',[finger(100,50)]);assert.equal(h.content.scrollTop,0);
  h.dispatch('touchstart',[finger(100,200)]);h.content.isConnected=false;
  h.dispatch('touchmove',[finger(100,50)]);assert.equal(h.content.scrollTop,0);
});

test('desktop and Wide view retain browser scrolling, including a mode change mid-swipe',()=>{
  for(const settings of [{phone:false},{wide:true}]){
    const h=harness(settings);
    h.dispatch('touchstart',[finger(100,200)]);
    assert.equal(h.dispatch('touchmove',[finger(100,100)]).prevented,false);
    assert.equal(h.content.scrollTop,0);
  }
  const h=harness();
  h.dispatch('touchstart',[finger(100,200)]);h.document.fullscreenElement={};
  assert.equal(h.dispatch('touchmove',[finger(100,100)]).prevented,false);
  assert.equal(h.content.scrollTop,0);
});
