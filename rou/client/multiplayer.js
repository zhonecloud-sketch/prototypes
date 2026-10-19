import { account,accountRequest } from './account-api.js';
export function openMultiplayer(destination = 'account') {
  document.dispatchEvent(new CustomEvent('atelier-open-account',{detail:destination}));
}
export function createMultiplayer(api){
  let active=false,busy=false,timer=null,lastSeen=0;
  const accept=data=>{lastSeen=Date.now();api.received(data.room,data.player);};
  async function poll(){if(!active||busy)return;busy=true;try{accept(await accountRequest('room-poll',{}));}catch(e){api.error(e.message);if(/seat expired|log in|invitation/i.test(e.message)){active=false;clearInterval(timer);api.disconnected();}}finally{busy=false;}}
  return {get active(){return active;},get busy(){return busy;},get fresh(){return Date.now()-lastSeen<6500;},
    async join(){if(!account.player){openMultiplayer('login');return false;}const data=await accountRequest('room-join',{});active=true;accept(data);clearInterval(timer);timer=setInterval(poll,2000);return true;},
    async leave(){if(active)await accountRequest('room-leave',{});active=false;clearInterval(timer);},
    async bet(operation,entries,roundId){if(!active||busy||Date.now()-lastSeen>6500)throw Error('Wait for the room connection to recover.');busy=true;try{accept(await accountRequest('room-bet',{operation,entries,roundId,requestId:crypto.randomUUID()}));}catch(e){lastSeen=0;throw e;}finally{busy=false;if(!lastSeen)void poll();}},
    poll,
  };
}
