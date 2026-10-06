// ---------- dev mode: ?dev=1, the ` key, or served by `npm run dev` ----------
// Shows a DEV button that opens the dev panel. With the local dev server, the tools save project files
// (src/feel.js, src/levels.js) and the page reloads when a source file changes; on the live site, tweaks stay in this browser.
const DEV={on:false,server:false,open:false};
try{DEV.on=new URLSearchParams(location.search).get('dev')==='1'||localStorage.getItem('hc-dev')==='1';}catch(e){}
if(window.HC_DEVSERVER)DEV.on=true;
let devBtn=null,devPanel=null,devMsg='',devFilter='';
// jump to scene: where to go and what to start with (remembered in this browser)
DEV.scene={level:0,sec:0,body:'',inner:'',weapon:'',god:false,nest:true,full:true};
try{Object.assign(DEV.scene,JSON.parse(localStorage.getItem('hc-devscene')||'{}'));}catch(e){}
const DEV_BODIES=['','basic','brute','walker','titan','flyer','doll','e:scrap','e:lancer','e:hound','e:guard','e:brute','e:walker'];
const DEV_WEAPONS=['','sword','hammer','laser','rocket','hook','magnet'];
const bodyLabel=id=>id?bodyOf(id).name+(id.startsWith('e:')?' (ROBOT)':''):'NONE (CORE)';
// start the campaign if needed, then put the player at the start of that section with the chosen bodies
function devGoto(){
  const sc=DEV.scene,sec=clamp(sc.level*5+sc.sec,0,SECS.length-1);opts=null;paused=false;
  if(state!=='brawl'||!bw){newRun();intro=null;campaignStart();}
  bw.ents=[];bw.items=[];bw.boss=null;bw.bombs=[];bw.strikes=[];bw.plats=[];bw.heads=[];bw.drops=[];bw.zaps=[];bw.rubble=[];
  const p=bw.p;Object.assign(p,{inside:false,frozen:false,stun:0,guarding:false,atk:0,kind:null,sp:null,grab:null,h:0,vh:0,vx:0,vz:0,onG:true,inv:30});
  bw.sec=sec-1;nextSec();bw.cam=SECS[bw.sec].x0;p.x=bw.cam+40;p.z=124;bw.stageT=0;bw.clear=false;
  if(sc.nest)bw.nestOK=true;
  const ids=[sc.inner,sc.body].filter(Boolean);p.layers=ids.map(id=>({id,shell:bodyOf(id).shell,max:bodyOf(id).shell}));
  if(sc.weapon&&p.layers.length)p.layers[p.layers.length-1].weapon=sc.weapon;
  if(sc.full){p.pow=100;p.core=5;}
  DEV.god=!!sc.god;devMsg='Jumped to level '+(sc.level+1)+', section '+(sc.sec+1)+'.';devSync();
}
function sceneStore(){try{localStorage.setItem('hc-devscene',JSON.stringify(DEV.scene));}catch(e){}}

