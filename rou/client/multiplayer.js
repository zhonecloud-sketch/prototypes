import { account,accountRequest } from './account-api.js?v=20261022-perf';
export function openMultiplayer(destination = 'account') {
  document.dispatchEvent(new CustomEvent('atelier-open-account',{detail:destination}));
}
export function createMultiplayer(api){
  let active=false,busy=false,timer=null,lastSeen=0,polling=null,pollController=null;
  const accept=data=>{lastSeen=Date.now();api.received(data.room,data.player);};
  function cancelPoll(){pollController?.abort();pollController=null;polling=null;}
  function poll(){
    if(!active||busy)return Promise.resolve();if(polling)return polling;
    const controller=new AbortController();pollController=controller;
    polling=(async()=>{try{const data=await accountRequest('room-poll',{},{},{signal:controller.signal});if(active&&!controller.signal.aborted)accept(data);}catch(e){if(controller.signal.aborted)return;api.error(e.message);if(/seat expired|log in|invitation/i.test(e.message)){active=false;clearInterval(timer);api.disconnected();}}finally{if(pollController===controller){pollController=null;polling=null;}}})();
    return polling;
  }
  return {get active(){return active;},get busy(){return busy;},get fresh(){return Date.now()-lastSeen<6500;},
    async join(){if(!account.player){openMultiplayer('login');return false;}const data=await accountRequest('room-join',{});active=true;accept(data);clearInterval(timer);timer=setInterval(poll,1900+Math.floor(Math.random()*200));return true;},
    async leave(){cancelPoll();if(active)await accountRequest('room-leave',{});active=false;clearInterval(timer);},
    async bet(operation,entries,roundId,roomId){if(!active||busy||Date.now()-lastSeen>6500)throw Error('Wait for the room connection to recover.');busy=true;cancelPoll();try{accept(await accountRequest('room-bet',{operation,entries,roundId,roomId,requestId:crypto.randomUUID()}));}catch(e){lastSeen=0;throw e;}finally{busy=false;api.updated?.();if(!lastSeen)void poll();}},
    poll,
  };
}
