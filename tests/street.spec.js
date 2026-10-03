// Street life: civilians who panic and can be squished, and props that break (barrels explode).
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign,snap}=require('./helpers');
test('sections have civilians and props',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(600);
  const s=await snap(page);expect(s.civs.length).toBeGreaterThan(0);expect(s.props.length).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
test('big bodies squish civilians, the bare core does not',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(600);
  await page.evaluate(()=>{window.__t.dummy('core');window.__t.civ(0);});await page.waitForTimeout(150);
  expect((await snap(page)).civs[0][2]).not.toBe('flat');
  await page.evaluate(()=>{window.__t.dummy('e:brute');window.__t.civ(0);});await page.waitForTimeout(150);
  expect((await snap(page)).civs[0][2]).toBe('flat');
  expect(errors).toEqual([]);
});
test('props break into rubble and barrels explode',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(600);
  await page.evaluate(()=>{window.__t.dummy('basic');window.__t.prop('bin',14);});
  for(let i=0;i<6&&(await snap(page)).props.length;i++){await press(page,'KeyX');await page.waitForTimeout(260);}
  let s=await snap(page);expect(s.props).toEqual([]);expect(s.rubble).toBeGreaterThan(0);
  await page.evaluate(()=>{window.__t.dummy('basic');window.__t.prop('barrel',14);});
  const hp0=await page.evaluate(()=>window.__t.dummyHp());
  for(let i=0;i<6&&(await snap(page)).props.length;i++){await press(page,'KeyX');await page.waitForTimeout(260);}
  s=await snap(page);expect(s.props).toEqual([]);
  expect(await page.evaluate(()=>window.__t.dummyHp())).toBeLessThan(hp0-10);
  expect(errors).toEqual([]);
});
