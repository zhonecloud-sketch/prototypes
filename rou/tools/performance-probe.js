// Injected by the disposable local preview only, never by the published game.
const probe=document.createElement('button');probe.id='performanceProbe';
probe.style.cssText='position:fixed;bottom:0;right:0;z-index:9999;max-width:70vw;font:11px monospace;padding:5px;background:#eee;color:#111;white-space:pre-wrap';
probe.textContent='Measure next 5 seconds';document.body.append(probe);
let measurement=null;
const originalTick=tick,originalUpdate=RouletteWheel.prototype.update;
tick=function(...args){if(measurement)measurement.ticks++;return originalTick(...args);};
RouletteWheel.prototype.update=function(...args){const start=performance.now();try{return originalUpdate.apply(this,args);}finally{if(measurement){measurement.renders++;measurement.renderMs+=performance.now()-start;measurement.drawCalls=this.renderer.info.render.calls;measurement.pixels=this.canvas.width*this.canvas.height;}}};
const probeObserver=new MutationObserver(entries=>{if(measurement)measurement.mutations+=entries.filter(e=>e.target!==probe&&e.target.parentElement!==probe).length;});
probeObserver.observe(document.getElementById('landscapeSurface'),{subtree:true,childList:true,attributes:true,characterData:true});
const longObserver=new PerformanceObserver(list=>{if(measurement)measurement.longTasks+=list.getEntries().length;});
longObserver.observe({type:'longtask',buffered:false});
probe.onclick=()=>{if(measurement)return;measurement={ticks:0,renders:0,renderMs:0,drawCalls:0,pixels:0,mutations:0,longTasks:0};probe.textContent='Measuring 5 seconds…';setTimeout(()=>{const m=measurement;measurement=null;m.renderMs=Math.round(m.renderMs);probe.textContent=JSON.stringify(m);},5000);};