// ---- the feel file: defaults (as written in src/feel.js), comments, and rewriting values in place
// FEEL_SRC is the text of src/feel.js, put in by the build
let feelSrc=typeof FEEL_SRC==='string'?FEEL_SRC:'';
const feelLeaves=()=>{const out=[];for(const [g,o] of Object.entries(FEEL))for(const [k,v] of Object.entries(o)){if(v&&typeof v==='object'){for(const [k2,v2] of Object.entries(v))out.push({g,k,k2,v:v2});}else out.push({g,k,v});}return out;};
const leafId=l=>l.g+'.'+l.k+(l.k2?'.'+l.k2:'');
const leafGet=l=>l.k2?FEEL[l.g][l.k][l.k2]:FEEL[l.g][l.k];
const leafSet=(l,v)=>{if(l.k2)FEEL[l.g][l.k][l.k2]=v;else FEEL[l.g][l.k]=v;};
const FEEL_DEFAULT={};for(const l of feelLeaves())FEEL_DEFAULT[leafId(l)]=l.v;
// the slice of the file text that belongs to one group
function groupSpan(src,g){const a=src.search(new RegExp('^\\s*'+g+':\\{','m'));if(a<0)return null;let i=src.indexOf('{',a),depth=0;for(;i<src.length;i++){if(src[i]==='{')depth++;else if(src[i]==='}'&&--depth===0)break;}return [a,i];}
function feelComment(l){const sp=groupSpan(feelSrc,l.g);if(!sp)return '';const part=feelSrc.slice(sp[0],sp[1]),m=part.match(new RegExp('^\\s*'+l.k+':\\s*-?[\\d.]+,?\\s*//\\s*(.*)$','m'));return m?m[1].trim():'';}
// the file with the current values written in place (comments and layout kept)
function devFeelText(){
  let src=feelSrc;
  for(const l of feelLeaves()){const sp=groupSpan(src,l.g);if(!sp)continue;let part=src.slice(sp[0],sp[1]);const v=String(+leafGet(l).toFixed(4));
    if(l.k2)part=part.replace(new RegExp('(^\\s*'+l.k+':\\{[^\\n]*?\\b'+l.k2+':\\s*)(-?[\\d.]+)','m'),'$1'+v);
    else part=part.replace(new RegExp('(^\\s*'+l.k+':\\s*)(-?[\\d.]+)','m'),'$1'+v);
    src=src.slice(0,sp[0])+part+src.slice(sp[1]);}
  return src;
}
// on the live site, tweaks are kept in this browser while dev mode is on
function feelStore(){try{const ch={};for(const l of feelLeaves()){const id=leafId(l);if(leafGet(l)!==FEEL_DEFAULT[id])ch[id]=leafGet(l);}localStorage.setItem('hc-feel',JSON.stringify(ch));}catch(e){}}
function feelRestore(){try{const ch=JSON.parse(localStorage.getItem('hc-feel')||'{}');for(const l of feelLeaves()){const id=leafId(l);if(id in ch&&Number.isFinite(ch[id]))leafSet(l,ch[id]);}}catch(e){}}
const feelChanged=()=>feelLeaves().filter(l=>leafGet(l)!==FEEL_DEFAULT[leafId(l)]);
// a slider range around the file value
function sliderSpec(d){const a=Math.abs(d)||1,int=Number.isInteger(d),max=int?Math.max(10,Math.ceil(a*3)):Math.max(1,+(a*3).toPrecision(2)),step=int?1:Math.pow(10,Math.floor(Math.log10(a))-2);return{min:0,max,step};}

