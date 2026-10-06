// Dev tools step 2: dev mode (?dev=1 / the ` key) and the local dev server (npm run dev).
// The server tests run it on a temporary copy of src/, so they never touch the real files.
const {test,expect}=require('@playwright/test');
const fs=require('fs'),os=require('os'),path=require('path'),http=require('http'),{spawn}=require('child_process');
const {URL:GAME,open}=require('./helpers');
const ROOT=path.join(__dirname,'..');
test('dev mode stays locked until IDDQD, then ?dev=1 and the ` key work',async({page})=>{
  await open(page);expect(await page.locator('#devBtn').isHidden()).toBe(true);
  await page.goto(GAME+'?dev=1');await page.waitForTimeout(300);expect(await page.locator('#devBtn').isHidden()).toBe(true);   // locked
  await page.keyboard.press('Backquote');await page.waitForTimeout(100);expect(await page.locator('#devBtn').isHidden()).toBe(true);
  for(const k of ['KeyI','KeyD','KeyD','KeyQ','KeyD']){await page.keyboard.press(k);await page.waitForTimeout(30);}
  await expect(page.locator('#devBtn')).toBeVisible();expect(await page.evaluate(()=>window.__t.toast())).toBe('DEV MODE UNLOCKED');
  await page.keyboard.press('Backquote');await page.waitForTimeout(100);expect(await page.locator('#devBtn').isHidden()).toBe(true);
  await page.goto(GAME+'?dev=1');await page.waitForTimeout(300);                                                               // remembered
  await expect(page.locator('#devBtn')).toBeVisible();
  await page.click('#devBtn');await expect(page.locator('#devPanel')).toBeVisible();
  await expect(page.locator('#devPanel')).toContainText('NO DEV SERVER');
  await page.keyboard.press('Backquote');await page.waitForTimeout(150);
  expect(await page.locator('#devBtn').isHidden()).toBe(true);expect(await page.locator('#devPanel').isHidden()).toBe(true);
});
test('tweak panel: a value changes the game live, survives a reload in dev mode, resets, and exports a feel.js with comments',async({page})=>{
  const errors=await open(page);await page.evaluate(()=>localStorage.setItem('hc-devok','1'));await page.goto(GAME+'?dev=1');await page.waitForTimeout(300);
  await page.click('#devBtn');await page.fill('#devFilter','jumpCore');await page.waitForTimeout(100);
  const num=page.locator('#devPanel input[type=number][data-id="player.jumpCore"]');await expect(num).toBeVisible();
  await expect(page.locator('#devPanel')).toContainText('jump speed of the bare core');                  // the comment from feel.js
  await num.fill('5.5');await page.waitForTimeout(100);
  expect((await page.evaluate(()=>window.__t.feel())).player.jumpCore).toBe(5.5);                        // live
  await num.press('Enter');await num.press('KeyX');await page.waitForTimeout(150);                    // typing doesn't drive the game
  expect(await page.evaluate(()=>window.__t.state())).toBe('title');
  const text=await page.evaluate(()=>window.__t.devFeelText());
  expect(text).toMatch(/jumpCore: 5\.5,\s+\/\/ jump speed of the bare core/);expect(text).toContain('const FEEL={');
  expect(new Function(text+'\nreturn FEEL;')().player.jumpCore).toBe(5.5);                                // still a valid feel.js
  await page.reload();await page.waitForTimeout(300);
  expect((await page.evaluate(()=>window.__t.feel())).player.jumpCore).toBe(5.5);                        // kept in this browser
  await page.click('#devBtn');await page.click('#devPanel button[data-act=resetall]');
  expect((await page.evaluate(()=>window.__t.feel())).player.jumpCore).toBe(3.9);
  await page.goto(GAME);await page.waitForTimeout(300);                                                   // without dev mode, tweaks never apply
  await page.evaluate(()=>{localStorage.setItem('hc-feel',JSON.stringify({'player.jumpCore':9}));localStorage.setItem('hc-dev','0');});
  await page.reload();await page.waitForTimeout(300);expect((await page.evaluate(()=>window.__t.feel())).player.jumpCore).toBe(3.9);
  expect(errors).toEqual([]);
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
    // SAVE writes the tweak into src/feel.js (comments kept) and doesn't reload the page
    await page.evaluate(()=>{window.__marker=1;});
    await page.fill('#devFilter','gravityUp');await page.locator('#devPanel input[type=number][data-id="player.gravityUp"]').fill('0.25');
    await page.click('#devPanel button[data-act=save]');await expect(page.locator('#devPanel')).toContainText('Saved to src/feel.js');
    const saved=fs.readFileSync(path.join(tmp,'src/feel.js'),'utf8');expect(saved).toMatch(/gravityUp: 0\.25,\s+\/\/ gravity while rising/);
    await page.waitForTimeout(2000);expect(await page.evaluate(()=>window.__marker)).toBe(1);
    // the level editor saves src/levels.js the same way
    await page.fill('#devFilter','');await page.click('#devPanel button[data-act=edit]');await page.click('#devPanel button[data-tool=C]');
    const r=await page.locator('#view').boundingBox();await page.mouse.click(r.x+r.width*180/256,r.y+r.height*125/144);
    await page.click('#devPanel button[data-act=edsave]');await expect(page.locator('#devPanel')).toContainText('Saved to src/levels.js');
    const lv=fs.readFileSync(path.join(tmp,'src/levels.js'),'utf8');const street=new Function(lv+';return STREET;')();expect(street.flatMap(s=>s.secs).flat().some(f=>f[0]==='C'&&Math.abs(f[1]-180)<3)).toBe(true);
    await page.click('#devPanel button[data-act=edstop]');
    fs.appendFileSync(path.join(tmp,'src/style.css'),'\n/* touched by the test */\n');
    await expect.poll(()=>page.evaluate(()=>window.__marker),{timeout:8000}).toBeUndefined();
    expect(errors).toEqual([]);
  });
});
test('jump to scene: from the title straight to the Hermit Crab, nested, invincible, full power',async({page})=>{
  const errors=await open(page);await page.evaluate(()=>localStorage.setItem('hc-devok','1'));await page.goto(GAME+'?dev=1');await page.waitForTimeout(300);
  await page.click('#devBtn');
  await page.selectOption('#devLevel',{value:'3'});await page.selectOption('#devSec',{value:'4'});
  await expect(page.locator('#devSec')).toContainText('BOSS: THE HERMIT CRAB');
  await page.selectOption('#devBody','e:brute');await page.selectOption('#devInner','basic');await page.selectOption('#devWeapon','magnet');
  await page.check('#devGod');await page.click('#devPanel button[data-act=goto]');await page.waitForTimeout(300);
  expect(await page.evaluate(()=>window.__t.state())).toBe('brawl');
  expect((await page.evaluate(()=>window.__t.boss())).type).toBe('crab');
  const s=await page.evaluate(()=>window.__t.snap());expect(s.layers).toEqual(['basic','e:brute']);expect(s.special).toBe('magnet');expect(s.pow).toBe(100);
  const g0=await page.evaluate(()=>window.__t.guardState());await page.evaluate(()=>{window.__t.noInv();window.__t.hurtFrom(20,-10);});
  expect((await page.evaluate(()=>window.__t.guardState())).shell).toBe(g0.shell);                     // invincible
  await page.reload();await page.waitForTimeout(300);await page.click('#devBtn');                        // choices remembered
  expect(await page.inputValue('#devLevel')).toBe('3');expect(await page.inputValue('#devBody')).toBe('e:brute');
  expect(errors).toEqual([]);
});
test('levels.js round-trips: the editor writes back exactly the file the game loads',async({page})=>{
  await open(page);const text=await page.evaluate(()=>window.__t.levelsText());
  expect(text).toBe(fs.readFileSync(path.join(ROOT,'src/levels.js'),'utf8').split('\r\n').join('\n'));
});
// clicks on the game screen at game coordinates (x from the section's left edge, z = depth)
const at=async(page,x,z)=>{const r=await page.locator('#view').boundingBox();return {x:r.x+x*r.width/256,y:r.y+z*r.height/144};};
test('level editor: place, drag, delete, undo, zones, props, play-test',async({page})=>{
  await page.setViewportSize({width:1700,height:900});
  const errors=await open(page);await page.evaluate(()=>localStorage.setItem('hc-devok','1'));await page.goto(GAME+'?dev=1');await page.waitForTimeout(300);await page.click('#devBtn');
  await page.selectOption('#devLevel',{value:'0'});await page.selectOption('#devSec',{value:'0'});
  await page.click('#devPanel button[data-act=edit]');await page.waitForTimeout(200);
  expect(await page.evaluate(()=>window.__t.edit())).toMatchObject({stage:0,i:0});
  const t0=await page.evaluate(()=>window.__t.bwT());await page.waitForTimeout(300);expect(await page.evaluate(()=>window.__t.bwT())).toBe(t0); // frozen
  const n0=(await page.evaluate(()=>window.__t.secData(0))).length;
  await page.click('#devPanel button[data-tool=brute]');let p=await at(page,150,126);await page.mouse.click(p.x,p.y);
  let sec=await page.evaluate(()=>window.__t.secData(0));expect(sec.length).toBe(n0+1);expect(sec[n0][0]).toBe('brute');expect(Math.abs(sec[n0][1]-150)).toBeLessThan(3);
  await page.click('#devPanel button[data-tool=select]');p=await at(page,150,120);const q=await at(page,100,130);
  await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(q.x,q.y,{steps:4});await page.mouse.up();
  sec=await page.evaluate(()=>window.__t.secData(0));expect(Math.abs(sec[n0][1]-100)).toBeLessThan(3);           // dragged
  await page.keyboard.press('Delete');expect((await page.evaluate(()=>window.__t.secData(0))).length).toBe(n0);    // deleted
  await page.keyboard.press('Control+KeyZ');expect((await page.evaluate(()=>window.__t.secData(0))).length).toBe(n0+1); // undone
  await page.click('#devPanel button[data-tool=mud]');p=await at(page,40,135);const p2=await at(page,120,135);
  await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p2.x,p2.y,{steps:4});await page.mouse.up();
  const mud=(await page.evaluate(()=>window.__t.stageData(0))).mud;expect(mud.some(m=>m[0]===0&&Math.abs(m[1]-40)<3&&Math.abs(m[2]-120)<3)).toBe(true);
  await page.selectOption('#edProp','car');await page.click('#devPanel button[data-tool=P]');p=await at(page,200,118);await page.mouse.click(p.x,p.y);
  const props=(await page.evaluate(()=>window.__t.snap())).props;expect(props.map(x=>x[2])).toEqual(['car']);     // its own prop turns the random ones off
  await page.click('#devPanel button[data-act=edplay]');await page.waitForTimeout(400);
  expect(await page.evaluate(()=>window.__t.edit())).toBeNull();
  const t1=await page.evaluate(()=>window.__t.bwT());await page.waitForTimeout(300);expect(await page.evaluate(()=>window.__t.bwT())).toBeGreaterThan(t1);
  expect((await page.evaluate(()=>window.__t.snap())).foes.length).toBe(n0+1);
  expect(errors).toEqual([]);
});
