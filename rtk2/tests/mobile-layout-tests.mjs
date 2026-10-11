import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const cssText=fs.readFileSync('style.css','utf8'),dom=new JSDOM(fs.readFileSync('index.html','utf8')),d=dom.window.document;
const css=d.createElement('style');css.textContent=cssText;d.head.append(css);
assert.notEqual(dom.window.getComputedStyle(d.querySelector('#governor')).display,'none');assert.equal(dom.window.getComputedStyle(d.querySelector('#governor')).fontFamily,dom.window.getComputedStyle(d.querySelector('#rulerName')).fontFamily);console.log('PASS desktop governor is displayed with the ruler-summary font');
const mobile=d.createElement('style');mobile.textContent=[...css.sheet.cssRules].filter(r=>r.conditionText?.match(/max-height:\s*600px/)).flatMap(r=>[...r.cssRules].map(x=>x.cssText)).join('\n');mobile.textContent+='\n'+cssText.slice(cssText.indexOf('/* v36:'));d.head.append(mobile);
d.querySelector('#game').classList.add('battle-active');
d.querySelector('#battleOrders').innerHTML='<div id="panelBody"><div class="battle-actions primary-battle">'+['Move','Attack','Wait','View','Strategy','Flee','End turn'].map(x=>'<button>'+x+'</button>').join('')+'</div></div>';
d.querySelector('#battleComparison').innerHTML='<div class="army-column army-labels"><span>Men</span><span>F/R</span></div>';
const style=node=>dom.window.getComputedStyle(node),baseline=style(d.querySelector('.army-labels>span'));
const status=d.querySelector('#toast');status.textContent='Defender’s turn';status.classList.add('show');
for(const text of ['Defender’s turn','Liu Bei’s turn','Liu Bei attacked: 100 enemy losses, 50 own losses.']){status.textContent=text;const s=style(status);assert.equal(s.top,'auto');assert.equal(s.height,'auto');assert.equal(s.minHeight,'0px');assert.equal(s.borderTopWidth,'0px');assert.equal(s.boxShadow,'none');assert.equal(s.paddingTop,'4px');assert.equal(s.paddingBottom,'4px');}
status.classList.add('battle-result');assert.equal(style(status).top,'50%');assert.equal(style(status).height,'auto');assert.equal(style(status).borderTopWidth,'0px');status.classList.remove('battle-result');
console.log('PASS battlefield status has content height and no frame, including result playback');
for(const selector of ['#date','#season','#provinceName','#rulerName','#governor','#eventTitle','#eventText','#battleMenu','#battleHUD','#cheatToggle','#dialogTitle','#hudTabs button','.primary-battle button','.province-label']){
 if(selector==='.province-label'){const badge=d.createElement('button');badge.className='province-label';d.querySelector('#world').append(badge);}
 for(const node of d.querySelectorAll(selector)){assert.equal(style(node).fontSize,baseline.fontSize,selector+' font size');assert.equal(style(node).fontFamily,baseline.fontFamily,selector+' font family');}
}
for(const selector of ['#menu','#cheatToggle','#battleMenu','#battleHUD','#closeHud','#hudTabs button','#singleAIStep','#resumeHud','.primary-battle button'])for(const node of d.querySelectorAll(selector)){assert.equal(style(node).height,'var(--command-height)',selector+' height');}
assert.equal(style(d.querySelector('.battle-actions')).gridTemplateColumns,'repeat(3,minmax(0,1fr))');assert.equal(style(d.querySelector('#battleOrders')).overflow,'hidden');assert.equal(style(d.querySelector('#panelBody')).overflow,'hidden');
const bounds=mobile.textContent.match(/--command-height:\s*clamp\((\d+)px,\s*([\d.]+)dvh,\s*(\d+)px\)/);assert(bounds);
for(const h of [270,320,375,393,500,600]){const height=Math.max(+bounds[1],Math.min(h*+bounds[2]/100,+bounds[3]));assert(height*3+2*3+4<=h*.3,'Three command rows fit at '+h+'px landscape height');}
assert.equal(style(d.querySelector('.primary-battle button')).lineHeight,'1');assert.equal(style(d.querySelector('.primary-battle button')).overflowWrap,'anywhere');assert.equal(style(d.querySelector('#portraitButton')).height,'100%');assert.equal(style(d.querySelector('#expandEvent')).height,'100%');
d.querySelector('#dialogFooter').innerHTML='<button>Back</button><button>Confirm</button>';
const footer=d.querySelector('#dialogFooter');assert.equal(style(footer).display,'flex');assert.equal(style(footer).justifyContent,'center');
for(const b of footer.children){assert.equal(style(b).width,'var(--dialog-command-width)');assert.equal(style(b).maxWidth,'var(--dialog-command-width)');assert.equal(style(b).height,'var(--command-height)');}
footer.innerHTML='<button>Continue</button>';assert.equal(style(footer).justifyContent,'center');assert.equal(style(footer.firstChild).flexGrow,'0');
d.querySelector('#eventFrame').innerHTML='<div class="strategic-chronology"><article class="realm-event"><button><canvas class="chronology-art"></canvas><span>A long campaign report that wraps naturally.</span></button></article></div>';
const card=d.querySelector('.realm-event button');assert.equal(style(card).height,'auto');assert.equal(style(card).alignItems,'flex-start');assert.equal(style(card).whiteSpace,'normal');assert.equal(style(card.querySelector('span')).lineHeight,'1.5');assert.equal(style(card.querySelector('canvas')).height,'38.39px');
assert.equal(d.querySelector('#toast').parentElement.id,'world');assert.equal(style(d.querySelector('#hudTabs')).gridTemplateColumns,'repeat(4,minmax(0,1fr))');assert.equal(style(d.querySelector('.legend-color.neutral')).marginLeft,'0px');assert.equal(style(d.querySelector('#provinceConnections')).bottom,'calc(14px + var(--command-height))');
d.querySelector('#hudBody').innerHTML='<section class="hud-ai-debug"><div class="dialog-buttons hud-debug-controls"><button aria-pressed="true">Planned path</button><button aria-pressed="false">Jungle scores</button></div></section>';
const debugButtons=[...d.querySelectorAll('.hud-debug-controls button')],debugRow=d.querySelector('.hud-debug-controls');
assert.equal(style(debugRow).justifyContent,'center');assert.equal(style(debugRow).display,'flex');
for(const b of debugButtons){assert.equal(style(b).width,'var(--dialog-command-width)');assert.equal(style(b).height,'var(--command-height)');assert.equal(style(b).flexGrow,'0');assert.equal(style(b).fontSize,baseline.fontSize);assert.equal(style(b).fontFamily,baseline.fontFamily);}
console.log('PASS AI overlay controls retain centred shared dimensions and mobile typography');
console.log('PASS centred equal-width single/multiple actions and content-sized event cards');
console.log('PASS mobile typography, command targets, retained artwork frames and three-row height budget (270–600px)');
assert.equal(style(d.querySelector('.province-summary')).marginTop,'1px');assert.equal(style(d.querySelector('.province-summary')).lineHeight,'1.1');
assert.equal(style(d.querySelector('.province-heading')).minHeight,'var(--command-height)');
for(const h of [270,320,375,393,500,600]){const heading=Math.max(+bounds[1],Math.min(h*+bounds[2]/100,+bounds[3]));assert(14+heading+1+3*12*1.1<=h*.3,'Governor summary fits at '+h+'px landscape height');}
console.log('PASS all three governor summary rows fit the shortest mobile panel without reducing the shared font');

assert.notEqual(style(d.querySelector('#governor')).display,'none');console.log('PASS mobile governor is displayed, including legacy short-screen rules');