function devSet(on){DEV.on=on;if(!on)DEV.open=false;try{localStorage.setItem('hc-dev',on?'1':'0');}catch(e){}devSync();}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function devSync(){
  if(!devBtn){
    devBtn=document.createElement('button');devBtn.id='devBtn';devBtn.type='button';devBtn.textContent='DEV';devBtn.setAttribute('aria-label','Dev tools');
    devBtn.addEventListener('click',()=>{DEV.open=!DEV.open;devSync();});
    devPanel=document.createElement('div');devPanel.id='devPanel';devPanel.setAttribute('role','dialog');devPanel.setAttribute('aria-label','Dev tools');
    devPanel.addEventListener('input',devInput);devPanel.addEventListener('click',devClick);
    document.body.append(devBtn,devPanel);
  }
  devBtn.hidden=!DEV.on;devPanel.hidden=!(DEV.on&&DEV.open);devBtn.classList.toggle('on',DEV.open);
  if(devPanel.hidden)return;
  const changed=feelChanged().length,open=new Set([...devPanel.querySelectorAll('details[open]')].map(d=>d.dataset.g));
  const groups={};for(const l of feelLeaves()){(groups[l.g]=groups[l.g]||[]).push(l);}
  let html='<h2>DEV TOOLS</h2>'+
    '<p class="dev-status '+(DEV.server?'ok':'off')+'">'+(DEV.server?'LOCAL DEV SERVER: SAVE writes src/feel.js.':'NO DEV SERVER: tweaks stay in this browser; copy or download feel.js. Run <code>npm run dev</code> to save to files.')+'</p>'+
    devSceneHtml()+devEditorHtml()+
    '<h3>FEEL ('+changed+' changed)</h3>'+
    '<div class="dev-row"><input type="search" id="devFilter" placeholder="find a value" value="'+esc(devFilter)+'" aria-label="Find a value"></div>'+
    '<div class="dev-row dev-btns">'+(DEV.server?'<button data-act="save">SAVE TO FILE</button>':'')+'<button data-act="copy">COPY feel.js</button><button data-act="download">DOWNLOAD</button><button data-act="resetall">RESET ALL</button></div>'+
    (devMsg?'<p class="dev-msg">'+esc(devMsg)+'</p>':'');
  for(const [g,list] of Object.entries(groups)){
    const shown=list.filter(l=>!devFilter||leafId(l).toLowerCase().includes(devFilter.toLowerCase()));if(!shown.length)continue;
    html+='<details data-g="'+g+'"'+(devFilter||open.has(g)?' open':'')+'><summary>'+g.toUpperCase()+'</summary>';
    for(const l of shown){const id=leafId(l),v=leafGet(l),d=FEEL_DEFAULT[id],sp=sliderSpec(d),ch=v!==d,note=l.k2?'':feelComment(l);
      html+='<div class="dev-feel'+(ch?' changed':'')+'"><label for="f-'+id+'">'+esc(l.k2?l.k+'.'+l.k2:l.k)+'</label>'+
        '<input type="range" id="f-'+id+'" data-id="'+id+'" min="'+sp.min+'" max="'+Math.max(sp.max,v)+'" step="'+sp.step+'" value="'+v+'">'+
        '<input type="number" data-id="'+id+'" step="'+sp.step+'" value="'+v+'" aria-label="'+esc(id)+' value">'+
        '<button data-act="reset" data-id="'+id+'" title="back to '+d+'" aria-label="reset '+esc(id)+'">↺</button>'+
        (note?'<small>'+esc(note)+'</small>':'')+'</div>';}
    html+='</details>';}
  html+='<p class="dev-hint">` (backquote) turns dev mode on/off. Editing freezes the game; PLAY-TEST runs the section.</p>';
  devPanel.innerHTML=html;
  const f=devPanel.querySelector('#devFilter');if(f&&devFilterFocus){f.focus();f.setSelectionRange(f.value.length,f.value.length);}
}
function devSceneHtml(){
  const sc=DEV.scene,opt=(list,val,label)=>list.map(v=>'<option value="'+esc(v)+'"'+(String(v)===String(val)?' selected':'')+'>'+esc(label(v))+'</option>').join('');
  const st=STAGES[sc.level]||STAGES[0],boss=(st.secs[4]||[]).find(f=>f[0]==='BOSS');
  return '<h3>JUMP TO SCENE</h3>'+
    '<div class="dev-grid"><label for="devLevel">LEVEL</label><select id="devLevel">'+opt(STAGES.map((_,i)=>i),sc.level,i=>(i+1)+'. '+STAGES[i].name)+'</select>'+
    '<label for="devSec">SECTION</label><select id="devSec">'+opt([0,1,2,3,4],sc.sec,i=>(i+1)+(i===4&&boss?' — BOSS: '+TYPES[boss[1]].name:''))+'</select>'+
    '<label for="devBody">BODY</label><select id="devBody">'+opt(DEV_BODIES,sc.body,bodyLabel)+'</select>'+
    '<label for="devInner">INSIDE IT</label><select id="devInner">'+opt(DEV_BODIES,sc.inner,bodyLabel)+'</select>'+
    '<label for="devWeapon">WEAPON</label><select id="devWeapon">'+opt(DEV_WEAPONS,sc.weapon,w=>w?SPNAME[w]:'NONE')+'</select></div>'+
    '<div class="dev-row dev-checks"><label><input type="checkbox" id="devGod"'+(sc.god?' checked':'')+'> INVINCIBLE</label><label><input type="checkbox" id="devNest"'+(sc.nest?' checked':'')+'> NESTING UNLOCKED</label><label><input type="checkbox" id="devFull"'+(sc.full?' checked':'')+'> FULL POWER + CORES</label></div>'+
    '<div class="dev-row dev-btns"><button data-act="goto">GO</button></div>';
}
let devFilterFocus=false;
const leafById=id=>feelLeaves().find(l=>leafId(l)===id);
function devInput(e){
  const t=e.target;
  const sk={devLevel:'level',devSec:'sec',devBody:'body',devInner:'inner',devWeapon:'weapon',devGod:'god',devNest:'nest',devFull:'full'}[t.id];
  if(t.id==='edProp'){editProp=t.value;return;}
  if(t.id==='edBoss'&&DEV.edit){const f=edSec().find(x=>x[0]==='BOSS');if(f){edSnapshot();f[1]=t.value;edChanged();}return;}
  if(sk){DEV.scene[sk]=t.type==='checkbox'?t.checked:(sk==='level'||sk==='sec'?+t.value:t.value);if(sk==='god')DEV.god=t.checked;sceneStore();if(sk==='level')devSync();return;}
  if(t.id==='devFilter'){devFilter=t.value;devFilterFocus=true;devSync();devFilterFocus=false;return;}
  const id=t.dataset.id;if(!id)return;const l=leafById(id),v=parseFloat(t.value);if(!l||!Number.isFinite(v))return;
  leafSet(l,v);feelStore();devMsg='';
  // keep the slider and the number box in step without rebuilding the panel (keeps focus while dragging)
  for(const el of devPanel.querySelectorAll('[data-id="'+id+'"]'))if(el!==t&&el.tagName==='INPUT')el.value=v;
  const row=t.closest('.dev-feel');if(row)row.classList.toggle('changed',v!==FEEL_DEFAULT[id]);
  const h3=devPanel.querySelector('h3');if(h3)h3.textContent='FEEL ('+feelChanged().length+' changed)';
}
async function devClick(e){
  const b=e.target.closest('button');if(!b)return;const act=b.dataset.act;
  if(act==='goto'){devGoto();return;}
  if(await devEditorAct(act,b))return;
  if(act==='reset'){const l=leafById(b.dataset.id);if(l)leafSet(l,FEEL_DEFAULT[b.dataset.id]);feelStore();devSync();}
  else if(act==='resetall'){for(const l of feelLeaves())leafSet(l,FEEL_DEFAULT[leafId(l)]);feelStore();devMsg='All values back to the file.';devSync();}
  else if(act==='copy'){try{await navigator.clipboard.writeText(devFeelText());devMsg='feel.js copied.';}catch(err){devMsg='Copy failed: use DOWNLOAD.';}devSync();}
  else if(act==='download'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([devFeelText()],{type:'text/javascript'}));a.download='feel.js';document.body.append(a);a.click();a.remove();devMsg='feel.js downloaded: put it in src/.';devSync();}
  else if(act==='save'){try{const text=devFeelText();await devSave('src/feel.js',text);feelSrc=text;for(const l of feelLeaves())FEEL_DEFAULT[leafId(l)]=leafGet(l);try{localStorage.removeItem('hc-feel');}catch(err){}devMsg='Saved to src/feel.js.';}catch(err){devMsg='Save failed: '+err.message;}devSync();}
}


