// Test hooks, injected only into dist/hardcore.test.html by `node build.js --test`.
// They read and set game state so the tests can drive and check the game.
window.__t={
  state:()=>state,
  snap:()=>bw?({state,sec:bw.sec,stage:bw.stage,clear:bw.clear,px:bw.p.x|0,pz:bw.p.z|0,ph:bw.p.h|0,onG:bw.p.onG,kind:bw.p.kind,sp:bw.p.sp,pow:bw.p.pow,
    layers:bw.p.layers.map(l=>l.id),score:bw.score,size:pBody().size,special:curSpecial(),
    boss:bw.boss?[bw.boss.type,bw.boss.x|0,bw.boss.z|0,bw.boss.st,bw.boss.hp]:null,bombs:bw.bombs.map(m=>[m.x|0,m.z|0,m.st]),
    foes:bw.ents.filter(e=>e.type&&e.st!=='dead').map(e=>[e.x|0,e.z|0]),crates:bw.ents.filter(e=>e.crate).map(e=>[e.x|0,e.z|0]),
    husks:bw.ents.filter(e=>e.husk).map(e=>[e.x|0,e.z|0,bodyOf(e.id).size,e.id])}):{state},
  heal:()=>{bw.p.core=3;bw.p.pow=100;for(const l of bw.p.layers)l.shell=l.max;},
  // put the player in a body (or the bare core) next to a sturdy, dazed dummy robot
  dummy:(id,weapon)=>{bw.p.layers=id==='core'?[]:[{id,shell:bodyOf(id).shell,max:bodyOf(id).shell,weapon:weapon||undefined}];
    Object.assign(bw.p,{pow:100,core:3,atk:0,kind:null,sp:null,h:0,onG:true,face:1,vx:0,z:124});
    bw.ents=bw.ents.filter(e=>!e.type);bw.items=[];const S=SECS[bw.sec];bw.p.x=S.x0+80;
    bw.ents.push({type:'scrap',T:TYPES.scrap,x:S.x0+112,z:124,h:0,vh:0,vx:0,face:-1,st:'stun',t:999,hp:500,max:500,dmg:1,hurt:0,walk:0,moving:false,boss:true,role:'wait',zo:0});},
  dummyHp:()=>{const e=bw.ents.find(e=>e.type);return e?e.hp:-1;},
  drawMs:()=>{const t0=performance.now();for(let i=0;i<30;i++)render();return (performance.now()-t0)/30;}
};
