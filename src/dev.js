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
    devSceneHtml()+
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
  html+='<p class="dev-hint">` (backquote) turns dev mode on/off. The level editor comes next.</p>';
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
  if(act==='reset'){const l=leafById(b.dataset.id);if(l)leafSet(l,FEEL_DEFAULT[b.dataset.id]);feelStore();devSync();}
  else if(act==='resetall'){for(const l of feelLeaves())leafSet(l,FEEL_DEFAULT[leafId(l)]);feelStore();devMsg='All values back to the file.';devSync();}
  else if(act==='copy'){try{await navigator.clipboard.writeText(devFeelText());devMsg='feel.js copied.';}catch(err){devMsg='Copy failed: use DOWNLOAD.';}devSync();}
  else if(act==='download'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([devFeelText()],{type:'text/javascript'}));a.download='feel.js';document.body.append(a);a.click();a.remove();devMsg='feel.js downloaded: put it in src/.';devSync();}
  else if(act==='save'){try{const text=devFeelText();await devSave('src/feel.js',text);feelSrc=text;for(const l of feelLeaves())FEEL_DEFAULT[leafId(l)]=leafGet(l);try{localStorage.removeItem('hc-feel');}catch(err){}devMsg='Saved to src/feel.js.';}catch(err){devMsg='Save failed: '+err.message;}devSync();}
}

// the local dev server answers /api/ping; on the live site (or a file) there is none
async function devPing(){try{const r=await fetch('/api/ping',{cache:'no-store'});DEV.server=r.ok&&(await r.json()).hardcore===true;}catch(e){DEV.server=false;}
  // with the server the file is the truth: read it fresh (it may be newer than this page) and drop browser-kept tweaks
  if(DEV.server){try{feelSrc=await devLoad('src/feel.js');localStorage.removeItem('hc-feel');}catch(e){}}
  devSync();}
async function devLoad(p){const r=await fetch('/api/file?path='+encodeURIComponent(p),{cache:'no-store'});if(!r.ok)throw new Error(await r.text());return r.text();}
async function devSave(p,content){if(!DEV.server)throw new Error('no dev server');const r=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:p,content})});if(!r.ok)throw new Error(await r.text());return true;}
function devWatch(){try{const es=new EventSource('/api/events');es.onmessage=e=>{if(e.data==='reload')location.reload();};}catch(e){}}
// browser-kept tweaks only apply in dev mode (a player who once opened dev mode keeps the normal game)
if(DEV.on&&!window.HC_DEVSERVER)feelRestore();
devSync();
if(location.protocol.startsWith('http')){devPing();if(window.HC_DEVSERVER)devWatch();}
