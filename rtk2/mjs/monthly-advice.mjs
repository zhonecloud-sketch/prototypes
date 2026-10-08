// Saved monthly capability rolls, separate from the gameplay RNG.
export const ADVICE_UNAVAILABLE='I need more info this month to estimate this order.';
export const ADVICE_ORDERS=['general','war','officers','visitors','hire','reassign','train','recruit','search','governor','advisor','dismiss','move','send','cultivate','flood','give','reward:gold','reward:horse','reward:writings','tax','delegate','exile','fort','merch:sell','merch:buy','merch:horse','merch:arms','diplom:alliance','diplom:joint','diplom:marriage','diplom:gift','diplom:cancel','diplom:threat','spy:infiltrate','spy:rival','spy:wolf','spy:betrayal','spy:forged','spy:verify','spy:withdraw','spy','view','healing'];
export function adviceOrder(purpose,data={}){
 if(ADVICE_ORDERS.includes(purpose))return purpose;
 const text=String(purpose).toLowerCase();
 if(/reward|writings/.test(text))return 'reward:'+(/writings/.test(text)?'writings':/horse/.test(text)?'horse':'gold');
 if(/diplom/.test(text))return 'diplom:'+(/joint/.test(text)?'joint':/cancel/.test(text)?'cancel':/threat/.test(text)?'threat':/marriage/.test(text)?'marriage':/gift/.test(text)?'gift':'alliance');
 if(/spy/.test(text)&&text.includes('·'))return 'spy:'+(/rival/.test(text)?'rival':/wolf/.test(text)?'wolf':/forged/.test(text)?'forged':/betrayal/.test(text)?'betrayal':/verify/.test(text)?'verify':/withdraw/.test(text)?'withdraw':'infiltrate');
 if(/merch/.test(text))return 'merch:'+(['sell','buy','horse','arms'].includes(data.mode)?data.mode:'buy');
 const aliases=[['governor','governor'],['advisor','advisor'],['invasion','war'],['cultiv','cultivate'],['develop','cultivate'],['relief','give'],['deleg','delegate'],['transport','send'],['scout','view'],['fort','fort']];
 for(const [match,key]of aliases)if(text.includes(match))return key;
 return ADVICE_ORDERS.find(key=>!key.includes(':')&&text.includes(key))||'general';
}
const month=s=>s.year*12+s.month-1;
function hash(text){let n=2166136261;for(const c of text){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}n^=n>>>16;n=Math.imul(n,0x7feb352d);n^=n>>>15;return (n>>>0)/4294967296;}
export function prepareMonthlyAdvice(s){
 const key=month(s),prior=s.monthlyAdvice;
 if(prior){if(!Number.isInteger(prior.month)||prior.month>key||!Number.isInteger(prior.seed)||prior.seed<0||prior.seed>4294967295||!prior.intelligence||!prior.rolls)throw Error('Invalid monthly advisor decisions.');
  for(const [id,int]of Object.entries(prior.intelligence))if(!s.officers.some(o=>String(o.id)===id)||!Number.isInteger(int)||int<0||int>100)throw Error('Invalid advisor intelligence snapshot.');
  for(const ruler of s.rulers){const rolls=prior.rolls[ruler.id]??(prior.rolls[ruler.id]=Object.fromEntries(ADVICE_ORDERS.map(order=>[order,hash(`${prior.seed}:${prior.month}:${ruler.id}:${order}`)])));if(ADVICE_ORDERS.some(order=>!Number.isFinite(rolls[order])||rolls[order]<0||rolls[order]>=1))throw Error('Invalid monthly order advice.');}
  if(prior.month===key){for(const o of s.officers)prior.intelligence[o.id]??=Math.max(0,Math.min(100,Math.round(o.int||0)));return prior;}
 }
 const seed=prior?.seed??(s.seed>>>0),intelligence=Object.fromEntries(s.officers.map(o=>[o.id,Math.max(0,Math.min(100,Math.round(o.int||0)))])),rolls=Object.fromEntries(s.rulers.map(r=>[r.id,Object.fromEntries(ADVICE_ORDERS.map(order=>[order,hash(`${seed}:${key}:${r.id}:${order}`)]))]));
 s.adviceReports={};return s.monthlyAdvice={month:key,seed,intelligence,rolls};
}
export function canAdvise(s,ruler,advisor,purpose,data={}){
 const ledger=prepareMonthlyAdvice(s),key=adviceOrder(purpose,data);
 return !!advisor&&!advisor.dead&&ledger.rolls[ruler.id][key]*100<(ledger.intelligence[advisor.id]??0);
}
