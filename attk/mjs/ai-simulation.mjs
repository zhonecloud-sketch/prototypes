// Fork without constructor upkeep. Simulations never own the live state or RNG.
export function forkAI(g,seed){const copy=Object.assign(Object.create(Object.getPrototypeOf(g)),g,{s:structuredClone(g.s),aiComparison:null});delete copy.random;delete copy.int;if(seed!==undefined)copy.s.seed=seed>>>0;return copy;}
export function observationSeed(value){let n=2166136261;for(const c of JSON.stringify(value))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
export const weighted=(features,weights)=>Object.entries(weights).reduce((n,[k,w])=>n+(features[k]||0)*w,0);
export function applyAIOrder(g,order){if(order.domain==='battlefield')return g.battleAction(order.action,order.args);if(order.action==='attack')return g.invade(order.args);return g.execute(order.action,order.args);}
export function describeAIOrder(g,o){if(!o)return 'Legacy handles this phase.';const id=o.args.unit??o.args.officer,actor=id===undefined?'Army':g.officer(id).name;return actor+' · '+o.action+(o.args.province?' · Province '+o.args.province:'')+(Number.isInteger(o.args.q)?' · hex '+(o.args.q+1)+','+(o.args.r+1):'')+(o.args.target!==undefined?' · target '+o.args.target:'');}
