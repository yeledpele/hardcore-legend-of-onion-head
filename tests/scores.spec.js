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
// ---- the online board, answered by a fake leaderboard service (the real one is never touched by tests)
async function fakeBoard(page,rows,{down=false}={}){
  const store=rows.slice(),posts=[];
  await page.route('https://leaderboard.invalid/**',async route=>{
    if(down)return route.abort();
    const req=route.request();
    if(req.method()==='POST'){const b=JSON.parse(req.postData());posts.push(b);store.push(b);return route.fulfill({status:201,body:''});}
    const top=store.slice().sort((a,b)=>b.score-a.score).slice(0,10);
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(top)});
  });
  return {store,posts};
}
const row=(n,s,l=3,c=0)=>({initials:n,score:s,level:l,continues:c});
test('online board: it shows on the ONLINE tab, a score that makes it asks for initials and is sent',async({page})=>{
  const fake=await fakeBoard(page,Array.from({length:10},(_,i)=>row('ON'+i,50000-i*1000)));
  const errors=await open(page);
  // a full local board the new score doesn't make, so only the online board asks for it
  await page.evaluate(()=>localStorage.setItem('hc-scores',JSON.stringify(Array.from({length:10},(_,i)=>({n:'LOC',s:900000-i,l:1,c:0,d:0})))));
  await page.reload();await page.waitForTimeout(300);await startCampaign(page);await page.waitForTimeout(600);
  await page.evaluate(()=>window.__t.gameOver(48500,1));await page.waitForTimeout(1400);
  await keys(page,['KeyX']);expect(await st(page)).toBe('entry');
  await keys(page,['ArrowDown','Enter','Enter','Enter']);await page.waitForTimeout(400);
  expect(fake.posts).toEqual([{initials:'9AA',score:48500,level:1,continues:1}]);
  expect(await st(page)).toBe('scores');
  expect(errors).toEqual([]);
});
test('online board down: the game stays local and says the online board is unavailable',async({page})=>{
  await fakeBoard(page,[],{down:true});
  const errors=await open(page);await keys(page,['ArrowDown','ArrowDown','Enter']);await keys(page,['ArrowRight']);await page.waitForTimeout(400);
  expect(await page.evaluate(()=>window.__t.onlineStatus())).toBe('down');
  await keys(page,['Enter','ArrowUp','ArrowUp']);await startCampaign(page);await page.waitForTimeout(600);   // back to PLAY on the title menu
  await page.evaluate(()=>window.__t.gameOver(3000,0));await page.waitForTimeout(1400);await keys(page,['KeyX','Enter','Enter','Enter']);
  expect((await page.evaluate(()=>window.__t.scores()))[0].s).toBe(3000);expect(errors).toEqual([]);
});
test('dev runs are never sent online',async({page})=>{
  const fake=await fakeBoard(page,[]);
  const errors=await open(page);await page.evaluate(()=>localStorage.setItem('hc-devok','1'));await page.goto(require('./helpers').URL+'?dev=1');await page.waitForTimeout(300);
  await page.click('#devBtn');await page.click('#devPanel button[data-act=goto]');await page.waitForTimeout(500);
  await page.evaluate(()=>window.__t.gameOver(70000,0));await page.waitForTimeout(1400);await keys(page,['KeyX']);await page.waitForTimeout(300);
  expect(await st(page)).toBe('scores');expect(fake.posts).toEqual([]);expect(errors).toEqual([]);
});
test('the title shows the leader, and attract mode cycles the board in and out',async({page})=>{
  await fakeBoard(page,[row('BEN',48210),row('ONI',31150)]);
  const errors=await open(page);await page.waitForTimeout(600);
  expect(await page.evaluate(()=>window.__t.titleLeader())).toBe('ONLINE 1ST BEN 48210');
  await page.evaluate(()=>{window.__t.setFeel('game','attractAfter',1);window.__t.setFeel('game','attractShow',1);});
  await expect.poll(()=>st(page),{timeout:4000}).toBe('scores');                       // the board comes in by itself
  await expect.poll(()=>st(page),{timeout:4000}).toBe('title');                        // and goes back
  await expect.poll(()=>st(page),{timeout:4000}).toBe('scores');
  await keys(page,['ArrowLeft']);expect(await st(page)).toBe('title');                   // any key returns to the title
  expect(errors).toEqual([]);
});
test('offline, the title shows your best local score instead',async({page})=>{
  await fakeBoard(page,[],{down:true});
  const errors=await open(page);await page.evaluate(()=>localStorage.setItem('hc-scores',JSON.stringify([{n:'ZED',s:8400,l:2,c:0}])));
  await page.reload();await page.waitForTimeout(600);
  expect(await page.evaluate(()=>window.__t.titleLeader())).toBe('BEST ZED 8400');expect(errors).toEqual([]);
});
test('during a run: HI shows the score to beat, and passing board entries shows toasts',async({page})=>{
  await fakeBoard(page,[row('BEN',5000),row('ONI',3000),row('ZED',1000)]);
  const errors=await open(page);await startCampaign(page);await page.waitForTimeout(800);
  const toast=()=>page.evaluate(()=>window.__t.toast());
  expect(await page.evaluate(()=>window.__t.hiScore())).toBe(5000);                        // the online #1 to beat
  expect(await toast()).toBeFalsy();                                                       // nothing passed yet
  await page.evaluate(()=>window.__t.setScore(2000));await expect.poll(toast).toBe('PASSED! NOW 3RD ONLINE');
  await page.evaluate(()=>window.__t.setScore(3500));await expect.poll(toast).toBe('PASSED! NOW 2ND ONLINE');
  await page.evaluate(()=>window.__t.setScore(6000));await expect.poll(toast).toBe('1ST ONLINE!');
  await expect.poll(()=>page.evaluate(()=>window.__t.hiScore())).toBe(6000);              // HI follows you once you lead
  // a continue halves the score: no toast for catching up again past the same entries... until you really pass one
  await page.evaluate(()=>window.__t.setScore(1500));await page.waitForTimeout(400);
  await page.evaluate(()=>window.__t.setScore(3200));await expect.poll(toast).toBe('PASSED! NOW 2ND ONLINE');
  expect(errors).toEqual([]);
});
test('offline, the HI score and toasts use your local board',async({page})=>{
  await fakeBoard(page,[],{down:true});
  const errors=await open(page);await page.evaluate(()=>localStorage.setItem('hc-scores',JSON.stringify([{n:'ZED',s:800,l:2,c:0}])));
  await page.reload();await page.waitForTimeout(300);await startCampaign(page);await page.waitForTimeout(800);
  expect(await page.evaluate(()=>window.__t.hiScore())).toBe(800);
  await page.evaluate(()=>window.__t.setScore(900));await expect.poll(()=>page.evaluate(()=>window.__t.toast())).toBe('1ST LOCAL!');
  expect(errors).toEqual([]);
});
