// Tweaks after Ben's notes: glitch only on damage / fail screens; full-width belts that drag everything;
// beaten robots leave a body only by chance; the Hermit Crab starts in a spiral sea-snail shell.
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign,snap}=require('./helpers');
test('the screen glitch shows only when you take damage',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(800);
  expect(await page.evaluate(()=>window.__t.glitch())).toBe(0); // starting the game doesn't glitch
  await page.evaluate(()=>window.__t.dummy('basic'));await press(page,'KeyC');await page.waitForTimeout(150);
  expect(await page.evaluate(()=>window.__t.glitch())).toBe(0); // nor does a special
  await page.evaluate(()=>window.__t.hurt(12));
  expect(await page.evaluate(()=>window.__t.glitch())).toBeGreaterThan(.3);
  await page.evaluate(()=>window.__t.setFeel('game','glitch',0));await page.waitForTimeout(1200);await page.evaluate(()=>window.__t.hurt(12));
  expect(await page.evaluate(()=>window.__t.glitch())).toBe(0); // the feel file can switch it off
  expect(errors).toEqual([]);
});
test('Toy Works belts span sections 2-4 and drag bodies, props and pickups',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  for(const sec of [11,12,13]){
    await page.evaluate(s=>{window.__t.goto(s);window.__t.clearHusks();window.__t.prop('bin',120);window.__t.husk('e:scrap');},sec);
    await page.evaluate(()=>window.__t.dummy('core'));
    const before=await page.evaluate(()=>window.__t.propXs());await page.waitForTimeout(800);const after=await page.evaluate(()=>window.__t.propXs());
    expect(after.length).toBe(before.length);for(let i=0;i<after.length;i++)expect(after[i],'section '+sec).toBeLessThan(before[i]-5);
  }
  expect(errors).toEqual([]);
});
test('beaten robots leave a body only by their type\'s chance',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  const beat=async chance=>{await page.evaluate(()=>{window.__t.dummy('basic');window.__t.clearHusks();});await page.evaluate(c=>window.__t.setFeel('bodyDrop','scrap',c),chance);
    await page.evaluate(()=>{window.__t.moveFoe(-300);window.__t.spawnFoe('scrap',22,1);});
    for(let i=0;i<4;i++){await press(page,'KeyX');await page.waitForTimeout(150);}
    await page.waitForTimeout(2200);return (await page.evaluate(()=>window.__t.husks())).filter(h=>h[1]==='e:scrap').length;};
  expect(await beat(0)).toBe(0);
  expect(await beat(1)).toBe(1);
  expect(errors).toEqual([]);
});
test('the Hermit Crab starts in a spiral sea-snail shell, then steals robot bodies',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  await page.evaluate(()=>{window.__t.goto(19);window.__t.body(['e:brute']);});await page.waitForTimeout(300);
  expect((await page.evaluate(()=>window.__t.boss())).shell).toBe('conch');
  for(let i=0;i<200;i++){const b=await page.evaluate(()=>window.__t.boss());if(!b||b.st==='seek'||b.st==='climb'||(b.shell&&b.shell!=='conch'))break;
    if(i%10===0)await page.evaluate(()=>window.__t.heal());const s=await snap(page);
    await page.keyboard.down(b.x>s.px?'ArrowRight':'ArrowLeft');await page.waitForTimeout(60);await page.keyboard.up(b.x>s.px?'ArrowRight':'ArrowLeft');
    await page.evaluate(()=>window.__t.nearBoss(-30,0));await press(page,'KeyX');}
  for(let i=0;i<80&&((await page.evaluate(()=>window.__t.boss()))||{}).shell!=='e:scrap'&&((await page.evaluate(()=>window.__t.boss()))||{}).shell!=='e:lancer';i++)await page.waitForTimeout(100);
  expect(['e:scrap','e:lancer']).toContain((await page.evaluate(()=>window.__t.boss())).shell);
  expect(errors).toEqual([]);
});
