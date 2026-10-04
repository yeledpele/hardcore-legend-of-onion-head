// Test hooks, injected only into dist/hardcore.test.html by `node build.js --test`.
// They read and set game state so the tests can drive and check the game.
window.__t={
  state:()=>state,
  snap:()=>bw?({state,sec:bw.sec,stage:bw.stage,clear:bw.clear,px:bw.p.x|0,pz:bw.p.z|0,ph:bw.p.h|0,onG:bw.p.onG,kind:bw.p.kind,sp:bw.p.sp,pow:bw.p.pow,
    layers:bw.p.layers.map(l=>l.id),score:bw.score,size:pBody().size,special:curSpecial(),
    boss:bw.boss?[bw.boss.type,bw.boss.x|0,bw.boss.z|0,bw.boss.st,bw.boss.hp]:null,bombs:bw.bombs.map(m=>[m.x|0,m.z|0,m.st]),
    foes:bw.ents.filter(e=>e.type&&e.st!=='dead').map(e=>[e.x|0,e.z|0]),crates:bw.ents.filter(e=>e.crate&&!e.prop).map(e=>[e.x|0,e.z|0]),
    props:bw.ents.filter(e=>e.prop&&!e.dead).map(e=>[e.x|0,e.z|0,e.prop,e.hp]),civs:bw.ents.filter(e=>e.civ&&!e.gone).map(e=>[e.x|0,e.z|0,e.st]),rubble:bw.rubble.length,items:bw.items.map(i=>i.kind==='wpn'?'wpn:'+i.w:i.kind),
    husks:bw.ents.filter(e=>e.husk).map(e=>[e.x|0,e.z|0,bodyOf(e.id).size,e.id])}):{state},
  heal:()=>{bw.p.core=3;bw.p.pow=100;for(const l of bw.p.layers)l.shell=l.max;},
  // put the player in a body (or the bare core, or a nested list of bodies, inner first) next to a sturdy, dazed dummy robot
  dummy:(id,weapon)=>{const ids=Array.isArray(id)?id:id==='core'?[]:[id];bw.p.layers=ids.map(id=>({id,shell:bodyOf(id).shell,max:bodyOf(id).shell,weapon:weapon||undefined}));
    Object.assign(bw.p,{pow:100,core:3,atk:0,kind:null,sp:null,h:0,onG:true,face:1,vx:0,z:124});
    bw.ents=bw.ents.filter(e=>!e.type);bw.items=[];const S=SECS[bw.sec];bw.p.x=S.x0+80;
    bw.ents.push({type:'scrap',T:TYPES.scrap,x:S.x0+112,z:124,h:0,vh:0,vx:0,face:-1,st:'stun',t:999,hp:500,max:500,dmg:1,hurt:0,walk:0,moving:false,boss:true,role:'wait',zo:0});},
  // drop an empty body right next to the player; unlock (or lock) nesting
  husk:id=>{bw.ents.push({husk:true,id,shell:bodyOf(id).shell,max:bodyOf(id).shell,x:bw.p.x,z:bw.p.z,face:1});},
  nestOK:on=>{bw.nestOK=on;},
  // jump straight to a section (0-based across the whole campaign)
  goto:sec=>{bw.ents=bw.ents.filter(e=>e.husk);bw.items=[];bw.boss=null;bw.bombs=[];bw.strikes=[];bw.plats=[];bw.heads=[];bw.drops=[];bw.zaps=[];bw.sec=sec-1;nextSec();bw.cam=SECS[bw.sec].x0;bw.p.x=bw.cam+40;bw.p.z=124;bw.stageT=0;},
  // put the player in these bodies (inner first) without touching the street
  body:(ids,weapon)=>{bw.p.layers=ids.map(id=>({id,shell:bodyOf(id).shell,max:bodyOf(id).shell}));if(weapon&&ids.length)bw.p.layers[ids.length-1].weapon=weapon;},
  foes:()=>bw.ents.filter(e=>e.type).map(e=>({t:e.type,x:Math.round(e.x-bw.cam),z:e.z|0,h:e.h|0,st:e.st,hp:e.hp,in:!!e.in})),
  boss:()=>bw.boss?{type:bw.boss.type,st:bw.boss.st,hp:bw.boss.hp,max:bw.boss.max,x:bw.boss.x|0,z:bw.boss.z|0}:null,
  inside:()=>!!bw.p.inside,
  frozen:()=>!!bw.p.frozen,
  // drop a resting (non-bomb) head dx px from the player
  addHead:dx=>{bw.heads.push({bomb:false,fuse:0,type:'scrap',x:bw.p.x+dx,z:bw.p.z,h:0,vx:0,vh:0,st:'rest',hot:false,w:8,hh:6,spin:0,life:1500});},
  clearHusks:()=>{bw.ents=bw.ents.filter(e=>!e.husk);},
  headX:()=>bw.heads.length?bw.heads[0].x-bw.p.x:null,
  // the first robot on the street: its x, and moving it dx px from the player
  foeX:()=>{const e=bw.ents.find(e=>e.type&&e.st!=='dead');return e?e.x-bw.p.x:null;},
  moveFoe:dx=>{const e=bw.ents.find(e=>e.type);if(e){e.x=bw.p.x+dx;e.z=bw.p.z;}},
  // force the boss into a state, and put the player at an offset from it
  bossState:(st,t)=>{bw.boss.st=st;bw.boss.t=t;},
  nearBoss:(dx,dz)=>{const b=bw.boss;bw.p.x=b.x+dx;bw.p.z=clamp(b.z+(dz||0),BZ0,BZ1);bw.p.inv=0;bw.p.h=0;bw.p.onG=true;},
  secs:()=>SECS.map(s=>[s.stage,STAGES[s.stage].name,s.foes.some(f=>f[0]==='BOSS')?s.foes.find(f=>f[0]==='BOSS')[1]:null]),
  // clear the street of civilians and props, then place one next to the player (dx px ahead)
  civ:dx=>{bw.ents=bw.ents.filter(e=>!e.civ&&!e.prop);const c=addCiv(bw.p.x+dx,bw.p.z);c.st='idle';c.t=9999;},
  prop:(k,dx)=>{bw.ents=bw.ents.filter(e=>!e.civ&&!e.prop);bw.ents.push({crate:true,prop:k,x:bw.p.x+dx,z:bw.p.z,h:0,hp:PROPS[k].hp,max:PROPS[k].hp,hurt:0});},
  feel:()=>FEEL,
  frame:()=>T,
  setFeel:(group,key,v)=>{FEEL[group][key]=v;},
  dummyHp:()=>{const e=bw.ents.find(e=>e.type);return e?e.hp:-1;},
  drawMs:()=>{const t0=performance.now();for(let i=0;i<30;i++)render();return (performance.now()-t0)/30;}
};
