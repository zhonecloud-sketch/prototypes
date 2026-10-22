import {position,WEEK} from './recorded-feed.js';
const worker=new Worker(new URL('./recorded-feed-worker.js',import.meta.url),{type:'module'});
let id=0;
worker.onmessage=({data})=>{
  if(data.error){document.title='Recorded feed unavailable';console.error(data.error);return;}
  const doc=new DOMParser().parseFromString(data.html,'text/html'),next=doc.querySelector('#spins'),current=document.querySelector('#spins');
  current.replaceWith(document.importNode(next,true));
  document.querySelector('#feedSummary').textContent=doc.querySelector('#feedSummary').textContent;
  document.title='Weekly recorded roulette feed · '+new Date(Number(next.dataset.weekStart)).toLocaleDateString();
};
function update(){worker.postMessage({id:++id,kind:'html',time:Date.now(),url:new URL('../assets/2m-rng.txt',import.meta.url).href});const p=position(Date.now(),2000000);setTimeout(update,Math.max(50,p.weekStart+WEEK-Date.now()+50));}
update();
