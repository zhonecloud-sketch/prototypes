export const API_ORIGIN=['localhost','127.0.0.1'].includes(location.hostname)?location.origin:'https://atelier-roulette-test.zhonecloud.chatgpt.site';
const key='atelier.serverAccess.v1';
let credentials;try{credentials=JSON.parse(sessionStorage.getItem(key)||'{}');}catch{credentials={};}
credentials.clientId ||= crypto.randomUUID();
delete credentials.accessToken;
sessionStorage.setItem(key,JSON.stringify(credentials));
export const account={player:null,verificationMode:'screen'};
let authRevision=0;
const notify=()=>document.dispatchEvent(new CustomEvent('atelier-account',{detail:account}));
export function storePlayer(player){account.player=player;notify();}
function persist(){sessionStorage.setItem(key,JSON.stringify(credentials));}
function clearSession(){account.player=null;delete credentials.sessionToken;persist();notify();}
export async function accountRequest(action,body,extraHeaders={},options={}) {
  if(['login','verify','logout','logout-all','delete-account','reset-password'].includes(action))authRevision++;
  // A new sign-in must not fall back to an earlier player's identity or token.
  if(action==='login'||action==='verify')clearSession();
  const revision=authRevision;
  const headers={'X-Atelier-Request':'1','X-Atelier-Client':credentials.clientId,...extraHeaders};
  if(credentials.sessionToken)headers.Authorization='Bearer '+credentials.sessionToken;
  if(body!==undefined)headers['Content-Type']='application/json';
  let response;
  const timeout=AbortSignal.timeout(12000),signal=options.signal?AbortSignal.any([timeout,options.signal]):timeout;
  try{response=await fetch(`${API_ORIGIN}/api/account/${action}`,{method:body===undefined?'GET':'POST',headers,body:body===undefined?undefined:JSON.stringify(body),credentials:'omit',cache:'no-store',signal});}
  catch(e){if(options.signal?.aborted)throw e;throw Error('Cannot connect to the account server. Check your connection and try again.');}
  let data;try{data=await response.json();}catch{throw Error('The account server is temporarily unavailable. Please try again.');}
  // A poll cancelled by a wager must never publish an older wallet afterwards.
  if(options.signal?.aborted)throw new DOMException('Request cancelled','AbortError');
  // Responses started before an account change cannot restore or erase it.
  if(revision!==authRevision)throw new DOMException('Account changed','AbortError');
  if(!response.ok){if(response.status===401&&(credentials.sessionToken||account.player||action==='login'||action==='verify')){authRevision++;clearSession();}throw Error(data.error||'The server could not complete this request.');}
  if(data.sessionToken){authRevision++;credentials.sessionToken=data.sessionToken;persist();}
  if('player' in data){account.player=data.player;if(data.player&&credentials.email!==data.player.email){credentials.email=data.player.email;persist();}notify();}
  if(data.verificationMode)account.verificationMode=data.verificationMode;
  if(['logout','logout-all','delete-account','reset-password'].includes(action)){authRevision++;clearSession();}
  return data;
}
export const accountEmail=()=>credentials.email||'';
export async function restoreAccount(){try{await accountRequest('session');}catch{}notify();}