// ---- the level editor: edit a section in place (the game freezes), play-test it, save src/levels.js
// @levelsText-start
// writes src/levels.js from the level data (one section per line, with a header that explains the format)
function levelsText(street){
  const J=JSON.stringify,L=[
'// HARDCORE street: every level of the PLAY campaign, section by section. Written by the level editor (dev panel); fine to edit by hand.',
'// Each section is a list of spawns. x is from the section\'s left edge (0-256; negative = comes in from behind), z is depth (110-138):',
'//   [robot, x, z]          a robot: scrap, lancer, hound, guard, brute, walker; [robot, x, z, 1] makes it a mini-boss',
'//   ["C", x, z]            a crate',
'//   ["P", kind, x, z]      a prop: car, bin, barrel, pine, fence, lamp, tank, pot, blocks, cube, can, sugar (any "P" turns off the random props)',
'//   ["H", x, z]            a civilian (any "H" turns off the random civilians)',
'//   ["BOSS", type]         the level\'s boss (section 5)',
'// mud: [[section, x0, x1]] and belt: [[section, x0, x1, direction]], sections counted from 0. intro: the level banner\'s story lines.',
'const STREET=['];
  street.forEach((st,i)=>{
    let head='  {theme:'+st.theme+',name:'+J(st.name);
    if(st.intro)head+=',intro:'+J(st.intro);
    if(st.mud&&st.mud.length)head+=',mud:'+J(st.mud);
    if(st.belt&&st.belt.length)head+=',belt:'+J(st.belt);
    L.push(head+',');L.push('   secs:[');
    st.secs.forEach((sec,j)=>L.push('    '+J(sec)+(j<st.secs.length-1?',':'')));
    L.push('   ]}'+(i<street.length-1?',':''));
  });
  L.push('];','');return L.join('\n');
}
// @levelsText-end
DEV.edit=null;
let editProp='barrel';
const EDIT_TOOLS=[['select','SELECT / MOVE'],['scrap','SCRAPPER'],['lancer','LANCER'],['hound','HOUND'],['guard','SHIELDBOT'],['brute','BRUTE'],['walker','WALKER'],['C','CRATE'],['P','PROP'],['H','CIVILIAN'],['mud','MUD ZONE'],['belt','BELT ZONE'],['erase','ERASE']];
const edSec=()=>STAGES[DEV.edit.stage].secs[DEV.edit.i];
const edAbs=()=>SECS[DEV.edit.stage*5+DEV.edit.i];
// where a spawn sits (x from the section's left edge), and moving it
function entPos(f){if(f[0]==='BOSS')return{x:190,z:124,fixed:true};if(f[0]==='P')return{x:f[2],z:f[3]};return{x:f[1],z:f[2]};}
function entMove(f,x,z){if(f[0]==='BOSS')return;if(f[0]==='P'){f[2]=x;f[3]=z;}else{f[1]=x;f[2]=z;}}
const entLabel=f=>f[0]==='C'?'CRATE':f[0]==='P'?f[1].toUpperCase():f[0]==='H'?'CIV':f[0]==='BOSS'?'BOSS '+TYPES[f[1]].name:TYPES[f[0]].name+(f[3]?' (MINI)':'');
// the browser keeps edits when there's no dev server (dev mode only), like the feel tweaks
function levelsStore(){if(DEV.server)return;try{localStorage.setItem('hc-levels',JSON.stringify(STAGES));}catch(e){}}
function levelsRestore(){try{const s=JSON.parse(localStorage.getItem('hc-levels')||'null');if(Array.isArray(s)&&s.length===STAGES.length){STAGES.splice(0,STAGES.length,...s);rebuildSecs();}}catch(e){}}
function edSnapshot(){const e=DEV.edit;e.undo.push(JSON.stringify(STAGES[e.stage]));if(e.undo.length>60)e.undo.shift();}
function edUndo(){const e=DEV.edit;if(!e||!e.undo.length)return;const o=JSON.parse(e.undo.pop()),st=STAGES[e.stage];for(const k of Object.keys(st))delete st[k];Object.assign(st,o);e.sel=-1;edChanged();}
// show the section as it will play: cleared and spawned from the data, frozen
function edRespawn(){
  bw.ents=[];bw.items=[];bw.boss=null;bw.bombs=[];bw.strikes=[];bw.plats=[];bw.heads=[];bw.drops=[];bw.zaps=[];bw.rubble=[];
  bw.sec=DEV.edit.stage*5+DEV.edit.i;const S=SECS[bw.sec];bw.stage=S.stage;bw.cam=S.x0;bw.clear=false;bw.stageT=0;spawnSec();
  Object.assign(bw.p,{x:bw.cam+20,z:124,h:0,vh:0,vx:0,vz:0,onG:true,inside:false,frozen:false});
}
function edChanged(){rebuildSecs();edRespawn();levelsStore();devSync();}
function editStart(){
  const sc=DEV.scene;if(state!=='brawl'||!bw)devGoto();
  DEV.edit={stage:sc.level,i:sc.sec,tool:'select',sel:-1,undo:[],drag:false,zone:null};paused=false;opts=null;edRespawn();devMsg='';devSync();
}
function editGo(d){const e=DEV.edit,n=STAGES.length*5,k=(e.stage*5+e.i+d+n)%n;e.stage=Math.floor(k/5);e.i=k%5;e.sel=-1;e.undo=[];DEV.scene.level=e.stage;DEV.scene.sec=e.i;sceneStore();edRespawn();devSync();}
function editStop(play){const e=DEV.edit;DEV.edit=null;if(play){DEV.scene.level=e.stage;DEV.scene.sec=e.i;sceneStore();devGoto();}devSync();}
// the editing overlay over the frozen section
function drawEditor(){
  const e=DEV.edit,cam=Math.round(bw.cam),x0=edAbs().x0-cam,st=STAGES[e.stage];
  g.globalAlpha=.22;for(let x=0;x<=256;x+=32)px(x0+x,BZ0-4,1,BZ1-BZ0+8,C.cy);g.globalAlpha=1;
  for(const [kind,list] of [['mud',st.mud||[]],['belt',st.belt||[]]])for(const m of list)if(m[0]===e.i){
    const c=kind==='mud'?C.yl:C.cy;g.globalAlpha=.4;px(x0+m[1],BZ0-7,m[2]-m[1],3,c);g.globalAlpha=1;txt(kind.toUpperCase()+(kind==='belt'?(m[3]<0?' <<':' >>'):''),x0+m[1]+2,BZ0-14,c);}
  if(e.zone&&e.zone.x1!==undefined){const a=Math.min(e.zone.x0,e.zone.x1),b=Math.max(e.zone.x0,e.zone.x1);g.globalAlpha=.5;px(x0+a,BZ0-7,b-a,3,C.wh);g.globalAlpha=1;}
  edSec().forEach((f,j)=>{
    const at=entPos(f),sx=Math.max(3,Math.min(252,x0+at.x)),sel=j===e.sel,col=sel?C.wh:f[0]==='C'?C.yl:f[0]==='P'?C.cy:f[0]==='H'?C.gr:f[0]==='BOSS'?C.mg:(f[3]?C.yl:C.mg);
    px(sx-6,at.z-15,12,1,col);px(sx-6,at.z+1,12,1,col);px(sx-6,at.z-15,1,17,col);px(sx+5,at.z-15,1,17,col);if(sel){px(sx-7,at.z-16,14,1,col);px(sx-7,at.z+2,14,1,col);}
    if(x0+at.x<3)txt('<'+at.x,4,at.z-24,col);
    if(sel||e.tool==='select')txtS(entLabel(f),sx,at.z+4,col,1,'c');
  });
  const tool=(EDIT_TOOLS.find(t=>t[0]===e.tool)||['',''])[1];g.globalAlpha=.85;px(0,0,W,10,C.void);g.globalAlpha=1;
  txt('EDIT  LEVEL '+(e.stage+1)+'  SECTION '+(e.i+1)+'  ·  '+tool+(e.tool==='P'?' '+editProp.toUpperCase():''),128,2,C.yl,1,'c');
}
// mouse / touch on the game screen while editing
function edPoint(ev){const r=view.getBoundingClientRect();return{x:Math.round((ev.clientX-r.left)*W/r.width+bw.cam-edAbs().x0),z:clamp(Math.round((ev.clientY-r.top)*H/r.height),BZ0,BZ1)};}
function edPick(p){let best=-1,bd=1e9;edSec().forEach((f,j)=>{const at=entPos(f),dx=Math.abs(at.x-p.x),dz=Math.abs(at.z-7-p.z);if(dx<12&&dz<14&&dx+dz<bd){bd=dx+dz;best=j;}});return best;}
view.addEventListener('pointerdown',ev=>{
  const e=DEV.edit;if(!e)return;ev.preventDefault();ev.stopPropagation();const p=edPoint(ev),sec=edSec();
  if(e.tool==='select'||e.tool==='erase'){const j=edPick(p);
    if(e.tool==='erase'){if(j>=0&&sec[j][0]!=='BOSS'){edSnapshot();sec.splice(j,1);e.sel=-1;edChanged();}return;}
    e.sel=j;if(j>=0&&!entPos(sec[j]).fixed){edSnapshot();e.drag=true;try{view.setPointerCapture(ev.pointerId);}catch(err){}}devSync();return;}
  if(e.tool==='mud'||e.tool==='belt'){e.zone={x0:clamp(p.x,0,256)};try{view.setPointerCapture(ev.pointerId);}catch(err){}return;}
  edSnapshot();const x=clamp(p.x,-40,256),z=p.z,t=e.tool;
  sec.push(t==='C'?['C',x,z]:t==='P'?['P',editProp,x,z]:t==='H'?['H',x,z]:[t,x,z]);e.sel=sec.length-1;edChanged();
},true);
view.addEventListener('pointermove',ev=>{
  const e=DEV.edit;if(!e)return;const p=edPoint(ev);
  if(e.drag&&e.sel>=0){entMove(edSec()[e.sel],clamp(p.x,-40,256),p.z);rebuildSecs();edRespawn();}
  else if(e.zone)e.zone.x1=clamp(p.x,0,256);
});
view.addEventListener('pointerup',ev=>{
  const e=DEV.edit;if(!e)return;
  if(e.drag){e.drag=false;edChanged();}
  if(e.zone){const a=Math.min(e.zone.x0,e.zone.x1??e.zone.x0),b=Math.max(e.zone.x0,e.zone.x1??e.zone.x0);
    if(b-a>=8){edSnapshot();const st=STAGES[e.stage],k=e.tool;st[k]=st[k]||[];st[k].push(k==='belt'?[e.i,a,b,-1]:[e.i,a,b]);}
    e.zone=null;edChanged();}
});
addEventListener('keydown',ev=>{
  const e=DEV.edit;if(!e||(ev.target&&ev.target.closest&&ev.target.closest('input,select,textarea')))return;
  if((ev.code==='Delete'||ev.code==='Backspace')&&e.sel>=0&&edSec()[e.sel][0]!=='BOSS'){ev.preventDefault();edSnapshot();edSec().splice(e.sel,1);e.sel=-1;edChanged();}
  else if((ev.ctrlKey||ev.metaKey)&&ev.code==='KeyZ'){ev.preventDefault();edUndo();}
});
function devEditorHtml(){
  const e=DEV.edit,opt=(list,val,label)=>list.map(v=>'<option value="'+esc(v)+'"'+(v===val?' selected':'')+'>'+esc(label(v))+'</option>').join('');
  if(!e)return '<h3>LEVEL EDITOR</h3><div class="dev-row dev-btns"><button data-act="edit">EDIT THE SECTION ABOVE</button></div>';
  const sec=edSec(),selF=e.sel>=0?sec[e.sel]:null,bossF=sec.find(f=>f[0]==='BOSS'),robot=selF&&TYPES[selF[0]]&&selF[0]!=='BOSS';
  return '<h3>LEVEL EDITOR · L'+(e.stage+1)+' S'+(e.i+1)+'</h3>'+
    '<div class="dev-row dev-btns"><button data-act="edprev">◀ SECTION</button><button data-act="ednext">SECTION ▶</button><button data-act="edundo"'+(e.undo.length?'':' disabled')+'>UNDO</button><button data-act="edplay">PLAY-TEST</button><button data-act="edstop">DONE</button></div>'+
    '<div class="dev-tools">'+EDIT_TOOLS.map(([k,n])=>'<button data-act="tool" data-tool="'+k+'"'+(e.tool===k?' class="on"':'')+'>'+n+'</button>').join('')+'</div>'+
    '<div class="dev-grid"><label for="edProp">PROP KIND</label><select id="edProp">'+opt(Object.keys(PROPS),editProp,k=>k.toUpperCase())+'</select>'+
    (bossF?'<label for="edBoss">BOSS</label><select id="edBoss">'+opt(Object.keys(TYPES).filter(t=>NB[t]||['matry','warden','maker'].includes(t)),bossF[1],t=>TYPES[t].name)+'</select>':'')+'</div>'+
    '<div class="dev-row dev-btns">'+(robot?'<button data-act="edmini">'+(selF[3]?'MAKE NORMAL':'MAKE MINI-BOSS')+'</button>':'')+(selF&&selF[0]!=='BOSS'?'<button data-act="eddel">DELETE SELECTED</button>':'')+'<button data-act="edzones">CLEAR ZONES HERE</button></div>'+
    '<p class="dev-hint">Click the game to place the tool; SELECT drags; Delete removes; Ctrl+Z undoes. Zones: drag across the floor. '+sec.length+' spawns in this section.</p>'+
    '<div class="dev-row dev-btns">'+(DEV.server?'<button data-act="edsave">SAVE levels.js</button>':'')+'<button data-act="edcopy">COPY levels.js</button><button data-act="eddownload">DOWNLOAD</button></div>';
}
async function devEditorAct(act,b){
  const e=DEV.edit;
  if(act==='edit'){editStart();return true;}
  if(!e&&!['edsave','edcopy','eddownload'].includes(act))return false;
  if(act==='edprev'||act==='ednext')editGo(act==='ednext'?1:-1);
  else if(act==='edundo')edUndo();
  else if(act==='edplay')editStop(true);
  else if(act==='edstop')editStop(false);
  else if(act==='tool'){e.tool=b.dataset.tool;e.sel=-1;devSync();}
  else if(act==='edmini'){const f=edSec()[e.sel];edSnapshot();if(f[3])f.length=3;else f[3]=1;edChanged();}
  else if(act==='eddel'){edSnapshot();edSec().splice(e.sel,1);e.sel=-1;edChanged();}
  else if(act==='edzones'){edSnapshot();const st=STAGES[e.stage];for(const k of ['mud','belt'])if(st[k])st[k]=st[k].filter(m=>m[0]!==e.i);edChanged();}
  else if(act==='edsave'){try{await devSave('src/levels.js',levelsText(STAGES));devMsg='Saved to src/levels.js.';}catch(err){devMsg='Save failed: '+err.message;}devSync();}
  else if(act==='edcopy'){try{await navigator.clipboard.writeText(levelsText(STAGES));devMsg='levels.js copied.';}catch(err){devMsg='Copy failed: use DOWNLOAD.';}devSync();}
  else if(act==='eddownload'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([levelsText(STAGES)],{type:'text/javascript'}));a.download='levels.js';document.body.append(a);a.click();a.remove();devMsg='levels.js downloaded: put it in src/.';devSync();}
  else return false;
  return true;
}

