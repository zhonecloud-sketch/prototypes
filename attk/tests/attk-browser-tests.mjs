import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium,webkit} from 'playwright';
const child=spawn(path.resolve('bin/attk-server'),['--root',process.cwd(),'--port','0']);
let output='';
const base=await new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>{child.kill();reject(Error('Startup timeout'));},15000);
 child.once('error',e=>{clearTimeout(timer);reject(e);});
 child.stdout.on('data',b=>{output+=b;const m=output.match(/Rust server: (http:\/\/[^\s]+)\/index.html/);
  if(m){clearTimeout(timer);resolve(m[1]);}});
});
fs.mkdirSync('dist/screenshots',{recursive:true});
try{
 for(const [name,type] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await type.launch();
  try{
   for(const [width,height] of [[667,375],[844,390],[915,412],[1280,720]]){
    const context=await browser.newContext({viewport:{width,height},
     hasTouch:height<500,deviceScaleFactor:height<500?2:1});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/index.html');
    await page.locator('#launch').waitFor({state:'visible',timeout:30000});
    assert.equal(await page.title(),'A Tale of the Three Kingdoms');
    assert.equal(await page.evaluate(()=>globalThis[Symbol.for('attk.rust.kernel.v1')].kernel_version()),1);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const menu=await page.locator('#newGame').boundingBox();
    assert(menu.x>=0&&menu.y>=0&&menu.x+menu.width<=width&&menu.y+menu.height<=height);
    await page.locator('#newGame').click();
    await page.locator('#setupWizard').waitFor({state:'visible'});
    const next=await page.locator('#wizardNext').boundingBox();
    assert(next.x>=0&&next.y>=0&&next.x+next.width<=width&&next.y+next.height<=height,
     JSON.stringify({browser:name,width,height,next}));
    await page.evaluate(()=>{const body=document.getElementById('wizardBody');body.scrollTop=body.scrollHeight;});
    const pinned=await page.locator('#wizardNext').boundingBox();
    assert.equal(pinned.y,next.y,'BUG-ATTK-01 setup footer remains visible after body scroll');
    await page.locator('#wizardNext').click();
    await page.locator('[data-count="1"]').click();
    await page.locator('#wizardNext').click();
    await page.locator('[data-ruler]:not([disabled])').first().click();
    await page.locator('#wizardNext').click();
    await page.locator('#wizardNext').click();
    await page.locator('#game').waitFor({state:'visible',timeout:30000});
    assert.deepEqual(errors,[]);
    await page.screenshot({path:'dist/screenshots/'+name+'-'+width+'x'+height+'.png'});
    console.log('PASS',name,width+'x'+height,'real WASM boot, pinned setup controls and campaign start');
    await context.close();
   }
   const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
   await page.goto(base+'/index.html');await page.locator('#rotate').waitFor({state:'visible'});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   console.log('PASS',name,'portrait rotation guidance');
   await page.close();
  }finally{await browser.close();}
 }
}finally{child.kill();}
