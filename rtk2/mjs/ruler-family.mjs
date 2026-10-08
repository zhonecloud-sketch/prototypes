// The supplied DOS game stores one daughter-availability flag, not ages or a birth schedule.
export const daughterStatus=r=>({count:r.hasDaughter===false?0:1,eligible:r.hasDaughter!==false&&r.daughterGivenTo===undefined,marriedTo:r.daughterGivenTo??null});
export function retireRulerFamily(s,r){
 for(const other of s.rulers){
  if(other.daughterGivenTo===r.id){delete other.daughterGivenTo;other.hasDaughter=false;}
  if(other.daughtersReceived)other.daughtersReceived=other.daughtersReceived.filter(id=>id!==r.id);
  delete other.marriedTo;
 }
 delete r.daughterGivenTo;r.daughtersReceived=[];r.hasDaughter=false;
}
