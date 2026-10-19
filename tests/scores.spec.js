// High scores: a run that ends (quit from SIGNAL LOST, or the ending) goes on the top 10 with 3-letter initials;
// continues are allowed and marked; dev runs are never saved; the list is kept in this browser.
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign}=require('./helpers');
const keys=async(page,list)=>{for(const k of list){await press(page,k);await page.waitForTimeout(110);}};
const st=page=>page.evaluate(()=>window.__t.state());
test('quitting from SIGNAL LOST: enter initials, the score is saved, ranked and remembered',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>window.__t.gameOver(4200,2));await page.waitForTimeout(1400);
  await keys(page,['KeyX']);expect(await st(page)).toBe('entry');                         // B: end the run
  await keys(page,['ArrowUp','ArrowUp','Enter','ArrowUp','Enter','Enter']);                // C, B, A
  expect(await st(page)).toBe('scores');
  let list=await page.evaluate(()=>window.__t.scores());expect(list[0]).toMatchObject({n:'CBA',s:4200,l:1,c:2});
  await keys(page,['Enter']);expect(await st(page)).toBe('title');
  // a lower score lands below it; initials default to the last ones used
  await keys(page,['Enter','Enter']);await page.waitForTimeout(600);await page.evaluate(()=>window.__t.gameOver(900,0));await page.waitForTimeout(1400);
  await keys(page,['KeyX','Enter','Enter','Enter']);list=await page.evaluate(()=>window.__t.scores());
  expect(list.map(r=>[r.n,r.s])).toEqual([['CBA',4200],['CBA',900]]);
  await page.reload();await page.waitForTimeout(400);expect((await page.evaluate(()=>window.__t.scores())).length).toBe(2);
  // HIGH SCORES from the title menu
  await keys(page,['ArrowDown','ArrowDown','Enter']);expect(await st(page)).toBe('scores');
  expect(errors).toEqual([]);
});
test('finishing the campaign counts as END; dev runs are not saved; a full board only takes better scores',async({page})=>{
  const errors=await open(page);
  await page.evaluate(()=>localStorage.setItem('hc-scores',JSON.stringify(Array.from({length:10},(_,i)=>({n:'ZZZ',s:1000*(10-i),l:3,c:0,d:0})))));
  await page.reload();await page.waitForTimeout(300);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>window.__t.gameOver(500,0));await page.waitForTimeout(1400);
  await keys(page,['KeyX']);expect(await st(page)).toBe('scores');                        // too low for a full board: no entry
  await keys(page,['Enter']);await keys(page,['Enter','Enter']);await page.waitForTimeout(600);
  await page.evaluate(()=>window.__t.finishCampaign(99999));await page.waitForTimeout(2400);
  await keys(page,['Enter']);expect(await st(page)).toBe('entry');await keys(page,['Enter','Enter','Enter']);
  let list=await page.evaluate(()=>window.__t.scores());expect(list.length).toBe(10);expect(list[0]).toMatchObject({s:99999,l:0});
  // a dev run (jump to scene) isn't saved
  await page.evaluate(()=>localStorage.setItem('hc-devok','1'));await page.goto(require('./helpers').URL+'?dev=1');await page.waitForTimeout(300);
  await page.click('#devBtn');await page.click('#devPanel button[data-act=goto]');await page.waitForTimeout(300);
  await page.evaluate(()=>window.__t.gameOver(500000,0));await page.waitForTimeout(1400);await keys(page,['KeyX']);
  expect(await st(page)).toBe('scores');expect((await page.evaluate(()=>window.__t.scores()))[0].s).toBe(99999);
  expect(errors).toEqual([]);
});
