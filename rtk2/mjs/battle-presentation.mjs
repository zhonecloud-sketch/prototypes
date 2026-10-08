export const activeBattleUnit=(battle,unit)=>battle?.phase==='battle'&&!battle.outcome&&!battle.suspended&&battle.selected===unit.id&&unit.side===battle.side&&unit.placed&&!unit.ordered&&!unit.fled&&!unit.routed&&unit.soldiers>0;
export function battleOrderUnavailable(battle,unit,order){
 if(order==='view')return null;
 if(!unit)return 'Choose one of your units first.';
 if(unit.ordered)return 'This unit has already received its order today.';
 if(order==='fireball'&&battle.weather==='rain')return 'Fire attacks are impossible in rain.';
 return null;
}
