const path=require('path');
const URL='file://'+path.resolve(__dirname,'..','dist','hardcore.test.html');
async function open(page,query=''){const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(URL+query);await page.waitForTimeout(500);return errors;}
async function press(page,key,ms=40){await page.keyboard.down(key);await page.waitForTimeout(ms);await page.keyboard.up(key);}
// title -> PLAY -> skip the story -> campaign
async function startCampaign(page){await press(page,'Enter');await page.waitForTimeout(300);await press(page,'Enter');await page.waitForTimeout(700);}
const snap=page=>page.evaluate(()=>window.__t.snap());
module.exports={URL,open,press,startCampaign,snap};