// the local dev server answers /api/ping; on the live site (or a file) there is none
async function devPing(){try{const r=await fetch('/api/ping',{cache:'no-store'});DEV.server=r.ok&&(await r.json()).hardcore===true;}catch(e){DEV.server=false;}
  // with the server the file is the truth: read it fresh (it may be newer than this page) and drop browser-kept tweaks
  if(DEV.server){try{feelSrc=await devLoad('src/feel.js');localStorage.removeItem('hc-feel');localStorage.removeItem('hc-levels');}catch(e){}}
  devSync();}
async function devLoad(p){const r=await fetch('/api/file?path='+encodeURIComponent(p),{cache:'no-store'});if(!r.ok)throw new Error(await r.text());return r.text();}
async function devSave(p,content){if(!DEV.server)throw new Error('no dev server');const r=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:p,content})});if(!r.ok)throw new Error(await r.text());return true;}
function devWatch(){try{const es=new EventSource('/api/events');es.onmessage=e=>{if(e.data==='reload')location.reload();};}catch(e){}}
// browser-kept tweaks only apply in dev mode (a player who once opened dev mode keeps the normal game)
if(DEV.on&&!window.HC_DEVSERVER){feelRestore();levelsRestore();}
devSync();
if(location.protocol.startsWith('http')){devPing();if(window.HC_DEVSERVER)devWatch();}
