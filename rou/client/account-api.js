export const API_ORIGIN=['localhost','127.0.0.1'].includes(location.hostname)?location.origin:'https://atelier-roulette-test.zhonecloud.chatgpt.site';
const key='atelier.serverAccess.v1';
let credentials;try{credentials=JSON.parse(sessionStorage.getItem(key)||'{}');}catch{credentials={};}
export const account={player:null,emailMode:'test',connected:!!credentials.accessToken};
const notify=()=>document.dispatchEvent(new CustomEvent('atelier-account',{detail:account}));
export function storePlayer(player){account.player=player;notify();}
function persist(){sessionStorage.setItem(key,JSON.stringify(credentials));account.connected=!!credentials.accessToken;}
export async function accountRequest(action,body,extraHeaders={}) {
  const headers={'X-Atelier-Request':'1',...extraHeaders};
  if(credentials.accessToken)headers['X-Atelier-Access']=credentials.accessToken;
  if(credentials.sessionToken)headers.Authorization='Bearer '+credentials.sessionToken;
  if(body!==undefined)headers['Content-Type']='application/json';
  let response;
  try{response=await fetch(`${API_ORIGIN}/api/account/${action}`,{method:body===undefined?'GET':'POST',headers,body:body===undefined?undefined:JSON.stringify(body),credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(12000)});}
  catch{throw Error('Cannot connect to the account server. Check your connection and try again.');}
  let data;try{data=await response.json();}catch{throw Error('The account server is temporarily unavailable. Please try again.');}
  if(!response.ok){if(response.status===401){account.player=null;if(/Tester access|Reconnect/.test(data.error))credentials={};else delete credentials.sessionToken;persist();notify();}throw Error(data.error||'The server could not complete this request.');}
  if(data.accessToken){credentials={accessToken:data.accessToken,email:data.email};persist();}
  if(data.sessionToken){credentials.sessionToken=data.sessionToken;persist();}
  if('player' in data){account.player=data.player;notify();}
  if(data.emailMode)account.emailMode=data.emailMode;
  if(['logout','logout-all','delete-account','reset-password'].includes(action)){delete credentials.sessionToken;persist();account.player=null;notify();}
  return data;
}
export const testerEmail=()=>credentials.email||'';
export async function restoreAccount(){if(account.connected)try{await accountRequest('session');}catch{}notify();}
export function disconnectTester(){credentials={};persist();account.player=null;notify();}
