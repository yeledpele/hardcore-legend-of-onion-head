// Every body's special and every weapon is fired at a dummy robot and must deal damage.
const {test,expect}=require('@playwright/test');
const {open,startCampaign}=require('./helpers');
const CASES=[['core'],['basic'],['brute'],['walker'],['titan'],['e:scrap'],['e:lancer'],['e:hound'],['e:guard'],['e:brute'],['e:walker'],['doll'],['flyer'],['basic','sword'],['basic','hook']];
test('every special and weapon lands',async({page})=>{
  const errors=await open(page);await startCampaign(page);
  const misses=[];
  for(const [id,w] of CASES){
    await page.evaluate(([id,w])=>window.__t.dummy(id,w),[id,w||null]);await page.waitForTimeout(60);
    const h0=await page.evaluate(()=>window.__t.dummyHp());
    await page.keyboard.press('KeyC');await page.waitForTimeout(1050);
    const h1=await page.evaluate(()=>window.__t.dummyHp());
    if(!(h0-h1>0))misses.push(id+(w?'+'+w:''));
  }
  expect(misses).toEqual([]);expect(errors).toEqual([]);
});
