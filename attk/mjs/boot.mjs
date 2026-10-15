import {initializeRustKernel} from './rust-kernel.mjs';
const status=document.getElementById('loadStatus');
try{
 if(location.protocol==='file:')
  throw Error('Start with start-game.bat, start-game.command or start-game.sh.');
 status.textContent='Loading the Rust engine…';
 await initializeRustKernel();
 await import('./app.mjs?v=60');
}catch(error){
 status.textContent=error.message;
 const retry=document.getElementById('retry');
 retry.hidden=false;
 retry.onclick=()=>location.reload();
}
