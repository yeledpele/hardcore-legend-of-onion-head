// A scripted player plays the whole campaign: 15 sections, 3 bosses, to the ending.
// It climbs into bigger empty bodies, fights the nearest robot, kicks bombs at the Warden,
// and uses specials. It is topped up now and then: this checks that the game can be finished, not difficulty.
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign,snap}=require('./helpers');
test.setTimeout(8*60*1000);
async function move(page,s,tx,tz,tol=4){
  const keys=[];if(tx>s.px+tol)keys.push('ArrowRight');else if(tx<s.px-tol)keys.push('ArrowLeft');
  if(tz>s.pz+2)keys.push('ArrowDown');else if(tz<s.pz-2)keys.push('ArrowUp');
  for(const k of keys)await page.keyboard.down(k);await page.waitForTimeout(60);for(const k of keys)await page.keyboard.up(k);
}
test('the whole campaign can be finished',async({page})=>{
  const errors=await open(page);await startCampaign(page);
  const bosses=new Set();let s;
  for(let i=0;i<3000;i++){
    s=await snap(page);if(s.state!=='brawl')break;
    if(s.boss)bosses.add(s.boss[0]);
    if(i%15===0)await page.evaluate(()=>window.__t.heal());
    const hk=s.husks.filter(h=>h[2]>s.size&&Math.abs(h[0]-s.px)<100);
    if(hk.length&&!s.foes.length&&!s.boss){const h=hk[0];if(Math.abs(h[0]-s.px)<10&&Math.abs(h[1]-s.pz)<5){await press(page,'Enter');continue;}await move(page,s,h[0],h[1]);continue;}
    const targets=s.foes.length?s.foes:s.crates;
    if(targets.length){const [ex,ez]=targets.reduce((a,t)=>Math.abs(t[0]-s.px)+Math.abs(t[1]-s.pz)*2<Math.abs(a[0]-s.px)+Math.abs(a[1]-s.pz)*2?t:a);
      await move(page,s,ex>s.px?ex-18:ex+18,ez,6);await press(page,ex>s.px?'ArrowRight':'ArrowLeft',10);await press(page,'KeyX');if(i%12===0)await press(page,'KeyC');continue;}
    if(s.boss){const [t,bx,bz]=s.boss;
      if(t==='warden'){if(s.bombs.length){const [mx,mz]=s.bombs[0];await move(page,s,mx-12,mz);await press(page,mx>s.px?'ArrowRight':'ArrowLeft',10);await press(page,'KeyX');}
        else{await move(page,s,bx-14,bz,6);await press(page,'KeyX');if(i%10===0)await press(page,'KeyC');}}
      else{const tgt=t==='matry'?(s.px<bx?bx-18:bx+18):bx-56;await move(page,s,tgt,bz+(t==='matry'?0:2),6);await press(page,bx>s.px?'ArrowRight':'ArrowLeft',10);await press(page,'KeyX');if(i%10===0)await press(page,'KeyC');}
      continue;}
    await page.keyboard.down('ArrowRight');await page.waitForTimeout(200);await page.keyboard.up('ArrowRight');
  }
  expect(errors).toEqual([]);
  expect(s.state).toBe('ending');
  expect([...bosses].sort()).toEqual(['maker','matry','warden']);
});
