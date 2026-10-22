import {FEED_ANCHOR,INTERVAL,WEEK} from './recorded-feed.js';
export function loadRecordedArchive(url,hash){
  return new Promise((resolve,reject)=>{
    const worker=new Worker(new URL('./recorded-feed-worker.js',import.meta.url),{type:'module'}),timer=setTimeout(()=>{worker.terminate();reject(Error('The recorded archive timed out.'));},20000);
    const finish=()=>{clearTimeout(timer);worker.terminate();};
    worker.onmessage=({data})=>{finish();if(data.error){reject(Error(data.error));return;}resolve({seed:'-1',numbers:data.numbers,count:data.numbers.length,interval:30,startRecord:1,total:data.numbers.length,requested:data.numbers.length,cyclic:true,duration:data.numbers.length*INTERVAL,repeatPeriod:Math.ceil(data.numbers.length/20160)*WEEK,autoWeekly:true,archiveHash:data.hash,anchor:FEED_ANCHOR});};
    worker.onerror=()=>{finish();reject(Error('The recorded archive could not be loaded.'));};worker.postMessage({id:1,url,hash});
  });
}
