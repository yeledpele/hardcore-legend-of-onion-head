// On a narrow phone: every touch button is on screen; A jumps, B attacks, A+B fires the special.
const {test,expect}=require('@playwright/test');
const {open,snap}=require('./helpers');
test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
test('touch controls fit and work on a phone',async({page})=>{
  const errors=await open(page);
  const rights=await page.evaluate(()=>[...document.querySelectorAll('#pad button')].map(b=>b.getBoundingClientRect().right));
  expect(rights.length).toBeGreaterThanOrEqual(7);for(const r of rights)expect(r).toBeLessThanOrEqual(390);
  await page.tap('#pad .start');await page.waitForTimeout(300);await page.tap('#pad .start');await page.waitForTimeout(1200);
  await page.tap('#pad .a');await page.waitForTimeout(120);expect((await snap(page)).ph).toBeGreaterThan(3);
  await page.waitForTimeout(900);
  await page.tap('#pad .b');await page.waitForTimeout(60);expect((await snap(page)).kind).toBe('melee');
  await page.waitForTimeout(700);
  await page.evaluate(()=>{for(const k of ['a','b']){const el=document.querySelector('#pad .'+k);el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:k==='a'?2:3}));}});
  await page.waitForTimeout(80);
  await page.evaluate(()=>{for(const k of ['a','b']){const el=document.querySelector('#pad .'+k);el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:k==='a'?2:3}));}});
  expect((await snap(page)).kind).toBe('sp');
  expect(errors).toEqual([]);
});
