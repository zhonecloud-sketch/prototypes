export function parseRngFile(text){
  const source=text.trim();let numbers;
  if(source.startsWith('[')){
    numbers=JSON.parse(source);
  }else{
    const spins=source.match(/<pre\b[^>]*\bid=["']spins["'][^>]*>([\s\S]*?)<\/pre>/i);
    const payload=spins?spins[1]:source;
    numbers=payload.split(/\r?\n/).filter(line=>line.trim()).flatMap((line,index)=>{
      const clean=line.trim();
      const timed=clean.match(/^\d{3}:\d{2}:\d{2}:\d{2}\s+(\d+)$/);
      if(timed)return [Number(timed[1])];
      if(!/^\d+(?:[\s,;]+\d+)*$/.test(clean))throw Error(`Invalid RNG format on line ${index+1}. Use whole roulette results from 0 to 36.`);
      return clean.split(/[\s,;]+/).map(Number);
    });
  }
  if(!Array.isArray(numbers)||numbers.length<1||numbers.length>2000000||numbers.some(n=>!Number.isInteger(n)||n<0||n>36))throw Error('The file must contain 1–2,000,000 whole roulette results from 0 to 36.');
  return numbers;
}
