// ---------- dev mode: ?dev=1, the ` key, or served by `npm run dev` ----------
// Shows a DEV button that opens the dev panel. With the local dev server, the tools can save project files
// (src/feel.js, src/levels.js) and the page reloads when a source file changes; on the live site, nothing is saved to files.
const DEV={on:false,server:false,open:false};
try{DEV.on=new URLSearchParams(location.search).get('dev')==='1'||localStorage.getItem('hc-dev')==='1';}catch(e){}
if(window.HC_DEVSERVER)DEV.on=true;
let devBtn=null,devPanel=null;
function devSet(on){DEV.on=on;if(!on)DEV.open=false;try{localStorage.setItem('hc-dev',on?'1':'0');}catch(e){}devSync();}
function devSync(){
  if(!devBtn){
    devBtn=document.createElement('button');devBtn.id='devBtn';devBtn.type='button';devBtn.textContent='DEV';devBtn.setAttribute('aria-label','Dev tools');
    devBtn.addEventListener('click',()=>{DEV.open=!DEV.open;devSync();});
    devPanel=document.createElement('div');devPanel.id='devPanel';devPanel.setAttribute('role','dialog');devPanel.setAttribute('aria-label','Dev tools');
    document.body.append(devBtn,devPanel);
  }
  devBtn.hidden=!DEV.on;devPanel.hidden=!(DEV.on&&DEV.open);devBtn.classList.toggle('on',DEV.open);
  devPanel.innerHTML='<h2>DEV TOOLS</h2>'+
    '<p class="dev-status '+(DEV.server?'ok':'off')+'">'+(DEV.server?'LOCAL DEV SERVER: changes save to project files; the page reloads when a source file changes.':'NO DEV SERVER: changes stay in this browser. Run <code>npm run dev</code> to save to files.')+'</p>'+
    '<p class="dev-hint">` (backquote) turns dev mode on/off. Tweak panel, debug layer, jump to scene and the level editor come next.</p>';
}
// the local dev server answers /api/ping; on the live site (or a file) there is none
async function devPing(){try{const r=await fetch('/api/ping',{cache:'no-store'});DEV.server=r.ok&&(await r.json()).hardcore===true;}catch(e){DEV.server=false;}devSync();}
async function devLoad(p){const r=await fetch('/api/file?path='+encodeURIComponent(p),{cache:'no-store'});if(!r.ok)throw new Error(await r.text());return r.text();}
async function devSave(p,content){if(!DEV.server)throw new Error('no dev server');const r=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:p,content})});if(!r.ok)throw new Error(await r.text());return true;}
function devWatch(){try{const es=new EventSource('/api/events');es.onmessage=e=>{if(e.data==='reload')location.reload();};}catch(e){}}
devSync();
if(location.protocol.startsWith('http')){devPing();if(window.HC_DEVSERVER)devWatch();}
