import * as T from '../../lib/three.core.js';
const TAU=Math.PI*2,SPIN_SECONDS=7,BALL_GRAVITY=98.1,clamp=(n,a,b)=>Math.min(b,Math.max(a,n)),mod=(n,m)=>((n%m)+m)%m,contextMod=mod;
export class BallSimulation{
 constructor(geometry,motion){this.T=T;this.trajectory=motion;this.pocketColliders=geometry.pockets.map(p=>({...p,faces:p.faces.map(f=>({surface:f.surface,triangle:new T.Triangle(...f.vertices.map(v=>new T.Vector3(...v)))}))}));this.deflectors=geometry.deflectors.map(d=>({...d,center:new T.Vector3(...d.center),faces:d.faces.map(f=>new T.Triangle(...f.map(v=>new T.Vector3(...v))))}));}
 wheelAngle(t){
  const m=this.trajectory;if(!m)return this.angle;
  if(t<0)return m.start+m.startVelocity*t;
  if(t>=SPIN_SECONDS)return m.start+m.travel+m.cruiseVelocity*(t-SPIN_SECONDS);
  if(t<m.ramp){const u=t/m.ramp;return m.start+m.startVelocity*t+(m.peakVelocity-m.startVelocity)*m.ramp*(u*u*u-.5*u*u*u*u)}
  const duration=SPIN_SECONDS-m.ramp,s=t-m.ramp,u=s/duration;
  return m.start+m.ramp*(m.startVelocity+m.peakVelocity)/2+m.cruiseVelocity*s+(m.peakVelocity-m.cruiseVelocity)*duration*(u-u*u*u+.5*u*u*u*u);
 }
 wheelVelocity(t){
  const m=this.trajectory;if(!m)return this.direction*.24;
  if(t<0)return m.startVelocity;if(t>=SPIN_SECONDS)return m.cruiseVelocity;
  if(t<m.ramp){const u=t/m.ramp;return m.startVelocity+(m.peakVelocity-m.startVelocity)*u*u*(3-2*u)}
  const u=(t-m.ramp)/(SPIN_SECONDS-m.ramp);return m.cruiseVelocity+(m.peakVelocity-m.cruiseVelocity)*(1-u*u*(3-2*u));
 }
 wheelAcceleration(t){
  const m=this.trajectory;if(!m||t<0||t>=SPIN_SECONDS)return 0;
  if(t<m.ramp){const u=t/m.ramp;return (m.peakVelocity-m.startVelocity)*6*u*(1-u)/m.ramp}
  const duration=SPIN_SECONDS-m.ramp,u=(t-m.ramp)/duration;return -(m.peakVelocity-m.cruiseVelocity)*6*u*(1-u)/duration;
 }
 bowlFloor(r){if(r>=3.59)return .162+(r-3.59);if(r>=3.37)return .042+(r-3.37)*.545;return Math.max(.047+clamp((2.94-r)/.342,0,1)*.076,-.038+(r-3.10)*.296)}
 pocketContact(position,velocity,t,indices,impacts,lastHits){
  const T=this.T,R=.092,closest=new T.Vector3(),normal=new T.Vector3(),tangent=new T.Vector3();let floorContact=false,contact=false;
  // Small fixed steps and repeated contact sweeps prevent a fast ball tunnelling
  // through the recess or a corner shared by the floor and two sloping walls.
  for(let pass=0;pass<3;pass++)for(const index of indices)for(const face of this.pocketColliders[index].faces){
   face.triangle.closestPointToPoint(position,closest);const d2=position.distanceToSquared(closest);if(d2>=R*R)continue;
   const distance=Math.sqrt(d2);normal.copy(position).sub(closest);if(distance>1e-8)normal.divideScalar(distance);else face.triangle.getNormal(normal);
   const incoming=velocity.dot(normal),surface=face.surface;position.addScaledVector(normal,R-distance+.00001);contact=true;if(surface==='floor'&&normal.y>.95)floorContact=true;
   if(incoming>=0)continue;
   const restitution=incoming<-.90?(surface==='floor'?.53:.47):0;
   velocity.addScaledVector(normal,-(1+restitution)*incoming);
   tangent.copy(velocity).addScaledVector(normal,-velocity.dot(normal));const speed=tangent.length(),friction=surface==='floor'?.22:.13;
   if(speed>1e-8)velocity.addScaledVector(tangent,-Math.min(1,friction*(1+restitution)*(-incoming)/speed));
   const key=index+':'+surface;
   if(restitution>0&&t-(lastHits.get(key)??-10)>.045){
    impacts.push({t,type:surface==='floor'?'pocket-floor':'pocket-wall',index,surface,point:closest.toArray(),center:position.toArray(),normal:normal.toArray(),incoming,outgoing:velocity.dot(normal)});lastHits.set(key,t);
   }
  }
  return {contact,floorContact};
 }
 traceBall(initialTheta,initialOmega,release,capture){
  const T=this.T,h=1/240,R=.092,points=[],impacts=[],lastHits=new Map();
  let theta=initialTheta,omega=initialOmega,r=3.60,vr=0,y=this.bowlFloor(3.60),vy=0;
  const pos=new T.Vector3(),velocity=new T.Vector3(),closest=new T.Vector3(),best=new T.Vector3(),normal=new T.Vector3();
  const record=(t)=>points.push({t,theta,r,y,omega,vr,vy,phase:'free'});record(0);
  for(let step=1;step<=Math.round(capture/h);step++){
   const t=step*h;
   if(t>release){vr+=(-4.5+omega*omega*.0008)*h;vr*=Math.exp(-.16*h);r+=vr*h}
   omega*=Math.exp(-(t>release?.55:.23)*h);theta+=omega*h;vy-=BALL_GRAVITY*h;y+=vy*h;
   if(r>3.68){r=3.68;vr=-Math.abs(vr)*.35}if(r<2.30){r=2.30;vr=Math.abs(vr)*.1}
   const floor=this.bowlFloor(r);if(r>=2.60&&y<floor){if(vy<-.65&&t>release)impacts.push({t,type:'bowl',speed:-vy});y=floor;vy=Math.abs(vy)>.8?-vy*.24:0}
   pos.set(r*Math.cos(theta),y,r*Math.sin(theta));velocity.set(vr*Math.cos(theta)-r*omega*Math.sin(theta),vy,vr*Math.sin(theta)+r*omega*Math.cos(theta));
   // Sphere/triangle contacts use the same world-space faces that are rendered.
   for(const collider of this.deflectors){
    if(pos.distanceToSquared(collider.center)>.36*.36)continue;
    let distance=Infinity,bestFace=null;
    for(const face of collider.faces){face.closestPointToPoint(pos,closest);const d=closest.distanceToSquared(pos);if(d<distance){distance=d;best.copy(closest);bestFace=face}}
    if(distance>R*R||t-(lastHits.get(collider.index)??-10)<.065)continue;
    const length=Math.sqrt(distance);normal.copy(pos).sub(best);if(length>1e-7)normal.multiplyScalar(1/length);else bestFace.getNormal(normal);
    const incoming=velocity.dot(normal);if(incoming>=-.025)continue;
    pos.addScaledVector(normal,R-length+.0015);
    // Low restitution and Coulomb friction dissipate the impact instead of
    // converting almost all of the tangential energy into a high aerial arc.
    const before=velocity.toArray(),impulse=-1.18*incoming;velocity.addScaledVector(normal,impulse);
    const sliding=velocity.clone().addScaledVector(normal,-velocity.dot(normal)),slipSpeed=sliding.length();
    if(slipSpeed>1e-8)velocity.addScaledVector(sliding,-Math.min(1,.24*impulse/slipSpeed));
    impacts.push({t,type:'deflector',index:collider.index,point:best.toArray(),center:pos.toArray(),normal:normal.toArray(),incoming,outgoing:velocity.dot(normal),before,after:velocity.toArray()});lastHits.set(collider.index,t);
   }
   // Moving fret boxes: test in a radial/tangential frame and reflect relative velocity.
   r=Math.hypot(pos.x,pos.z);theta+=mod(Math.atan2(pos.z,pos.x)-theta+Math.PI,TAU)-Math.PI;
   if(r<2.78&&r>2.12&&pos.y<.22){
    const stepAngle=TAU/37,wa=this.wheelAngle(t),nearest=Math.round((theta-wa+Math.PI/2+stepAngle/2)/stepAngle),a=nearest*stepAngle-Math.PI/2-stepAngle/2+wa,ca=Math.cos(a),sa=Math.sin(a);
    const radial=pos.x*ca+pos.z*sa-2.43,tangent=-pos.x*sa+pos.z*ca,height=pos.y-.006;
    const qx=clamp(radial,-.215,.215),qz=clamp(tangent,-.0125,.0125),qy=clamp(height,-.0575,.0575);
    const dx=radial-qx,dz=tangent-qz,dy=height-qy,d2=dx*dx+dy*dy+dz*dz,key='f'+mod(nearest,37);
    if(d2<R*R&&d2>1e-10&&t-(lastHits.get(key)??-10)>.055){
     normal.set(dx*ca-dz*sa,dy,dx*sa+dz*ca).normalize();
     const wv=this.wheelVelocity(t),rotorVelocity=new T.Vector3(-pos.z*wv,0,pos.x*wv),relative=velocity.clone().sub(rotorVelocity),incoming=relative.dot(normal);
     if(incoming<-.05){pos.addScaledVector(normal,R-Math.sqrt(d2)+.001);relative.addScaledVector(normal,-1.32*incoming).multiplyScalar(.91);velocity.copy(relative).add(rotorVelocity);impacts.push({t,type:'fret',index:mod(nearest,37),incoming});lastHits.set(key,t)}
    }
   }
   if(r<2.70&&r>2.12&&pos.y<.22){
    const wa=this.wheelAngle(t),wv=this.wheelVelocity(t),axis=new T.Vector3(0,1,0),localPosition=pos.clone().applyAxisAngle(axis,wa),localVelocity=velocity.clone().sub(new T.Vector3(-pos.z*wv,0,pos.x*wv)).applyAxisAngle(axis,wa),nearest=mod(Math.round((Math.atan2(localPosition.z,localPosition.x)+Math.PI/2)/(TAU/37)),37);
    this.pocketContact(localPosition,localVelocity,t,[nearest,mod(nearest-1,37),mod(nearest+1,37)],impacts,lastHits);
    pos.copy(localPosition).applyAxisAngle(axis,-wa);velocity.copy(localVelocity).applyAxisAngle(axis,-wa).add(new T.Vector3(-pos.z*wv,0,pos.x*wv));
   }
   r=Math.hypot(pos.x,pos.z);theta+=mod(Math.atan2(pos.z,pos.x)-theta+Math.PI,TAU)-Math.PI;y=pos.y;vy=velocity.y;
   vr=(pos.x*velocity.x+pos.z*velocity.z)/r;omega=(pos.x*velocity.z-pos.z*velocity.x)/(r*r);record(t);
   if(r<2.57&&y<.16){
    const wa=this.wheelAngle(t),wv=this.wheelVelocity(t),axis=new T.Vector3(0,1,0),local=pos.clone().applyAxisAngle(axis,wa),relative=velocity.clone().sub(new T.Vector3(-pos.z*wv,0,pos.x*wv)).applyAxisAngle(axis,wa);
    const rest=this.tracePocket(local,relative,t,capture);points.push(...rest.points);impacts.push(...rest.impacts);break;
   }
  }
  const p=points.at(-1),angle=p.theta-this.wheelAngle(capture),index=contextMod(Math.round((angle+Math.PI/2)/(Math.PI*2/37)),37),prior=points.at(-121);const local=[p.r*Math.cos(angle),p.y,p.r*Math.sin(angle)],priorAngle=prior.theta-this.wheelAngle(prior.t),distance=Math.hypot(local[0]-prior.r*Math.cos(priorAngle),local[2]-prior.r*Math.sin(priorAngle),p.y-prior.y);return {points,impacts,index,local,distance};
 }
 tracePocket(position,velocity,start,end){
  const h=1/240,points=[],impacts=[],lastHits=new Map();
  for(let step=1;step<=Math.round((end-start)/h);step++){
   const t=start+step*h,w=this.wheelVelocity(t),alpha=this.wheelAcceleration(t),ax=w*w*position.x+2*w*velocity.z+alpha*position.z,az=w*w*position.z-2*w*velocity.x-alpha*position.x;
   velocity.x+=ax*h;velocity.z+=az*h;velocity.y-=BALL_GRAVITY*h;position.addScaledVector(velocity,h);
   const index=mod(Math.round((Math.atan2(position.z,position.x)+Math.PI/2)/(TAU/37)),37),contact=this.pocketContact(position,velocity,t,[index,mod(index-1,37),mod(index+1,37)],impacts,lastHits);
   if(contact.floorContact){velocity.x*=Math.exp(-1.1*h);velocity.z*=Math.exp(-1.1*h);if(velocity.length()<.035)velocity.set(0,0,0);}
   const r=Math.hypot(position.x,position.z),theta=Math.atan2(position.z,position.x)+this.wheelAngle(t);
   points.push({t,theta,r,y:position.y,omega:w+(position.x*velocity.z-position.z*velocity.x)/(r*r),vy:velocity.y,vr:(position.x*velocity.x+position.z*velocity.z)/r,phase:contact.floorContact?'pocket':'entry'});
  }
  return {points,impacts};
 }
}
