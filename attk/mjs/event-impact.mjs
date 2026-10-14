// Per-event deltas, rather than guessed percentages in event prose.
export const IMPACT_KEYS=['people','soldiers','gold','food','land','flood'];
export const zeroImpact=()=>Object.fromEntries(IMPACT_KEYS.map(k=>[k,0]));
export function provinceSnapshot(g,p){return {people:p.population,soldiers:p.officers.reduce((n,id)=>n+g.officer(id).soldiers,0),gold:p.gold,food:p.food,land:p.land,flood:p.flood};}
export function provinceImpact(g,p,before){const after=provinceSnapshot(g,p);return Object.fromEntries(IMPACT_KEYS.map(k=>[k,after[k]-before[k]]));}
export function impactText(impact){return 'Impact: '+IMPACT_KEYS.map(k=>{const value=impact[k],label=k==='flood'?'flood control':k;return `${label} ${Math.abs(value).toLocaleString('en-US')}${value<0?' lost':value>0?' gained':' unchanged'}`;}).join('; ')+'.';}
export function withImpact(text,impact){return text+(text.includes('Impact:')?'':' '+impactText(impact));}
export function cleanEventLanguage(text=''){return text.replace(/^#\d+\s*·\s*/,'').replace(/(?:蝗蟲|房子泡湯了|天眼\s*\/\s*風颱|瘟疫|COVID-189|揭竿而起|看！有流星！快許願！|驅虎吞狼|大家的最愛\s*\/\s*連環計|華佗の医学書\s*\(青囊書\)|佔地為王|出兵戰爭)\s*·\s*/g,'').replace(/名聞天下的[^·]*領便當去了\s*·\s*/g,'');}
