// Field armies eat once after both sides complete their daily orders.
export const battleDailyFood=men=>Math.ceil(Math.max(0,men)/20);
export function warProvisions(men,food=0){
 const daily=battleDailyFood(men),monthly=daily*30;
 return {men,daily,monthly,days:daily?Math.floor(Math.max(0,food)/daily):0};
}
