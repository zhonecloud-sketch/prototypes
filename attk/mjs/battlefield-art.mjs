// All 41 paintings use the same registration as the original 13 × 12 hex data.
// The image is drawn once with one scale factor; the grid remains the rules map.
export const BATTLEFIELD_BOUNDS={left:-10,top:-6*Math.sqrt(3),width:20,height:12.5*Math.sqrt(3)};
export const battlefieldKey=province=>'battlefield'+String(province).padStart(2,'0');
export const battlefieldFile=province=>'battlefields/province-'+String(province).padStart(2,'0')+'-v17.webp';
export function paintingRect(image,scale,screen){
 const bounds=BATTLEFIELD_BOUNDS,origin=screen({x:bounds.left,z:bounds.top}),width=bounds.width*scale,height=width*image.height/image.width;
 return {x:origin.x,y:origin.y,width,height};
}
export function paintBattlefield(ctx,image,scale,screen){
 if(!image)throw Error('The province battlefield painting is unavailable.');
 const rect=paintingRect(image,scale,screen);ctx.drawImage(image,rect.x,rect.y,rect.width,rect.height);return rect;
}
