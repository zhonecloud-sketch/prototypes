import {AI_RULES_ID} from './ai-rules-id.mjs?v=54';
export {AI_RULES_ID};
export const AI_POLICY_VERSION=1;
export const AI_WEIGHTS={
 governance:{territory:4,officers:2,army:1.5,land:1,flood:.6,loyalty:.8,gold:1,food:2,safety:3},
 battlefield:{men:3,enemyLoss:3,palace:5,progress:2,cover:1,fire:4,mobility:.5,orders:1,commander:3}
};
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
export function validateAIProfile(p,compatible=true){
 if(!object(p)||p.schema!==1||p.policyVersion!==AI_POLICY_VERSION||!Object.hasOwn(AI_WEIGHTS,p.domain))throw Error('Unsupported AI profile format or policy version.');
 if(typeof p.name!=='string'||!p.name.trim()||p.name.length>80||typeof p.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)||typeof p.rulesId!=='string'||!/^[a-f0-9]{64}$/.test(p.rulesId))throw Error('Invalid AI profile identity.');
 const keys=Object.keys(AI_WEIGHTS[p.domain]);if(!object(p.weights)||Object.keys(p.weights).length!==keys.length||keys.some(k=>!Number.isFinite(p.weights[k])||p.weights[k]<.05||p.weights[k]>12))throw Error('AI weights must match the domain and be between 0.05 and 12.');
 if(compatible&&p.rulesId!==AI_RULES_ID)throw Error('This profile was trained for different game rules. Retrain it before importing.');
 // Only numerical priorities are executable. Training metadata is kept as JSON.
 if(p.training!==undefined&&(!object(p.training)||JSON.stringify(p.training).length>24000))throw Error('Invalid training metadata.');
 return structuredClone(p);
}
export function validateAIExtensions(s){
 const e=s.aiExtensions;if(e===undefined)return;if(!object(e)||e.schema!==1||!object(e.profiles)||!object(e.defaults)||!object(e.rulers)||typeof e.shadow!=='boolean')throw Error('Invalid AI extension settings.');
 if(Object.keys(e.profiles).some(k=>!Object.hasOwn(AI_WEIGHTS,k)))throw Error('Unknown AI profile domain.');for(const [domain,p]of Object.entries(e.profiles)){validateAIProfile(p,false);if(p.domain!==domain)throw Error('AI profile domain mismatch.');}
 for(const [id,modes]of [['global',e.defaults],...Object.entries(e.rulers)]){if(id!=='global'&&!s.rulers.some(r=>String(r.id)===id))throw Error('Unknown AI extension ruler.');if(!object(modes)||Object.keys(modes).some(k=>!Object.hasOwn(AI_WEIGHTS,k)))throw Error('Invalid AI extension domain.');for(const [domain,mode]of Object.entries(modes)){if(!['legacy','trained'].includes(mode))throw Error('Unknown AI policy.');if(mode==='trained'&&(!e.profiles[domain]||e.profiles[domain].rulesId!==AI_RULES_ID))modes[domain]='legacy';}}
}
export function aiMode(g,domain,id=g.s.battle&&domain==='battlefield'?g.battleOwner():g.s.player){const e=g.s.aiExtensions,p=e?.profiles[domain];return p?.rulesId===AI_RULES_ID?(e.rulers[id]?.[domain]??e.defaults[domain]??'legacy'):'legacy';}
export function extensionSettings(g){return g.s.aiExtensions??={schema:1,profiles:{},defaults:{governance:'legacy',battlefield:'legacy'},rulers:{},shadow:false};}
export function importAIProfiles(g,input){const list=input?.schema===1&&Array.isArray(input.profiles)?input.profiles:[input];if(!list.length||list.length>2)throw Error('Import one or two AI profiles.');const profiles=list.map(p=>validateAIProfile(p));if(new Set(profiles.map(p=>p.domain)).size!==profiles.length)throw Error('Only one profile per domain can be imported at a time.');const e=extensionSettings(g);for(const p of profiles)e.profiles[p.domain]=p;return profiles;}
export function setAIMode(g,domain,mode,id='global'){if(!Object.hasOwn(AI_WEIGHTS,domain)||!['legacy','trained','inherit'].includes(mode))throw Error('Choose a supported AI policy.');if(id!=='global'&&!g.s.rulers.some(r=>String(r.id)===String(id)))throw Error('Choose an existing ruler.');const e=extensionSettings(g);if(mode==='trained')validateAIProfile(e.profiles[domain]);const target=id==='global'?e.defaults:(e.rulers[id]??={});if(mode==='inherit'&&id!=='global')delete target[domain];else target[domain]=mode==='inherit'?'legacy':mode;}
