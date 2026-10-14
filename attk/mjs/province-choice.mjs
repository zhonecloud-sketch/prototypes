export function provinceRuler(g,p){return p.owner===255?'Unclaimed':g.s.rulers.find(r=>r.id===p.owner)?.name||'Independent';}
export function provinceLabel(g,p,alphabetical=false){return `${alphabetical?p.name+' · #'+p.id:'#'+p.id+' · '+p.name} · ${provinceRuler(g,p)}`;}
export function provinceChoice(g,p){return [p.id,provinceLabel(g,p),{province:p.id}];}
