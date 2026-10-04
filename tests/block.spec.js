// Block (hold V / pad B) with a guard meter that breaks; two specials when nested (C / RT outer, F / LT inner);
// the Matryoshka's legs.
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign,snap}=require('./helpers');
const g=page=>page.evaluate(()=>window.__t.guardState());
test('blocking stops hits from the front, not from behind or blasts',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>window.__t.dummy('e:brute'));await page.waitForTimeout(100);
  await page.keyboard.down('KeyV');await page.waitForTimeout(150);
  let s=await g(page);expect(s.guarding).toBe(true);const shell0=s.shell;
  await page.evaluate(()=>window.__t.hurtFrom(8,12));await page.waitForTimeout(50);
  s=await g(page);expect(s.shell).toBe(shell0);expect(s.guard).toBeLessThan(100);            // front: blocked, the guard pays
  await page.waitForTimeout(400);await page.evaluate(()=>{window.__t.noInv();window.__t.hurtFrom(8,-12);});
  s=await g(page);expect(s.shell).toBeLessThan(shell0);                                      // behind: gets through
  await page.waitForTimeout(1000);const sh1=(await g(page)).shell;await page.evaluate(()=>{window.__t.noInv();window.__t.hurtFrom(8,12,true);});
  expect((await g(page)).shell).toBeLessThan(sh1);                                           // a blast: gets through
  await page.keyboard.up('KeyV');expect(errors).toEqual([]);
});
test('the guard breaks after enough blocked damage and stuns you, then refills',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>window.__t.dummy('e:brute'));await page.keyboard.down('KeyV');await page.waitForTimeout(150);
  for(let i=0;i<4&&(await g(page)).stun===0;i++){await page.evaluate(()=>{window.__t.noInv();window.__t.hurtFrom(8,12);});await page.waitForTimeout(40);}
  let s=await g(page);expect(s.stun).toBeGreaterThan(0);expect(s.guarding).toBe(false);
  await page.keyboard.up('KeyV');for(let i=0;i<40&&(await g(page)).stun>0;i++)await page.waitForTimeout(100);
  s=await g(page);expect(s.stun).toBe(0);expect(s.guard).toBe(100);expect(errors).toEqual([]);
});
test('nested: C fires the outer body\'s special, F the inner body\'s',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>{window.__t.dummy('e:hound');window.__t.body(['basic','e:brute']);});await page.waitForTimeout(100);
  await press(page,'KeyF');await page.waitForTimeout(40);expect((await snap(page)).sp).toBe('glove');   // inner: the Basic frame's Power Glove
  await page.waitForTimeout(1200);await page.evaluate(()=>{window.__t.heal();});
  await press(page,'KeyC');await page.waitForTimeout(40);expect((await snap(page)).sp).toBe('pound');   // outer: the Brute robot's Ground Pound
  expect(errors).toEqual([]);
});
test('the Matryoshka walks on little legs (draws without errors)',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>window.__t.goto(4));await page.waitForTimeout(1500);
  expect((await page.evaluate(()=>window.__t.boss())).type).toBe('matry');expect(errors).toEqual([]);
});
