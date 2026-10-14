import assert from 'node:assert/strict';
import {combatAnimations,ambushAnimations,battleStatusMessages,combatAnimationCycles,combatAnimationDuration,combatAnimationPhase} from '../mjs/battle-presentation.mjs';
const names={0:'Cao Cao',34:'Cao Hong',66:'Zhang Yang'},rows=[{unit:0,side:'attack',loss:23},{unit:34,side:'attack',loss:71},{unit:66,side:'defend',loss:127}];
const battle={phase:'battle',side:'attack',selected:0,units:[],lastAction:{type:'simultaneous',unit:0,messageSerial:1,lossRows:rows},messages:[{serial:1,text:'Cao Cao initiated a simultaneous attack: 127 enemy losses, 94 own losses. Each unit: Cao Cao lost 23 men; Cao Hong lost 71 men; Zhang Yang lost 127 men.'}]};
const messages=battleStatusMessages(battle,0,id=>names[id],false);
assert.deepEqual(messages.slice(-3).map(m=>m.text),['Cao Cao: 23 men lost (attacker).','Cao Hong: 71 men lost (attacker).','Zhang Yang: 127 men lost (defender).']);
assert(!messages[1].text.includes('Each unit'));console.log('PASS simultaneous status shows one readable loss message per friendly and hostile participant');
const ambush={unit:66,target:0,combatUnits:[{id:66,q:6,r:4,side:'defend',soldiers:2000},{id:0,q:6,r:5,side:'attack',soldiers:4000}]};
battle.messages=[{serial:4,text:'Localised ambush text',ambush},{serial:5,text:'Localised second ambush text',ambush:{...ambush,unit:34}}];
const before=JSON.stringify(battle),animations=ambushAnimations(battle,{messageSerial:4},id=>names[id]);assert.equal(animations.length,2);assert.equal(animations[0].target,0);assert.equal(animations[0].combatUnits.length,2);assert.equal(JSON.stringify(battle),before);assert.equal(combatAnimationCycles(animations[0]),8);assert.equal(combatAnimationDuration(animations[0]),3000);console.log('PASS structured ambush animations preserve both participants independently of text or living roster');
for(const exchanges of [1,3,10]){const action={type:'charge',exchanges};assert.equal(combatAnimationCycles(action),8*exchanges);assert.equal(combatAnimationDuration(action),600*exchanges+1300);assert.equal(combatAnimationPhase(action,650+600*exchanges).phase,'return');}console.log('PASS charge repeats eight native flashes for each actual resolved exchange, with finite march and return');

const joint={type:'simultaneous',unit:0,target:66,exchanges:2,combatUnits:[{id:0},{id:34},{id:66}]};
const pairs=combatAnimations(joint);assert.deepEqual(pairs.map(a=>a.combatUnits.map(u=>u.id)),[[0,66],[34,66]]);assert.equal(pairs.reduce((n,a)=>n+combatAnimationCycles(a),0),16);assert.equal(combatAnimations({...joint,exchanges:1}).length,1);console.log('PASS simultaneous flashes sequential attacker-target pairs only for actual exchanges');
