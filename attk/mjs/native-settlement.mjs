// main.exe 20B8C, abstract defender escape. Distinct from tactical withdrawal.
export function abstractEscape(unit,random,{priorUnclaimedEscape=false,special=false}={}){
 const denominator=5+Math.floor(random()*3),bonus=Math.floor(random()*50);
 const threshold=Math.floor((unit.war+unit.int+unit.training+Math.floor(unit.soldiers/10)+bonus)/denominator)+(priorUnclaimedEscape?50:0)+(special?20:0);
 return Math.floor(random()*100)<threshold;
}
