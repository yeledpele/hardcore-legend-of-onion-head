// The feel file: it loads, keeps one "name: number," per line (the dev tools rewrite values in place), and the game reads it live.
const {test,expect}=require('@playwright/test');
const fs=require('fs'),path=require('path');
const {open,press,startCampaign,snap}=require('./helpers');
const SRC=fs.readFileSync(path.join(__dirname,'..','src','feel.js'),'utf8');
test('feel.js loads and every value is a finite number on its own line',()=>{
  const FEEL=new Function(SRC+'\nreturn FEEL;')();
  let n=0;const walk=(o,p)=>{for(const [k,v] of Object.entries(o)){if(typeof v==='object')walk(v,p+k+'.');else{expect(Number.isFinite(v),p+k).toBe(true);n++;}}};
  walk(FEEL,'');expect(n).toBeGreaterThan(60);
  // each group's keys appear once as "key: number" so a value can be found and replaced
  for(const [g,o] of Object.entries(FEEL))for(const [k,v] of Object.entries(o)){if(typeof v==='object')continue;
    const re=new RegExp('^\\s*'+k+':\\s*-?[\\d.]+,?\\s*(//.*)?$','m');expect(re.test(SRC.slice(SRC.indexOf(g+':{'))),g+'.'+k).toBe(true);}
});
test('the game reads the feel file live',async({page})=>{
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(400);
  const peak=async()=>{await page.evaluate(()=>window.__t.dummy('core'));await page.waitForTimeout(200);await page.keyboard.down('KeyZ');let top=0;
    for(let i=0;i<20;i++){top=Math.max(top,(await snap(page)).ph);await page.waitForTimeout(30);}await page.keyboard.up('KeyZ');await page.waitForTimeout(900);return top;};
  const normal=await peak();
  await page.evaluate(()=>window.__t.setFeel('player','jumpCore',6));
  const high=await peak();
  expect(high).toBeGreaterThan(normal*1.5);expect(errors).toEqual([]);
});
