// Boss revisions: the Toad King is a jelly cube you beat from the inside; the Crane freezes what it catches;
// the Crane drops the MAGNET power (special = push, every 3rd combo hit = pull).
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign,snap}=require('./helpers');
const at=async(page,stage,sec,body)=>{const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(([st,sc,bd])=>{window.__t.goto(st*5+sc);if(bd)window.__t.body(bd);},[stage,sec,body]);await page.waitForTimeout(300);return errors;};
const hp=page=>page.evaluate(()=>window.__t.boss().hp);
test('Toad King: outside hits barely hurt; inside, the nucleus takes real damage',async({page})=>{
  const errors=await at(page,5,4,['e:brute']);
  await page.evaluate(()=>{window.__t.nearBoss(-34,0);window.__t.bossState('dazed',9999);});await page.waitForTimeout(100);
  let h0=await hp(page);for(let i=0;i<6;i++){await press(page,'ArrowRight',10);await press(page,'KeyX');await page.waitForTimeout(220);}
  const outside=h0-await hp(page);expect(outside).toBeLessThan(8);
  await page.evaluate(()=>{window.__t.nearBoss(-10,0);window.__t.bossState('slide',200);});await page.waitForTimeout(400);
  expect(await page.evaluate(()=>window.__t.inside())).toBe(true);
  h0=await hp(page);for(let i=0;i<6;i++){await press(page,'KeyX');await page.waitForTimeout(220);}
  expect(h0-await hp(page)).toBeGreaterThan(Math.max(20,outside*3));
  expect(errors).toEqual([]);
});
test('Toad King: inside, it digests your bodies one by one, then spits out the bare core',async({page})=>{
  const errors=await at(page,5,4,['basic','e:brute']);
  await page.evaluate(()=>window.__t.setFeel('bosses','toadDigestEvery',25));
  await page.evaluate(()=>{window.__t.nearBoss(-10,0);window.__t.bossState('slide',200);});await page.waitForTimeout(250);
  expect(await page.evaluate(()=>window.__t.inside())).toBe(true);
  for(let i=0;i<40&&await page.evaluate(()=>window.__t.inside());i++)await page.waitForTimeout(100);
  expect(await page.evaluate(()=>window.__t.inside())).toBe(false);
  expect((await snap(page)).layers).toEqual([]);
  expect(errors).toEqual([]);
});
test('Crane: the magnet freezes you to it; mashing breaks free, otherwise it slams you down',async({page})=>{
  const errors=await at(page,4,4,['e:brute']);
  const catchMe=async()=>{await page.evaluate(()=>{window.__t.nearBoss(0,0);window.__t.bossState('lwind',3);});await page.waitForTimeout(200);};
  await catchMe();expect(await page.evaluate(()=>window.__t.frozen())).toBe(true);
  for(let i=0;i<12;i++){await press(page,'KeyX',20);await page.waitForTimeout(40);}
  expect(await page.evaluate(()=>window.__t.frozen())).toBe(false);
  await page.waitForTimeout(1200);await page.evaluate(()=>window.__t.heal());
  await catchMe();expect(await page.evaluate(()=>window.__t.frozen())).toBe(true);
  for(let i=0;i<60&&await page.evaluate(()=>window.__t.frozen());i++)await page.waitForTimeout(100);
  expect(await page.evaluate(()=>window.__t.boss().st)).toBe('stuck');
  expect(errors).toEqual([]);
});
test('MAGNET power: the special pushes robots away, every 3rd combo hit pulls one in',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>window.__t.dummy('e:brute','magnet'));await page.waitForTimeout(100);
  expect((await snap(page)).special).toBe('magnet');
  const x0=await page.evaluate(()=>window.__t.foeX());const h0=await page.evaluate(()=>window.__t.dummyHp());
  await press(page,'KeyC');await page.waitForTimeout(450); // check before the robot walks back
  expect(await page.evaluate(()=>window.__t.foeX())).toBeGreaterThan(x0+15);
  expect(await page.evaluate(()=>window.__t.dummyHp())).toBeLessThan(h0);
  await page.evaluate(()=>window.__t.moveFoe(95));await page.waitForTimeout(100);
  for(let i=0;i<6;i++){await press(page,'KeyX',30);await page.waitForTimeout(70);} // mash: presses during a hit chain the combo
  await page.waitForTimeout(300);expect(await page.evaluate(()=>window.__t.foeX())).toBeLessThan(40);
  // with no robot in reach it pulls a head (heads carry a robot type; this once crashed the game)
  await page.evaluate(()=>{window.__t.moveFoe(-200);window.__t.clearHusks();window.__t.addHead(90);});await page.waitForTimeout(400);
  for(let i=0;i<6;i++){await press(page,'KeyX',30);await page.waitForTimeout(70);}
  await page.waitForTimeout(300);expect(await page.evaluate(()=>window.__t.headX())).toBeLessThan(40);
  expect(errors).toEqual([]);
});
