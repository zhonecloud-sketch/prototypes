import {makeRecord} from './insights-model.js?v=20261023-insights-gaps';

// Reconstruct a round's entire payoff; multiple chips are not extra samples.
export function serverRecords(records,owner,epoch){
  return records.map(r=>{
    const sourceId=r.sourceId||'legacy',roomId=r.roomId||1;
    const record=makeRecord({owner,epoch,sourceId,drawKey:r.drawKey||`legacy:${r.roundId}`,
      round:{id:`${roomId}:${r.roundId}`,start:r.roundId*30000,outcome:r.number},
      bets:r.bets.map(b=>({...b,label:b.id}))});
    if(!record||record.stake!==r.stake||record.returned!==r.returned||record.net!==r.net)throw Error('The wager does not match its server settlement. Refresh or contact the developer.');
    return {...record,roundId:r.roundId,roomId,settledAt:r.settledAt};
  });
}
