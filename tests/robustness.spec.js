// Hebrew, Classic mode, blocked gamepad access (as in the Claude app's file preview), and drawing speed.
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign}=require('./helpers');
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
test('a frame draws in under 4 ms',async({page})=>{
  await open(page);await startCampaign(page);await page.waitForTimeout(1500);
  expect(await page.evaluate(()=>window.__t.drawMs())).toBeLessThan(4);
});
