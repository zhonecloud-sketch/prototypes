import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {Game,createCampaign} from '../mjs/strategy.mjs';
import {aiBattle} from '../mjs/battle.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const root=path.resolve('.'),scenarios=JSON.parse(fs.readFileSync('config/scenarios.json')),terrains=JSON.parse(fs.readFileSync('config/province-terrain.json'));
const server=spawn(path.join(root,process.platform==='win32'?'bin/attk-server.exe':'bin/attk-server'),['--root',root,'--port','0','--no-open']);
const base=await new Promise((resolve,reject)=>{let output='';server.once('error',reject);server.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/Rust server: (http:\/\/\S+)\/index.html/);if(match)resolve(match[1]);});server.once('exit',code=>reject(Error('Server exited '+code)));});
fs.mkdirSync('dist/screenshots',{recursive:true});
let browser;
try{
 browser=await chromium.launch({channel:process.platform==='win32'?'msedge':undefined,headless:true});
 for(const [width,height,side] of [[568,270,'defend'],[640,360,'attack'],[844,390,'attack']]){
  const g=new Game(createCampaign(scenarios[0],[0]),{},structuredClone(terrains));g.s.settings.battleView='all';g.s.settings.sound=g.s.settings.music=false;g.s.monthlyReview=null;g.s.paused=true;g.s.speed=g.s.settings.messageSpeed=500;for(const o of g.s.officers)o.ambition=0;g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000});const b=g.s.battle;g.s.humanRulers=[b.attacker,b.defender];while(!(b.side==='defend'&&b.units.every(u=>u.placed)))aiBattle(g);
  const initiator=b.units.find(u=>u.side===side&&u.id!==b.leaders[side]),responder=b.units.find(u=>u.side!==side&&u.id!==b.leaders[u.side]);initiator.war=side==='attack'?100:1;responder.war=side==='attack'?1:100;
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,deviceScaleFactor:1});await context.addInitScript(payload=>localStorage.setItem('attk-campaign-v1',payload),JSON.stringify(g.s));const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  const handoff=async()=>{if(await page.locator('#acceptArmy').isVisible())await page.locator('#acceptArmy').click();};
  await page.goto(base+'/index.html');await page.locator('#newGame').waitFor({state:'visible'});await page.locator('#loadGame').click();await page.locator('#loadCheckpoint').click();await page.locator('#confirmDeployment').click();
  await page.waitForFunction(()=>!document.querySelector('#toast').classList.contains('show'));
  if(side==='attack'){await page.locator('#declinePersonalCombat').click();await handoff();await page.waitForFunction(()=>!document.querySelector('#toast').classList.contains('show'));}
  await page.locator('#duelInitiator').selectOption(String(initiator.id));await page.locator('#offerPersonalCombat').click();await handoff();await page.locator('#personalCombat[data-stage=challenge]').waitFor({state:'visible'});await page.screenshot({path:`dist/screenshots/personal-combat-challenge-${width}.png`});await page.locator('#personalCombat').waitFor({state:'hidden'});
  await page.locator('#duelResponder').selectOption(String(responder.id));await page.locator('#acceptChallenge').click();await handoff();await page.locator('#personalCombat[data-stage=combat]').waitFor({state:'visible'});
  const boxes=await page.locator('#personalCombat').evaluate(panel=>{const r=panel.getBoundingClientRect();return {panel:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},children:[...panel.children].map(node=>{const b=node.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom};}),sides:[...panel.querySelectorAll('.personal-combat-general')].map(node=>node.dataset.side),pageOverflow:document.documentElement.scrollWidth>innerWidth};});
  assert.deepEqual(boxes.sides,['defend','attack']);assert(!boxes.pageOverflow);for(const box of boxes.children){assert(box.x>=boxes.panel.x&&box.right<=boxes.panel.right+1);assert(box.y>=boxes.panel.y&&box.bottom<=boxes.panel.bottom+1,JSON.stringify({width,height,box,panel:boxes.panel}));}
  await page.screenshot({path:`dist/screenshots/personal-combat-animation-${width}.png`});await page.locator(`#personalCombat[data-stage=${side==='attack'?'win':'loss'}]`).waitFor({state:'visible',timeout:30000});await page.screenshot({path:`dist/screenshots/personal-combat-result-${width}.png`});assert.deepEqual(errors,[]);console.log(`PASS actual Edge/Chromium ${width}x${height}: human ${side}, full scene/counters/results fit, no browser errors`);await context.close();
 }
}finally{await browser?.close();server.kill();}
