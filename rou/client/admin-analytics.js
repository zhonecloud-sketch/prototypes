const DAY=86400000,PAGE_SIZE=50;
const $=id=>document.getElementById(id);
const countries=new Intl.DisplayNames(['en'],{type:'region',fallback:'none'});
const dates=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:'Asia/Kuala_Lumpur'});
const net=new Intl.NumberFormat('en-US',{signDisplay:'exceptZero',maximumFractionDigits:2});
const ticks=new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1});

function countryName(code){return code?countries.of(code)||code:'Unknown';}

function draw(canvas,points){
  const width=canvas.clientWidth,height=canvas.clientHeight;
  if(!width||!height||!points.length)return;
  const ratio=window.devicePixelRatio||1;
  canvas.width=Math.round(width*ratio);
  canvas.height=Math.round(height*ratio);
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  ctx.scale(ratio,ratio);
  ctx.font='11px Arial';
  const values=points.flatMap(p=>[p.actual,p.expected]);
  const min=Math.min(0,...values),max=Math.max(0,...values);
  const range=max-min||1;
  const marks=Array.from({length:5},(_,i)=>max-i*range/4);
  const left=12+Math.max(...marks.map(value=>ctx.measureText(ticks.format(value)).width));
  const top=14,bottom=height-30,right=width-23;
  const x=i=>left+i*(right-left)/(points.length-1);
  const y=value=>top+(max-value)*(bottom-top)/range;
  ctx.fillStyle='#adc0b1';
  ctx.textBaseline='middle';
  ctx.textAlign='right';
  for(const value of marks){
    const line=y(value);
    ctx.fillText(ticks.format(value),left-6,line);
    ctx.strokeStyle='#a3915c55';
    ctx.beginPath();ctx.moveTo(left,line);ctx.lineTo(right,line);ctx.stroke();
  }
  for(const i of [1,Math.floor(points.length/2),points.length-1]){
    ctx.textAlign=i===1?'left':i===points.length-1?'right':'center';
    ctx.fillText(dates.format(points[i].date),x(i),height-12);
  }
  function line(key,color,dash){
    ctx.strokeStyle=color;
    ctx.lineWidth=key==='actual'?3:2;
    ctx.lineJoin='round';
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x(0),y(0));
    points.slice(1).forEach((p,i)=>ctx.lineTo(x(i+1),y(p[key])));
    ctx.stroke();
  }
  line('actual','#9ad8ba',[]);
  line('expected','#d0bb7b',[5,4]);
}

export function mountAnalytics({request,run,esc,money}){
  const canvas=$('analyticsChart');
  let offset=0,playerId=null,points=[];
  new ResizeObserver(()=>draw(canvas,points)).observe(canvas);

  function renderCountries(id,rows,empty){
    $(id).innerHTML=rows.map(({country,count})=>`<tr><th scope="row">${esc(countryName(country))}</th><td>${money(count)}</td></tr>`).join('')||
      `<tr><td colspan="2">${empty}</td></tr>`;
    return rows.reduce((total,row)=>total+row.count,0);
  }

  function renderChart({player,start,periodDays,days}){
    $('analyticsAllPlayers').hidden=!player;
    $('analyticsChartTitle').textContent='Net return · '+(player?.username||'All players');
    const plays=days.reduce((total,day)=>total+day.count,0);
    $('analyticsPeriod').textContent=`${dates.formatRange(start,start+(periodDays-1)*DAY)} · GMT+8 · ${money(plays)} wagered ${plays===1?'round':'rounds'}`;
    $('analyticsChartContent').hidden=!days.length;
    $('analyticsChartEmpty').hidden=!!days.length;
    const byDay=new Map(days.map(row=>[row.day,row]));
    let actual=0,stake=0;
    points=[{actual:0,expected:0}];
    for(let i=0;i<periodDays;i++){
      const day=byDay.get(i);
      actual+=day?.net||0;
      stake+=day?.stake||0;
      points.push({actual,expected:-stake/37,date:start+i*DAY,count:day?.count||0});
    }
    $('analyticsActual').textContent=net.format(actual);
    $('analyticsExpected').textContent=net.format(-stake/37);
    $('analyticsDays').innerHTML=points.slice(1).map(p=>`<tr><th scope="row">${dates.format(p.date)}</th><td>${money(p.count)}</td><td>${net.format(p.actual)}</td><td>${net.format(p.expected)}</td></tr>`).join('');
  }

  async function load(nextOffset=offset,nextPlayerId=playerId){
    const report=await request('analytics',{offset:nextOffset,playerId:nextPlayerId});
    offset=nextOffset;
    playerId=nextPlayerId;
    const {totals,players}=report;
    $('analyticsAccounts').textContent=money(renderCountries('analyticsRegisteredCountries',report.registered,'No registered accounts.'));
    $('analyticsGuests').textContent=money(renderCountries('analyticsGuestCountries',report.guests,'No signed-out sessions recorded yet.'));
    $('analyticsPlays').textContent=money(totals.multiplayer+totals.solo);
    $('analyticsPlayModes').textContent=`${money(totals.multiplayer)} multiplayer · ${money(totals.solo)} solo`;
    $('analyticsPlayers').innerHTML=players.map(p=>`<tr><th scope="row">${esc(p.username)}</th><td>${esc(countryName(p.country))}</td><td>${money(p.multiplayer)}</td><td>${money(p.solo)}</td><td>${money(p.multiplayer+p.solo)}</td><td><button data-analytics-player="${esc(p.id)}" aria-label="View net return for ${esc(p.username)}">View chart</button></td></tr>`).join('')||
      '<tr><td colspan="6">No players on this page.</td></tr>';
    $('analyticsPrevious').hidden=!offset;
    $('analyticsNext').hidden=!report.hasMore;
    renderChart(report);
    $('analyticsReport').hidden=false;
    draw(canvas,points);
  }

  function focusChart(){
    const title=$('analyticsChartTitle');
    title.focus({preventScroll:true});
    title.scrollIntoView({block:'center'});
  }
  $('refreshAnalytics').onclick=()=>run(()=>load());
  $('analyticsPrevious').onclick=()=>run(()=>load(Math.max(0,offset-PAGE_SIZE)));
  $('analyticsNext').onclick=()=>run(()=>load(offset+PAGE_SIZE));
  $('analyticsAllPlayers').onclick=()=>run(async()=>{await load(offset,null);focusChart();});
  $('analyticsPlayers').onclick=e=>{
    const button=e.target.closest('[data-analytics-player]');
    if(button)run(async()=>{await load(offset,button.dataset.analyticsPlayer);focusChart();});
  };

  function reset(){
    offset=0;
    playerId=null;
    points=[];
    canvas.width=0;
    for(const id of ['analyticsRegisteredCountries','analyticsGuestCountries','analyticsPlayers','analyticsDays','analyticsAccounts','analyticsGuests','analyticsPlays','analyticsPlayModes','analyticsChartTitle','analyticsActual','analyticsExpected'])$(id).textContent='';
    $('analyticsReport').hidden=true;
  }
  return {load,reset};
}
