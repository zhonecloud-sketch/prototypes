import fs from 'node:fs';import assert from 'node:assert/strict';
import {Game,createCampaign,validateSave} from '../mjs/strategy.mjs';
import {pendingBattleResult,reviewBattleResult,battleResultCopy,triumphBattleResult} from '../mjs/battle-summary.mjs';
import {ownershipPalette,ownershipColor} from '../mjs/raster-world.mjs';
const scenarios=JSON.parse(fs.readFileSync(new URL('../config/scenarios.json',import.meta.url))),terrains=JSON.parse(fs.readFileSync(new URL('../config/province-terrain.json',import.meta.url)));
const native=JSON.parse(fs.readFileSync(new URL('../docs/native-display-v47.json',import.meta.url)));
assert.deepEqual(ownershipPalette,native.colors.map(row=>row.solidColor));assert.equal(new Set(ownershipPalette).size,16);assert.equal(ownershipColor(255),'#a0aaa4');assert.equal(ownershipColor(16),'#a0aaa4');console.log('PASS all 16 ownership fills match the native ruler table, without modulo colour collisions');
for(const human of [[],[0]])for(const view of ['personal','all'])for(const winner of ['attack','defend']){
 const s=createCampaign(scenarios[0],human);s.seed=1;const g=new Game(s,{},structuredClone(terrains));g.s.settings.battleView='all';g.invade({province:9,target:8,governor:33,officers:[0,34],food:20000});const b=g.s.battle;g.s.settings.battleView=view;g.random=()=>0;b.outcome={winner,reason:'Controlled display regression'};g.resolveBattle();
 const row=pendingBattleResult(g);assert(row);const before=JSON.stringify(g.s),copy=battleResultCopy(g,row);assert.equal(JSON.stringify(g.s),before);assert(copy.outcome.includes(row.attacker.name)&&copy.outcome.includes(row.defender.name));assert(copy.commander.includes(row.commanders[winner==='attack'?'defend':'attack'].name));assert.equal(copy.title,winner==='attack'?'Attack victorious':'Attack defeated');if(g.s.triumph)assert.equal(triumphBattleResult(g),row);
 reviewBattleResult(g,row);assert.equal(pendingBattleResult(g),null);assert.deepEqual(validateSave(g.s,scenarios,terrains).battleResultReviews,g.s.battleResultReviews);
 if(g.s.triumph)g.acknowledgeTriumph();
 console.log(`PASS ${human.length?'human':'spectator'} / ${view} / ${winner} result reports both rulers, province and losing commander; review survives save/load`);
}
const s=createCampaign(scenarios[0],[0]),g=new Game(s,{},structuredClone(terrains));
const row={war:1,source:9,target:8,status:'won',finishedDay:3,reason:'Test',attacker:{name:'Cao Cao',zh:'曹操'},defender:{name:'Dong Zhuo',zh:'董卓'},commanders:{defend:{name:'Li Jue',zh:'李傕'}},commanderResult:'pending'};g.s.warChronicle=[row];
for(const [fate,word]of [['pending','captured'],['free','released'],['behead','executed'],['recruit','recruited'],['killed','killed'],['returned','not captured'],['absent','no further fate']]){row.commanderResult=fate;assert.equal(pendingBattleResult(g),row);assert(battleResultCopy(g,row).commander.includes(word));reviewBattleResult(g,row);assert.equal(pendingBattleResult(g),null);}
g.s.settings.names='chinese';assert(battleResultCopy(g,row).outcome.includes('曹操'));assert(battleResultCopy(g,row).commander.includes('李傕'));console.log('PASS captured, released, executed, recruited, killed, returned and unknown commander fates, including Chinese names and follow-up reviews');
