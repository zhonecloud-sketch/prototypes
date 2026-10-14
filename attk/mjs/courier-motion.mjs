// One movement clock for the rendered rider and its looping sound.
export function courierMotion(game,time){
 const journey=game?.s?.journey,motion=game?.journeyMotion,leg=journey?.legs[journey.leg];
 const valid=!!motion&&!!leg&&!journey.interception&&!journey.proposal&&motion.to===leg.route[leg.index];
 const elapsed=valid?time-motion.start:650;
 return {moving:valid&&elapsed>=0&&elapsed<650,progress:valid?Math.max(0,Math.min(1,elapsed/650)):1,from:motion?.from,to:motion?.to};
}
