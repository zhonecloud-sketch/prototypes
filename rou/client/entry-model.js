// Editing keeps the caret between Unicode characters, including pasted names.
export function editEntry(value,caret,key,maxLength=254){
  const chars=Array.from(value);caret=Math.max(0,Math.min(chars.length,caret));
  if(key==='Left')return {value,caret:Math.max(0,caret-1)};
  if(key==='Right')return {value,caret:Math.min(chars.length,caret+1)};
  if(key==='Clear')return {value:'',caret:0};
  if(key==='Backspace'){if(caret)chars.splice(--caret,1);}
  else if(key==='Delete')chars.splice(caret,1);
  else {const added=Array.from(key==='Space'?' ':key);if((chars.join('')+added.join('')).length<=maxLength){chars.splice(caret,0,...added);caret+=added.length;}}
  return {value:chars.join(''),caret};
}
