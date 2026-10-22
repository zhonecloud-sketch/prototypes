// Injected by the disposable local preview only, never by the published game.
const probe=document.createElement('button');probe.id='performanceProbe';
probe.style.cssText='position:fixed;bottom:0;right:0;z-index:9999;max-width:70vw;font:11px monospace;padding:5px;background:#eee;color:#111;white-space:pre-wrap';
probe.textContent='Measure next 5 seconds';document.body.append(probe);
let measurement=null;
const originalTick=tick,originalUpdate=RouletteWheel.prototype.update;
tick=function(...args){if(measurement)measurement.ticks++;return originalTick(...args);};
RouletteWheel.prototype.update=function(...args){const start=performance.now();try{return originalUpdate.apply(this,args);}finally{if(measurement){measurement.renders++;measurement.renderMs+=performance.now()-start;measurement.drawCalls=this.renderer.info.render.calls;measurement.pixels=this.canvas.width*this.canvas.height;measurement.paths=this.bank?.paths.size;measurement.preparation=this.bank?.stats;measurement.ready=!!this.trajectory?.points;measurement.ballY=this.ball.position.y;const prior=measurement.lastFrame;if(prior)measurement.maxGap=Math.max(measurement.maxGap||0,args[0]-prior);measurement.lastFrame=args[0];}}};
const probeObserver=new MutationObserver(entries=>{if(measurement)measurement.mutations+=entries.filter(e=>e.target!==probe&&e.target.parentElement!==probe).length;});
probeObserver.observe(document.getElementById('landscapeSurface'),{subtree:true,childList:true,attributes:true,characterData:true});
const longObserver=new PerformanceObserver(list=>{if(measurement)measurement.longTasks+=list.getEntries().length;});
longObserver.observe({type:'longtask',buffered:false});
function measure(duration=5000){measurement={ticks:0,renders:0,renderMs:0,drawCalls:0,pixels:0,mutations:0,longTasks:0};probe.textContent='Measuring…';setTimeout(()=>{const m=measurement;measurement=null;m.renderMs=Math.round(m.renderMs);probe.textContent=JSON.stringify(m);},duration);}
probe.onclick=()=>{if(!measurement)measure();};
const spinProbe=probe.cloneNode();spinProbe.id='spinProbe';spinProbe.style.bottom='38px';spinProbe.textContent='Measure next spin';document.body.append(spinProbe);
spinProbe.onclick=()=>{if(measurement)return;spinProbe.disabled=true;spinProbe.textContent='Waiting for next spin…';const elapsed=now()%30000,wait=elapsed<19500?20000-elapsed:50000-elapsed;setTimeout(()=>{measure(7000);spinProbe.textContent='Measuring spin…';setTimeout(()=>{spinProbe.disabled=false;spinProbe.textContent='Measure next spin';},7100);},wait);};
