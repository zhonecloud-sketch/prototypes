// Field armies eat once after both sides complete their daily orders.
export const battleDailyFood=men=>men>0?Math.max(1,Math.floor(men/30)):0;
export function warProvisions(men,food=0){
 const daily=battleDailyFood(men),monthly=daily*30;
 return {men,daily,monthly,days:daily?Math.floor(Math.max(0,food)/daily):0};
}

// Defending reserves still eat from the besieged province, as in the DOS caller.
export function battleRationMen(game,battle,side){
 const field=battle.units.filter(u=>u.side===side&&u.soldiers>0&&!u.routed&&!u.fled&&!u.captured).reduce((n,u)=>n+u.soldiers,0);
 return field+(side==='defend'?game.province(battle.target).officers.filter(id=>!battle.units.some(u=>u.id===id)).reduce((n,id)=>n+game.officer(id).soldiers,0):0);
}
// Policy: sufficient for a full month plus a reserve, never strength-weighted.
export function invasionFoodPlan(men,available,{minimumCarriedFood=6000,warProvisionDays=75}={}){
 const daily=battleDailyFood(men),minimum=daily*30+1;
 return men>0&&available>=minimum?Math.min(available,Math.max(minimum,minimumCarriedFood,daily*warProvisionDays+1)):null;
}
