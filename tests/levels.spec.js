// The five new levels: each level's first section loads with its props, and a scripted player can beat its boss,
// which drops its body. The player is topped up now and then: this checks the fight can be won, not difficulty.
const {test,expect}=require('@playwright/test');
const {open,press,startCampaign,snap}=require('./helpers');
test.setTimeout(5*60*1000);
// type, stage, the body it drops, and its signature moves (at least one must happen during the fight; moves are picked at random)
const BOSSES=[['knight',2,'walker',['charge','spin']],['crab',3,'titan',['seek']],['crane',4,'e:brute',['stuck','down']],['toad',5,'brute',['full']],['cook',6,'walker',['pan','stuck']]];
async function move(page,s,tx,tz,tol=4){
  const keys=[];if(tx>s.px+tol)keys.push('ArrowRight');else if(tx<s.px-tol)keys.push('ArrowLeft');
  if(tz>s.pz+2)keys.push('ArrowDown');else if(tz<s.pz-2)keys.push('ArrowUp');
  for(const k of keys)await page.keyboard.down(k);await page.waitForTimeout(60);for(const k of keys)await page.keyboard.up(k);
}
for(const [type,stage,drop,sig] of BOSSES){
  test('level '+(stage+1)+': the '+type+' can be beaten and drops its body',async({page})=>{
    const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
    await page.evaluate(st=>window.__t.goto(st*5),stage);await page.waitForTimeout(300);
    let s=await snap(page);expect(s.props.length).toBeGreaterThan(0);
    await page.evaluate(st=>{window.__t.goto(st*5+4);window.__t.body(['e:brute']);},stage);await page.waitForTimeout(300);
    expect((await page.evaluate(()=>window.__t.boss())).type).toBe(type);
    if(type==='toad'){ // its tongue catches you in its lane and swallows you
      await page.evaluate(()=>{window.__t.nearBoss(-50,0);window.__t.bossState('twind',4);});await page.waitForTimeout(700);
      expect(await page.evaluate(()=>window.__t.inside())).toBe(true);}
    let b,seen=new Set();
    for(let i=0;i<2500;i++){
      b=await page.evaluate(()=>window.__t.boss());if(!b)break;seen.add(b.st);
      if(i%10===0)await page.evaluate(()=>window.__t.heal());
      if(await page.evaluate(()=>window.__t.inside())){await press(page,'KeyX',20);continue;}
      s=await snap(page);if(s.state!=='brawl')break;
      if(s.layers.length===0&&i%40===0)await page.evaluate(()=>window.__t.body(['e:brute']));
      await move(page,s,s.px<b.x?b.x-18:b.x+18,b.z,6);await press(page,b.x>s.px?'ArrowRight':'ArrowLeft',10);await press(page,'KeyX');
      if(i%9===0)await press(page,'KeyC');
    }
    expect(b).toBeNull();
    await page.waitForTimeout(200);s=await snap(page);
    expect(s.husks.some(h=>h[3]===drop)).toBe(true);
    expect(seen.size).toBeGreaterThan(3);expect(sig.some(st=>seen.has(st))).toBe(true);
    expect(errors).toEqual([]);
  });
}
