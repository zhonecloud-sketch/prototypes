import {parseArchive,weeklyHtml} from './recorded-feed.js';
let archive;
self.onmessage=async({data})=>{
  try{
    archive??=(async()=>{const r=await fetch(data.url,{credentials:'omit'});if(!r.ok)throw Error('The recorded RNG archive is unavailable.');const numbers=parseArchive(await r.text()),bytes=await crypto.subtle.digest('SHA-256',numbers),hash=Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');return {numbers,hash};})();
    const {numbers,hash}=await archive;
    if(data.hash&&hash!==data.hash)throw Error('The recorded RNG archive checksum does not match this feed.');
    if(data.kind==='html')self.postMessage({id:data.id,html:weeklyHtml(numbers,hash,data.time)});
    else{const copy=numbers.slice();self.postMessage({id:data.id,numbers:copy,hash},[copy.buffer]);}
  }catch(e){archive=null;self.postMessage({id:data.id,error:e.message});}
};
