// Standalone scenes are decoded only when needed, instead of a large startup atlas.
export const HISTORY_YEARS=[189,190,192,194,197,200,207,208,215,219,220,221,222,223,229];
export function historyArtworkFile(key){const year=key.slice(7);return key==='historyDefault'?'./assets/history-v36/default.webp':HISTORY_YEARS.includes(Number(year))?'./assets/history-v36/'+year+'.webp':null;}
