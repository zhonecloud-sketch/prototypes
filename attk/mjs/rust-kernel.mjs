const key=Symbol.for('attk.rust.kernel.v1');
const required=['equipment_percent','combat_power','casualty_raw',
 'flee_chance','training_gain','food_gain'];
export function rustKernel(){
 const value=globalThis[key];
 if(value)return value;
 if(globalThis.process?.versions?.node)return null;
 throw Error('Rust engine is not loaded. Run the game with start-game.');
}
export async function initializeRustKernel(bytes){
 if(globalThis[key])return globalThis[key];
 if(!bytes){
  const response=await fetch(new URL('../wasm/attk_engine.wasm',import.meta.url));
  if(!response.ok)throw Error('Missing Rust WebAssembly engine. Run build first.');
  bytes=await response.arrayBuffer();
 }
 const {instance}=await WebAssembly.instantiate(bytes,{});
 const value=instance.exports;
 if(value.kernel_version?.()!==1||required.some(k=>typeof value[k]!=='function'))
  throw Error('Incompatible Rust engine. Rebuild this ATTK version.');
 globalThis[key]=value;
 return value;
}
export const rustKernelLoaded=()=>!!globalThis[key];
