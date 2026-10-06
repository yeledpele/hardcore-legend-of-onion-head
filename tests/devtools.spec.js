// Dev tools step 2: dev mode (?dev=1 / the ` key) and the local dev server (npm run dev).
// The server tests run it on a temporary copy of src/, so they never touch the real files.
const {test,expect}=require('@playwright/test');
const fs=require('fs'),os=require('os'),path=require('path'),http=require('http'),{spawn}=require('child_process');
const {URL:GAME,open}=require('./helpers');
const ROOT=path.join(__dirname,'..');
test('dev mode is off by default, on with ?dev=1, and the ` key toggles it',async({page})=>{
  await open(page);expect(await page.locator('#devBtn').isHidden()).toBe(true);
  await page.goto(GAME+'?dev=1');await page.waitForTimeout(300);
  await expect(page.locator('#devBtn')).toBeVisible();
  await page.click('#devBtn');await expect(page.locator('#devPanel')).toBeVisible();
  await expect(page.locator('#devPanel')).toContainText('NO DEV SERVER');
  await page.keyboard.press('Backquote');await page.waitForTimeout(150);
  expect(await page.locator('#devBtn').isHidden()).toBe(true);expect(await page.locator('#devPanel').isHidden()).toBe(true);
});
test.describe('the dev server',()=>{
  let tmp,proc,base;
  test.beforeAll(async()=>{
    tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hc-dev-'));fs.cpSync(path.join(ROOT,'src'),path.join(tmp,'src'),{recursive:true});
    const port=5800+Math.floor(Math.random()*800);base='http://localhost:'+port;
    proc=spawn(process.execPath,[path.join(ROOT,'dev-server.js')],{env:{...process.env,HC_ROOT:tmp,PORT:String(port)}});
    await new Promise((ok,bad)=>{proc.stdout.on('data',d=>{if(String(d).includes('dev server'))ok();});proc.on('exit',c=>bad(new Error('server exited '+c)));setTimeout(()=>bad(new Error('server did not start')),8000);});
  });
  test.afterAll(()=>{try{proc.kill();}catch(e){}try{fs.rmSync(tmp,{recursive:true,force:true});}catch(e){}});
  const req=(p,{method='GET',body,host}={})=>new Promise((ok,bad)=>{const u=new URL(base+p);
    const r=http.request({hostname:'127.0.0.1',port:u.port,path:u.pathname+u.search,method,headers:{Host:host||u.host,'Content-Type':'application/json'}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>ok({status:res.statusCode,body:d}));});
    r.on('error',bad);if(body)r.write(JSON.stringify(body));r.end();});
  test('serves the game from src, reads and saves only the allowed files, only for this computer',async()=>{
    let r=await req('/');expect(r.status).toBe(200);expect(r.body).toContain('HC_DEVSERVER');expect(r.body).toContain('const FEEL=');
    r=await req('/api/ping');expect(JSON.parse(r.body).hardcore).toBe(true);
    r=await req('/api/file?path=src/feel.js');expect(r.body).toBe(fs.readFileSync(path.join(tmp,'src/feel.js'),'utf8'));
    r=await req('/api/save',{method:'POST',body:{path:'src/feel.js',content:'// saved by the test\n'}});expect(r.status).toBe(200);
    expect(fs.readFileSync(path.join(tmp,'src/feel.js'),'utf8')).toBe('// saved by the test\n');
    for(const p of ['src/game.js','../package.json','src/../package.json'])expect((await req('/api/save',{method:'POST',body:{path:p,content:'x'}})).status,p).toBe(403);
    expect((await req('/api/file?path=src/game.js')).status).toBe(403);
    expect((await req('/',{host:'evil.example.com'})).status).toBe(403);
    fs.cpSync(path.join(ROOT,'src/feel.js'),path.join(tmp,'src/feel.js'));
  });
  test('the page knows it has the server, and reloads when a source file changes',async({page})=>{
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));
    await page.goto(base+'/');await page.waitForTimeout(800);
    await expect(page.locator('#devBtn')).toBeVisible();await page.click('#devBtn');
    await expect(page.locator('#devPanel')).toContainText('LOCAL DEV SERVER');
    await page.evaluate(()=>{window.__marker=1;});
    fs.appendFileSync(path.join(tmp,'src/style.css'),'\n/* touched by the test */\n');
    await expect.poll(()=>page.evaluate(()=>window.__marker),{timeout:8000}).toBeUndefined();
    expect(errors).toEqual([]);
  });
});
