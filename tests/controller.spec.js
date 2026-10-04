// Controller support, with a simulated standard-mapping gamepad (window.__pad.b[i] = pressed, window.__pad.ax = [x,y]).
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign,snap}=require('./helpers');
const FAKE=()=>{
  window.__pad={b:Array(17).fill(false),ax:[0,0],rumbles:[]};
  const pad={id:'Test pad',index:0,connected:true,mapping:'standard',
    get buttons(){return window.__pad.b.map(p=>({pressed:p,value:p?1:0}));},get axes(){return window.__pad.ax.concat([0,0]);},
    vibrationActuator:{playEffect:(type,o)=>{window.__pad.rumbles.push(o);return Promise.resolve('complete');}}};
  Navigator.prototype.getGamepads=function(){return [pad,null,null,null];};
};
const hold=async(page,i,ms=60)=>{await page.evaluate(i=>{window.__pad.b[i]=true;},i);await page.waitForTimeout(ms);await page.evaluate(i=>{window.__pad.b[i]=false;},i);};
test('a controller starts the game, moves, jumps (A or B), attacks (X), fires the special (triggers) and climbs in / ejects (Y, shoulders)',async({page})=>{
  await page.addInitScript(FAKE);const errors=await open(page);
  await hold(page,9);await page.waitForTimeout(300);await hold(page,9);await page.waitForTimeout(800);
  expect(await page.evaluate(()=>window.__t.state())).toBe('brawl');
  await page.evaluate(()=>window.__t.dummy('basic'));await page.waitForTimeout(100);
  const x0=(await snap(page)).px;await page.evaluate(()=>{window.__pad.ax=[-1,0];});await page.waitForTimeout(400);await page.evaluate(()=>{window.__pad.ax=[0,0];});
  expect((await snap(page)).px).toBeLessThan(x0-5);
  for(const btn of [0,1]){await page.evaluate(()=>window.__t.dummy('basic'));await page.waitForTimeout(150);
    await hold(page,btn,120);expect((await snap(page)).ph,'button '+btn+' jumps').toBeGreaterThan(3);await page.waitForTimeout(900);}
  await page.evaluate(()=>window.__t.dummy('basic'));await page.waitForTimeout(150);await hold(page,2);await page.waitForTimeout(30);
  expect((await snap(page)).kind).toBe('melee');await page.waitForTimeout(600);
  // the special spends POWER (the Basic's punch special can end within a frame or two, so check the cost, not the move)
  await page.evaluate(()=>window.__t.dummy('basic'));await page.waitForTimeout(150);await hold(page,7);await page.waitForTimeout(30);
  expect((await snap(page)).pow).toBeLessThan(80);
  // Y climbs into a bigger empty body next to you; a shoulder button ejects
  await page.waitForTimeout(800);await page.evaluate(()=>{window.__t.dummy('basic');window.__t.clearHusks();window.__t.husk('e:brute');});await page.waitForTimeout(150);
  await hold(page,3);await page.waitForTimeout(300);expect((await snap(page)).layers).toEqual(['e:brute']);
  await page.evaluate(()=>window.__t.clearHusks());await page.waitForTimeout(100);await hold(page,4);await page.waitForTimeout(300);expect((await snap(page)).layers).toEqual([]);
  expect(errors).toEqual([]);
});
test('connecting shows a message, big hits rumble the pad, keyboard play stops the rumble',async({page})=>{
  await page.addInitScript(FAKE);const errors=await open(page);
  await page.evaluate(()=>dispatchEvent(new Event('gamepadconnected')));await page.waitForTimeout(100);
  expect(await page.evaluate(()=>window.__t.toast())).toBe('CONTROLLER CONNECTED');
  await hold(page,9);await page.waitForTimeout(200);
  await page.evaluate(()=>window.__t.kick(6));await page.waitForTimeout(50);
  expect(await page.evaluate(()=>window.__pad.rumbles.length)).toBeGreaterThan(0);
  await page.evaluate(()=>window.__t.kick(1));await page.waitForTimeout(100);const n=await page.evaluate(()=>window.__pad.rumbles.length);
  await page.evaluate(()=>window.__t.kick(1));expect(await page.evaluate(()=>window.__pad.rumbles.length)).toBe(n); // small shakes don't rumble
  await press(page,'ArrowLeft');await page.waitForTimeout(100);await page.evaluate(()=>window.__t.kick(8));
  expect(await page.evaluate(()=>window.__pad.rumbles.length)).toBe(n); // playing on the keyboard: no rumble
  expect(errors).toEqual([]);
});
test('Space jumps in the campaign',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>window.__t.dummy('basic'));await page.waitForTimeout(150);
  await press(page,'Space',120);expect((await snap(page)).ph).toBeGreaterThan(3);expect(errors).toEqual([]);
});
