// Hebrew, Classic mode, blocked gamepad access (as in the Claude app's file preview), and drawing speed.
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign,snap}=require('./helpers');
test('runs with gamepad access blocked',async({page})=>{
  await page.addInitScript(()=>{Navigator.prototype.getGamepads=function(){throw new DOMException('blocked','SecurityError');};});
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(800);
  expect(await page.evaluate(()=>window.__t.state())).toBe('brawl');expect(errors).toEqual([]);
});
test('Hebrew loads and plays',async({page})=>{
  const errors=await open(page,'?lang=he');await startCampaign(page);await page.waitForTimeout(800);
  expect(await page.evaluate(()=>window.__t.state())).toBe('brawl');expect(errors).toEqual([]);
});
test('Classic mode starts',async({page})=>{
  const errors=await open(page);await press(page,'ArrowDown');await press(page,'Enter');
  for(let i=0;i<12;i++){await press(page,'Enter',30);await page.waitForTimeout(60);}
  expect(['map','intro','prep']).toContain(await page.evaluate(()=>window.__t.state()));expect(errors).toEqual([]);
});
test('nested bodies draw',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(800);
  for(const L of [['e:scrap','e:brute'],['basic','brute'],['e:scrap','walker']]){await page.evaluate(L=>window.__t.dummy(L),L);await page.waitForTimeout(150);
    expect((await page.evaluate(()=>window.__t.snap())).layers).toEqual(L);}
  expect(errors).toEqual([]);
});
test('nesting is locked until the Matryoshka falls',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(800);
  const climb=async id=>{await page.evaluate(id=>{window.__t.husk(id);},id);await press(page,'Enter');await page.waitForTimeout(200);return snap(page);};
  await page.evaluate(()=>window.__t.dummy('basic'));
  let s=await climb('brute');expect(s.layers).toEqual(['brute']);expect(s.husks.some(h=>h[3]==='basic')).toBe(true);
  await page.evaluate(()=>window.__t.nestOK(true));
  s=await climb('walker');expect(s.layers).toEqual(['brute','walker']);
  expect(errors).toEqual([]);
});
test('the Flyer boosts up like a jetpack while A is held',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(800);
  const peak=async(id,ms)=>{await page.evaluate(id=>window.__t.dummy(id),id);await page.waitForTimeout(300);
    await page.keyboard.down('KeyZ');let top=0;const t0=Date.now();while(Date.now()-t0<ms){top=Math.max(top,(await snap(page)).ph);await page.waitForTimeout(30);}
    await page.keyboard.up('KeyZ');await page.waitForTimeout(1500);return top;};
  const hop=await peak('walker',900),jet=await peak('flyer',1400);
  expect(jet).toBeGreaterThan(hop+10);expect(jet).toBeLessThanOrEqual(46);
  expect((await snap(page)).onG).toBe(true);expect(errors).toEqual([]);
});
test('a frame draws in under 4 ms',async({page})=>{
  await open(page);await startCampaign(page);await page.waitForTimeout(1500);
  expect(await page.evaluate(()=>window.__t.drawMs())).toBeLessThan(4);
});
