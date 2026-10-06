// npm run dev: serves the game straight from src/ (no build step), reloads open pages when a source file changes,
// and lets the dev tools read and save a short list of project files. Listens on this computer only (127.0.0.1).
// Built on Node's own http module; nothing to install.
const http=require('http'),fs=require('fs'),path=require('path'),{assemble}=require('./build');
const ROOT=path.resolve(process.env.HC_ROOT||__dirname),PORT=+(process.env.PORT||5173);
// the only files the tools may read or write
const SAVABLE=['src/feel.js','src/levels.js'];
const clients=new Set(),savedAt={};
const send=(res,code,body,type='text/plain')=>{res.writeHead(code,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store'});res.end(body);};
// only pages from this server, on this computer (blocks other sites and DNS rebinding)
const localHost=h=>/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(h||'');
const sameOrigin=req=>!req.headers.origin||localHost(req.headers.origin.replace(/^https?:\/\//,''));
const server=http.createServer((req,res)=>{
  if(!localHost(req.headers.host))return send(res,403,'forbidden host');
  const u=new URL(req.url,'http://localhost');
  if(req.method==='GET'&&(u.pathname==='/'||u.pathname==='/index.html')){
    try{send(res,200,assemble(ROOT,{dev:true}),'text/html');}catch(e){send(res,500,'build error: '+e.message);}return;}
  if(u.pathname==='/api/ping')return send(res,200,JSON.stringify({hardcore:true,savable:SAVABLE}),'application/json');
  if(u.pathname==='/api/events'){
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store',Connection:'keep-alive'});res.write(':ok\n\n');
    clients.add(res);req.on('close',()=>clients.delete(res));return;}
  if(u.pathname==='/api/file'&&req.method==='GET'){
    const p=u.searchParams.get('path');if(!SAVABLE.includes(p))return send(res,403,'not allowed: '+p);
    fs.readFile(path.join(ROOT,p),'utf8',(e,d)=>e?send(res,404,'missing: '+p):send(res,200,d));return;}
  if(u.pathname==='/api/save'&&req.method==='POST'){
    if(!sameOrigin(req))return send(res,403,'forbidden origin');
    let body='';req.on('data',c=>{body+=c;if(body.length>2e6)req.destroy();});
    req.on('end',()=>{try{const {path:p,content}=JSON.parse(body);
      if(!SAVABLE.includes(p)||typeof content!=='string')return send(res,403,'not allowed: '+p);
      savedAt[p.replace(/\//g,path.sep)]=Date.now();fs.writeFileSync(path.join(ROOT,p),content);console.log('saved',p);send(res,200,'ok');}
      catch(e){send(res,400,'bad request: '+e.message);}});
    return;}
  send(res,404,'not found');
});
// reload open pages when a source file changes; a file the tools just saved doesn't reload (its values are already live)
let timer=null;
fs.watch(path.join(ROOT,'src'),{recursive:true},(ev,file)=>{
  if(!file)return;const rel=path.join('src',file);if(Date.now()-(savedAt[rel]||0)<1500)return;
  clearTimeout(timer);timer=setTimeout(()=>{for(const c of clients)c.write('data: reload\n\n');console.log('changed',rel,'- reloading',clients.size,'page(s)');},150);
});
server.listen(PORT,'127.0.0.1',()=>console.log('HARDCORE dev server: http://localhost:'+PORT+'/  (serving '+path.join(ROOT,'src')+', Ctrl+C to stop)'));
