// The options menu (title and pause), the SYNTHWAVE MINT palette, sound and rumble switches, remembered between visits.
const {test,expect}=require('@playwright/test');
const {open,press}=require('./helpers');
const MINT=['#021F25','#04292C','#0C5448','#006060','#165453','#459C75','#50C37F','#8DF58C','#CCF5A8','#97E741','#9CCC3C','#FF3F90','#CC3078','#6C2454','#3C243C','#FDFCC6','#FDFBE7','#607884','#305460'].map(c=>c.toLowerCase());
const keys=async(page,list)=>{for(const k of list){await press(page,k);await page.waitForTimeout(120);}};
const screenColours=page=>page.evaluate(()=>{const d=document.getElementById('view').getContext('2d').getImageData(0,0,256,144).data,set=new Set();
  for(let i=0;i<d.length;i+=4)set.add('#'+[d[i],d[i+1],d[i+2]].map(n=>n.toString(16).padStart(2,'0')).join(''));return [...set];});
test('title OPTIONS: switch to SYNTHWAVE MINT and turn the sound off; both are remembered',async({page})=>{
  const errors=await open(page);
  await keys(page,['ArrowDown','ArrowDown','Enter']);
  expect(await page.evaluate(()=>window.__t.opts())).toEqual({sel:0,from:'title'});
  await keys(page,['Enter']);expect((await page.evaluate(()=>window.__t.opt())).pal).toBe('mint');
  await keys(page,['ArrowDown','ArrowDown','Enter']);expect((await page.evaluate(()=>window.__t.opt())).sound).toBe(false);
  await keys(page,['Escape']);expect(await page.evaluate(()=>window.__t.opts())).toBeNull();
  await page.waitForTimeout(200);
  const off=(await screenColours(page)).filter(c=>!MINT.includes(c));
  expect(off,'colours outside the palette').toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.dataset.pal)).toBe('mint');
  await page.reload();await page.waitForTimeout(500);
  const o=await page.evaluate(()=>window.__t.opt());expect(o.pal).toBe('mint');expect(o.sound).toBe(false);
  expect(errors).toEqual([]);
});
test('pause menu: OPTIONS opens over the paused game and comes back to it',async({page})=>{
  const errors=await open(page);await keys(page,['Enter','Enter']);await page.waitForTimeout(600);
  await keys(page,['KeyP']);expect(await page.evaluate(()=>window.__t.paused())).toBe(true);
  await keys(page,['ArrowDown','Enter']);expect((await page.evaluate(()=>window.__t.opts())).from).toBe('pause');
  await keys(page,['ArrowDown','ArrowDown','ArrowDown','Enter']);expect((await page.evaluate(()=>window.__t.opt())).rumble).toBe(false);
  await keys(page,['Escape']);expect(await page.evaluate(()=>window.__t.opts())).toBeNull();expect(await page.evaluate(()=>window.__t.paused())).toBe(true);
  await keys(page,['ArrowUp','Enter']);expect(await page.evaluate(()=>window.__t.paused())).toBe(false);
  expect(errors).toEqual([]);
});
test('the mint palette costs little drawing time',async({page})=>{
  await page.addInitScript(()=>{try{localStorage.setItem('hc-opts',JSON.stringify({pal:'mint'}));}catch(e){}});
  const errors=await open(page);await keys(page,['Enter','Enter']);await page.waitForTimeout(1200);
  expect(await page.evaluate(()=>window.__t.drawMs())).toBeLessThan(4);expect(errors).toEqual([]);
});
