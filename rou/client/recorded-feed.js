// One shared calendar for real.html, solo playback and the Rust room service.
export const FEED_ANCHOR=Date.parse('2026-10-17T16:00:00Z'); // Sunday GMT+8.
export const INTERVAL=30000,WEEK=604800000,PER_WEEK=WEEK/INTERVAL;
const mod=(n,m)=>((n%m)+m)%m;
export function position(time,count){
  const slot=Math.floor((time-FEED_ANCHOR)/INTERVAL),week=Math.floor(slot/PER_WEEK);
  return {slot,week,index:mod(slot,count),cycle:Math.floor(slot/count),weekStart:FEED_ANCHOR+week*WEEK,startRecord:mod(week*PER_WEEK,count)+1};
}
export function parseArchive(text,expected=2000000){
  const numbers=new Uint8Array(expected);let count=0,value=-1;
  for(let i=0;i<=text.length;i++){
    const c=i===text.length?10:text.charCodeAt(i);
    if(c>=48&&c<=57){value=(value<0?0:value)*10+c-48;if(value>36)throw Error('RNG results must be between 0 and 36.');}
    else if(c===10||c===13||c===32||c===9){if(value>=0){if(count===expected)throw Error('The RNG archive has extra results.');numbers[count++]=value;value=-1;}}
    else throw Error('The RNG archive contains an invalid character.');
  }
  if(count!==expected)throw Error(`Expected ${expected} RNG results, found ${count}.`);
  return numbers;
}
export function weeklyHtml(numbers,hash,time=Date.now()){
  const p=position(time,numbers.length),rows=[];
  for(let i=0;i<PER_WEEK;i++){const seconds=i*30,d=Math.floor(seconds/86400),h=Math.floor(seconds%86400/3600),m=Math.floor(seconds%3600/60),s=seconds%60;rows.push(String(d).padStart(3,'0')+':'+[h,m,s].map(n=>String(n).padStart(2,'0')).join(':')+'\t'+numbers[mod(p.week*PER_WEEK+i,numbers.length)]);}
  const repeats=Math.floor((p.week*PER_WEEK+PER_WEEK-1)/numbers.length)>0;
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>Weekly recorded roulette feed</title></head>\n<body><p id="feedSummary">Recorded archive · week ${p.week+1} · ${repeats?'REPEATED DATA included in this week':'first pass'} · Sunday 00:00 GMT+8</p><pre id="seed">seed: -1</pre>\n<pre id="spins" data-interval-seconds="30" data-start-record="${p.startRecord}" data-total-records="${numbers.length}" data-output-records="${PER_WEEK}" data-requested-records="${PER_WEEK}" data-time-format="ddd:hh:mm:ss" data-cyclic="true" data-auto-weekly="true" data-week-start="${p.weekStart}" data-archive-sha="${hash}">${rows.join('\n')}</pre>\n<script type="module" src="./client/weekly-feed-page.js"></script></body></html>\n`;
}
