
(()=>{
'use strict';
const W=256,H=144,GY=124;
const C={void:'#0d0321',deep:'#170833',plum:'#26104a',grid:'#2c1258',cy:'#00f0ff',cyd:'#0b7c95',cyx:'#063f55',mg:'#ff2a6d',mgd:'#8c1248',mgx:'#4a0a2c',yl:'#ffe600',yld:'#8f7a00',wh:'#f2f7ff',gr:'#6e6488',grd:'#3b3452',grx:'#231d33'};
const PAL={
  me:{line:C.cy,fill:C.cyd,dark:C.cyx,mark:C.wh,eye:C.yl},
  foe:{line:C.mg,fill:C.mgd,dark:C.mgx,mark:C.wh,eye:C.yl},
  warn:{line:C.yl,fill:C.mgd,dark:C.mgx,mark:C.yl,eye:C.wh},
  hit:{line:C.wh,fill:C.wh,dark:C.wh,mark:C.wh,eye:C.wh},
  husk:{line:C.gr,fill:C.grd,dark:C.grx,mark:C.gr,eye:C.grd},
  maker:{line:C.yl,fill:C.mgd,dark:C.mgx,mark:C.wh,eye:C.mg},
  sil:{line:'#05010d',fill:'#05010d',dark:'#05010d',mark:'#05010d',eye:'#05010d'}
};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch=matchMedia('(pointer:coarse)').matches;
if(touch)document.body.classList.add('touch');

// ---------- canvases ----------
const view=document.getElementById('view'),vx=view.getContext('2d');
const mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c;};
const buf=mk(),red=mk(),cyn=mk(),bg=mk();
let g=buf.getContext('2d');
const rc=red.getContext('2d'),cc=cyn.getContext('2d');
const withCtx=(ctx,fn)=>{const o=g;g=ctx;fn();g=o;};

// ---------- language: English / Hebrew ----------
const VERSION='4.1';
let LANG='en';try{LANG=new URLSearchParams(location.search).get('lang')==='he'?'he':(localStorage.getItem('hc-lang')||'en');}catch(e){}
// Hebrew pixel glyphs, same 5-row body as the Latin font; lamed rises, final letters and qof descend
const HFONT={
'א':{w:4,t:0,r:['1..1','.1.1','.11.','1.1.','1..1']},'ב':{w:4,t:0,r:['111.','...1','...1','...1','1111']},
'ג':{w:4,t:0,r:['.11.','..1.','..1.','.11.','1..1']},'ד':{w:4,t:0,r:['1111','..1.','..1.','..1.','..1.']},
'ה':{w:4,t:0,r:['1111','...1','1..1','1..1','1..1']},'ו':{w:3,t:0,r:['11.','.1.','.1.','.1.','.1.']},
'ז':{w:3,t:0,r:['111','.1.','.1.','.1.','.1.']},'ח':{w:4,t:0,r:['1111','1..1','1..1','1..1','1..1']},
'ט':{w:4,t:0,r:['1.11','1..1','1..1','1..1','1111']},'י':{w:2,t:0,r:['11','.1']},
'כ':{w:4,t:0,r:['111.','...1','...1','...1','111.']},'ך':{w:4,t:0,r:['1111','...1','...1','...1','...1','...1','...1']},
'ל':{w:4,t:-1,r:['1...','1...','1111','...1','..1.','.1..']},'מ':{w:4,t:0,r:['1.11','11.1','1..1','1..1','1.11']},
'ם':{w:4,t:0,r:['1111','1..1','1..1','1..1','1111']},'נ':{w:3,t:0,r:['11.','..1','..1','..1','111']},
'ן':{w:3,t:0,r:['11.','.1.','.1.','.1.','.1.','.1.','.1.']},'ס':{w:4,t:0,r:['1111','1..1','1..1','1..1','.11.']},
'ע':{w:4,t:0,r:['1..1','1..1','.1.1','..1.','11..']},'פ':{w:4,t:0,r:['1111','11.1','...1','...1','1111']},
'ף':{w:4,t:0,r:['1111','11.1','...1','...1','...1','...1','...1']},'צ':{w:4,t:0,r:['1..1','1..1','.11.','..1.','1111']},
'ץ':{w:4,t:0,r:['1..1','1..1','.11.','.1..','.1..','.1..','.1..']},'ק':{w:4,t:0,r:['1111','...1','1..1','1.1.','1...','1...','1...']},
'ר':{w:4,t:0,r:['111.','...1','...1','...1','...1']},'ש':{w:5,t:0,r:['1.1.1','1.1.1','1.1.1','1.1.1','11111']},
'ת':{w:4,t:0,r:['1111','.1.1','.1.1','.1.1','11.1']}};
const HE={
'A WORLD OF HUMANS, ROBOTS AND MONSTERS OF EVERY SIZE.':'עולם של בני אדם, רובוטים ומפלצות בכל הגדלים.',
'A GIRL FINDS A ROBOT HEAD BURIED IN THE DIRT.':'ילדה מוצאת ראש רובוט קבור באדמה.',
'SHE FIXES IT. SHE TRAINS IT. SHE CALLS IT ONION HEAD.':'היא מתקנת אותו. היא מאמנת אותו. היא קוראת לו ראש בצל.',
'THEN A GIANT ROBOT CAME.':'ואז הגיע רובוט ענק.','TIME PASSES.':'הזמן עובר.','MORE TIME PASSES.':'עוד זמן עובר.',
'ONION HEAD IS ONLINE.':'ראש בצל התעורר.','DESTROY EVERY ROBOT BIGGER THAN YOU.':'השמד כל רובוט גדול ממך.',
'THE COLOSSUS FALLS.':'הענק נופל.','ITS ARM POINTS NORTH, TO THE PINES.':'זרועו מצביעה צפונה, אל האורנים.',
'SHELLY LIVED IN THE PINES.':'שלי גרה בין האורנים.','ONION HEAD WALKS NORTH.':'ראש בצל צועד צפונה.',
'THE WARDEN GOES QUIET.':'השומר משתתק.','ITS LAST SIGNAL CAME FROM THE FOUNDRY,':'האות האחרון שלו הגיע מבית היציקה,',
'WHERE THE GIANTS ARE MADE.':'המקום שבו נבנים הענקים.','THE ONE THAT TOOK SHELLY IS THERE.':'זה שלקח את שלי נמצא שם.',
'A: NEXT':'A: הבא','START: SKIP':'START: דלג','A: ONWARD':'A: הלאה','A: BACK TO THE MAP':'A: חזרה למפה',
'A: REBOOT AT THE BURIAL SITE':'A: אתחול באתר הקבורה','A: REBOOT AT THE EDGE OF':'A: אתחול בקצה','A: TITLE':'A: מסך פתיחה',
'B B B: COMBO   A: JUMP   HOLD B: CHARGE   DOWN+B IN AIR: DIVE':'BBB: קומבו  A: קפיצה  החזק B: טעינה  למטה+B: צלילה',
'BACK 2 KNIFE':'חזרה לסכין','BATTLE PREP':'הכנה לקרב','BLOCK':'חסימה','BLOCKED':'נחסם','CLANG':'קלאנג',
'CLIMB THE ARM':'טפס על הזרוע','CORE HIT':'פגיעה בליבה','DOUBLE TAP DOWN: EJECT':'למטה פעמיים: פליטה','DOWNED':'הופל',
'FIGHT':'קרב','GUARD BREAK':'שבירת הגנה','HEAVY HITS BREAK SHIELDS. OR GET BEHIND IT':'מכות כבדות שוברות מגן. או עקוף אותו',
'HI':'היי','HIT THE CORE, OR CLIMB THE ARM':'הכה בליבה, או טפס על הזרוע','HIT THE HEAD':'הכה בראש','INCOMING':'מתקרב',
'INSIDE IT, A SIGNAL: S.H.E.L.L.Y':'בתוכו, אות: ש.ל.י','IT FEELS YOU':'הוא מרגיש אותך','ITS SHELL IS CRACKING':'המעטפת שלו נסדקת',
'KICK THE BOMBS UP AT THE WARDEN':'בעט את הפצצות אל השומר','KICK':'בעיטה','KING OF ROBOTS':'מלך הרובוטים',
'KNIFE ONLY':'רק סכין','NO SPECIAL':'אין מיוחד','LEGEND OF ONION HEAD':'האגדה של ראש בצל','LEVEL CLEAR':'השלב הושלם',
'SALVAGE':'שלל','NO FREE SLOT':'אין חריץ פנוי','THE CORE HAS NO SLOTS':'לליבה אין חריצים','NO UPGRADES YET':'אין שדרוגים עדיין',
'NONE':'אין','NOTHING NEW':'שום דבר חדש','PARRIED':'נהדפת','PARRY':'הדיפה','PROTOTYPE':'אב טיפוס','RETREAT':'נסיגה',
'SIGNAL LOST':'האות אבד','TAP START':'גע כדי להתחיל','PRESS START':'לחץ START','THE MAKER IS SCRAP. ITS CORE IS STILL WARM.':'היוצר הוא גרוטאה. הליבה שלו עדיין חמה.',
'THE ROBOT IS BROKEN ONCE MORE.':'הרובוט שבור שוב.','THROWN OFF':'הועפת','WALK INTO A ROBOT TO FIGHT IT':'גש לרובוט כדי להילחם בו',
'SALVAGE WHAT YOU CAN':'אסוף מה שאפשר','YOU':'אתה','YOUR FRAME, RECOVERED':'השלד שלך הוחזר','THE COLOSSUS WAITS':'הענק מחכה',
'THE MAKER IS AWAKE':'היוצר ער','THE WARDEN IS WATCHING':'השומר צופה',"SHELLY'S HOUSE. THE DOOR IS OPEN.":'הבית של שלי. הדלת פתוחה.',
'EJECT':'פליטה','IT EJECTED':'הוא נפלט','SHELL BREAK':'המעטפת נשברה','POGO':'ניתור','LAUNCH':'הקפצה','CHARGED':'טעון','STOMP':'רקיעה',
'L: ENGLISH':'L: ENGLISH','MATRYOSHKA':'מטריושקה','ANOTHER ONE INSIDE':'עוד אחת בפנים','THE LAST DOLL':'הבובה האחרונה','ITS SMALLEST SHELL: THE DOLL':'הקליפה הקטנה שלה: הבובה','NESTING LOCKED: BEAT THE MATRYOSHKA':'קינון נעול: נצחו את המטריושקה','NESTING UNLOCKED':'קינון נפתח','THE TOY WORKS':'מפעל הצעצועים','HERMIT HARBOUR':'נמל הסרטנים','THE MAGNET YARD':'מגרש המגנט','THE GULLET BOG':'ביצת הלוע',"THE GIANT'S KITCHEN":'המטבח של הענק',
'THE WIND-UP KNIGHT':'אביר הקפיץ','THE HERMIT CRAB':'הסרטן הנזיר','THE CRANE':'העגורן','THE TOAD KING':'מלך הקרפדות','THE COOK':'הטבח',
'THE WARDEN GOES QUIET.':'השומר משתתק.','ITS LAST SIGNAL CAME FROM THE FOUNDRY.':'האות האחרון שלו הגיע מבית היציקה.','THE ROAD RUNS THROUGH A TOY FACTORY.':'הדרך עוברת דרך מפעל צעצועים.','SOMETHING INSIDE IS STILL WOUND UP.':'משהו בפנים עדיין מתוח.',
'THE KNIGHT RUNS DOWN.':'האביר נעצר.','THE ROAD ENDS AT A NIGHT HARBOUR.':'הדרך נגמרת בנמל לילי.','EMPTY BODIES WASH UP ON THE PIER.':'גופים ריקים נסחפים אל המזח.','SOMETHING IS COLLECTING THEM.':'משהו אוסף אותם.',
'THE CRAB LETS GO OF ITS DREAM SHELL.':'הסרטן מרפה מקונכיית החלומות שלו.','PAST THE PIER, A SCRAPYARD HUMS.':'מעבר למזח מזמזם מגרש גרוטאות.','A MAGNET PULLS AT EVERY BODY.':'מגנט מושך כל גוף.','ONLY A CORE IS TOO LIGHT TO LIFT.':'רק ליבה קלה מדי להרמה.',
'THE CRANE FALLS SILENT.':'העגורן משתתק.','THE ROAD SINKS INTO A SWAMP':'הדרך שוקעת בביצה','OF DROWNED MACHINES.':'של מכונות טבועות.','SOMETHING BIG IS CROAKING.':'משהו גדול מקרקר.',
'THE TOAD KING BURPS ITS LAST.':'מלך הקרפדות גיהק בפעם האחרונה.','A DOOR IN THE BOG OPENS ONTO A KITCHEN.':'דלת בביצה נפתחת אל מטבח.','ONION HEAD IS TINY HERE.':'ראש בצל זעיר כאן.','THE COOK IS HUNGRY.':'הטבח רעב.',
'THE COOK DROPS ITS PAN.':'הטבח מפיל את המחבת.','BEHIND THE STOVE LIES THE FOUNDRY,':'מאחורי הכיריים נמצא בית היציקה,','WHERE THE GIANTS ARE MADE.':'שם נבנים הענקים.','THE ONE THAT TOOK SHELLY IS THERE.':'זה שלקח את שלי נמצא שם.',
'UNWOUND':'הקפיץ נגמר','REWOUND':'נמתח מחדש','KEY PULLED':'המפתח נשלף','DIZZY':'סחרחורת','GOTCHA':'תפסתי!','MASH B':'לחצו B שוב ושוב','NOW IT IS SOFT':'עכשיו הוא רך','HOOKED: SHELL OFF':'נתפס: הקונכייה עפה','IT STEALS A SHELL':'הוא גונב קונכייה','IT DIGS A NEW SHELL':'הוא חופר קונכייה חדשה',
'HIT THE MAGNET':'הכו במגנט','MAGNET SLAM':'מכת מגנט','LIFTED':'הורם','THE CAB CRASHES':'התא מתרסק','GULP':'גלפ!','HIT IT FROM INSIDE':'הכו מבפנים','BURST OUT':'פורצים החוצה!','IT DIGESTS YOUR BODY':'הוא מעכל את הגוף שלך','TONGUE PULLED':'הלשון נשלפה','BURP':'גרעפס','CROAK':'קרקור',
'PEPPER':'פלפל','JUMP ON THE PAN':'קפצו על המחבת','THE HAND IS DOWN':'היד נפלה',
'ITS EMPTY ARMOUR: WALKER':'השריון הריק שלו: צועד','ITS DREAM SHELL: TITAN':'קונכיית החלומות שלו: טיטאן','THE OPERATOR CLIMBS OUT':'המפעיל יוצא החוצה','IT COUGHS UP A BRUTE FRAME':'הוא משתעל שלד בריון','IN ITS SLEEVE: A WALKER FRAME':'בשרוול שלו: שלד צועד','SQUISH':'נמעך!','BOOM':'בום','AAH!':'אאאה!','HELP!':'הצילו!','RUN!':'ברחו!','EEK!':'אִי!','CLIMB INTO A BIGGER BODY TO NEST':'היכנסו לגוף גדול יותר כדי לקנן','DOLL':'בובה','LIGHTNING CALL':'קריאת ברק','LIGHTNING! KEEP MOVING':'ברק! תמשיך לזוז','FLYER':'מעופף','BOMB DROP':'הטלת פצצות','A FLYING FRAME WAS INSIDE':'בפנים היה שלד מעופף','A+B TOGETHER: SPECIAL':'A+B יחד: מיוחד','CHAIN HOOK':'שרשרת וו','HOOKED':'נתפס','TOPPLED':'הופל','IT BRACES ITSELF':'הוא מתייצב','TICKING HEAD! KICK IT AWAY':'ראש מתקתק! בעט אותו','ITS HEAD IS DOWN: HIT IT':'הראש שלו למטה: הכה בו','HEADSHOT':'פגיעת ראש','HIT A HEAD TO KICK IT':'הכה בראש כדי לבעוט בו','KICK BOMBS OR HEADS UP AT THE WARDEN':'בעט פצצות או ראשים אל השומר','HEAD OFF':'הראש עף','MINI BOSS':'מיני בוס','JUMP ON THE FIST':'קפוץ על האגרוף','JUMP AND STRIKE THE HEAD':'קפוץ והכה בראש','HIT IT NOW, OR JUMP ON THE FIST':'הכה עכשיו, או קפוץ על האגרוף','ITS CORE FRAME: TITAN':'שלד הליבה שלו: טיטאן','A WALKER FRAME WAS INSIDE':'בפנים היה שלד צועד','KNIFE THROW':'זריקת סכין','SCRAP SPIN':'סחרור גרוטאות','SPEAR THRUST':'דקירת רומח','POUNCE':'זינוק','SHIELD BASH':'הלם מגן','GROUND POUND':'הלם קרקע','NO POWER':'אין כוח','POWER':'כוח','NEEDS A BODY':'צריך גוף','PLAY':'שחק','CLASSIC':'קלאסי','NOTHING TO EJECT':'אין מה לפלוט','START: CLIMB IN':'START: היכנס','START: EJECT':'START: פליטה','BEAT A ROBOT, THEN CLIMB INTO ITS BODY':'הבס רובוט, ואז היכנס לגוף שלו','NESTED':'מקונן','A: TRY AGAIN   B: TITLE':'A: נסה שוב   B: מסך פתיחה','STORY':'סיפור','BRAWL':'מכות רחוב','CHOOSE YOUR FRAME':'בחר את השלד שלך','A: START   B: BACK':'A: התחל   B: חזרה','SPEED':'מהירות','STREET CLEAR':'הרחוב נוקה','SCORE':'ניקוד','A: AGAIN   B: TITLE':'A: שוב   B: מסך פתיחה','BOSS':'בוס','GRAB':'תפיסה','THROW':'זריקה','CORE CELL':'תא ליבה','FIX +20':'תיקון +20','CORE +1':'ליבה +1','GO':'קדימה','B: HIT   A: JUMP   A+B: BURST   WALK INTO A DAZED ROBOT: GRAB':'B: מכה  A: קפיצה  A+B: פיצוץ  לך לרובוט המום: תפיסה','NEST:':'קינון:','THE CORE CANNOT CARRY A FRAME':'הליבה לא יכולה לשאת שלד','ONLY A SMALLER FRAME FITS INSIDE':'רק שלד קטן יותר נכנס בפנים','LAYER LOST':'שכבה אבדה','NEEDS A SECOND FRAME':'צריך שלד שני','NEEDS A 2ND FRAME':'צריך שלד שני','NEW: NEST A FRAME IN BATTLE PREP':'חדש: קנן שלד בהכנה לקרב','L: HEBREW':'L: עברית',
'CORE':'ליבה','BASIC':'בסיסי','BRUTE':'בריון','WALKER':'צועד','TITAN':'טיטאן','KING':'מלך',
'POWER GLOVE':'כפפת כוח','ARMOR PLATE':'לוח שריון','SWORD OF JUSTICE':'חרב הצדק','HAMMER OF MIGHT':'פטיש העוצמה',
'SHOULDER LASER':'לייזר כתף','ROCKET LAUNCH':'שיגור טיל','GIANT SWORD':'חרב ענק','HEART SHIELD':'מגן לב','SPARE CORE':'ליבה רזרבית','JET BOOSTER':'מאיץ סילון',
'SWORD':'חרב','HAMMER':'פטיש','SHOULDER':'לייזר','ROCKET':'טיל','GIANT':'ענק',
'SCRAPPER':'גרוטאן','LANCER':'רומח','SHAMAN':'שאמאן','COLOSSUS':'הענק','SHIELDBOT':'רובוט מגן','BOMBER':'מפציץ','HOUND':'כלב ציד',
'THE WARDEN':'השומר','THE MAKER':'היוצר','UNKNOWN':'לא ידוע',
'THE BURIAL WASTE':'שממת הקבורה','THE PINE FOREST':'יער האורנים','THE FOUNDRY':'בית היציקה',
'FRAME':'שלד','SHELL':'מעטפת','HOSTILES':'אויבים','LEVEL':'שלב','HP':'חיים','PUNCH':'אגרוף','SLOTS':'חריצים','UP':'למעלה','UP:':'למעלה:',
'ONLY THE CORE FITS. B: PARK THE RIG':'רק הליבה נכנסת. B: חנה את השלד','NEEDS THE HAMMER OF MIGHT':'צריך את פטיש העוצמה','NEEDS THE SHOULDER LASER':'צריך את לייזר הכתף',
'NEEDS THE JET BOOSTER':'צריך את מאיץ הסילון','TOO DEEP. NEEDS A WALKER OR TITAN':'עמוק מדי. צריך צועד או טיטאן','RIG PARKED':'השלד חונה','BACK IN THE RIG':'חזרה לשלד',
'YOUR RIG IS BACK THERE':'השלד שלך מאחור','CLIMB INTO YOUR RIG FIRST':'קודם חזור לשלד','YOUR RIG IS PARKED':'השלד שלך חונה','CORE CELL: +1 CORE':'תא ליבה: +1 ליבה',
'CORE CELLS':'תאי ליבה','MEMORIES':'זיכרונות','DONE':'סיום','THE RIG':'השלד','B: PARK THE RIG   START: RIG SCREEN':'B: חנה את השלד   START: מסך שלד','SMASH':'ריסוק','ZAP':'זאפ',
'A: CLOSE':'A: סגור','FIX':'תקן','TRAIN':'אימון',
'LOST:':'אבד:','CRIT':'קריטי','DOWN':'הובס','HITS':'מכות'};
const isHe=c=>c>='\u05D0'&&c<='\u05EA';
const MIRROR={'(':')',')':'(','<':'>','>':'<'};
function tr(s){
  if(LANG!=='he')return s;
  const u=s.toUpperCase();if(HE[u]!==undefined)return HE[u];
  const w=u.split(' '),out=[];
  for(let i=0;i<w.length;){let hit=null,len=0;for(let n=Math.min(8,w.length-i);n>=1;n--){const k=w.slice(i,i+n).join(' ');if(k&&HE[k]!==undefined){hit=HE[k];len=n;break;}}if(hit!==null){out.push(hit);i+=len;}else{out.push(w[i]);i++;}}
  return out.join(' ');
}
// right-to-left: reverse the line, then turn runs of Latin letters and digits back around
function visual(s){
  const a=[...s];if(!a.some(isHe))return s;
  const r=a.reverse().map(c=>MIRROR[c]||c),L=c=>/[A-Z0-9]/.test(c),out=[];
  for(let i=0;i<r.length;){
    if(L(r[i])){let j=i;while(j+1<r.length&&(L(r[j+1])||(/[ .:\/]/.test(r[j+1])&&j+2<r.length&&L(r[j+2]))))j++;if(j+1<r.length&&/[+\-]/.test(r[j+1])&&/[0-9]/.test(r[j]))j++;out.push(...r.slice(i,j+1).reverse().map(c=>MIRROR[c]||c));i=j+1;}
    else{out.push(r[i]);i++;}
  }
  return out.join('');
}
const prepCache=new Map();
function prepText(s){s=String(s);const k=LANG+'|'+s;let v=prepCache.get(k);if(v===undefined){v=visual(tr(s).toUpperCase());if(prepCache.size>4000)prepCache.clear();prepCache.set(k,v);}return v;}
const adv=ch=>{const h=HFONT[ch];return h?h.w+1:4;};
function setLang(l){LANG=l;try{localStorage.setItem('hc-lang',l);}catch(e){}syncLangUI();}

const LEGEND={
  en:'<b>Arrows / WASD</b> move &nbsp; <b>Z / Space</b> jump (A), hold for higher &nbsp; <b>X</b> attack (B): tap for a combo, the third hit launches &nbsp; <b>hold X</b> charge &nbsp; <b>Down + X in the air</b> dive &nbsp; <b>Up</b> special &nbsp; <b>Down</b> guard, double-tap to eject &nbsp; <b>Enter</b> start &nbsp; <b>Play: Enter</b> climb into a bigger empty body, or eject &nbsp; <b>Z + X together</b> (A+B) special: each body has its own power, fill POWER by landing hits; crates drop weapons &nbsp; walk into a dazed robot to grab, X to throw &nbsp; <b>Classic</b> (title menu): the map and duels &nbsp; <b>On the map: X</b> park or climb into your frame, <b>Enter</b> rig panel &nbsp; <b>L</b> עברית',
  he:'<b>חצים / WASD</b> תנועה &nbsp; <b>Z / רווח</b> קפיצה (A), החזק לגובה &nbsp; <b>X</b> מכה (B): הקש לקומבו, המכה השלישית מקפיצה &nbsp; <b>החזק X</b> טעינה &nbsp; <b>למטה + X באוויר</b> צלילה &nbsp; <b>למעלה</b> מיוחד &nbsp; <b>למטה</b> הגנה, פעמיים לפליטה &nbsp; <b>Enter</b> התחלה &nbsp; <b>במשחק: Enter</b> היכנס לגוף ריק גדול יותר, או פליטה &nbsp; <b>Z + X יחד</b> (A+B) מיוחד: לכל גוף כוח משלו, ממלאים כוח במכות; ארגזים מפילים נשקים &nbsp; לך לרובוט המום כדי לתפוס, X לזריקה &nbsp; <b>קלאסי</b> (בתפריט): המפה והדו־קרבות &nbsp; <b>במפה: X</b> חניית השלד או כניסה אליו, <b>Enter</b> לוח השלד &nbsp; <b>L</b> English'};
function syncLangUI(){
  const k=document.getElementById('keys'),b=document.getElementById('langBtn');
  k.innerHTML=LEGEND[LANG];k.dir=LANG==='he'?'rtl':'ltr';k.lang=LANG;
  b.textContent=LANG==='he'?'English':'עברית';
  document.documentElement.lang=LANG;document.title=(LANG==='he'?'הארדקור: האגדה של ראש בצל':'HARDCORE: Legend of Onion Head')+' v'+VERSION;
}
document.getElementById('langBtn').addEventListener('click',()=>setLang(LANG==='he'?'en':'he'));
syncLangUI();
// ---------- pixel font 3x5 ----------
const FONT={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',Q:'010101101110011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111',
'0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100110101010','7':'111001010010010','8':'010101010101010','9':'010101011001110',
'.':'000000000000010',',':'000000000010100','!':'010010010000010','?':'110001010000010',':':'000010000010000','-':'000000111000000','/':'001001010100100',"'":'010010000000000','>':'100010001010100','<':'001010100010001','+':'000010111010000','(':'010100100100010',')':'010001001001010'};
const textW=(s,sc=1)=>{s=prepText(s);let w=0;for(const ch of s)w+=adv(ch);return (w-1)*sc;};
function txt(s,x,y,col,sc=1,align='l'){
  s=prepText(s);
  let w=0;for(const ch of s)w+=adv(ch);w=(w-1)*sc;
  if(align==='c')x-=Math.floor(w/2);else if(align==='r')x-=w;
  x=Math.round(x);y=Math.round(y);
  let cx=x;
  for(const ch of s){
    if(ch==='@'){pixHex(cx+Math.floor(3*sc/2),y+Math.floor(5*sc/2),Math.round(sc*1.9),sc,col);g.fillStyle=C.mg;g.fillRect(cx+sc,y+2*sc,sc,sc);cx+=4*sc;continue;}
    const h=HFONT[ch];
    if(h){g.fillStyle=col;h.r.forEach((row,ri)=>{for(let i=0;i<h.w;i++)if(row[i]==='1')g.fillRect(cx+i*sc,y+(h.t+ri)*sc,sc,sc);});cx+=(h.w+1)*sc;continue;}
    const d=FONT[ch];
    if(d){g.fillStyle=col;for(let i=0;i<15;i++)if(d[i]==='1')g.fillRect(cx+(i%3)*sc,y+((i/3)|0)*sc,sc,sc);}
    cx+=4*sc;
  }
}
function txtS(s,x,y,col,sc=1,align='l',sh=C.void){txt(s,x+sc,y+sc,sh,sc,align);txt(s,x,y,col,sc,align);}

// ---------- pixel helpers ----------
function px(x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function pixHex(cx,cy,R,t,col,fill){
  cx=Math.round(cx);cy=Math.round(cy);
  const a=Math.max(1,Math.round(R*.866)),ri=R-t,ai=Math.round(ri*.866);
  g.fillStyle=col;
  for(let dy=-a;dy<=a;dy++){
    const hw=Math.round(R-(Math.abs(dy)/a)*(R/2)),y=cy+dy;
    if(fill||ai<1||Math.abs(dy)>=ai){g.fillRect(cx-hw,y,hw*2+1,1);}
    else{const hwi=Math.round(ri-(Math.abs(dy)/ai)*(ri/2));g.fillRect(cx-hw,y,hw-hwi,1);g.fillRect(cx+hwi+1,y,hw-hwi,1);}
  }
}
function pline(x0,y0,x1,y1,col){
  x0|=0;y0|=0;x1|=0;y1|=0;g.fillStyle=col;
  const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
  for(let i=0;i<600;i++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}
}
function bar(x,y,w,h,f,col,back){px(x,y,w,h,back);px(x,y,Math.max(0,Math.round(w*Math.max(0,Math.min(1,f)))),h,col);}
function pixCircle(cx,cy,r,col){cx=Math.round(cx);cy=Math.round(cy);g.fillStyle=col;for(let dy=-r;dy<=r;dy++){const w=Math.round(Math.sqrt(r*r-dy*dy));g.fillRect(cx-w,cy+dy,w*2+1,1);}}
function pent(cx,cy,col){g.fillStyle=col;[9,9,9,7,5,3,1].forEach((w,i)=>g.fillRect(Math.round(cx)-(w>>1),Math.round(cy)-3+i,w,1));}
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rnd=(a,b)=>a+Math.random()*(b-a);

// ---------- core (Onion Head) ----------
function drawCore(x,y,face,t,eyeOn=true,mood=''){
  x=Math.round(x);y=Math.round(y)-1;
  const s=mood==='angry'?0:Math.round(Math.sin(t*(mood==='idle'?.04:.08)));
  // sprout (stands straight when angry)
  px(x+2-s,y-3,1,3,C.cyd);px(x+3,y-5,1,5,C.cy);px(x+4+s,y-7,1,7,C.cy);px(x+5+s,y-4,1,4,C.cyd);px(x+4+s,y-8,1,1,C.mg);
  // a square shell with sharp corners, square side nubs, the crack where the plant grows
  px(x,y,8,8,C.cy);px(x+1,y+1,6,6,C.void);
  px(x-2,y+3,2,2,C.cyd);px(x+8,y+3,2,2,C.cyd);
  px(x+2,y,2,1,C.void);
  // a square ring eye (the deck's ring eye, squared)
  const ex=face>0?x+3:x+1,ey=y+2;
  if(!eyeOn){px(ex,ey,4,4,C.grd);px(ex+1,ey+1,2,2,C.void);return;}
  const blink=mood!=='angry'&&mood!=='hurt'&&(t%190)<5;
  if(blink){px(ex,ey+2,4,1,C.cyd);return;}
  px(ex,ey,4,4,mood==='angry'?C.mg:mood==='hurt'?((t>>1)&1?C.mg:C.wh):C.cyd);px(ex+1,ey+1,2,2,C.void);
  if(mood==='hurt')return;
  px(ex+1,ey+1,2,2,C.yl);
  if(mood==='angry'){px(face>0?ex:ex+2,ey-1,2,1,C.cy);}
  else if(mood==='curious'){px(face>0?ex+2:ex+1,ey+1,1,1,C.wh);px(ex,ey-1,4,1,C.cyd);}
  else if(mood==='idle'){px(ex,ey,4,2,C.cyd);}
  else px(face>0?ex+2:ex+1,ey+1,1,1,C.wh);
}

// ---------- mechs ----------
// atk modes: 0 none, 1 jab, 2 cross (back arm), 3 uppercut, 4 guard, 5 wind-up
// ---------- frames drawn after the deck's progression slides ----------
// flat blocks, a wide lid the core sits on, arm blocks with finger pegs, separate legs with feet
const FP={
  me:{hi:'#d4fff6',body:'#86d6c8',shade:'#529f95',deep:'#2b6366',mark:'#ffffff'},
  warn:{hi:'#fff6b0',body:'#ffe600',shade:'#c9a800',deep:'#7a6400',mark:'#ffffff'},
  husk:{hi:'#9a92b8',body:'#6e6488',shade:'#4c4466',deep:'#2c2640',mark:'#8a82a8'},
  hit:{hi:'#ffffff',body:'#ffffff',shade:'#ffffff',deep:'#ffffff',mark:'#ffffff'}
};
const FSHAPE={basic:{plate:4,steps:0,legs:'stub',chest:'tri',fist:0,pads:0},brute:{plate:6,steps:1,legs:'stub',chest:'tri',fist:2,pads:1},
  walker:{plate:2,steps:0,legs:'knee',chest:'tri',fist:0,pads:0},titan:{plate:8,steps:1,legs:'splay',chest:'pent',fist:1,pads:1},king:{plate:12,steps:2,legs:'splay',chest:'pent',fist:2,pads:1}};
function box(x,y,w,h,pal,dark){x=Math.round(x);y=Math.round(y);g.fillStyle=pal.line;g.fillRect(x,y,w,h);if(w>2&&h>2){g.fillStyle=dark?pal.dark:pal.fill;g.fillRect(x+1,y+1,w-2,h-2);}}
function drawFrame(x,fy,fid,s,face,ph,moving,atk,fp){
  atk=atk===true?1:(atk||0);x=Math.round(x);fy=Math.round(fy);
  const F=FSHAPE[fid]||FSHAPE.basic,big=s.tw>=20,ph2=big?3:2;
  const lw=s.lw||3,sw=moving?Math.sin(ph):0,cw=moving?Math.cos(ph):0;
  const stride=Math.max(1,Math.round(s.lh/4)),sx=Math.round(sw*stride),lift=Math.max(1,Math.round(s.lh/5));
  const liftA=cw>.35?lift:0,liftB=cw<-.35?lift:0,bob=moving?(Math.abs(sw)>.7?1:0):((T>>5)&1);
  const lean=(atk===2||atk===3)?face:0;
  const top=fy-s.lh-s.th+bob,tx=x-Math.floor(s.tw/2)+lean,torsoY=top+ph2,torsoH=s.th-ph2,pelY=fy-s.lh+bob;
  const swing=moving?Math.round(sw*Math.max(1,s.ah/6)):0;
  // ---- legs (back leg darker), drawn first
  const leg=(lx,liftv,col,front)=>{
    const L=s.lh-2-liftv,fx=front?face:face;
    if(F.legs==='knee'){const k=Math.floor(L/2);px(lx,pelY+2,lw,k,col);px(lx-face,pelY+2+k,lw,L-k,col);px(lx-face+(face>0?0:-2),fy-liftv-1,lw+2,1,col);}
    else if(F.legs==='splay'){const out=front?face:-face,k=Math.floor(L/2);px(lx,pelY+2,lw,k,col);px(lx+out,pelY+2+k,lw,L-k,col);px(lx+out-(face>0?0:3),fy-liftv-2,lw+3,2,col);}
    else{px(lx,pelY+2,lw,L,col);px(lx+(face>0?0:-1),fy-liftv-1,lw+1,1,col);}
  };
  const x0=x-Math.floor(s.tw/2),lb=x0+s.tw-1-lw-sx*face-1,lf=x0+1+sx*face+1;
  const legB=face>0?lf:lb,legF=face>0?lb:lf,liB=face>0?liftA:liftB,liF=face>0?liftB:liftA;
  leg(legB,liB,fp.shade,false);
  px(x-Math.floor((s.tw-2)/2),pelY,s.tw-2,2,fp.deep);
  leg(legF,liF,fp.body,true);
  // ---- back arm (shade)
  const armY=torsoY+1,armBack=face>0?tx-s.aw:tx+s.tw;
  const fingers=(ax,ay,aw,col)=>{if(aw>=3){px(ax,ay,1,2,col);px(ax+(aw>>1),ay,1,2,col);px(ax+aw-1,ay,1,2,col);}else px(ax,ay,aw,1,col);};
  const fist=(ax,ay,aw,col)=>{if(F.fist){px(ax-F.fist+(aw>>1)-1,ay,aw+F.fist*2-(aw>>1)+1,3+F.fist,col);}else fingers(ax,ay,aw,col);};
  if(atk!==2){px(armBack,armY+swing,s.aw,s.ah,fp.shade);fist(armBack,armY+swing+s.ah,s.aw,fp.shade);}
  // ---- torso: block, narrowing at the hips on the big frames, with a seam and the chest mark
  px(tx,torsoY,s.tw,torsoH,fp.body);
  if(big){px(tx,torsoY+torsoH-3,2,3,fp.shade);px(tx+s.tw-2,torsoY+torsoH-3,2,3,fp.shade);}
  px(tx,torsoY+torsoH-1,s.tw,1,fp.deep);px(face>0?tx+s.tw-2:tx+1,torsoY+2,1,torsoH-4,fp.shade);
  const mx=x+lean,my=torsoY+Math.max(2,Math.floor(torsoH/2)-2);
  if(F.chest==='pent'){g.fillStyle=fp.mark;[5,5,5,3,1].forEach((w,i)=>g.fillRect(mx-(w>>1),my+i,w,1));}
  else{px(mx,my,1,1,fp.mark);px(mx-1,my+1,3,1,fp.mark);px(mx-2,my+2,5,1,fp.mark);}
  // ---- the lid: a plate wider than the torso, stepped on the big frames
  const pw=s.tw+F.plate;px(x-Math.floor(pw/2)+lean,top,pw,ph2,fp.body);px(x-Math.floor(pw/2)+lean,top,pw,1,fp.hi);px(x-Math.floor(pw/2)+lean,top+ph2-1,pw,1,fp.deep);
  for(let k=1;k<=F.steps;k++){const w2=pw-k*6;px(x-Math.floor(w2/2)+lean,top-k*2,w2,2,fp.body);px(x-Math.floor(w2/2)+lean,top-k*2,w2,1,fp.hi);}
  const coreTop=top-F.steps*2;
  // ---- shoulder pads
  if(F.pads){const pw2=s.aw+2;px(face>0?tx+s.tw-2:tx-pw2+2,torsoY-1,pw2,3,fp.body);px(face>0?tx+s.tw-2:tx-pw2+2,torsoY-1,pw2,1,fp.hi);}
  // ---- front arm (body), by attack mode
  let hx,hy;
  if(atk===1){const ax=face>0?tx+s.tw-1:tx-s.ah+1;px(ax,armY+2,s.ah,s.aw,fp.body);const fx=face>0?ax+s.ah:ax-3;px(fx,armY+1,3,s.aw+2,fp.body);hx=face>0?ax+s.ah:ax;hy=armY+2+(s.aw>>1);}
  else if(atk===2){px(face>0?tx:tx+s.tw-s.aw,armY,s.aw,s.ah-2,fp.body);const ax=face>0?tx+s.tw-2:tx-s.ah+1;px(ax,armY+3,s.ah+1,s.aw,fp.shade);hx=face>0?ax+s.ah+1:ax;hy=armY+3+(s.aw>>1);}
  else if(atk===3){const ax=face>0?tx+s.tw-s.aw:tx;px(ax,armY-s.ah+3,s.aw,s.ah,fp.body);px(ax-1,armY-s.ah+1,s.aw+2,3,fp.body);hx=ax+(s.aw>>1);hy=armY-s.ah+3;}
  else if(atk===4){const ax=face>0?tx+s.tw-1:tx-s.aw+1;px(ax,armY,s.aw,Math.max(3,s.ah-3),fp.body);hx=face>0?ax+s.aw:ax-1;hy=armY;}
  else if(atk===5){const ax=face>0?tx-s.aw+2:tx+s.tw-2;px(ax,armY,s.aw,Math.max(3,s.ah-1),fp.body);hx=ax+(s.aw>>1);hy=armY+s.ah;}
  else{const ax=(face>0?tx+s.tw-1:tx-s.aw+1)+(moving?Math.round(-sw)*face:0);px(ax,armY-swing,s.aw,s.ah,fp.body);px(ax,armY-swing,s.aw,1,fp.hi);fist(ax,armY-swing+s.ah,s.aw,fp.body);hx=ax+(s.aw>>1);hy=armY-swing+s.ah;}
  return{topY:coreTop,hx,hy,lean};
}
// a body nested on top of another: sunk by its leg height and clipped at the lower body's top, so its legs stay hidden
function drawRider(top,lh,draw){g.save();g.beginPath();g.rect(-1e4,-1e4,2e4,1e4+Math.round(top));g.clip();const r=draw(Math.round(top)+lh);g.restore();return r;}
// the core's side domes ("additions" on the character sheet) appear once it is nested in a frame
function drawDomes(cx,cy,fp){px(cx-2,cy+2,2,3,fp.body);px(cx-3,cy+3,1,1,fp.shade);px(cx+8,cy+2,2,3,fp.body);px(cx+10,cy+3,1,1,fp.shade);}
function drawMech(x,fy,s,face,ph,moving,atk,pal){
  atk=atk===true?1:(atk||0);
  x=Math.round(x);fy=Math.round(fy);
  const lw=s.lw||3,sw=moving?Math.sin(ph):0,cw=moving?Math.cos(ph):0;
  const stride=Math.max(1,Math.round(s.lh/4)),sx=Math.round(sw*stride);
  const lift=Math.max(1,Math.round(s.lh/5)),lift1=cw>.35?lift:0,lift2=cw<-.35?lift:0;
  const bob=moving?(Math.abs(sw)>.7?1:0):((T+(x*7))>>5)&1;
  const lean=(atk===2||atk===3)?face:0;
  const tx0=x-Math.floor(s.tw/2),tx=tx0+lean,ty=fy-s.lh-s.th+bob;
  const swing=moving?Math.round(sw*Math.max(1,s.ah/6)):0;
  const lb=tx0+s.tw-1-lw-sx*face,lf=tx0+1+sx*face;
  const legB=face>0?lf:lb,legF=face>0?lb:lf,liftB=face>0?lift1:lift2,liftF=face>0?lift2:lift1;
  box(legB,fy-s.lh+bob,lw,s.lh-bob-liftB,pal,true);
  px(face>0?legB+lw:legB-1,fy-liftB-1,1,1,pal.line);
  box(legF,fy-s.lh+bob,lw,s.lh-bob-liftF,pal);
  px(face>0?legF+lw:legF-1,fy-liftF-1,1,1,pal.line);
  if(atk!==2)box(face>0?tx-s.aw+1:tx+s.tw-1,ty+2+swing,s.aw,s.ah,pal,true);
  box(tx,ty,s.tw,s.th,pal);
  if(s.th>=8){const mx=x+lean;px(mx,ty+3,1,1,pal.mark);px(mx-1,ty+4,3,1,pal.mark);px(mx-2,ty+5,5,1,pal.mark);}
  let hx,hy;
  if(atk===1){const ax=face>0?tx+s.tw-2:tx-s.ah+2;box(ax,ty+3,s.ah,s.aw,pal);hx=face>0?ax+s.ah:ax;hy=ty+3+(s.aw>>1);}
  else if(atk===2){const fa=face>0?tx:tx+s.tw-s.aw;box(fa,ty+2,s.aw,Math.max(3,s.ah-2),pal);const ax=face>0?tx+s.tw-3:tx-s.ah+2;box(ax,ty+4,s.ah+1,s.aw,pal,true);hx=face>0?ax+s.ah+1:ax;hy=ty+4+(s.aw>>1);}
  else if(atk===3){const ax=face>0?tx+s.tw-s.aw+1:tx-1;box(ax,ty-s.ah+4,s.aw,s.ah,pal);hx=ax+(s.aw>>1);hy=ty-s.ah+4;}
  else if(atk===4){const ax=face>0?tx+s.tw-1:tx-s.aw+1;box(ax,ty+1,s.aw,Math.max(3,s.ah-3),pal);hx=face>0?ax+s.aw:ax-1;hy=ty+1;}
  else if(atk===5){const ax=face>0?tx-s.aw+2:tx+s.tw-2;box(ax,ty+1,s.aw,Math.max(3,s.ah-1),pal);hx=ax+(s.aw>>1);hy=ty+s.ah;}
  else{const ax=(face>0?tx+s.tw-1:tx-s.aw+1)+(moving?Math.round(-sw)*face:0);box(ax,ty+2-swing,s.aw,s.ah,pal);hx=ax+(s.aw>>1);hy=ty+2-swing+s.ah;}
  return{topY:ty,hx,hy,lean};
}

// ---------- data ----------
const FR={
  core:{name:'CORE',code:'00',shell:0,slots:0,dmg:3,spd:1.5},
  basic:{name:'BASIC',code:'01',shell:40,slots:1,dmg:4,spd:1.25,s:{tw:10,th:9,lh:6,aw:3,ah:7,lw:3}},
  brute:{name:'BRUTE',code:'02',shell:70,slots:2,dmg:6,spd:1.05,s:{tw:16,th:12,lh:7,aw:5,ah:10,lw:4}},
  walker:{name:'WALKER',code:'03',shell:100,slots:3,dmg:8,spd:1.15,s:{tw:18,th:13,lh:12,aw:4,ah:12,lw:3}},
  titan:{name:'TITAN',code:'04',shell:140,slots:4,dmg:10,spd:1.1,s:{tw:20,th:15,lh:13,aw:5,ah:13,lw:4}},
  king:{name:'KING',code:'04',s:{tw:44,th:32,lh:26,aw:11,ah:30,lw:10}}
};
const MOM=FEEL.weight;
const MAPMOM={core:{a:.35,f:.72,v:1.55},basic:{a:.2,f:.8,v:1.25},brute:{a:.12,f:.88,v:1.0},walker:{a:.14,f:.86,v:1.05},titan:{a:.09,f:.91,v:.95}};
const FR_ORDER=['core','basic','brute','walker','titan'];
const SIZE={core:0,basic:1,brute:2,walker:3,titan:4,king:5};
function fixNest(){if(run.nest&&(run.frame==='core'||!run.frames.includes(run.nest)||SIZE[run.nest]>=SIZE[run.frame]))run.nest=null;}
const PARTS={
  glove:{name:'POWER GLOVE',desc:'+3 PUNCH',kind:'passive'},
  plate:{name:'ARMOR PLATE',desc:'+30 SHELL',kind:'passive'},
  sword:{name:'SWORD OF JUSTICE',desc:'LONG REACH',kind:'special'},
  hammer:{name:'HAMMER OF MIGHT',desc:'HEAVY SMASH',kind:'special'},
  laser:{name:'SHOULDER LASER',desc:'RANGED SHOT',kind:'special'},
  giant:{name:'GIANT SWORD',desc:'COLOSSAL SLASH',kind:'special'},
  heart:{name:'HEART SHIELD',desc:'EASIER PARRY',kind:'passive'},
  spare:{name:'SPARE CORE',desc:'+1 CORE',kind:'passive'},
  jets:{name:'JET BOOSTER',desc:'DOUBLE JUMP',kind:'passive'},
  rocket:{name:'ROCKET LAUNCH',desc:'SKY STRIKE',kind:'special'}
};
const TYPES={
  scrap:{name:'SCRAPPER',code:'01',hp:30,dmg:7,spd:.7,reach:10,wind:30,cd:60,tw:12,th:10,lh:5,aw:3,ah:7,lw:3,hw:8,hh:6,r:5},
  lancer:{name:'LANCER',code:'02',hp:46,dmg:9,spd:.8,reach:26,wind:34,cd:70,tw:8,th:12,lh:9,aw:2,ah:9,lw:2,hw:6,hh:6,r:5},
  brute:{name:'BRUTE',code:'02',hp:64,dmg:12,spd:.55,reach:14,wind:40,cd:80,tw:20,th:14,lh:7,aw:6,ah:12,lw:5,hw:8,hh:6,r:7},
  walker:{name:'WALKER',code:'03',hp:100,dmg:14,spd:.6,reach:20,wind:34,cd:66,tw:26,th:18,lh:14,aw:5,ah:14,lw:4,hw:14,hh:10,r:9},
  shaman:{name:'SHAMAN',code:'02',hp:52,dmg:9,spd:.7,reach:0,wind:34,cd:80,tw:8,th:10,lh:6,aw:2,ah:8,lw:1,hw:8,hh:7,r:6,float:true},
  colossus:{name:'COLOSSUS',code:'04',hp:200,dmg:18,boss:true,r:16},
  guard:{name:'SHIELDBOT',code:'02',hp:60,dmg:10,spd:.6,reach:12,wind:30,cd:70,tw:14,th:12,lh:7,aw:4,ah:10,lw:3,hw:8,hh:6,r:6,shield:true},
  bomber:{name:'BOMBER',code:'02',hp:56,dmg:8,spd:.55,reach:10,wind:26,cd:60,cd2:110,tw:16,th:13,lh:6,aw:3,ah:9,lw:3,hw:12,hh:10,r:7,ranged:true},
  hound:{name:'HOUND',code:'02',hp:46,dmg:11,spd:.9,reach:8,wind:20,cd:60,cd2:130,tw:22,th:9,lh:6,aw:0,ah:0,lw:2,hw:0,hh:2,r:7,dash:true},
  matry:{name:'MATRYOSHKA',code:'03',hp:255,dmg:12,r:12},
  warden:{name:'THE WARDEN',code:'04',hp:170,dmg:16,warden:true,r:14},
  maker:{name:'THE MAKER',code:'05',hp:280,dmg:20,boss:true,r:16,pal:'maker'},
  knight:{name:'THE WIND-UP KNIGHT',code:'04',hp:240,dmg:14,r:12},
  crab:{name:'THE HERMIT CRAB',code:'04',hp:200,dmg:12,r:14},
  crane:{name:'THE CRANE',code:'04',hp:230,dmg:16,r:14},
  toad:{name:'THE TOAD KING',code:'04',hp:230,dmg:16,r:16},
  cook:{name:'THE COOK',code:'05',hp:280,dmg:16,r:16},
  makercore:{name:'THE MAKER',code:'05',hp:140,dmg:12,spd:1.15,reach:14,wind:16,cd:36,tw:10,th:10,lh:8,aw:3,ah:8,lw:2,hw:10,hh:8,r:6,duelist:true,pal:'maker'}
};
const WW=640,WH=360;
const LEVELS=[
  {name:'THE BURIAL WASTE',start:{x:50,y:170},ground:C.void,grid:'#1a0a36',tuft:[C.cyx,C.mgd],edge:C.mg,bossHint:'THE COLOSSUS WAITS',
   solids:[{x:90,y:60,w:40,d:22,h:18},{x:230,y:40,w:30,d:30,h:26},{x:240,y:180,w:50,d:18,h:12},{x:380,y:250,w:34,d:26,h:22},{x:470,y:170,w:26,d:40,h:30},{x:60,y:240,w:28,d:20,h:14},{x:330,y:110,w:22,d:22,h:34},{x:570,y:220,w:40,d:20,h:16}].map(r=>({...r,kind:'ruin'})),
   foes:[
    {id:'s1',type:'scrap',x:180,y:120,drop:{part:'glove'}},
    {id:'s2',type:'scrap',x:310,y:250,drop:{part:'plate'}},
    {id:'l1',type:'lancer',x:140,y:300,drop:{part:'sword'}},
    {id:'b1',type:'brute',x:430,y:90,drop:{frame:'brute',part:'hammer'}},
    {id:'sh1',type:'shaman',x:400,y:205,drop:{part:'rocket'}},
    {id:'w1',type:'walker',x:510,y:300,drop:{frame:'walker',part:'laser'}},
    {id:'boss',type:'colossus',x:585,y:70,drop:{frame:'titan',part:'giant'},clear:1}]},
  {name:'THE PINE FOREST',start:{x:40,y:180},ground:'#040b12',grid:'#0b1c28',tuft:['#0b4a4a',C.cyx],edge:C.cy,bossHint:'THE WARDEN IS WATCHING',
   intro:['THE COLOSSUS FALLS.','ITS ARM POINTS NORTH, TO THE PINES.','SHELLY LIVED IN THE PINES.','ONION HEAD WALKS NORTH.'],
   solids:[{kind:'cabin',x:290,y:150,w:38,d:20,h:20}],
   landmark:{x:309,y:176,r:34,msg:"SHELLY'S HOUSE. THE DOOR IS OPEN."},
   foes:[
    {id:'g1',type:'guard',x:190,y:110,drop:{part:'heart'}},
    {id:'bm1',type:'bomber',x:430,y:270,drop:{part:'spare'}},
    {id:'l2',type:'lancer',x:120,y:300,drop:{}},
    {id:'sh2',type:'shaman',x:520,y:150,drop:{}},
    {id:'g2',type:'guard',x:330,y:300,drop:{}},
    {id:'war',type:'warden',x:585,y:60,drop:{part:'jets'},clear:2}]},
  {name:'THE FOUNDRY',start:{x:40,y:300},ground:'#0e0308',grid:'#2a0a18',tuft:[C.yld,C.mgx],edge:C.yl,bossHint:'THE MAKER IS AWAKE',
   intro:['THE WARDEN GOES QUIET.','ITS LAST SIGNAL CAME FROM THE FOUNDRY,','WHERE THE GIANTS ARE MADE.','THE ONE THAT TOOK SHELLY IS THERE.'],
   solids:[{kind:'block',x:100,y:50,w:44,d:24,h:26},{kind:'block',x:250,y:40,w:36,d:30,h:34},{kind:'block',x:360,y:150,w:30,d:30,h:30},{kind:'block',x:120,y:220,w:36,d:22,h:18},{kind:'block',x:540,y:180,w:40,d:24,h:28},{kind:'block',x:380,y:300,w:44,d:20,h:16},
     {kind:'vat',x:200,y:150,w:22,d:14,h:14},{kind:'vat',x:330,y:60,w:22,d:14,h:14},{kind:'vat',x:470,y:320,w:22,d:14,h:14},{kind:'vat',x:60,y:110,w:22,d:14,h:14}],
   foes:[
    {id:'h1',type:'hound',x:170,y:120,drop:{}},
    {id:'h2',type:'hound',x:300,y:290,drop:{}},
    {id:'bm2',type:'bomber',x:430,y:90,drop:{}},
    {id:'g3',type:'guard',x:470,y:255,drop:{}},
    {id:'w2',type:'walker',x:240,y:210,drop:{}},
    {id:'mk',type:'maker',x:585,y:70,drop:{},final:true}]}
];
const POCKETS=[
  [{id:'p1v',x:12,y:300,side:'r',gate:'vent',reward:{kind:'cell'}},
   {id:'p1c',x:140,y:12,side:'b',gate:'crack',reward:{kind:'memory',mem:0}},
   {id:'p1g',x:584,y:292,side:'l',gate:'glyph',reward:{kind:'part',part:'heart'}}],
  [{id:'p2v',x:20,y:16,side:'b',gate:'vent',reward:{kind:'memory',mem:1}},
   {id:'p2w',x:420,y:12,side:'b',gate:'water',reward:{kind:'cell'}},
   {id:'p2c',x:200,y:300,side:'t',gate:'crack',reward:{kind:'part',part:'spare'}}],
  [{id:'p3j',x:12,y:12,side:'r',gate:'chasm',reward:{kind:'memory',mem:2}},
   {id:'p3g',x:548,y:292,side:'l',gate:'glyph',reward:{kind:'cell'}}]
];
LEVELS.forEach((L,li)=>{
  L.gates=[];L.caches=[];L.pocketRects=[];
  for(const pk of POCKETS[li]){
    const PW=52,PH=40,TK=4,gw=14,x=pk.x,y=pk.y;L.pocketRects.push([x,y,x+PW,y+PH]);
    const walls=[];
    const addH=(yy,gap)=>{if(!gap){walls.push({x,y:yy,w:PW,d:TK});return;}const gx=x+(PW-gw)/2;walls.push({x,y:yy,w:gx-x,d:TK});walls.push({x:gx+gw,y:yy,w:x+PW-gx-gw,d:TK});L.gates.push({id:pk.id,kind:pk.gate,x:gx,y:yy,w:gw,d:TK,horiz:true});};
    const addV=(xx,gap)=>{if(!gap){walls.push({x:xx,y,w:TK,d:PH});return;}const gy=y+(PH-gw)/2;walls.push({x:xx,y,w:TK,d:gy-y});walls.push({x:xx,y:gy+gw,w:TK,d:y+PH-gy-gw});L.gates.push({id:pk.id,kind:pk.gate,x:xx,y:gy,w:TK,d:gw,horiz:false});};
    addH(y,pk.side==='t');addH(y+PH-TK,pk.side==='b');addV(x,pk.side==='l');addV(x+PW-TK,pk.side==='r');
    walls.forEach(w=>L.solids.push({...w,kind:'fence',h:9}));
    L.caches.push({id:pk.id,x:x+PW/2,y:y+PH/2+2,...pk.reward});
  }
});
(()=>{ // scatter pines, keeping clearings around robots, the start and the cabin
  let seed=7;const sr=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const L=LEVELS[1],pts=[];
  for(let i=0;i<400&&pts.length<48;i++){
    const x=(20+sr()*600)|0,y=(24+sr()*326)|0;
    if(L.foes.some(f=>Math.hypot(f.x-x,f.y-y)<28))continue;
    if(Math.hypot(L.start.x-x,L.start.y-y)<34)continue;
    if(x>270&&x<346&&y>130&&y<196)continue;
    if(L.pocketRects.some(r=>x>r[0]-12&&x<r[2]+12&&y>r[1]-10&&y<r[3]+16))continue;
    if(pts.some(p=>Math.hypot(p.x-x,p.y-y)<14))continue;
    pts.push({kind:'pine',x,y,w:8,d:4,h:(18+sr()*12)|0});
  }
  L.solids.push(...pts);
})();
LEVELS.forEach(l=>{l.tufts=[];for(let i=0;i<160;i++)l.tufts.push({x:rnd(0,WW)|0,y:rnd(0,WH)|0,c:Math.random()<.2?l.tuft[1]:l.tuft[0]});});
let LV=LEVELS[0];

// ---------- input ----------
const KEYS=['up','down','left','right','a','b','start','jump','lang','sp'];
const kb={},tc={},gp={},K={},P={},prev={},hit={};
const KMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',KeyZ:'a',KeyJ:'a',KeyX:'b',KeyK:'b',Space:'jump',Enter:'start',Escape:'b',KeyL:'lang',KeyC:'sp',ShiftLeft:'sp',ShiftRight:'sp'};
addEventListener('keydown',e=>{const k=KMAP[e.code];if(k){if(!e.repeat)hit[k]=true;kb[k]=true;e.preventDefault();initAudio();}});
addEventListener('keyup',e=>{const k=KMAP[e.code];if(k){kb[k]=false;e.preventDefault();}});
addEventListener('blur',()=>{for(const k of KEYS){kb[k]=false;tc[k]=false;}});
document.querySelectorAll('#pad button').forEach(b=>{
  const k=b.dataset.k;
  const on=e=>{e.preventDefault();tc[k]=true;hit[k]=true;b.classList.add('on');initAudio();};
  const off=e=>{e.preventDefault();tc[k]=false;b.classList.remove('on');};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('pointerleave',off);
  b.addEventListener('contextmenu',e=>e.preventDefault());
});
view.addEventListener('pointerdown',()=>{initAudio();if(state==='title')hit.start=true;});
function pollPad(){
  for(const k of KEYS)gp[k]=false;
  let pads=[];try{pads=navigator.getGamepads?navigator.getGamepads():[];}catch(e){pads=[];};let p=null;
  for(const x of pads)if(x){p=x;break;}
  if(!p)return;
  const ax=p.axes[0]||0,ay=p.axes[1]||0,b=i=>!!(p.buttons[i]&&p.buttons[i].pressed);
  gp.left=ax<-.5||b(14);gp.right=ax>.5||b(15);gp.up=ay<-.5||b(12);gp.down=ay>.5||b(13);
  gp.up=gp.up||(state!=='brawl'&&b(3));gp.sp=b(3);gp.a=b(0);gp.b=b(2);gp.jump=b(1);gp.start=b(9);
  if(KEYS.some(k=>gp[k]))initAudio();
}
function computeKeys(){for(const k of KEYS){const v=!!(kb[k]||tc[k]||gp[k]);P[k]=(v&&!prev[k])||!!hit[k];hit[k]=false;K[k]=v||P[k];prev[k]=v;}}

// ---------- audio ----------
let ac=null;
function initAudio(){if(ac)return;try{ac=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}
function beep(f,d=.08,type='square',v=.04,slide=0){
  if(!ac)return;const t=ac.currentTime,o=ac.createOscillator(),gn=ac.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
  gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn).connect(ac.destination);o.start(t);o.stop(t+d+.02);
}
function crunch(d=.15,v=.08){
  if(!ac)return;const n=ac.sampleRate*d|0,b=ac.createBuffer(1,n,ac.sampleRate),a=b.getChannelData(0);
  for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
  const s=ac.createBufferSource(),gn=ac.createGain();s.buffer=b;gn.gain.value=v;s.connect(gn).connect(ac.destination);s.start();
}

// ---------- state ----------
let state='title',T=0,hitstop=0,shake=0,glitch=.6;
let mapFx=[],memView=null,mines=[],strikes=[],eprojs=[],debris=[],bursts=[],plats=[],platPrev={},fightT=0;
let run=null,foes=[],pl=null,en=null,projs=[],parts=[],texts=[],result=null,prep=null,intro=null,curFoe=null,banner=null;
let cam={x:0,y:0},grace=0,mapT=0,deadT=0,endT=0;
function loadLevel(i){
  if(run.rig){run.frame=run.rig.frame;run.equip=run.rig.equip;run.nest=run.rig.nest||null;run.rig=null;}run.vx=run.vy=0;run.hint=null;
  run.level=i;LV=LEVELS[i];foes=LV.foes.map(f=>({...f,hx:f.x,hy:f.y,t:0,dx:0,dy:0}));
  run.px=LV.start.x;run.py=LV.start.y;run.cp={frames:run.frames.slice(),parts:run.parts.slice(),equip:run.equip.slice(),frame:run.frame,nest:run.nest};mapT=0;
}
function newRun(){
  run={frames:['core','basic'],parts:[],equip:[],frame:'basic',nest:null,known:{},beaten:{},px:0,py:0,level:0,cells:0,mems:0,got:{},opened:{},rig:null,vx:0,vy:0};loadLevel(0);
}
function spark(x,y,n,cols,sp=2,grav=.1){for(let i=0;i<n;i++)parts.push({x,y,vx:rnd(-sp,sp),vy:rnd(-sp*1.3,sp*.4),t:rnd(14,30)|0,c:cols[(Math.random()*cols.length)|0],gv:grav,s:Math.random()<.3?2:1});}
function say(s,x,y,c,life=45){texts.push({s,x,y,c,t:life,max:life});}
function kick(sh,gl){if(!reduce)shake=Math.max(shake,sh);glitch=Math.max(glitch,gl);}

// ---------- backgrounds ----------
withCtx(bg.getContext('2d'),()=>{
  const bands=[C.void,'#12052a',C.deep,'#1f0b40',C.plum];
  bands.forEach((c,i)=>{px(0,i*21,W,21,c);if(i>0)for(let x=0;x<W;x+=2)px(x+((i*21)&1),i*21-1,1,1,c);});
  // striped hex sun
  const sx=200,sy=68,R=30;
  for(let dy=-26;dy<=26;dy++){
    const a=Math.round(R*.866);if(Math.abs(dy)>a)continue;
    const hw=Math.round(R-(Math.abs(dy)/a)*(R/2));
    const f=(dy+26)/52,col=f<.35?C.yl:f<.6?'#ff8a3d':C.mg;
    if(dy>2&&((dy-2)%5<Math.min(3,1+((dy-2)/9|0))))continue;
    px(sx-hw,sy+dy,hw*2+1,1,col);
  }
  // city
  let x=0;while(x<W){const w=rnd(8,24)|0,h=rnd(10,34)|0;px(x,104-h,w,h,'#0a0220');for(let i=0;i<w*h/60;i++)px(x+1+rnd(0,w-2)|0,104-h+2+rnd(0,h-4)|0,1,1,Math.random()<.5?C.yld:C.cyx);x+=w+(rnd(0,3)|0);}
  // floor
  px(0,104,W,40,'#0b021c');
  for(let i=-16;i<=16;i++)pline(128+i*8,105,128+i*44,143,C.grid);
  [106,109,113,118,124,131,139].forEach(y=>px(0,y,W,1,C.grid));
  px(0,104,W,1,C.mg);
});
const bgs=[bg,mk(),mk()];
withCtx(bgs[1].getContext('2d'),()=>{
  ['#07051a','#08112a','#0a1a33','#0c2338','#0f2c3e'].forEach((c,i)=>{px(0,i*21,W,21,c);if(i>0)for(let x=0;x<W;x+=2)px(x+((i*21)&1),i*21-1,1,1,c);});
  pixHex(64,36,16,1,'#bff8ff',true);pixHex(64,36,16,1,C.cy);px(57,31,4,3,'#9ee6ef');px(68,40,3,2,'#9ee6ef');
  const pine=(cx,base,h,col,edge)=>{for(let i=0;i<h;i++){const w=Math.round(1+i*.4*(1-((i%7)/14)));px(cx-w,base-h+i,w*2+1,1,col);if(edge&&i%7===0)px(cx-w,base-h+i,w*2+1,1,edge);}px(cx-1,base,3,3,col);};
  for(let x=-6;x<W+10;x+=(rnd(8,14)|0))pine(x,104,rnd(26,44)|0,'#0a2034');
  for(let x=0;x<W+10;x+=(rnd(16,26)|0))pine(x,106,rnd(36,60)|0,'#061624',C.cyx);
  for(let i=0;i<26;i++)px(rnd(0,W)|0,rnd(44,100)|0,1,1,C.yl);
  px(0,104,W,40,'#040b12');
  for(let i=-16;i<=16;i++)pline(128+i*8,105,128+i*44,143,'#0b2230');
  [106,109,113,118,124,131,139].forEach(y=>px(0,y,W,1,'#0b2230'));
  g.globalAlpha=.22;px(0,95,W,8,'#9ee6ef');g.globalAlpha=1;
  px(0,104,W,1,C.cy);
});
withCtx(bgs[2].getContext('2d'),()=>{
  ['#12030b','#1f0512','#2e0719','#420b22','#5a102c'].forEach((c,i)=>{px(0,i*21,W,21,c);if(i>0)for(let x=0;x<W;x+=2)px(x+((i*21)&1),i*21-1,1,1,c);});
  pixHex(196,62,30,1,'#ff8a3d',true);pixHex(196,62,22,1,C.yl,true);pixHex(196,62,30,2,C.mg);
  for(let y=40;y<88;y+=6)px(166,y,62,2,'#5a102c');
  px(16,18,110,2,'#10030a');px(92,20,1,34,'#10030a');px(89,54,7,3,'#10030a');px(118,10,4,10,'#10030a');
  px(150,12,90,2,'#10030a');px(170,14,1,20,'#10030a');px(167,34,7,3,'#10030a');
  let x=0;while(x<W){const w=rnd(14,34)|0,h=rnd(18,46)|0;px(x,104-h,w,h,'#10030a');
    if(Math.random()<.5){const cx=x+(rnd(2,Math.max(3,w-6))|0),hc=rnd(10,22)|0;px(cx,104-h-hc,4,hc,'#10030a');px(cx-2,104-h-hc-6,7,4,'#3a1f2e');px(cx+1,104-h-hc-11,6,4,'#2d1824');}
    for(let i=0;i<w*h/70;i++)px(x+1+rnd(0,w-2)|0,104-h+2+rnd(0,h-4)|0,1,1,Math.random()<.6?C.yl:C.mgd);x+=w+(rnd(0,4)|0);}
  px(0,104,W,40,'#0e0308');
  for(let i=-16;i<=16;i++)pline(128+i*8,106,128+i*44,143,'#2a0a18');
  [109,113,118,124,131,139].forEach(y=>px(0,y,W,1,'#2a0a18'));
  for(let x=0;x<W;x+=8){px(x,104,4,2,C.yl);px(x+4,104,4,2,'#10030a');}
});

// backdrops for levels 3-7 (themes 3-7)
const skyBands=(cols)=>cols.forEach((c,i)=>{px(0,i*21,W,21,c);if(i>0)for(let x=0;x<W;x+=2)px(x+((i*21)&1),i*21-1,1,1,c);});
bgs.push(mk(),mk(),mk(),mk(),mk());
// 3 the Toy Works: shelves of toys, a hanging mobile, a rocking horse
withCtx(bgs[3].getContext('2d'),()=>{
  skyBands(['#0e0616','#140a1e','#1a0e26','#22122e','#2e1a3a']);
  for(let y=56;y<100;y+=22){px(0,y,W,2,'#3a2448');for(let x=4;x<W;x+=(rnd(9,16)|0)){const h=rnd(6,14)|0,c=['#ff5a7a','#5ac8ff','#ffd84a','#8a5aff'][(Math.random()*4)|0];px(x,y-h,rnd(4,7)|0,h,c);px(x+1,y-h+2,2,1,C.wh);}}
  pline(128,0,128,14,'#5a4a6a');px(104,14,48,1,'#5a4a6a');for(const mx of [104,128,151]){pline(mx,14,mx,20,'#5a4a6a');pixHex(mx,23,3,1,'#ffd84a',true);}
  const hx=200;px(hx-16,86,32,8,'#5a2a3a');px(hx+10,76,8,10,'#5a2a3a');px(hx+14,72,6,6,'#5a2a3a');px(hx-12,94,2,8,'#5a2a3a');px(hx+8,94,2,8,'#5a2a3a');for(let i=-20;i<=20;i++)px(hx+i,102-Math.round(Math.abs(i)*i*i/4000),1,2,'#7a3a4a');
  px(0,104,W,1,'#ff5a7a');
});
// 4 Hermit Harbour: moon over black water, a pier on stilts, boat hulls, a lighthouse
withCtx(bgs[4].getContext('2d'),()=>{
  skyBands(['#03080e','#06121c','#081826','#0a1e2e','#0c2433']);
  pixHex(60,26,11,1,'#e8f0d8',true);pixHex(60,26,11,1,'#ffd84a');
  px(0,78,W,26,'#0c2a3a');for(let i=0;i<60;i++)px(rnd(0,W)|0,rnd(80,103)|0,rnd(2,6)|0,1,Math.random()<.3?'#e8f0d8':'#1d4a5a');
  px(56,80,8,24,'#2a5a6a');px(58,82,4,1,'#e8f0d8');
  px(0,70,150,3,'#1d3a46');for(let x=4;x<150;x+=12)px(x,73,2,31,'#132a34');
  for(const [bx,bw2] of [[170,40],[214,30]]){px(bx,72,bw2,8,'#1d4a5a');px(bx+4,80,bw2-8,3,'#1d4a5a');px(bx+bw2/2-1,52,2,20,'#132a34');pline(bx+bw2/2,54,bx+bw2-2,70,'#132a34');}
  px(232,28,10,46,'#e8f0d8');for(let y=34;y<70;y+=10)px(232,y,10,4,'#c8344a');px(230,22,14,6,'#132a34');px(234,24,6,3,'#ffd84a');
  g.globalAlpha=.09;for(let i=0;i<26;i++)px(236-i*4,25-i*.3,i*2+2,2,'#ffd84a');g.globalAlpha=1;
  px(0,104,W,1,'#c9a46a');
});
// 5 the Magnet Yard: stacked car cubes, a far crane, sodium lamps
withCtx(bgs[5].getContext('2d'),()=>{
  skyBands(['#0a0703','#140e06','#1c1408','#26190a','#2e1e0c']);
  let x=0;while(x<W){const n=rnd(2,5)|0,w=rnd(16,24)|0;for(let i=0;i<n;i++){px(x,104-(i+1)*12,w,11,i%2?'#2a2010':'#33280f');px(x+2,104-(i+1)*12+3,w-4,1,'#5a4a2a');px(x+3,104-(i+1)*12+6,4,3,'#1a1206');}x+=w+(rnd(1,6)|0);}
  px(150,20,4,84,'#1a1206');px(110,20,90,3,'#1a1206');pline(190,23,190,50,'#1a1206');px(184,50,12,5,'#1a1206');
  for(const lx of [30,96,230]){px(lx,40,1,64,'#1a1206');px(lx-3,38,7,3,'#1a1206');g.globalAlpha=.25;for(let r=3;r<16;r+=3)px(lx-r,41,r*2,2+r,'#ff9a2a');g.globalAlpha=1;px(lx-1,41,3,1,'#ffcf6a');}
  px(0,104,W,1,'#ff9a2a');
});
// 6 the Gullet Bog: drowned machines, reeds, hanging moss, fireflies
withCtx(bgs[6].getContext('2d'),()=>{
  skyBands(['#050a05','#0b140c','#0f1c10','#142414','#182c18']);
  for(let x=-10;x<W+10;x+=(rnd(14,24)|0)){const h=rnd(40,70)|0;px(x,104-h,rnd(4,7)|0,h,'#0e1a0e');for(let i=0;i<4;i++)px(x-6+i*4,104-h,3,rnd(6,18)|0,'#16281a');}
  px(40,86,40,14,'#16281a');px(48,80,22,8,'#16281a');px(52,82,6,4,'#0b140c');px(62,82,6,4,'#0b140c');
  px(170,90,30,10,'#16281a');px(176,84,12,6,'#16281a');px(196,78,20,2,'#16281a');
  for(let x=0;x<W;x+=3){const h=rnd(6,22)|0;px(x,104-h,1,h,Math.random()<.5?'#2c4a2a':'#203a20');}
  for(let i=0;i<30;i++)px(rnd(0,W)|0,rnd(30,100)|0,1,1,'#c6ff4a');
  px(0,104,W,1,'#4a5a2a');
});
// 7 the Giant's Kitchen: table and chair legs like pillars, a counter overhead, a cat's eye in the dark
withCtx(bgs[7].getContext('2d'),()=>{
  skyBands(['#100804','#1a0f08','#22140a','#2a190c','#331e0e']);
  px(0,0,W,16,'#3a2414');px(0,16,W,3,'#22140a');px(150,19,6,30,'#c8344a');px(146,46,14,10,'#c8344a');for(let i=0;i<3;i++)px(147+i*4,48,2,6,'#f2f7ff');
  for(const [lx,w] of [[20,22],[110,16],[214,26]]){px(lx,19,w,85,'#3a2414');px(lx+2,19,3,85,'#5a3a20');px(lx,40,w,2,'#22140a');}
  for(const lx of [70,90]){px(lx,58,8,46,'#2a190c');}px(64,56,32,4,'#2a190c');
  px(176,78,30,22,'#0a0402');px(184,86,6,4,'#ffe600');px(198,86,6,4,'#ffe600');px(186,87,1,2,C.void);px(200,87,1,2,C.void);
  g.globalAlpha=.2;px(0,96,W,8,'#ff6a3d');g.globalAlpha=1;
  px(0,104,W,1,'#ff6a3d');
});

// ---------- flow ----------
const STORY=[
  'A WORLD OF HUMANS, ROBOTS AND MONSTERS OF EVERY SIZE.',
  'A GIRL FINDS A ROBOT HEAD BURIED IN THE DIRT.',
  'SHE FIXES IT. SHE TRAINS IT. SHE CALLS IT ONION HEAD.',
  'THEN A GIANT ROBOT CAME.',
  'TIME PASSES.',
  'MORE TIME PASSES.',
  'ONION HEAD IS ONLINE.',
  'DESTROY EVERY ROBOT BIGGER THAN YOU.'
];
function introDone(){if(intro&&intro.campaign)campaignStart();else{mapT=0;toMap();}}
function toMap(){state='map';glitch=1;beep(220,.2,'sawtooth',.04,400);}

function openPrep(f){
  prep={foe:f,cur:run.parts.length+2,msg:'',msgT:0};
  state='prep';kick(0,.9);beep(880,.12,'square',.04,-600);
}
function slotsOf(fid){return FR[fid].slots;}
function trimEquip(){const n=slotsOf(run.frame);run.equip=run.equip.filter(p=>run.parts.includes(p)).slice(0,n);}
function bestFrame(){for(let i=FR_ORDER.length-1;i>=0;i--)if(run.frames.includes(FR_ORDER[i]))return FR_ORDER[i];return 'core';}

function startFight(foe){
  const TT=TYPES[foe.type],f=FR[run.frame],isCore=run.frame==='core',eq=isCore?[]:run.equip,sc=scaled(TT,foe.type,run.level);
  const shellMax=isCore?0:f.shell+(eq.includes('plate')?30:0),coreMax=3+(eq.includes('spare')?1:0)+(run.cells||0);
  pl={x:48,y:GY,vx:0,vy:0,kb:0,face:1,fid:run.frame,husks:[],inner:(!isCore&&run.nest)?{fid:run.nest,shell:FR[run.nest].shell,shellMax:FR[run.nest].shell}:null,mode:isCore?'core':'frame',shell:shellMax,shellMax,core:coreMax,coreMax,
      atk:0,hitAt:0,atkKind:null,cd:0,cdMax:1,inv:0,onG:true,ejected:false,broken:false,husk:null,lost:[],walk:0,stepN:0,
      combo:0,comboWin:0,queued:false,coyote:0,jbuf:0,jcut:false,land:0,charge:0,bHold:0,hits:0,hitT:0,hitLanded:false,guard:false,guardT:0,lastDown:-99,still:0,spin:0,trail:[],hiT:0,plat:null,boot:isCore?20:44,
      heart:eq.includes('heart'),jets:eq.includes('jets'),usedAir:false,stun:0,
      special:isCore?null:(eq.find(p=>PARTS[p].kind==='special')||null),glove:eq.includes('glove')};
  en={type:foe.type,T:TT,name:sc.name,dmg:sc.dmg,x:TT.warden?128:200,y:TT.float?GY-12:TT.warden?40:GY,hp:sc.hp,max:sc.hp,
      st:TT.boss?'idle':'walk',t:TT.boss?90:40,face:-1,hurt:0,hurtHead:0,k:0,fx:0,fy:0,tx:128,shk:0,moving:false,walk:0,bob:0,cd2:0,gone:false,
      t2:TT.cd2||90,turnT:0,lock:0,lx:48,dropT:120,wT:0,landed:false,combo2:false};
  if(TT.boss){en.fx=en.x-66;en.fy=GY-44;}
  projs=[];eprojs=[];parts=[];texts=[];debris=[];bursts=[];plats=[];platPrev={};mines=[];strikes=[];fightT=0;
  curFoe=foe;state='fight';banner={s:'FIGHT',t:60};kick(0,1);crunch(.25,.06);
}
function pdims(){if(pl.mode==='core')return{w:8,h:11};const s=FR[pl.fid].s;return{w:s.tw+2,h:s.lh+s.th+7};}
function erect(){
  if(en.T.warden)return[en.x-14,en.y-14,en.x+14,en.y+14];
  if(en.T.boss){const k=Math.round(en.k);return[en.x-44,GY-97+k,en.x+44,GY];}
  const s=en.T,h=s.lh+s.th+s.hh;return[en.x-s.tw/2-1,en.y-h,en.x+s.tw/2+1,en.y];
}
const overlap=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];

// lost & broken: a mech comes apart into physical pieces
function breakApart(x,fy,s,pal,hw,hh){
  const add=(x0,y0,w,h,dark)=>debris.push({x:x0,y:y0,w,h,vx:rnd(-2.6,2.6),vy:rnd(-4.2,-1.5),pal,dark,rest:false,sp:(Math.random()*6)|0});
  const lw=s.lw||3,tx=x-s.tw/2,ty=fy-s.lh-s.th;
  add(tx+1,fy-s.lh,lw,s.lh);add(tx+s.tw-1-lw,fy-s.lh,lw,s.lh,true);
  add(tx,ty,s.tw,s.th);add(tx-s.aw,ty+2,s.aw,s.ah,true);add(tx+s.tw,ty+2,s.aw,s.ah);
  if(hw)add(x-hw/2,ty-hh,hw,hh);
  debris.push({x:x-2,y:ty+3,w:5,h:3,vx:rnd(-1,1),vy:-5,tri:true,rest:false,sp:0});
}

function hitEnemy(box4,d,heavy,hx,hy,force,launch){
  if(en.st==='dead'||en.gone||en.st==='phase')return false;
  if(!overlap(box4,erect()))return false;
  let crit=false;
  if(en.T.boss){
    const k=Math.round(en.k),head=[en.x-11,GY-97+k,en.x+11,GY-81+k];
    if(overlap(box4,head)){crit=true;d*=2;en.hurtHead=10;}
    else if(en.st!=='kneel'&&!force){spark(hx,hy,5,[C.wh,C.gr],1.5);say('CLANG',hx,hy-10,C.gr,30);beep(1400,.05,'square',.03);kick(1,.15);return true;}
  }
  const front=(hx-en.x)*en.face>0;
  let guardBroke=false;
  if(!force&&en.T.shield&&front&&['walk','wind','rec'].includes(en.st)){
    if(!heavy){spark(hx,hy,5,[C.yl,C.wh],1.5);say('BLOCKED',hx,hy-10,C.yl,30);beep(1100,.05,'square',.03);kick(1,.15);pl.kb-=pl.face*1.2;return true;}
    guardBroke=true;say('GUARD BREAK',en.x,en.y-36,C.yl,50);beep(300,.2,'square',.05,-200);
  }
  if(!force&&en.T.duelist&&front&&(en.st==='walk'||en.st==='rec')&&!heavy&&Math.random()<.35){
    spark(hx,hy,10,[C.mg,C.wh],2);say('PARRIED',pl.x,pl.y-pdims().h-10,C.mg,45);beep(1800,.12,'square',.05,-600);
    pl.stun=40;pl.kb=-pl.face*2;pl.atk=0;pl.atkKind=null;en.st='wind';en.t=10;en.face=pl.x<en.x?-1:1;hitstop=6;kick(2,.6);return true;
  }
  if(en.T.warden){if(en.st==='down')d=Math.round(d*1.5);else if(force){en.st='down';en.t=180;en.landed=false;say('DOWNED',en.x,en.y-20,C.yl,60);}}
  en.hp-=d;en.hurt=8;hitstop=crit?8:heavy?6:3;
  pl.hitLanded=true;pl.hits=pl.hitT>0?pl.hits+1:1;pl.hitT=90;
  if(!en.T.boss&&!en.T.warden){
    en.x=clamp(en.x+pl.face*(heavy?6:2),16,246);
    if(launch&&!en.T.float&&!guardBroke){en.st='air';en.vy=-4.4;en.avx=pl.face*.7;en.moving=false;say('LAUNCH',en.x,en.y-34,C.cy,26);}
    else if(en.st==='air'){en.vy=Math.min(en.vy,-2.3);en.avx=pl.face*.5;}
    else if(heavy||guardBroke){en.st='stun';en.t=guardBroke?70:28;en.moving=false;}
    else if(en.st==='walk')en.t=Math.max(en.t,8);
  }
  spark(hx,hy,heavy||crit?14:7,[C.yl,C.mg,C.wh],heavy?3:2);
  say(crit?'CRIT '+d:String(d),hx,hy-8,crit?C.mg:C.yl,crit?45:30);
  kick(heavy||crit?5:2,heavy||crit?.6:.25);beep(heavy?120:crit?1600:300,.1,'square',.06,crit?-1200:-80);crunch(heavy?.18:.07,heavy?.1:.05);
  if(en.type==='maker'&&en.hp<=en.max/2){en.hp=Math.ceil(en.max/2);en.st='phase';en.t=100;say('ITS SHELL IS CRACKING',en.x-40,GY-20,C.yl,70);beep(80,.9,'sawtooth',.06,60);return true;}
  if(en.hp<=0){
    en.hp=0;en.st='dead';kick(6,1);crunch(.4,.12);beep(90,.5,'sawtooth',.06,-60);
    if(en.T.boss||en.T.warden)en.t=110;
    else{en.t=55;en.gone=true;const s=en.T;breakApart(en.x,en.y,s,en.T.pal==='maker'?PAL.maker:PAL.foe,s.hw,s.hh);spark(en.x,en.y-12,20,[C.mg,C.yl,C.wh],3);}
  }
  return true;
}

// returns 'miss' | 'parry' | 'block' | 'hit'
function hurtPlayer(d,srcX,unb){
  if(pl.inv>0||en.st==='dead'||pl.boot>0||state!=='fight')return 'miss';
  const d4=pdims(),front=(srcX-pl.x)*pl.face>0;
  if(pl.guard&&front&&!unb){
    if(pl.guardT<=(pl.heart?18:10)){
      hitstop=8;kick(2,.8);say('PARRY',pl.x,pl.y-d4.h-10,C.yl,50);spark(pl.x+pl.face*8,pl.y-d4.h/2,14,[C.yl,C.wh],2.5);beep(1800,.12,'square',.05,-600);
      if(!en.T.boss&&!en.T.warden&&en.st!=='dead'){en.st='stun';en.t=60;en.x+=pl.face*6;en.moving=false;}
      pl.guardT=99;pl.inv=10;return 'parry';
    }
    const dd=Math.max(1,Math.round(d*(pl.heart?.1:.25)));pl.shell-=dd;pl.kb=-pl.face*1.6;pl.inv=12;
    say('BLOCK',pl.x,pl.y-d4.h-8,C.cy,30);spark(pl.x+pl.face*7,pl.y-d4.h/2,6,[C.cy,C.wh],1.5);beep(900,.05,'square',.04);kick(1,.2);
    if(pl.shell<=0){pl.shell=0;shellBreak();}
    return 'block';
  }
  pl.inv=45;pl.kb=srcX>pl.x?-3:3;hitstop=4;kick(4,.7);beep(80,.18,'sawtooth',.07,-40);crunch(.12,.08);
  spark(pl.x,pl.y-d4.h/2,10,[C.cy,C.wh,C.mg],2.5);
  if(pl.mode==='frame'){
    pl.shell-=d;say('-'+d,pl.x,pl.y-d4.h-6,C.mg,30);
    if(pl.shell<=0){pl.shell=0;shellBreak();}
  }else{
    pl.core--;say('CORE HIT',pl.x,pl.y-20,C.mg,40);
    if(pl.core<=0){pl.core=0;state='dead';deadT=0;kick(8,1);crunch(.6,.12);beep(60,.8,'sawtooth',.07,-30);}
  }
  return 'hit';
}
function canEject(){return pl.mode==='frame'&&(pl.inner||!pl.ejected);}
function dropToInner(){
  const n=pl.inner;pl.fid=n.fid;pl.shell=n.shell;pl.shellMax=n.shellMax;pl.inner=null;
  pl.guard=false;pl.atk=0;pl.atkKind=null;pl.charge=0;pl.vy=-3.8;pl.onG=false;pl.plat=null;pl.inv=40;pl.boot=0;
}
function eject(){
  pl.husks.push({x:pl.x,fid:pl.fid,face:pl.face});
  if(pl.inner){const nm=FR[pl.inner.fid];dropToInner();pl.kb=-pl.face*2.2;pl.ejected=true;banner={s:'EJECT',t:50};kick(3,.9);beep(600,.25,'square',.05,900);say('FRAME '+nm.code+' '+nm.name,pl.x,pl.y-40,C.cy,60);spark(pl.x,pl.y-20,12,[C.cy,C.wh],2);return;}
  pl.mode='core';pl.ejected=true;pl.guard=false;pl.vy=-4.4;pl.onG=false;pl.plat=null;pl.kb=-pl.face*2.5;pl.atk=0;pl.atkKind=null;pl.inv=30;pl.spin=1;pl.trail=[];
  banner={s:'EJECT',t:50};kick(3,.9);beep(600,.25,'square',.05,900);
}
function shellBreak(){
  const fid=pl.fid;
  breakApart(pl.x,pl.y,FR[fid].s,PAL.husk,0,0);
  if(pl.inner){
    run.frames=run.frames.filter(f=>f!==fid);pl.lost.push('FRAME '+FR[fid].code+' '+FR[fid].name);
    dropToInner();spark(pl.x,pl.y-10,20,[C.cy,C.gr,C.wh],3.5,.15);
    banner={s:'SHELL BREAK',t:60};kick(7,1);crunch(.35,.12);say('LAYER LOST',pl.x,pl.y-40,C.yl,90);return;
  }
  pl.mode='core';pl.broken=true;pl.guard=false;pl.atk=0;pl.atkKind=null;pl.vy=-3.4;pl.onG=false;pl.plat=null;pl.inv=50;pl.spin=1;pl.trail=[];
  if(fid!=='core'){run.frames=run.frames.filter(f=>f!==fid);pl.lost.push('FRAME '+FR[fid].code+' '+FR[fid].name);}
  if(run.equip.length){const p=run.equip[(Math.random()*run.equip.length)|0];run.parts=run.parts.filter(x=>x!==p);run.equip=run.equip.filter(x=>x!==p);pl.lost.push(PARTS[p].name);}
  spark(pl.x,pl.y-10,20,[C.cy,C.gr,C.wh],3.5,.15);
  banner={s:'SHELL BREAK',t:60};kick(7,1);crunch(.35,.12);say('BACK 2 KNIFE',pl.x,pl.y-34,C.yl,90);
}
function finishFight(){
  const foe=curFoe,lines=[],lost=pl.lost.slice();
  run.beaten[foe.id]=true;run.known[foe.type]=true;if(foe.type==='maker')run.known.makercore=true;run.fights=(run.fights||0)+1;
  if(foe.final){state='ending';endT=0;glitch=1;parts=[];return;}
  if(foe.drop.frame&&!run.frames.includes(foe.drop.frame)){run.frames.push(foe.drop.frame);lines.push('FRAME '+FR[foe.drop.frame].code+' '+FR[foe.drop.frame].name);}
  if(foe.drop.part&&!run.parts.includes(foe.drop.part)){run.parts.push(foe.drop.part);lines.push(PARTS[foe.drop.part].name);}
  if(pl.husks.length)lines.push('YOUR FRAME, RECOVERED');
  if(!run.nestTip&&run.frames.filter(f=>f!=='core').length>1){run.nestTip=true;lines.push('NEW: NEST A FRAME IN BATTLE PREP');}
  if(!run.frames.includes(run.frame))run.frame=bestFrame();
  trimEquip();fixNest();
  result={lines,lost,name:en.name,next:foe.clear!=null?foe.clear:null};state='result';glitch=.8;beep(660,.1,'square',.04);setTimeout(()=>beep(990,.15,'square',.04),110);
}
function reboot(){
  run.rig=null;run.vx=run.vy=0;
  const cp=run.cp;run.frames=cp.frames.slice();run.parts=cp.parts.slice();run.equip=cp.equip.slice();run.frame=cp.frame;run.nest=cp.nest||null;
  if(!run.frames.includes(run.frame))run.frame=bestFrame();trimEquip();fixNest();
  run.px=LV.start.x;run.py=LV.start.y;grace=90;mapT=0;toMap();
}

// ---------- update ----------
function step(){
  T++;pollPad();computeKeys();
  if(P.lang)setLang(LANG==='he'?'en':'he');
  if(hitstop>0){hitstop--;return;}
  if(state==='title'){
    if(Math.random()<.02)glitch=Math.max(glitch,.45);
    if(P.up||P.down){titleSel=1-titleSel;beep(700,.04,'square',.03);glitch=Math.max(glitch,.3);}
    if(P.start||P.a||P.jump){if(titleSel===0){newRun();intro={i:0,c:0,campaign:true};state='intro';glitch=1;beep(440,.15,'square',.04,660);}else{newRun();intro={i:0,c:0};state='intro';glitch=1;beep(440,.15,'square',.04,440);}}
  }else if(state==='intro'){
    const SL=intro.lines||STORY,line=tr(SL[intro.i]);intro.c+=.8;
    if(!intro.lines&&intro.i===3&&intro.c<2)kick(6,1);
    if(Math.floor(intro.c)%3===0&&intro.c<line.length)beep(1200+Math.random()*300,.02,'square',.015);
    if(P.start){introDone();}
    else if(P.a||P.jump){if(intro.c<line.length)intro.c=line.length;else{intro.i++;intro.c=0;glitch=Math.max(glitch,.35);if(intro.i>=SL.length){introDone();}}}
  }else if(state==='map')stepMap();
  else if(state==='prep')stepPrep();
  else if(state==='memory'){memView.t++;if(memView.t>14&&(P.a||P.b||P.start||P.jump)){state='map';grace=30;memView=null;glitch=.4;}}
  else if(state==='fight')stepFight();
  else if(state==='result'){if(P.a||P.start||P.jump){if(result.next!=null){loadLevel(result.next);intro={lines:LV.intro,i:0,c:0};state='intro';glitch=1;}else{state='map';grace=60;glitch=.8;}}}
  else if(state==='dead'){deadT++;if(deadT>60&&(P.a||P.start||P.jump))reboot();}
  else if(state==='brawl')stepBrawl();
  else if(state==='bover'){bw.endT++;if(bw.endT>60&&(P.a||P.start)){retrySection();}else if(bw.endT>60&&P.b){state='title';glitch=1;}}
  else if(state==='ending'){endT++;if(endT>120&&(P.a||P.start)){state='title';glitch=1;}}
  for(const p of parts){if(p.ring){p.t--;continue;}p.x+=p.vx;p.y+=p.vy;p.vy+=p.gv;p.t--;if(p.y>GY+6&&state==='fight'){p.y=GY+6;p.vy*=-.4;p.vx*=.7;}}
  parts=parts.filter(p=>p.t>0);
  for(const t of texts){t.y-=.4;t.t--;}texts=texts.filter(t=>t.t>0);
  if(banner&&--banner.t<=0)banner=null;
  shake*=.8;if(shake<.3)shake=0;
}

// ---------- v1.2: the rig, gates and pockets on the map ----------
const hsh=(x,y)=>{let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967295;};
function gatePass(gt){
  if(run.opened[gt.id])return true;
  if(gt.kind==='vent')return run.frame==='core';
  if(gt.kind==='water')return run.frame==='walker'||run.frame==='titan';
  if(gt.kind==='chasm')return run.frame!=='core'&&run.equip.includes('jets');
  return false;
}
const inGate=kind=>LV.gates.find(gt=>gt.kind===kind&&run.px>gt.x-5&&run.px<gt.x+gt.w+5&&run.py>gt.y-5&&run.py<gt.y+gt.d+5);
function hint(s){if(!run.hint||run.hint.s!==s||run.hint.t<20)run.hint={s,t:120};}
const GATE_NEED={vent:'ONLY THE CORE FITS. B: PARK THE RIG',crack:'NEEDS THE HAMMER OF MIGHT',glyph:'NEEDS THE SHOULDER LASER',chasm:'NEEDS THE JET BOOSTER',water:'TOO DEEP. NEEDS A WALKER OR TITAN'};
function mapBurst(x,y,cols,n){for(let i=0;i<n;i++)mapFx.push({x,y,vx:rnd(-1.5,1.5),vy:rnd(-1.6,1),t:rnd(18,32)|0,c:cols[i%cols.length]});}
function touchGate(gt){
  if(run.opened[gt.id])return;
  const cx=gt.x+gt.w/2,cy=gt.y+gt.d/2,armed=run.frame!=='core';
  if(gt.kind==='crack'&&armed&&run.equip.includes('hammer')){run.opened[gt.id]=true;mapBurst(cx,cy,[C.gr,C.grd,C.yl],20);crunch(.3,.1);beep(90,.3,'square',.06,-40);glitch=Math.max(glitch,.5);hint('SMASH');return;}
  if(gt.kind==='glyph'&&armed&&run.equip.includes('laser')){run.opened[gt.id]=true;mapBurst(cx,cy,[C.cy,C.wh,C.mg],20);beep(1500,.3,'sawtooth',.04,-1200);glitch=Math.max(glitch,.6);hint('ZAP');return;}
  hint(GATE_NEED[gt.kind]);
}
function parkRig(){
  run.rig={x:run.px,y:run.py,frame:run.frame,equip:run.equip.slice(),nest:run.nest};run.frame='core';run.equip=[];run.nest=null;
  mapBurst(run.px,run.py-6,[C.cy,C.wh],10);beep(600,.25,'square',.05,900);glitch=Math.max(glitch,.5);hint('RIG PARKED');
}
function enterRig(){
  const r=run.rig;run.frame=r.frame;run.equip=r.equip;run.nest=r.nest||null;run.rig=null;run.px=r.x;run.py=r.y;run.vx=run.vy=0;
  mapBurst(run.px,run.py-6,[C.cy,C.yl,C.wh],14);beep(180,.1,'square',.05,-60);setTimeout(()=>beep(880,.08,'square',.04,440),120);glitch=Math.max(glitch,.5);hint('BACK IN THE RIG');
}
function collect(c){
  run.got[c.id]=true;mapBurst(c.x,c.y-4,[C.yl,C.wh,C.cy],16);
  if(c.kind==='cell'){run.cells=(run.cells||0)+1;hint('CORE CELL: +1 CORE');[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.15,'square',.04),i*70));}
  else if(c.kind==='part'){if(!run.parts.includes(c.part))run.parts.push(c.part);hint(PARTS[c.part].name);beep(660,.1,'square',.04);setTimeout(()=>beep(990,.15,'square',.04),110);}
  else{run.mems=(run.mems||0)+1;memView={i:c.mem,t:0};state='memory';beep(392,.8,'sine',.04);setTimeout(()=>beep(587,.8,'sine',.03),150);}
}
const FENCE=[{top:'#2a1450',front:'#150830',edge:C.cyd},{top:'#0b3040',front:'#06202a',edge:C.cyd},{top:'#2a0a18',front:'#16040c',edge:C.yld}];
function drawGate(gt,x,y){
  const op=run.opened[gt.id],F=FENCE[run.level],h=9,fy=y+gt.d-h,cx=x+gt.w/2,cy=y+gt.d/2,pul=(T>>4)&1;
  const block=()=>{px(x,y-h,gt.w,gt.d,F.top);px(x,fy,gt.w,h,F.front);px(x,y-h,gt.w,1,F.edge);};
  if(gt.kind==='vent'){
    block();const vx0=gt.horiz?cx-5:x-1,vy0=gt.horiz?fy+2:cy-4,vw=gt.horiz?10:gt.w+2,vh=gt.horiz?h-2:8;
    px(vx0,vy0,vw,vh,C.void);px(vx0,vy0,vw,1,C.cyd);for(let i=1;i<vw;i+=2)px(vx0+i,vy0+1,1,vh-1,'#1d1036');
    if(!run.rig&&run.frame==='core'&&pul)px(cx,vy0-3,1,2,C.cy);
  }else if(gt.kind==='crack'){
    if(op){px(x,y,gt.w,gt.d,C.void);for(let i=0;i<7;i++)px(x+((i*5)%gt.w),y+((i*3)%Math.max(1,gt.d))-2,2,1,F.edge);return;}
    block();for(let i=0;i<4;i++){px(x+2+i*3,fy+1+((i%2)*3),2,1,C.yl);px(x+3+i*3,fy+3-((i%2)*2),1,2,C.wh);}
  }else if(gt.kind==='glyph'){
    if(op){px(x,y-h,1,gt.d+h,C.cyd);px(x+gt.w-1,y-h,1,gt.d+h,C.cyd);return;}
    px(x,y-h,gt.w,gt.d+h,C.cyx);px(x,y-h,gt.w,1,C.cy);pixHex(cx,y-h/2+gt.d/2,3,1,pul?C.cy:C.cyd);px(cx,y-h/2+gt.d/2,1,1,C.mg);
  }else if(gt.kind==='chasm'){
    const ex=gt.horiz?0:6,ey=gt.horiz?6:0;px(x-ex,y-ey,gt.w+ex*2,gt.d+ey*2,'#02010a');px(x-ex,y-ey,gt.w+ex*2,1,C.grd);
    if((T>>2)%6===0)px(cx+rnd(-4,4),cy+rnd(-3,3),1,1,C.gr);
  }else if(gt.kind==='water'){
    const ex=gt.horiz?0:6,ey=gt.horiz?6:0;px(x-ex,y-ey,gt.w+ex*2,gt.d+ey*2,'#0b3a5a');
    for(let i=0;i<3;i++){const wx=x-ex+((T*.3+i*9)%(gt.w+ex*2));px(wx,y-ey+2+i*4,3,1,C.cyd);}
  }
}
function drawCache(c,x,y){
  if(run.got[c.id])return;const b=Math.round(Math.sin(T*.08+c.x)*1.5);
  px(x-4,y+1,8,2,C.void);
  if(c.kind==='cell'){pixHex(x,y-5+b,4,1,C.yl,true);px(x-1,y-6+b,2,2,C.wh);}
  else if(c.kind==='memory'){px(x-3,y-7+b,6,1,C.mg);px(x-4,y-6+b,1,3,C.mg);px(x+2,y-6+b,1,3,C.mg);px(x-3,y-3+b,6,1,C.mg);px(x+3,y-9+b,2,2,C.yl);}
  else{px(x-4,y-10+b,9,8,C.yl);px(x-3,y-9+b,7,6,C.void);px(x-1,y-7+b,3,2,C.yl);}
  if((T+c.x)%50<6)px(x+rnd(-4,4),y-rnd(6,12),1,1,C.wh);
}
function drawRig(r,x,y){
  const H=FP.husk,big=r.frame!=='basic'?1:0;
  px(x-4,y+1,8,2,C.void);px(x-3,y,2,2,H.shade);px(x+1,y,2,2,H.body);
  px(x-3-big,y-4,6+big*2,4,H.body);px(x-4-big,y-5,8+big*2,1,H.hi);px(x-5-big,y-3,1,3,H.shade);px(x+4+big,y-3,1,3,H.body);px(x-2,y-7,4,2,C.void);
  if((T>>3)&1){px(x-1,y-13,3,1,C.yl);px(x,y-12,1,1,C.yl);}
}
function drawRigPanel(){
  const R=[130,18,122,122];px(R[0],R[1],R[2],R[3],C.cy);px(R[0]+1,R[1]+1,R[2]-2,R[3]-2,C.void);
  txt(LV.name,191,24,C.yl,1,'c');
  txt('CORE CELLS',138,38,C.cyd);for(let i=0;i<3;i++){const on=i<(run.cells||0);pixHex(143+i*13,53,5,1,on?C.yl:C.grd,on);}
  txt('MEMORIES',138,66,C.cyd);for(let i=0;i<3;i++)px(138+i*10,76,7,5,i<(run.mems||0)?C.mg:C.grd);
  txt('CORE '+(3+(run.cells||0)+(run.equip.includes('spare')?1:0)),138,90,C.yl);
  const n=run.parts.length,sel=prep.cur===n+2;if(sel)px(134,111,114,10,C.cyx);
  txt((sel?'> ':'  ')+'DONE',138,114,sel?C.yl:C.wh);
}
// memories: the deck's chalk storyboard look, one panel per memory
const MS=v=>Math.round(v*.5333);
function chalkLine(x0,y0,x1,y1,col,seed){const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)));for(let i=0;i<=n;i++){const t=i/n,x=x0+(x1-x0)*t+(hsh(i+seed,seed*3)*2-1)*.6,y=y0+(y1-y0)*t+(hsh(seed,i+7)*2-1)*.6;if(hsh(i*7,seed)<.9)px(x,y,1,1,col);}}
function cPoly(pts,col,seed){for(let i=0;i<pts.length-1;i++)chalkLine(MS(pts[i][0]),MS(pts[i][1]),MS(pts[i+1][0]),MS(pts[i+1][1]),col,seed+i*13);}
function cLine(x0,y0,x1,y1,col,seed){chalkLine(MS(x0),MS(y0),MS(x1),MS(y1),col,seed);}
function cCircle(cx,cy,r,col,seed){const pts=[];for(let i=0;i<=16;i++){const a=i/16*6.283;pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}cPoly(pts,col,seed);}
function cText(s,x,y,col,seed){txt(s,MS(x)+Math.round(hsh(seed,1)*2-1),MS(y)+Math.round(hsh(1,seed)*2-1),col,2,'l');}
function drawMemory(){
  if(!memView)return;
  const a=Math.min(1,memView.t/10),bo=Math.floor(T/8)*31,CH='#8fd8c8',CH2='#4f9a8c',PK='#e890b4',i=memView.i;
  g.globalAlpha=a*.96;px(0,0,W,H,'#1e0a16');g.globalAlpha=a;
  cPoly([[22,18],[458,17],[459,252],[21,253],[22,18]],CH,bo);cPoly([[26,22],[454,22],[455,248],[25,248],[26,22]],CH2,bo+3);
  if(i===0){
    cPoly([[40,236],[120,196],[200,176],[280,184],[360,214],[440,236]],CH2,bo+5);
    cPoly([[182,150],[212,150],[212,176],[182,176],[182,150]],CH,bo+9);cCircle(199,162,4,CH,bo+11);
    cLine(196,150,192,128,CH,bo+12);cLine(198,150,202,122,CH,bo+13);cLine(200,150,210,132,CH,bo+14);
    cCircle(268,122,11,CH,bo+15);cPoly([[270,133],[262,170],[246,196]],CH,bo+16);cLine(262,170,276,196,CH,bo+17);
    cPoly([[266,146],[240,160],[222,166]],CH,bo+18);cPoly([[222,166],[216,160],[214,170],[222,166]],PK,bo+19);
    for(let k=0;k<5;k++)cLine(256+k*3,112,262+k*4,100,PK,bo+20+k);
    cText('FIX',300,60,CH,bo);cText('FIX',318,100,CH,bo+1);cLine(316,122,240,150,CH2,bo+22);
  }else if(i===1){
    cText('TRAIN',56,48,CH,bo);cText('TRAIN',76,92,CH,bo+1);cText('TRAIN',96,136,CH,bo+2);
    const rx=290+Math.round(Math.sin(T*.05)*6);
    cPoly([[rx,168],[rx+26,168],[rx+26,190],[rx,190],[rx,168]],CH,bo+4);cCircle(rx+17,178,3,CH,bo+5);
    cLine(rx+6,190,rx+2,204,CH,bo+6);cLine(rx+20,190,rx+26,204,CH,bo+7);cLine(rx+8,168,rx+4,146,CH,bo+8);cLine(rx+12,168,rx+16,142,CH,bo+9);
    for(let k=0;k<3;k++)cLine(rx-40,172+k*8,rx-10,172+k*8,CH2,bo+10+k);
    cLine(150,206,176,206,CH,bo+15);cCircle(146,206,5,CH,bo+16);cCircle(180,206,5,CH,bo+17);
    cCircle(400,126,10,CH,bo+18);cPoly([[400,136],[398,178],[386,206]],CH,bo+19);cLine(398,178,410,206,CH,bo+20);cLine(400,150,372,142,CH,bo+21);
  }else{
    for(let k=0;k<28;k++){const x=150+k*6;cLine(x,40+((k*5)%14),x-4,208,CH2,bo+k);}
    cPoly([[140,54],[330,54],[330,210],[140,210],[140,54]],CH,bo+40);cPoly([[196,20],[276,20],[276,56],[196,56],[196,20]],CH,bo+41);
    cCircle(218,38,6,PK,bo+42);cCircle(254,38,6,PK,bo+43);
    cPoly([[330,80],[392,150],[380,168]],CH,bo+46);cLine(140,80,96,140,CH,bo+47);
    cCircle(372,196,7,CH,bo+48);cLine(372,203,370,228,CH,bo+49);cLine(370,212,360,200,CH,bo+50);cLine(370,212,380,200,CH,bo+51);
    cPoly([[330,220],[346,220],[346,232],[330,232],[330,220]],CH,bo+52);
  }
  if(memView.t>14)txt('A: CLOSE',MS(452),MS(234),CH2,1,'r');
  g.globalAlpha=1;
}
function solid(x,y,who){
  for(const r of LV.solids)if(x>r.x-4&&x<r.x+r.w+4&&y>r.y-3&&y<r.y+r.d+3)return true;
  for(const gt of LV.gates)if(x>gt.x-4&&x<gt.x+gt.w+4&&y>gt.y-3&&y<gt.y+gt.d+3){if(who==='pl'&&gatePass(gt))continue;return gt;}
  return false;
}
function stepMap(){
  mapT++;
  let mx=K.right-K.left,my=K.down-K.up;if(mx&&my){mx*=.707;my*=.707;}
  const mm=MAPMOM[run.frame]||MAPMOM.basic,wet=!!inGate('water'),vmax=mm.v*(wet?.5:1);
  run.vx=run.vx||0;run.vy=run.vy||0;
  if(mx)run.vx+=mx*mm.a;else run.vx*=mm.f;
  if(my)run.vy+=my*mm.a;else run.vy*=mm.f;
  const spd=Math.hypot(run.vx,run.vy);if(spd>vmax){run.vx*=vmax/spd;run.vy*=vmax/spd;}
  const ox0=run.px,oy0=run.py;
  const nx=clamp(run.px+run.vx,6,WW-6),ny=clamp(run.py+run.vy,10,WH-4);
  const hx=solid(nx,run.py,'pl');if(!hx)run.px=nx;else{run.vx=0;if(hx.kind)touchGate(hx);}
  const hy=solid(run.px,ny,'pl');if(!hy)run.py=ny;else{run.vy=0;if(hy.kind)touchGate(hy);}
  if(wet&&T%6===0)mapBurst(run.px,run.py,[C.cy,C.cyd],2);
  const moved=Math.hypot(run.px-ox0,run.py-oy0);run.moving=moved>.05;run.walk=(run.walk||0)+moved;if(mx)run.face=mx>0?1:-1;
  run.still=run.moving?0:(run.still||0)+1;let near=false;for(const f of foes)if(!run.beaten[f.id]&&Math.hypot(f.x-run.px,f.y-run.py)<55)near=true;run.mood=near?(run.known[foes.find(f=>!run.beaten[f.id]&&Math.hypot(f.x-run.px,f.y-run.py)<55).type]?'angry':'curious'):run.still>200?'idle':'';
  if(grace>0)grace--;
  if(run.rig){const dr=Math.hypot(run.rig.x-run.px,run.rig.y-run.py);if(dr>16)run.rig.away=true;else if(run.rig.away&&dr<7){enterRig();}}
  if(P.b){if(run.rig){if(Math.hypot(run.rig.x-run.px,run.rig.y-run.py)<22)enterRig();else hint('YOUR RIG IS BACK THERE');}else if(run.frame!=='core')parkRig();}
  if(P.start){if(run.rig)hint('CLIMB INTO YOUR RIG FIRST');else{prep={foe:null,cur:0,msg:'',msgT:0,rig:true};state='prep';glitch=.6;beep(880,.1,'square',.04,-400);return;}}
  for(const c of LV.caches)if(!run.got[c.id]&&Math.hypot(c.x-run.px,c.y-run.py)<9){collect(c);if(state!=='map')return;}
  if(run.hint&&run.hint.t>0)run.hint.t--;
  for(const f of mapFx){f.x+=f.vx;f.y+=f.vy;f.vx*=.92;f.vy*=.92;f.t--;}mapFx=mapFx.filter(f=>f.t>0);
  for(const f of foes){
    if(run.beaten[f.id])continue;
    if(!TYPES[f.type].boss){
      if(--f.t<=0){f.t=rnd(40,120)|0;const a=rnd(0,6.28),m=Math.random()<.35?0:.3;f.dx=Math.cos(a)*m;f.dy=Math.sin(a)*m;}
      const nx2=f.x+f.dx,ny2=f.y+f.dy;
      if(Math.hypot(nx2-f.hx,ny2-f.hy)<34&&!solid(nx2,ny2)){f.x=nx2;f.y=ny2;}else f.t=0;
    }
    if(grace<=0&&Math.hypot(f.x-run.px,f.y-run.py)<TYPES[f.type].r+6){openPrep(f);return;}
  }
  cam.x=clamp(run.px-W/2,0,WW-W);cam.y=clamp(run.py-H/2,0,WH-H);
}
function stepPrep(){
  const n=run.parts.length,rows=n+(prep.rig?3:4);
  if(P.up){prep.cur=(prep.cur+rows-1)%rows;beep(700,.03);}
  if(P.down){prep.cur=(prep.cur+1)%rows;beep(700,.03);}
  if(prep.msgT>0)prep.msgT--;
  const owned=FR_ORDER.filter(f=>run.frames.includes(f));
  const deny=m=>{prep.msg=m;prep.msgT=70;beep(120,.12,'square',.05);};
  if((prep.cur===0||prep.cur===1)&&(P.left||P.right)&&run.rig)deny('YOUR RIG IS PARKED');
  else if(prep.cur===0&&(P.left||P.right)){
    let i=owned.indexOf(run.frame);i=(i+(P.right?1:-1)+owned.length)%owned.length;run.frame=owned[i];trimEquip();fixNest();beep(520,.05,'square',.04,200);glitch=Math.max(glitch,.3);
  }else if(prep.cur===1&&(P.left||P.right)){
    // nesting: a smaller frame rides inside the bigger one as an extra layer
    if(run.frame==='core')deny('THE CORE CANNOT CARRY A FRAME');
    else{
      // any other frame can be picked; the bigger one always goes outside
      const opts=[null,...owned.filter(f=>f!=='core'&&f!==run.frame)];
      if(opts.length<2)deny('NEEDS A SECOND FRAME');
      else{
        let i=opts.indexOf(run.nest);i=(i+(P.right?1:-1)+opts.length)%opts.length;const c=opts[i];
        if(c&&SIZE[c]>SIZE[run.frame]){run.nest=run.frame;run.frame=c;trimEquip();}else run.nest=c;
        beep(run.nest?660:400,.06,'square',.04,run.nest?300:-100);glitch=Math.max(glitch,.3);
      }
    }
  }
  const act=P.a||P.jump;
  if(prep.cur>=2&&prep.cur<=n+1&&act){
    const p=run.parts[prep.cur-2];
    if(run.equip.includes(p)){run.equip=run.equip.filter(x=>x!==p);beep(400,.05);}
    else if(run.equip.length<slotsOf(run.frame)){run.equip.push(p);beep(900,.05);}
    else deny(slotsOf(run.frame)?'NO FREE SLOT':'THE CORE HAS NO SLOTS');
  }
  if(prep.rig){if((prep.cur===n+2&&act)||P.start||P.b){state='map';grace=20;glitch=.5;beep(300,.1,'square',.04,-150);}return;}
  if((prep.cur===n+2&&act)||P.start){startFight(prep.foe);return;}
  if((prep.cur===n+3&&act)||P.b){
    const f=prep.foe,a=Math.atan2(run.py-f.y,run.px-f.x);
    for(let d=18;d<60;d+=4){const x=clamp(f.x+Math.cos(a)*(TYPES[f.type].r+d),6,WW-6),y=clamp(f.y+Math.sin(a)*(TYPES[f.type].r+d),10,WH-4);if(!solid(x,y)){run.px=x;run.py=y;break;}}
    grace=90;state='map';glitch=.6;beep(300,.1,'square',.04,-150);
  }
}

function landed(id,v){
  pl.onG=true;pl.plat=id;pl.usedAir=false;pl.jcut=false;
  const core=pl.mode==='core',fr=FR[core?'core':pl.fid],base=core?3:fr.dmg+(pl.glove?3:0);
  if(pl.atkKind==='dive'){
    pl.atk=0;pl.atkKind=null;pl.land=10;kick(4,.3);crunch(.15,.08);beep(90,.15,'square',.05,-40);bursts.push({x:Math.round(pl.x),y:Math.round(pl.y),t:12});
    const bx=[pl.x-20,pl.y-10,pl.x+20,pl.y+2];hitMines(bx);hitEnemy(bx,base,true,pl.x,pl.y-4);
  }else if(v>2.2){
    pl.land=v>3.8?8:5;
    if(!core&&['brute','walker','titan'].includes(pl.fid)&&v>4.2){kick(3,.2);crunch(.1,.06);spark(pl.x,pl.y,10,[C.grd,C.cyd,C.yl],2,.05);hitEnemy([pl.x-16,pl.y-6,pl.x+16,pl.y+2],2,false,pl.x,pl.y-3);}
  }
  if(v>2.5)spark(pl.x,pl.y,4,[C.grd,C.cyd],1,.05);
  if(pl.spin>0){pl.spin=0;pl.trail=[];pl.hiT=60;say('HI',pl.x,pl.y-26,C.wh,50);beep(1320,.07,'square',.03);setTimeout(()=>beep(1760,.08,'square',.03),90);}
}
function updDebris(){
  for(const d of debris){
    if(d.rest)continue;
    d.vy+=.22;d.x+=d.vx;d.y+=d.vy;d.sp++;
    if(d.sp%7===0&&!d.tri){const t=d.w;d.w=d.h;d.h=t;}
    if(d.y+d.h>=GY+3){d.y=GY+3-d.h;if(Math.abs(d.vy)<1.3){d.rest=true;crunch(.03,.02);}else{d.vy*=-.35;d.vx*=.6;}}
    if(d.x<2){d.x=2;d.vx*=-.5;}if(d.x+d.w>254){d.x=254-d.w;d.vx*=-.5;}
  }
}
// the colossus is a level: shoulders, back and (while it kneels) the slam arm are ledges
function bossPlats(){
  const e=en,bx=e.x+(e.shk||0),k=Math.round(e.k),B=GY,L=[];
  if(e.st!=='dead'){
    L.push({id:'shL',x0:bx-58,x1:bx-36,y:B-86+k});
    L.push({id:'torso',x0:bx-44,x1:bx+44,y:B-80+k});
    L.push({id:'shR',x0:bx+36,x1:bx+58,y:B-86+k});
    if(e.st==='kneel'){
      const sx=e.x-50,sy=B-74+k;
      L.push({id:'fist',x0:e.fx-11,x1:e.fx+11,y:e.fy-8});
      for(let i=1;i<=3;i++){const a=i/4,cx=sx+(e.fx-sx)*a,cy=sy+(e.fy-sy)*a;L.push({id:'seg'+i,x0:cx-5,x1:cx+5,y:cy-4});}
    }
  }
  for(const q of L){const p=platPrev[q.id];q.dx=p==null?0:q.x0-p;platPrev[q.id]=q.x0;}
  return L;
}
function startMelee(n){
  const core=pl.mode==='core';
  pl.combo=n;pl.atk=[12,12,20][n];pl.hitAt=[8,8,11][n];pl.atkKind='melee';pl.queued=false;
  if(n===2)pl.kb+=pl.face*1.6;
  beep(core?[900,1000,700][n]:[500,600,260][n],.05,'square',.03,-200);
}
function doHit(){
  const core=pl.mode==='core',f=FR[core?'core':pl.fid],d4=pdims(),dir=pl.face,y0=pl.y-d4.h,y1=pl.y,s=f.s;
  const reach=(r,up=0)=>dir>0?[pl.x,y0-up,pl.x+r,y1]:[pl.x-r,y0-up,pl.x,y1];
  const base=core?3:f.dmg+(pl.glove?3:0);
  if(pl.atkKind==='melee'){
    const n=pl.combo,heavy=n===2;
    const r=core?10+(heavy?3:0):s.tw/2+s.ah+2+(n===1?1:0);
    const dmg=heavy?base*2:base+(n===1?1:0),bx=reach(r,heavy?(core?6:s.ah):0);
    hitMines(bx);
    if(!hitEnemy(bx,dmg,heavy,pl.x+dir*r,pl.y-d4.h/2-(heavy?4:0),false,heavy&&!core)&&heavy)spark(pl.x+dir*r,pl.y-d4.h,4,[C.wh],1);
  }else if(pl.atkKind==='charged'){
    const r=s.tw/2+s.ah+10,bx=reach(r,4);hitMines(bx);
    if(hitEnemy(bx,base*3,true,pl.x+dir*r,pl.y-d4.h/2)){if(!en.T.boss&&!en.T.warden&&en.st!=='dead')en.x=clamp(en.x+dir*10,16,246);kick(6,.7);}
    spark(pl.x+dir*r,pl.y-d4.h/2,12,[C.yl,C.wh],3);
  }else if(pl.atkKind==='air'){
    const r=core?10:s.tw/2+s.ah,bx=dir>0?[pl.x-2,y0,pl.x+r,y1+8]:[pl.x-r,y0,pl.x+2,y1+8];
    hitMines(bx);hitEnemy(bx,base+2,false,pl.x+dir*r*.7,pl.y-2);
  }else if(pl.atkKind==='sword'){
    const r=s.tw/2+34,bx=reach(r);hitMines(bx);hitEnemy(bx,11,false,pl.x+dir*r*.7,pl.y-d4.h/2);beep(1800,.06,'triangle',.03,-900);
  }else if(pl.atkKind==='hammer'){
    const r=s.tw/2+s.ah+14,bx=dir>0?[pl.x,y0-6,pl.x+r,y1]:[pl.x-r,y0-6,pl.x,y1];
    hitMines(bx);
    if(!hitEnemy(bx,20,true,pl.x+dir*r*.8,pl.y-6)){kick(4,.3);crunch(.12,.06);}
    spark(pl.x+dir*r*.8,pl.y,10,[C.yl,C.gr],2.5);
  }else if(pl.atkKind==='giant'){
    const r=s.tw/2+60,bx=dir>0?[pl.x,y0-14,pl.x+r,y1]:[pl.x-r,y0-14,pl.x,y1];
    hitMines(bx);
    if(!hitEnemy(bx,26,true,pl.x+dir*r*.6,pl.y-d4.h/2))kick(5,.4);
    spark(pl.x+dir*r*.6,pl.y-4,12,[C.wh,C.cy],3);crunch(.2,.08);
  }
}
function stepDive(){
  const d4=pdims(),box=[pl.x-d4.w/2-2,pl.y-6,pl.x+d4.w/2+2,pl.y+8];
  if(T%2===0)parts.push({x:pl.x+rnd(-3,3),y:pl.y-d4.h,vx:0,vy:-1,t:8,c:C.yl,gv:0,s:1});
  const core=pl.mode==='core',f=FR[core?'core':pl.fid],base=core?3:f.dmg+(pl.glove?3:0);
  if(hitMines(box)||hitEnemy(box,Math.round(base*1.5),true,pl.x,pl.y+2)){
    pl.vy=-3.8;pl.atk=0;pl.atkKind=null;pl.usedAir=false;pl.jcut=true;say('POGO',pl.x,pl.y-d4.h-8,C.cy,24);beep(900,.08,'square',.04,600);
  }
}
function stepFight(){
  fightT++;updDebris();
  for(const b of bursts)b.t--;bursts=bursts.filter(b=>b.t>0);
  // nesting: the core drops in and its frame boots up around it
  if(pl.boot>0){
    pl.boot--;
    if(pl.boot===(pl.mode==='core'?0:24)){crunch(.08,.06);beep(180,.1,'square',.05,-80);spark(pl.x,pl.y-(pl.mode==='core'?4:20),8,[C.cy,C.yl],1.5);kick(2,.3);}
    if(pl.boot===1&&pl.mode!=='core'){beep(880,.08,'square',.04,440);glitch=Math.max(glitch,.5);}
    return;
  }
  // guard (hold down), eject (double-tap down)
  if(pl.stun>0)pl.stun--;
  const inp=pl.stun<=0;
  if(inp&&P.down){if(canEject()&&T-pl.lastDown<18)eject();pl.lastDown=T;}
  const core=pl.mode==='core',fr=FR[core?'core':pl.fid];
  const wasGuard=pl.guard;
  pl.guard=inp&&!core&&K.down&&pl.onG&&pl.atk<=0;
  pl.guardT=pl.guard?pl.guardT+1:0;
  if(pl.guard&&!wasGuard)beep(700,.03,'square',.02);
  const dir=inp?K.right-K.left:0;
  if(pl.atk<=0&&dir&&!pl.guard)pl.face=dir;
  const locked=pl.guard||(pl.atk>0&&pl.onG&&['melee','hammer','giant','charged'].includes(pl.atkKind));
  const airC=pl.onG?1:.7,slow=pl.charge>0?.35:pl.land>4&&!core&&pl.fid!=='basic'?.5:1;
  // frames have weight: heavy frames build up speed slowly and slide to a stop
  const mo=MOM[core?'core':pl.fid]||MOM.basic;
  if(dir&&!locked){
    if(pl.onG&&Math.sign(pl.vx)===-dir&&Math.abs(pl.vx)>fr.spd*.55){if(T%3===0)spark(pl.x-dir*5,pl.y,2,[C.grd,C.gr],1,.05);if(T%9===0)crunch(.04,.03);}
    pl.vx=clamp(pl.vx+dir*mo.a*airC,-fr.spd*slow,fr.spd*slow);
  }else pl.vx*=pl.onG?mo.f:.94;
  // jump: buffered press, coyote time, variable height; lighter frames jump higher
  if(pl.onG)pl.coyote=6;else if(pl.coyote>0)pl.coyote--;
  if(inp&&(P.a||P.jump))pl.jbuf=7;else if(pl.jbuf>0)pl.jbuf--;
  const heavyAtk=pl.atk>0&&pl.onG&&['hammer','giant','charged'].includes(pl.atkKind);
  if(pl.jbuf>0&&!pl.guard&&!heavyAtk&&pl.atkKind!=='dive'){
    if(pl.onG||pl.coyote>0){
      pl.vy=core?-4.1:({basic:-3.7,brute:-3.45,walker:-3.6,titan:-3.35}[pl.fid]||-3.5);
      pl.onG=false;pl.plat=null;pl.coyote=0;pl.jbuf=0;pl.jcut=false;pl.charge=0;
      if(pl.atkKind==='melee'){pl.atk=0;pl.atkKind=null;pl.queued=false;}
      beep(330,.06,'square',.03,300);spark(pl.x,pl.y,4,[C.grd],1,.05);
    }else if(pl.jets&&!pl.usedAir&&!core){pl.vy=-3.4;pl.usedAir=true;pl.jbuf=0;pl.jcut=false;spark(pl.x,pl.y,6,[C.yl,C.mg],1.2,.05);beep(500,.1,'square',.03,400);}
  }
  if(!(K.a||K.jump)&&!pl.jcut&&pl.vy<-1.2&&pl.atkKind!=='dive'&&pl.spin<=0){pl.vy*=.5;pl.jcut=true;}
  // vertical motion + one-way ledges
  if(pl.plat){const q=plats.find(q=>q.id===pl.plat);if(!q||pl.x<q.x0-2||pl.x>q.x1+2){pl.plat=null;pl.onG=false;}}
  if(!pl.plat){
    const y0=pl.y,dv=pl.atkKind==='dive';pl.vy=Math.min(pl.vy+(dv?.5:pl.vy<0?.19:.3),dv?7:5.2);pl.y+=pl.vy;
    if(pl.vy>=0)for(const q of plats)if(pl.x>=q.x0&&pl.x<=q.x1&&y0<=q.y+1&&pl.y>=q.y){const v=pl.vy;pl.y=q.y;pl.vy=0;landed(q.id,v);break;}
    if(!pl.plat&&pl.y>=GY){const v=pl.vy,was=pl.onG;pl.y=GY;pl.vy=0;if(!was)landed(null,v);else pl.onG=true;}
  }
  if(pl.spin>0){pl.spin++;if(pl.spin%2===0){pl.trail.push({x:pl.x,y:pl.y});if(pl.trail.length>5)pl.trail.shift();}}
  if(pl.hiT>0)pl.hiT--;
  pl.x+=pl.vx+pl.kb;pl.kb*=.8;
  if(en.T.boss){const bx=en.x;if(!pl.plat&&pl.y>=GY-1&&pl.x>bx-52)pl.x=Math.max(bx-52,pl.x-3);pl.x=clamp(pl.x,8,Math.min(248,bx+58));}
  else{
    pl.x=clamp(pl.x,8,248);
    if(!en.T.float&&!en.T.warden&&!en.gone&&en.st!=='dash'){const eh=en.T.lh+en.T.th+en.T.hh,minD=pdims().w/2+en.T.tw/2;
      if(pl.y>GY-eh+3&&Math.abs(pl.x-en.x)<minD)pl.x=clamp(en.x+(pl.x<en.x?-minD:minD),8,248);}
  }
  if(pl.onG&&Math.abs(pl.vx)>.2){pl.walk+=Math.abs(pl.vx);const sn=Math.floor(pl.walk*(core?.55:.3)/Math.PI);if(sn!==pl.stepN){pl.stepN=sn;parts.push({x:pl.x+rnd(-3,3),y:pl.y-1,vx:-pl.vx*.3,vy:-.3,t:12,c:C.grd,gv:0,s:1});}}
  pl.still=(Math.abs(pl.vx)<.1&&pl.atk<=0&&!pl.guard)?pl.still+1:0;
  // attacks: A A A combo, air attack, specials on Up
  const d4=pdims();
  if(pl.cd>0)pl.cd--;
  if(pl.comboWin>0)pl.comboWin--;
  if(pl.atk>0){
    if(pl.atkKind==='dive')stepDive();else pl.atk--;
    if(P.b&&pl.atkKind==='melee'&&pl.combo<2)pl.queued=true;
    if(pl.atk===pl.hitAt)doHit();
    if(pl.atk<=0){const k=pl.atkKind;pl.atkKind=null;if(k==='melee'){if(pl.queued&&pl.onG)startMelee(pl.combo+1);else{pl.queued=false;pl.comboWin=12;}}}
  }else if(inp&&P.b){
    pl.guard=false;
    if(!pl.onG){if(K.down){pl.atkKind='dive';pl.atk=999;pl.hitAt=-5;pl.vy=Math.max(pl.vy,3.5);pl.vx*=.4;beep(600,.12,'square',.04,-400);}else{pl.atk=12;pl.hitAt=7;pl.atkKind='air';beep(700,.04,'square',.03,-200);}}
    else startMelee(pl.comboWin>0&&pl.combo<2?pl.combo+1:0);
  }else if(inp&&P.up){
    if(!pl.special){if(pl.cd<=0){say(core?'KNIFE ONLY':'NO SPECIAL',pl.x,pl.y-d4.h-8,C.gr,30);pl.cd=30;pl.cdMax=30;}}
    else if(pl.cd<=0){
      const sp=pl.special;pl.guard=false;
      if(sp==='sword'){pl.atk=18;pl.hitAt=11;pl.atkKind='sword';pl.cd=pl.cdMax=40;}
      if(sp==='hammer'){pl.atk=32;pl.hitAt=18;pl.atkKind='hammer';pl.cd=pl.cdMax=70;beep(200,.2,'sawtooth',.03,-100);}
      if(sp==='laser'){pl.atk=10;pl.hitAt=-1;pl.atkKind='laser';pl.cd=pl.cdMax=26;projs.push({kind:'laser',x:pl.x+pl.face*6,y:pl.y-d4.h+3,vx:pl.face*4.5,t:70,dmg:8});beep(1500,.12,'sawtooth',.03,-1200);}
      if(sp==='giant'){pl.atk=34;pl.hitAt=20;pl.atkKind='giant';pl.cd=pl.cdMax=95;beep(150,.4,'sawtooth',.04,300);}
      if(sp==='rocket'){pl.atk=14;pl.hitAt=-1;pl.atkKind='rocket';pl.cd=pl.cdMax=110;projs.push({kind:'rocket',x:pl.x-pl.face*5,y:pl.y-d4.h,vy:-2,ph:'up',t:0,tx:en.x});beep(200,.5,'sawtooth',.04,900);crunch(.2,.05);}
    }
  }
  // hold B after an attack to charge a guard-breaking heavy strike
  pl.bHold=K.b?pl.bHold+1:0;
  if(pl.atk<=0&&inp&&!core&&pl.onG&&K.b&&pl.bHold>10&&!pl.guard){
    if(pl.charge===0)beep(300,.1,'square',.02,200);
    pl.charge=Math.min(40,pl.charge+1);
    if(pl.charge===24){beep(1200,.1,'square',.04);say('CHARGED',pl.x,pl.y-d4.h-10,C.yl,30);}
    if(T%3===0){const a=rnd(0,6.28);parts.push({x:pl.x+Math.cos(a)*12,y:pl.y-d4.h/2+Math.sin(a)*8,vx:-Math.cos(a)*.6,vy:-Math.sin(a)*.5,t:14,c:pl.charge>=24?C.wh:C.yl,gv:0,s:1});}
  }else if(pl.charge>0&&!K.b){
    if(pl.charge>=24&&pl.atk<=0&&!core&&pl.onG){pl.atk=20;pl.hitAt=9;pl.atkKind='charged';pl.kb+=pl.face*2.4;beep(120,.25,'sawtooth',.06,-60);crunch(.12,.06);}
    pl.charge=0;
  }else if(pl.charge>0&&(core||!pl.onG||pl.guard))pl.charge=0;
  if(pl.hitT>0)pl.hitT--;else pl.hits=0;
  if(pl.land>0)pl.land--;
  if(pl.atk<=0)pl.hitLanded=false;
  if(pl.inv>0)pl.inv--;
  // player projectiles
  for(const p of projs){
    if(p.kind==='rocket'){
      p.t++;
      if(p.ph==='up'){p.vy-=.25;p.y+=p.vy;if(T%2===0)parts.push({x:p.x+rnd(-1,1),y:p.y+6,vx:rnd(-.3,.3),vy:1,t:12,c:Math.random()<.5?C.yl:C.mg,gv:0,s:1});if(p.y<-24){p.ph='lock';p.t=0;p.tx=en.x;}}
      else if(p.ph==='lock'){p.tx+=(en.x-p.tx)*.15;if(p.t%8===1)beep(1400,.04,'square',.02);if(p.t>30){p.ph='down';p.x=p.tx;p.y=-16;p.vy=5;}}
      else{
        p.y+=p.vy;p.vy+=.3;parts.push({x:p.x+rnd(-1,1),y:p.y-9,vx:0,vy:-.5,t:10,c:C.gr,gv:0,s:1});
        if(hitEnemy([p.x-3,p.y-6,p.x+3,p.y],16,true,p.x,p.y)||p.y>=GY){
          const by=Math.min(p.y,GY);bursts.push({x:Math.round(p.x),y:Math.round(by),t:16});kick(5,.8);crunch(.35,.12);beep(70,.4,'sawtooth',.07,-30);spark(p.x,by,16,[C.yl,C.wh,C.mg],3.5);p.dead=true;
        }
      }
    }else{
      p.x+=p.vx;p.t--;
      for(const m of mines)if(!m.dead&&Math.abs(m.x-p.x)<5&&Math.abs(m.y-5-p.y)<6){explode(m.x,m.y-3,18,10,10);m.dead=true;p.dead=true;}
      if(!p.dead&&hitEnemy([p.x-3,p.y-2,p.x+3,p.y+2],p.dmg||8,false,p.x,p.y))p.dead=true;
      if(p.x<0||p.x>W||p.t<=0)p.dead=true;
    }
  }
  projs=projs.filter(p=>!p.dead);
  // enemy orbs: block them, or parry to send them back
  for(const o of eprojs){
    o.x+=o.vx;o.y+=o.vy;o.t--;
    if(T%3===0)parts.push({x:o.x,y:o.y,vx:0,vy:0,t:8,c:C.mgd,gv:0,s:1});
    const db=pdims();
    if(overlap([o.x-2,o.y-2,o.x+2,o.y+2],[pl.x-db.w/2,pl.y-db.h,pl.x+db.w/2,pl.y])){
      const r=hurtPlayer(o.dmg,o.x,false);
      if(r==='parry')projs.push({kind:'laser',x:o.x,y:o.y,vx:-Math.sign(o.vx||1)*4,t:80,dmg:12,col:C.yl});
      if(r!=='miss')o.t=0;
    }
    if(o.y>GY+2){o.t=0;spark(o.x,GY,4,[C.mg],1);}
    if(o.x<-4||o.x>W+4)o.t=0;
  }
  eprojs=eprojs.filter(o=>o.t>0);
  updMines();
  for(const st of strikes){st.t--;if(st.t===12)beep(900,.1,'square',.03,-500);if(st.t<=0){explode(st.x,GY-3,16,12,0);st.dead=true;}}
  strikes=strikes.filter(st=>!st.dead);
  if(en.hurt>0)en.hurt--;if(en.hurtHead>0)en.hurtHead--;
  if(en.T.boss)stepBoss();else if(en.T.warden)stepWarden();else if(en.T.float)stepShaman();else stepEnemy();
  if(en.T.boss){plats=bossPlats();if(pl.plat){const q=plats.find(q=>q.id===pl.plat);if(q){pl.x+=q.dx;pl.y=q.y;}}}
}
function stepEnemy(){
  if(en.st==='air'){en.y+=en.vy;en.vy+=.22;en.x=clamp(en.x+en.avx,16,246);en.avx*=.98;en.moving=false;
    if(en.y>=GY&&en.vy>0){en.y=GY;en.st='down';en.t=34;kick(2,.2);crunch(.08,.05);spark(en.x,GY,6,[C.grd,C.mgd],1.5);}return;}
  if(en.st==='down'){en.moving=false;if(--en.t<=0){en.st='walk';en.t=24;}return;}
  const s=en.T,d4=pdims();
  const gap=Math.abs(pl.x-en.x)-(d4.w/2+s.tw/2),dist=Math.abs(pl.x-en.x),want=pl.x<en.x?-1:1;
  const keepAway=(near,far)=>{let mv=0;if(dist<near)mv=-want;else if(dist>far)mv=want;if((en.x<24&&mv<0)||(en.x>232&&mv>0))mv=0;en.moving=!!mv;en.x+=mv*s.spd;if(mv)en.walk+=s.spd;};
  const windUp=()=>{en.st='wind';en.t=s.wind;en.moving=false;beep(1000,.06,'square',.03);};
  switch(en.st){
    case 'walk':
      // shieldbots turn slowly, so jumping over them opens their back
      if(s.shield){if(want!==en.face){if(++en.turnT>34){en.face=want;en.turnT=0;}}else en.turnT=0;}else en.face=want;
      if(en.t>0)en.t--;
      if(s.ranged){
        keepAway(70,120);
        if(--en.t2<=0&&mines.length<3){en.st='drop';en.t=30;en.moving=false;beep(700,.2,'square',.03,-300);break;}
        if(gap<=s.reach&&en.t<=0)windUp();
      }else if(s.dash){
        keepAway(50,95);
        if(gap<=s.reach&&en.t<=0)windUp();
        else if(--en.t2<=0){en.st='crouch';en.t=36;en.moving=false;beep(120,.4,'sawtooth',.04,80);}
      }else{
        en.moving=gap>s.reach-3&&en.face===want;
        if(en.moving){en.x+=en.face*s.spd;en.walk+=s.spd;}
        if(gap<=s.reach&&en.t<=0&&want===en.face)windUp();
      }
      break;
    case 'drop':if(--en.t<=0){mines.push({x:en.x+en.face*6,y:en.y-18,vx:en.face*1,vy:-2,st:'fall',t:0,f:0});en.st='walk';en.t2=s.cd2;beep(400,.1,'square',.04);}break;
    case 'crouch':en.face=want;if(--en.t<=0){en.st='dash';en.dashDir=want;en.dashEnd=clamp(pl.x+want*56,18,238);en.dashHit=false;crunch(.15,.06);}break;
    case 'dash':
      en.x+=en.dashDir*4.2;en.walk+=4.2;en.moving=true;
      if(T%2===0)parts.push({x:en.x-en.dashDir*10,y:GY-2,vx:-en.dashDir*.5,vy:-.3,t:10,c:C.grd,gv:0,s:1});
      if(!en.dashHit&&overlap(erect(),[pl.x-d4.w/2,pl.y-d4.h,pl.x+d4.w/2,pl.y])){en.dashHit=true;hurtPlayer(en.dmg,en.x-en.dashDir*6,false);}
      if((en.dashDir>0&&en.x>=en.dashEnd)||(en.dashDir<0&&en.x<=en.dashEnd)||en.x<=18||en.x>=238){en.st='rec';en.t=60;en.moving=false;en.t2=s.cd2||120;}
      break;
    case 'wind':if(--en.t<=0){en.st='atk';en.t=10;beep(160,.08,'sawtooth',.04,-60);}break;
    case 'atk':
      if(--en.t===6){
        const eh=s.lh+s.th+s.hh,x0=en.x+en.face*s.tw/2,x1=en.x+en.face*(s.tw/2+s.reach+4);
        const ab=[Math.min(x0,x1),GY-eh*.8,Math.max(x0,x1),GY];
        if(overlap(ab,[pl.x-d4.w/2,pl.y-d4.h,pl.x+d4.w/2,pl.y]))hurtPlayer(en.dmg,en.x,false);
      }
      if(en.t<=0){if(s.duelist&&!en.combo2&&Math.random()<.55){en.combo2=true;en.st='wind';en.t=8;}else{en.combo2=false;en.st='rec';en.t=s.cd;}}
      break;
    case 'rec':en.moving=false;if(--en.t<=0){en.st='walk';en.t=12;}break;
    case 'stun':en.moving=false;if(--en.t<=0){en.st='walk';en.t=16;}break;
    case 'dead':en.moving=false;if(--en.t<=0)finishFight();break;
  }
  en.x=clamp(en.x,16,246);
}
// shaman: keeps its distance, casts orbs, blinks away when you get close
function stepShaman(){
  const s=en.T;en.bob+=.08;
  const hover=en.st==='stun'?2:12+Math.round(Math.sin(en.bob)*2);
  en.y+=((GY-hover)-en.y)*.3;
  const dist=Math.abs(pl.x-en.x);
  if(en.cd2>0)en.cd2--;
  switch(en.st){
    case 'walk':{
      en.face=pl.x<en.x?-1:1;
      let mv=0;if(dist<70)mv=-en.face;else if(dist>110)mv=en.face;
      if((en.x<24&&mv<0)||(en.x>232&&mv>0))mv=0;
      en.moving=!!mv;en.x+=mv*s.spd;
      if(dist<28&&en.cd2<=0){en.st='blink';en.t=18;glitch=Math.max(glitch,.5);beep(2000,.15,'square',.03,-1500);break;}
      if(--en.t<=0){en.st='cast';en.t=s.wind;beep(500,.3,'triangle',.03,700);}
      break;}
    case 'cast':
      en.moving=false;en.face=pl.x<en.x?-1:1;
      if(--en.t<=0){
        const hx=en.x+en.face*7,hy=en.y-21,db=pdims(),a=Math.atan2((pl.y-db.h/2)-hy,pl.x-hx);
        eprojs.push({x:hx,y:hy,vx:Math.cos(a)*1.9,vy:Math.sin(a)*1.9,t:220,dmg:en.dmg});
        beep(300,.2,'square',.04,-150);en.st='walk';en.t=s.cd;
      }break;
    case 'blink':
      if(--en.t===9){
        spark(en.x,en.y-12,8,[C.mg,C.cy],2);
        const side=pl.x<128?1:-1;let nx=clamp(pl.x+side*100,20,236);if(Math.abs(nx-pl.x)<60)nx=clamp(pl.x-side*100,20,236);en.x=nx;
        spark(en.x,en.y-12,8,[C.mg,C.cy],2);
      }
      if(en.t<=0){en.st='cast';en.t=22;en.cd2=100;}
      break;
    case 'stun':en.moving=false;if(--en.t<=0){en.st='walk';en.t=30;}break;
    case 'dead':if(--en.t<=0)finishFight();break;
  }
  en.x=clamp(en.x,16,240);
}
function stepBoss(){
  const e=en,bx=e.x,k=e.k,d4=pdims();
  const tk=e.st==='kneel'?18:e.st==='slam'?6:0;e.k+=(tk-e.k)*.18;
  e.shk=e.st==='shake'&&e.t<58?(Math.random()<.5?-1:1)*(e.t<22?2:1):0;
  const onBody=!!pl.plat&&['shL','torso','shR'].includes(pl.plat);
  const lerp=(tx,ty,a)=>{e.fx+=(tx-e.fx)*a;e.fy+=(ty-e.fy)*a;};
  switch(e.st){
    case 'idle':lerp(bx-66,GY-44+k,.1);
      if(onBody){e.st='shake';e.t=70;say('IT FEELS YOU',bx,GY-20,C.mg,60);beep(70,.6,'sawtooth',.05,40);break;}
      if(--e.t<=0){
        if(e.type==='maker'&&Math.random()<.4){e.st='rain';e.t=96;beep(300,.5,'sawtooth',.04,-200);say('INCOMING',bx-60,GY-20,C.yl,50);}
        else if(pl.x>bx-120&&Math.random()<.55){e.st='swwind';e.t=48;beep(90,.4,'sawtooth',.04,60);}
        else{e.st='slamwind';e.t=56;e.tx=clamp(pl.x,18,bx-58);beep(140,.5,'sawtooth',.04,200);}
      }break;
    case 'shake':lerp(bx-66,GY-44+k,.1);
      if(e.t%10===0){crunch(.06,.04);kick(2,.2);}
      if(--e.t<=0){
        if(onBody){pl.plat=null;pl.onG=false;pl.vy=-3.6;pl.kb=-4.5;say('THROWN OFF',pl.x,pl.y-30,C.wh,40);kick(4,.6);beep(120,.3,'sawtooth',.05,-60);}
        e.st='idle';e.t=50;
      }break;
    case 'slamwind':e.tx+=(clamp(pl.x,18,bx-58)-e.tx)*(e.t>24?.08:0);lerp(e.tx,18,.14);if(--e.t<=0){e.st='slam';e.fx=e.tx;}break;
    case 'slam':e.fy+=10;
      if(e.fy>=GY-8){e.fy=GY-8;
        if(Math.abs(pl.x-e.tx)<13+d4.w/2&&pl.y>GY-18)hurtPlayer(e.T.dmg,e.tx,true);
        spark(e.tx,GY,18,[C.yl,C.mg,C.gr],3.5);kick(7,.7);crunch(.3,.12);beep(55,.4,'sawtooth',.08,-20);
        e.st='kneel';e.t=110;say('CLIMB THE ARM',bx-40,GY-22,C.yl,70);
      }break;
    case 'kneel':if(--e.t<=0){e.st='rise';e.t=30;}break;
    case 'rise':lerp(bx-66,GY-44+k,.1);if(--e.t<=0){if(onBody){e.st='shake';e.t=70;}else{e.st='idle';e.t=rnd(40,70)|0;}}break;
    case 'swwind':lerp(bx-50,GY-10,.15);if(--e.t<=0){e.st='sweep';e.fx=bx-50;crunch(.2,.08);}break;
    case 'sweep':e.fx-=6;e.fy=GY-8;
      if(Math.abs(pl.x-e.fx)<12+d4.w/2&&pl.y>GY-12)hurtPlayer(Math.round(e.T.dmg*.7),e.fx,true);
      if(T%2===0)spark(e.fx,GY,2,[C.gr,C.yl],1.5);
      if(e.fx<=bx-130){e.st='idle';e.t=70;}break;
    case 'rain':lerp(bx-66,GY-44+k,.1);if(e.t%16===0)strikes.push({x:clamp(pl.x+rnd(-24,24),10,bx-54),t:36});if(--e.t<=0){e.st='idle';e.t=60;}break;
    case 'phase':
      e.shk=(Math.random()<.5?-1:1)*2;lerp(bx-66,GY-44+k,.1);
      if(e.t%5===0){spark(bx+rnd(-44,44),GY-rnd(20,90),6,[C.yl,C.wh,C.mg],2.5);crunch(.05,.04);}
      if(e.t===70&&onBody){pl.plat=null;pl.onG=false;pl.vy=-3.6;pl.kb=-4.5;}
      if(--e.t<=0)makerEject();
      break;
    case 'dead':
      if(e.t%6===0){spark(bx+rnd(-44,44),GY-rnd(10,90),10,[C.mg,C.yl,C.wh,C.cy],3);crunch(.1,.06);kick(4,.7);}
      e.k+=(30-e.k)*.02;
      if(--e.t<=0)finishFight();break;
  }
}

// ---------- levels 2 and 3 ----------
function scaled(TT,type,lvl){
  const big=TT.boss||TT.warden,m=big?1:1+.4*lvl,dm=big?1:1+.25*lvl;
  return{hp:Math.round(TT.hp*m),dmg:Math.round(TT.dmg*dm),name:TT.name+(!big&&lvl>0&&['scrap','lancer','brute','walker','shaman'].includes(type)?' MK'+(lvl+1):'')};
}
function explode(x,y,r,dp,de){
  bursts.push({x:Math.round(x),y:Math.round(y),t:16});spark(x,y,14,[C.yl,C.wh,C.mg],3);kick(5,.7);crunch(.3,.1);beep(70,.35,'sawtooth',.06,-30);
  const d4=pdims(),zone=[x-r,y-r,x+r,y+r];
  if(dp&&overlap(zone,[pl.x-d4.w/2,pl.y-d4.h,pl.x+d4.w/2,pl.y]))hurtPlayer(dp,x,false);
  if(de)hitEnemy(zone,de,true,x,y,true);
  for(const m of mines)if(!m.dead&&m.st!=='kicked'&&Math.abs(m.x-x)<r&&Math.abs(m.y-y)<r+6){m.t=m.st==='fuse'?Math.min(m.t,8):8;m.st='fuse';}
}
// walking bombs: kick them back with any hit
function hitMines(box4){
  let k=false;
  for(const m of mines){
    if(m.dead||m.st==='kicked')continue;
    if(overlap(box4,[m.x-4,m.y-9,m.x+4,m.y])){m.st='kicked';m.vx=pl.face*(en.T.warden?2.2:3.4);m.vy=en.T.warden?-6.9:-3.4;say('KICK',m.x,m.y-12,C.cy,25);beep(900,.08,'square',.04,500);k=true;}
  }
  return k;
}
function updMines(){
  for(const m of mines){
    m.f++;
    if(m.st==='fall'){m.vy+=.2;m.x+=m.vx;m.y+=m.vy;if(m.y>=GY){m.y=GY;m.st='walk';m.vx=0;}}
    else if(m.st==='walk'){const d=pl.x<m.x?-1:1;m.x+=d*.75;if(Math.abs(pl.x-m.x)<13&&pl.y>GY-22){m.st='fuse';m.t=34;beep(1500,.05,'square',.03);}}
    else if(m.st==='fuse'){if(--m.t<=0){explode(m.x,GY-3,20,12,8);m.dead=true;}else if(m.t%6===0)beep(1800,.03,'square',.02);}
    else if(m.st==='kicked'){
      m.vy+=.2;m.x+=m.vx;m.y+=m.vy;
      if(en.T.warden&&en.st!=='down'&&en.st!=='dead')m.vx+=clamp((en.x-m.x)*.004,-.08,.08);
      const e=erect();
      if(!en.gone&&en.st!=='dead'&&m.x>e[0]&&m.x<e[2]&&m.y-4<e[3]&&m.y>e[1]){explode(m.x,m.y-3,16,0,18);m.dead=true;}
      else if(m.y>=GY){explode(m.x,GY-3,18,10,10);m.dead=true;}
    }
    m.x=clamp(m.x,4,252);
  }
  mines=mines.filter(m=>!m.dead);
}
// the warden: a hovering eye with a searchlight. Kick its own bombs up to knock it down.
function stepWarden(){
  const e=en;e.bob+=.05;
  switch(e.st){
    case 'walk':
      if(--e.wT<=0){e.tx=rnd(50,206);e.wT=140;}
      e.x+=(e.tx-e.x)*.012;e.y+=((40+Math.sin(e.bob)*4)-e.y)*.1;
      e.lx+=clamp(pl.x-e.lx,-.85,.85);
      if(Math.abs(pl.x-e.lx)<16)e.lock++;else e.lock=Math.max(0,e.lock-.5);
      if(e.lock>34){e.st='wind';e.t=32;e.lock=0;beep(200,.5,'sawtooth',.04,600);break;}
      if(--e.dropT<=0){e.st='drop';e.t=26;}
      break;
    case 'wind':e.y+=(40-e.y)*.1;if(--e.t<=0){e.st='atk';e.t=20;kick(3,.6);crunch(.3,.08);beep(90,.35,'square',.06,-40);}break;
    case 'atk':
      if(Math.abs(pl.x-e.lx)<9+pdims().w/2)hurtPlayer(en.dmg,e.lx,true);
      if(T%2===0)spark(e.lx,GY,3,[C.mg,C.wh],2);
      if(--e.t<=0)e.st='walk';break;
    case 'drop':
      if(e.t===14){for(const dx of [-8,8])if(mines.length<4)mines.push({x:e.x+dx,y:e.y+12,vx:dx*.08,vy:0,st:'fall',t:0,f:0});beep(500,.1,'square',.04,-200);}
      if(--e.t<=0){e.st='walk';e.dropT=170;}break;
    case 'down':
      e.y+=((GY-15)-e.y)*.2;
      if(!e.landed&&e.y>GY-18){e.landed=true;kick(5,.5);crunch(.25,.1);spark(e.x,GY,14,[C.gr,C.yl],3);}
      if(--e.t<=0){e.st='rise';e.t=40;e.landed=false;}break;
    case 'rise':e.y+=(40-e.y)*.06;if(--e.t<=0){e.st='walk';e.dropT=90;}break;
    case 'dead':
      e.y+=((GY-12)-e.y)*.08;
      if(e.t%6===0){spark(e.x+rnd(-12,12),e.y+rnd(-12,12),10,[C.mg,C.yl,C.wh],3);crunch(.1,.06);kick(3,.5);}
      if(--e.t<=0)finishFight();break;
  }
}
// the maker breaks its own shell at half health, just like Onion Head can
function makerEject(){
  const e=en,bx=e.x,P2=PAL.maker;
  const add=(x0,y0,w,h)=>debris.push({x:x0,y:y0,w,h,vx:rnd(-3,3),vy:rnd(-5,-2),pal:P2,dark:Math.random()<.5,rest:false,sp:0});
  add(bx-44,GY-80,40,22);add(bx+4,GY-80,40,22);add(bx-58,GY-86,22,18);add(bx+36,GY-86,22,18);add(bx-38,GY-26,16,26);add(bx+22,GY-26,16,26);add(e.fx-11,e.fy-8,22,16);add(bx-30,GY-36,30,12);
  debris.push({x:bx-4,y:GY-62,w:9,h:7,vx:rnd(-1,1),vy:-6,tri:true,rest:false,sp:0});
  spark(bx,GY-50,40,[C.yl,C.mg,C.wh],4);kick(8,1);crunch(.6,.12);beep(60,.8,'sawtooth',.07,40);
  const hp=e.hp;
  en.T=TYPES.makercore;en.type='makercore';en.dmg=TYPES.makercore.dmg;en.x=clamp(bx-30,40,236);en.y=GY;en.st='stun';en.t=50;en.k=0;en.shk=0;en.face=-1;en.hp=hp;en.moving=false;en.walk=0;
  plats=[];if(pl.plat){pl.plat=null;pl.onG=false;}
  banner={s:'IT EJECTED',t:80};glitch=1;
}

// ---------- drawing ----------
function playerMood(){
  if(pl.inv>30)return 'hurt';
  if(pl.atk>0||pl.guard)return 'angry';
  if(fightT<80&&!run.known[en.type])return 'curious';
  if(pl.still>150)return 'idle';
  return '';
}
function hiLines(x,top){if(pl.hiT<=0||(pl.hiT<20&&(T>>1)&1))return;px(x-7,top+1,1,3,C.wh);px(x-6,top,1,1,C.wh);px(x,top-3,1,3,C.wh);px(x+6,top,1,1,C.wh);px(x+7,top+1,1,3,C.wh);}
function drawPlayer(){
  const p=pl;if(p.inv>0&&!p.boot&&(T>>1)&1&&p.inv<40)return;
  const x=Math.round(p.x),fy=Math.round(p.y),moving=Math.abs(p.vx)>.2&&p.onG,mood=playerMood();
  if(p.mode==='core'){
    for(let i=0;i<p.trail.length;i++){const tr=p.trail[i];if(i%2)continue;px(tr.x-4,tr.y-10,8,7,C.cyx);px(tr.x-3,tr.y-9,6,5,C.void);}
    if(p.boot>0){drawCore(x-4,Math.round(-14+(fy-10+14)*(1-p.boot/20)),p.face,T,true,'curious');return;}
    if(p.spin>0&&!p.onG){
      // tumbling through the air after an eject or a shell break
      const q=Math.floor(p.spin/3)%4,m=[[1,0,0,1],[0,1,-1,0],[-1,0,0,-1],[0,-1,1,0]][q];
      g.save();g.translate(x,fy-7);g.transform(m[0],m[1],m[2],m[3],0,0);drawCore(-4,-3,p.face,T,true,'hurt');g.restore();return;
    }
    const ph=p.walk*.55,sw=moving?Math.sin(ph):0,cw=moving?Math.cos(ph):0;
    const bob=moving&&Math.abs(sw)>.7?1:0,l=Math.round(sw*1.4),la=cw>.3?1:0,lb=cw<-.3?1:0,f=p.face;
    if(!p.onG){px(x-3,fy-4,1,2,C.cy);px(x+2,fy-4,1,2,C.cy);}
    else{px(x-3+l,fy-3+bob,1,3-bob-la,C.cy);px(x-3+l+f,fy-1-la,1,1,C.cy);px(x+2-l,fy-3+bob,1,3-bob-lb,C.cy);px(x+2-l+f,fy-1-lb,1,1,C.cy);}
    const lunge=p.atkKind==='melee'&&p.atk>0&&p.atk<=p.hitAt+3?f:0;
    drawCore(x-4+lunge,fy-10+bob+(p.land>3?1:0),f,T,true,mood);
    if(p.atkKind==='dive'){px(x-3,fy+1,7,1,C.yl);px(x-1,fy-2,1,3,C.wh);}
    // knife 4 life: jab, low slash, overhead chop
    let kw=2,ky=fy-6+bob+(moving?Math.round(-sw):0);
    if(p.atk>0&&(p.atkKind==='melee'||p.atkKind==='air')){
      const act=p.atk<=p.hitAt+3,n=p.atkKind==='air'?0:p.combo;
      if(act){kw=n===2?7:6;ky=fy-(n===1?4:n===2?9:6)+bob;
        if(p.atk>=p.hitAt-1){const sx=f>0?x+5+lunge:x-11+lunge;px(sx,n===2?ky-3:ky+2,6,1,C.cyd);px(f>0?sx+5:sx,n===2?ky-2:ky+1,1,1,C.cyd);}}
      else ky=fy-8+bob;
    }
    px(f>0?x+5+lunge:x-5-kw+lunge,ky,kw,1,C.wh);
    if(p.stun>0)stunStars(x,fy-20);
    hiLines(x,fy-24);
    return;
  }
  const s=FR[p.fid].s;
  // back-mounted gear
  if(p.special==='laser'){const lx=p.face>0?x-Math.floor(s.tw/2)-3:x+Math.ceil(s.tw/2)-4,ly=fy-s.lh-s.th-2;px(lx,ly,7,3,C.cy);px(lx+1,ly+1,5,1,C.cyx);px(p.face>0?lx+7:lx-1,ly+1,1,1,C.mg);}
  if(p.special==='giant'&&!(p.atkKind==='giant'&&p.atk>0)){const gx=p.face>0?x-Math.floor(s.tw/2)-2:x+Math.ceil(s.tw/2)-1,gy=fy-s.lh-s.th-16;px(gx,gy,3,s.th+18,C.wh);px(gx,gy,1,s.th+18,C.cy);px(gx-1,gy+s.th+14,5,1,C.yl);}
  if(p.special==='rocket'&&!(p.atkKind==='rocket'&&p.atk>0)&&p.cd<=0){const lx=p.face>0?x-Math.floor(s.tw/2)-2:x+Math.ceil(s.tw/2)-1,ly=fy-s.lh-s.th-4;px(lx,ly+1,3,6,C.cy);px(lx,ly-1,3,2,C.mg);}
  if(p.boot>0){
    const top=fy-s.lh-s.th,target=top-7;
    const cy=p.boot>24?Math.round(-14+(target+14)*((44-p.boot)/20)):target;
    if(p.boot<=24){
      const mh=s.lh+s.th+3,rh=Math.round(mh*(24-p.boot)/24);
      g.save();g.beginPath();g.rect(-20,fy-rh,W+40,rh+4);g.clip();drawFrame(x,fy,p.fid,s,p.face,0,false,0,FP.me);g.restore();
      px(x-Math.floor(s.tw/2)-5,fy-rh,s.tw+10,1,C.yl);
    }else if((T>>1)&1){px(x-Math.floor(s.tw/2),fy-1,s.tw,1,C.cyx);}
    if(p.inner){const ns=FR[p.inner.fid].s,it=fy-s.lh-s.th,k=p.boot>24?0:Math.min(1,(24-p.boot)/12);if(p.boot<=24){const ir=drawRider(it,ns.lh,y=>drawFrame(x,Math.round(y-(1-k)*30),p.inner.fid,ns,p.face,0,false,0,FP.me));drawCore(x-4,ir.topY-7,p.face,T,true,'curious');return;}}
    drawCore(x-4,cy,p.face,T,true,'curious');
    return;
  }
  let mode=0;
  if(p.atk>0){
    if(p.atkKind==='melee')mode=p.atk<=p.hitAt+3?[1,2,3][p.combo]:5;
    else if(p.atkKind==='air')mode=p.atk<=p.hitAt+3?1:0;
    else if(p.atkKind==='sword')mode=p.atk<=p.hitAt+4?1:5;
    else if(p.atkKind==='hammer')mode=p.atk<=p.hitAt+2?1:0;
    else if(p.atkKind==='giant')mode=p.atk>p.hitAt?3:1;
    else if(p.atkKind==='charged')mode=p.atk<=p.hitAt+4?1:5;
  }else if(p.guard)mode=4;
  else if(p.charge>0)mode=5;
  const sq=p.land>0?(p.land>4?2:1):0,stc=!p.onG&&p.vy<-1.5?1:0,dv=p.atkKind==='dive'?2:0;
  const s2=(sq||stc||dv)?Object.assign({},s,{lh:Math.max(2,s.lh-sq+stc-dv)}):s;
  const r=drawFrame(x,fy,p.fid,s2,p.face,p.walk*.3,moving,mode,p.charge>=24&&(T>>2)&1?FP.warn:p.inv>40?FP.hit:FP.me);
  if(p.charge>0){const k=Math.min(1,p.charge/24);for(let i=0;i<4;i++){const a=T*.2+i*1.57,rr=10-k*6;px(r.hx+Math.cos(a)*rr,r.hy+Math.sin(a)*rr,1,1,k>=1?C.wh:C.yl);}}
  if(p.atkKind==='charged'&&mode===1&&p.atk>=p.hitAt-2)for(let i=0;i<3;i++)px(p.face>0?r.hx+2+i*5:r.hx-7-i*5,r.hy-4+i*3,6,1,C.yl);
  if(p.atkKind==='dive'){px(x-Math.floor(s.tw/2)-1,fy+1,s.tw+2,1,C.yl);for(let i=0;i<3;i++)px(x-5+i*5,r.topY-10-i*2,1,4,C.cyd);}
  let ctop=r.topY,cx=x+r.lean;
  if(p.inner){const ns=FR[p.inner.fid].s,ib=moving&&((T>>3)&1)?1:0;const ir=drawRider(r.topY+ib,ns.lh,y=>drawFrame(cx,y,p.inner.fid,ns,p.face,0,false,mode===4?0:mode===5?5:0,FP.me));ctop=ir.topY;cx+=ir.lean;}
  drawCore(cx-4,ctop-7,p.face,T,true,mood);
  drawDomes(cx-4,ctop-7,p.charge>=24&&(T>>2)&1?FP.warn:FP.me);
  if(p.glove&&mode!==4)px(r.hx-1,r.hy-1,3,3,C.yl);
  const atkOn=mode===1||mode===2||mode===3;
  if(p.special==='sword'){
    if(p.atkKind==='sword'&&mode===1){const L=32;px(p.face>0?r.hx+1:r.hx-L-1,r.hy-1,L,1,C.wh);px(p.face>0?r.hx+1:r.hx-L-1,r.hy,L,1,C.cy);px(r.hx,r.hy-2,1,5,C.yl);
      if(p.atk>=p.hitAt-2)for(let i=0;i<3;i++)px(p.face>0?r.hx+4+i*9:r.hx-10-i*9,r.hy-3-i,6,1,C.cyd);}
    else if(mode!==4&&!atkOn){px(r.hx,r.hy-13,1,12,C.wh);px(r.hx-1,r.hy-2,3,1,C.yl);}
  }
  if(p.special==='hammer'){
    if(p.atkKind==='hammer'&&mode===0){px(r.hx,r.hy-15,1,15,C.gr);px(r.hx-3,r.hy-20,7,6,C.yl);px(r.hx-2,r.hy-19,5,1,C.wh);}
    else if(p.atkKind==='hammer'){const L=12;px(p.face>0?r.hx:r.hx-L,r.hy,L,1,C.gr);px(p.face>0?r.hx+L-2:r.hx-L-4,r.hy-3,6,8,C.yl);}
    else if(mode!==4&&!atkOn){px(r.hx,r.hy-9,1,9,C.gr);px(r.hx-2,r.hy-12,5,4,C.yl);}
  }
  if(p.atkKind==='giant'&&p.atk>0){
    if(mode===3){px(r.hx-1,r.hy-46,3,46,C.wh);px(r.hx-1,r.hy-46,1,46,C.cy);px(r.hx-2,r.hy,5,1,C.yl);}
    else{const L=60,gx=p.face>0?r.hx:r.hx-L;px(gx,r.hy-1,L,3,C.wh);px(gx,r.hy+1,L,1,C.cy);px(r.hx,r.hy-2,1,5,C.yl);if(p.atk>=p.hitAt-3)for(let i=0;i<4;i++)px(p.face>0?r.hx+6+i*13:r.hx-16-i*13,r.hy-5-i,9,1,C.cyd);}
  }
  if(p.usedAir&&p.vy<0){px(x-3,fy,2,2+((T>>1)&1),C.yl);px(x+2,fy,2,2+((T>>1)&1),C.yl);}
  if(p.stun>0)stunStars(x,r.topY-12);
  if(mode===4){
    // heart shield from the concept sheet; flashes white during the parry window
    const sh=s.th+4,sx=p.face>0?r.hx:r.hx-3,edge=p.guardT<=10?C.wh:C.yl;
    box(sx,r.topY-2,4,sh,{line:edge,fill:C.mgd,dark:C.mgx});
    const hy=r.topY-2+(sh>>1)-1;px(sx+1,hy,1,1,C.mg);px(sx+2,hy,1,1,C.mg);px(sx+1,hy+1,2,1,C.mg);
  }
  // swoosh arcs on combo hits
  if(p.atkKind==='melee'&&atkOn&&p.atk>=p.hitAt-1){
    const n=p.combo,ax=p.face>0?r.hx+1:r.hx-7;
    if(n===2){px(r.hx-1,r.hy-6,3,1,C.wh);px(r.hx-3,r.hy-3,1,3,C.cyd);px(r.hx+3,r.hy-3,1,3,C.cyd);}
    else{px(ax,r.hy-2,6,1,C.cyd);px(ax,r.hy+2,6,1,C.cyd);}
  }
  hiLines(x,r.topY-16);
}
function drawHusk(){for(const h of pl.husks){const s=FR[h.fid].s;if(s)drawFrame(h.x,GY+2,h.fid,s,h.face,0,false,0,FP.husk);}}
function drawDebris(){for(const d of debris){if(d.tri){px(d.x,d.y,5,1,C.wh);px(d.x+1,d.y+1,3,1,C.wh);px(d.x+2,d.y+2,1,1,C.wh);}else box(d.x,d.y,d.w,d.h,d.pal,d.dark);}}
function drawBursts(){
  for(const b of bursts){
    const L=Math.round((16-b.t)*1.7)+4,c=b.t>8?C.yl:C.mg;
    for(let i=0;i<8;i++){const a=Math.PI+i*Math.PI/7,l=i%2?L*.55:L;pline(b.x+Math.cos(a)*3,b.y+Math.sin(a)*3,b.x+Math.cos(a)*l,b.y+Math.sin(a)*l,c);}
    px(b.x-2,b.y-3,5,4,b.t>10?C.wh:C.yl);
  }
}
function stunStars(cx,top){for(let i=0;i<3;i++){const a=T*.18+i*2.1;px(cx+Math.cos(a)*6,top-3+Math.sin(a)*2,1,1,C.yl);}}
function drawFoe(e,x,fy,t,pal){if(e.T.float)drawShaman(e,x,fy,t,pal);else if(e.T.dash)drawHound(e,x,fy,t,pal);else drawEnemy(e,x,fy,t,pal);}
function drawEnemy(e,x,fy,t,pal){
  const s=e.T,atk=e.st==='atk',mode=atk?1:e.st==='wind'?5:0;
  const r=drawMech(x+(e.hurt>0?-e.face:0),fy,s,e.face,(e.walk||0)*.35,e.moving,mode,pal);
  const hs=Math.max(s.hw,s.hh),hx=Math.round(x+(e.hurt>0?-e.face:0))-Math.floor(hs/2),hy=r.topY-hs+(e.st==='stun'?1:0);
  if(e.noHead){px(Math.round(x)-2,r.topY-1,4,1,pal.dark);px(Math.round(x)-1,r.topY-2,2,1,pal.line);}
  else box(hx,hy,hs,hs,pal);
  if(e.noHead){}
  else if(e.type==='walker'){px(hx+2,hy+2,hs-4,hs-4,pal===PAL.sil?pal.fill:C.cyx);px(e.face>0?hx+s.hw-6:hx+4,hy+3,2,e.st==='stun'?1:2,pal.eye);}
  else if(e.type==='bomber'){px(hx+2,hy+2,s.hw-4,s.hh-4,pal===PAL.sil?pal.fill:C.cyx);if(pal!==PAL.sil)pixHex(hx+(s.hw>>1),hy+(s.hh>>1),2,1,e.st==='drop'&&(t>>2)&1?C.yl:C.mg,true);px(hx+(s.hw>>1),hy-3,1,3,pal.line);if(e.st==='drop')px(Math.round(x)-3,r.topY+s.th-3,6,2,C.yl);}
  else if(e.type==='makercore'){if(pal!==PAL.sil){px(hx+(hs>>1)-2,hy+(hs>>1)-2,5,5,C.mg);px(hx+(hs>>1)-1,hy+(hs>>1)-1,3,3,C.mgx);px(hx+(hs>>1),hy+(hs>>1),1,1,C.yl);}px(hx,hy-3,1,3,pal.line);px(hx+hs-1,hy-3,1,3,pal.line);}
  else{const ex=e.face>0?hx+hs-4:hx+1;px(ex,hy+2,3,3,pal.eye);if(e.st!=='stun')px(e.face>0?ex+1:ex+1,hy+3,1,1,C.void);else px(ex,hy+3,3,1,pal.line);}
  if(e.type==='lancer'){const L=atk?s.reach+8:e.st==='wind'?6:12;px(e.face>0?r.hx:r.hx-L,r.hy,L,1,pal.mark);px(e.face>0?r.hx+L:r.hx-L-1,r.hy-1,2,3,pal.eye);}
  if(e.type==='brute')box(r.hx-3,r.hy-2,6,5,pal);
  if(e.type==='makercore'){const L=atk?16:e.st==='wind'?4:9;px(e.face>0?r.hx:r.hx-L,r.hy,L,1,C.wh);px(r.hx,r.hy-1,1,3,C.yl);}
  if(e.type==='guard'){
    if(e.st!=='stun'&&e.st!=='air'&&e.st!=='down'){const sx=e.face>0?Math.round(x)+Math.ceil(s.tw/2)+1:Math.round(x)-Math.floor(s.tw/2)-6,sy=r.topY-4,sh=s.th+8;
      box(sx,sy,5,sh,{line:pal===PAL.sil?pal.line:C.yl,fill:pal.fill,dark:pal.dark});
      if(pal!==PAL.sil){const hy2=sy+(sh>>1)-1;px(sx+1,hy2,1,1,C.mg);px(sx+3,hy2,1,1,C.mg);px(sx+1,hy2+1,3,1,C.mg);px(sx+2,hy2+2,1,1,C.mg);}}
    else box(Math.round(x)-12,fy-3,12,3,{line:C.yl,fill:C.mgd,dark:C.mgx});
  }
  if(e.type==='scrap')px(e.face>0?r.hx:r.hx-3,r.hy,4,1,pal.mark);
  if(e.st==='wind'){const j=(t>>2)&1,tx=Math.round(x);px(tx-4,hy-7+j,1,1,C.yl);px(tx-3,hy-6+j,1,1,C.yl);px(tx,hy-8+j,1,3,C.yl);px(tx+4,hy-7+j,1,1,C.yl);px(tx+3,hy-6+j,1,1,C.yl);}
  if(e.st==='stun'||e.st==='down')stunStars(Math.round(x),hy);
}
function drawShaman(e,x,fy,t,pal){
  x=Math.round(x);fy=Math.round(fy);const f=e.face||-1,cast=e.st==='cast';
  if(cast){
    for(let i=0;i<14;i++){const w=Math.max(2,5-(i>>2)),yy=fy-15-i;px(x-5-i,yy,w,3,pal.fill);px(x+5+i-w+1,yy,w,3,pal.fill);px(x-5-i,yy,1,1,pal.line);px(x+5+i,yy,1,1,pal.line);}
  }else{
    for(let i=0;i<16;i++){const w=3+Math.round(i*.55);px(x-w,fy-18+i,w*2,1,i%4===0?pal.fill:pal.dark);}
  }
  const sw=Math.round(Math.sin(t*.1));
  px(x-2,fy-6,1,6+sw,pal.line);px(x+1,fy-6,1,6-sw,pal.line);
  box(x-4,fy-16,8,10,pal);px(x,fy-13,1,1,pal.mark);px(x-1,fy-12,3,1,pal.mark);
  box(x-4,fy-23,8,7,pal);px(f>0?x+1:x-3,fy-21,2,e.st==='stun'?1:2,pal.eye);
  px(x-3,fy-26,1,3,pal.line);px(x,fy-27,1,4,pal.line);px(x+2,fy-26,1,3,pal.line);
  const sx=f>0?x+6:x-7;px(sx,fy-18,1,18,pal===PAL.sil?pal.line:C.gr);px(sx-1,fy-21,3,1,pal.eye);px(sx,fy-20,1,1,pal.eye);
  if(cast&&(t>>1)&1)pixHex(sx,fy-22,4,1,C.mg);
  if(e.st==='stun')stunStars(x,fy-27);
}
function drawBoss(e,t,pal){
  const bx=Math.round(e.x)+(e.shk||0),k=Math.round(e.k),B=GY;
  box(bx-38,B-26,16,26,pal);box(bx+22,B-26,16,26,pal);
  box(bx-44,B-6,24,6,pal);box(bx+20,B-6,24,6,pal);
  box(bx-30,B-36+k,60,12,pal,true);
  box(bx-44,B-80+k,88,46,pal);
  px(bx-40,B-76+k,80,1,pal.line);
  box(bx-58,B-86+k,22,18,pal);box(bx+36,B-86+k,22,18,pal);
  const hp=e.hurtHead>0&&(e.hurtHead&2)?PAL.hit:pal;
  if(e.headDown){const hx=bx-90,hy=B-14;for(let i=0;i<4;i++)box(bx-40-i*10,B-64+k+i*12,8,8,pal,true);box(hx,hy,24,16,hp);px(hx+4,hy+5,5,5,C.mg);px(hx+5,hy+6,3,3,(t>>2)&1?C.yl:C.wh);}
  else box(bx-10,B-96+k,20,14,hp);
  if(e.headDown){}
  else if(e.type==='maker'){box(bx-15,B-106+k,4,11,hp);box(bx+11,B-106+k,4,11,hp);pixHex(bx,B-89+k,5,1,C.mg);px(bx,B-89+k,1,1,C.yl);}
  else if(pal!==PAL.sil){px(bx-5,B-91+k,4,4,C.mg);px(bx-4,B-90+k,2,2,C.yl);}
  box(bx+44,B-68+k,12,40,pal,true);box(bx+42,B-30+k,16,10,pal);
  const vul=e.st==='kneel';
  if(vul&&pal!==PAL.sil)pixHex(bx,B-60+k,9,1,(t>>3)&1?C.yl:C.mg);
  pent(bx,B-60+k,vul?((t>>2)&1?C.yl:C.wh):pal.mark);
  const sx=Math.round(e.x)-50,sy=B-74+k;
  for(let i=1;i<=3;i++){const a=i/4,cx=Math.round(sx+(e.fx-sx)*a),cy=Math.round(sy+(e.fy-sy)*a);box(cx-4,cy-4,8,8,pal,true);if(vul&&(t>>3)&1)px(cx-4,cy-4,8,1,C.yl);}
  box(Math.round(e.fx)-11,Math.round(e.fy)-8,22,16,pal);
  px(Math.round(e.fx)-7,Math.round(e.fy)-3,14,1,pal.mark);
  if(vul&&(t>>3)&1)px(Math.round(e.fx)-11,Math.round(e.fy)-8,22,1,C.yl);
}

// ---------- PLAY: the beat 'em up campaign ----------
// one street through all three levels; robots you beat leave their bodies behind, and a smaller body can climb into a bigger one
const BZ0=110,BZ1=138,SECW=256,SL=SECW*5;
const STAGES=[
  {theme:0,name:'THE BURIAL WASTE',secs:[[['scrap',200,120],['scrap',236,134]],[['scrap',210,116],['lancer',240,132],['C',150,128]],[['brute',220,124,1],['scrap',-30,132]],[['scrap',200,124],['lancer',-30,116],['C',120,118]],[['BOSS','matry']]]},
  {theme:1,name:'THE PINE FOREST',secs:[[['guard',220,122],['scrap',240,134]],[['hound',230,114],['hound',-30,134],['C',140,128]],[['walker',220,122,1],['hound',-30,132]],[['scrap',230,116],['guard',240,132],['C',120,124]],[['BOSS','warden']]]},
  {theme:3,name:'THE TOY WORKS',intro:['THE WARDEN GOES QUIET.','ITS LAST SIGNAL CAME FROM THE FOUNDRY.','THE ROAD RUNS THROUGH A TOY FACTORY.','SOMETHING INSIDE IS STILL WOUND UP.'],belt:[[1,40,220,-1],[3,60,200,-1]],
   secs:[[['scrap',200,120],['scrap',236,134],['lancer',240,116]],[['hound',230,114],['hound',-30,134],['C',140,128]],[['guard',220,124,1],['lancer',-30,132]],[['brute',210,118],['walker',240,132],['scrap',-30,124],['C',120,124]],[['BOSS','knight']]]},
  {theme:4,name:'HERMIT HARBOUR',intro:['THE KNIGHT RUNS DOWN.','THE ROAD ENDS AT A NIGHT HARBOUR.','EMPTY BODIES WASH UP ON THE PIER.','SOMETHING IS COLLECTING THEM.'],
   secs:[[['scrap',200,120],['scrap',236,134],['lancer',240,116]],[['hound',230,114],['hound',-30,134],['C',150,128]],[['guard',220,124,1],['scrap',-30,132]],[['brute',210,118],['walker',240,132],['lancer',-30,124],['C',120,124]],[['BOSS','crab']]]},
  {theme:5,name:'THE MAGNET YARD',intro:['THE CRAB LETS GO OF ITS DREAM SHELL.','PAST THE PIER, A SCRAPYARD HUMS.','A MAGNET PULLS AT EVERY BODY.','ONLY A CORE IS TOO LIGHT TO LIFT.'],
   secs:[[['scrap',200,118],['scrap',230,132],['scrap',-30,124]],[['lancer',220,118],['walker',240,132],['C',140,126]],[['brute',220,124,1],['hound',-30,132]],[['walker',220,118],['guard',240,132],['scrap',-30,124],['C',120,124]],[['BOSS','crane']]]},
  {theme:6,name:'THE GULLET BOG',intro:['THE CRANE FALLS SILENT.','THE ROAD SINKS INTO A SWAMP','OF DROWNED MACHINES.','SOMETHING BIG IS CROAKING.'],mud:[[0,80,150],[1,60,140],[2,120,200],[3,40,110],[4,30,90]],
   secs:[[['scrap',200,118],['scrap',230,132],['scrap',-30,124]],[['hound',230,114],['hound',-30,134],['C',170,128]],[['brute',220,124,1],['lancer',-30,132]],[['guard',220,118],['walker',240,132],['hound',-30,124],['C',150,124]],[['BOSS','toad']]]},
  {theme:7,name:"THE GIANT'S KITCHEN",intro:['THE TOAD KING BURPS ITS LAST.','A DOOR IN THE BOG OPENS ONTO A KITCHEN.','ONION HEAD IS TINY HERE.','THE COOK IS HUNGRY.'],
   secs:[[['scrap',200,120],['scrap',236,134],['lancer',240,116]],[['hound',230,114],['hound',-30,134],['C',140,128]],[['walker',220,124,1],['scrap',-30,132]],[['brute',210,118],['brute',240,132],['lancer',-30,124],['C',120,124]],[['BOSS','cook']]]},
  {theme:2,name:'THE FOUNDRY',intro:['THE COOK DROPS ITS PAN.','BEHIND THE STOVE LIES THE FOUNDRY,','WHERE THE GIANTS ARE MADE.','THE ONE THAT TOOK SHELLY IS THERE.'],secs:[[['hound',220,114],['brute',240,130]],[['guard',220,118],['guard',240,134],['lancer',-30,124],['C',150,126]],[['brute',220,116,1],['brute',240,134,1]],[['walker',230,122],['hound',240,134],['C',130,122]],[['BOSS','maker']]]}
];
const SECS=[];STAGES.forEach((st,si)=>st.secs.forEach((foes,i)=>{const x0=si*SL+i*SECW;SECS.push({stage:si,x0,foes,
  mud:(st.mud||[]).filter(m=>m[0]===i).map(m=>[x0+m[1],x0+m[2]]),belt:(st.belt||[]).filter(m=>m[0]===i).map(m=>[x0+m[1],x0+m[2],m[3]])});}));
// difficulty: levels 1-2 as before, then rising evenly so the last level matches the old level 3
const tierOf=st=>st<=1?st:1+(st-1)/(STAGES.length-2);
// mud slows, belts push; checked for the section you're in and the next one
function hazAt(x){let mud=false,belt=0;for(const S of [SECS[bw.sec],SECS[bw.sec+1]])if(S){for(const m of S.mud)if(x>m[0]&&x<m[1])mud=true;for(const c of S.belt)if(x>c[0]&&x<c[1])belt=c[2];}return{mud,belt};}
const BLEN=SECS.length*SECW;
const stageAt=x=>clamp(Math.floor(x/SL),0,STAGES.length-1);
// bodies Onion Head can pilot: its own frames, and any robot it has beaten ("e:" + robot type)
const FSIZE={core:0,basic:1,brute:2,walker:3,titan:4};
const ESIZE={scrap:1,lancer:1,hound:2,guard:2,brute:2,bomber:2,makercore:2,walker:3};
function bodyOf(id){
  if(id==='flyer')return FLYER;
  if(id==='doll')return{doll:true,size:2,shell:70,dmg:6,spd:1.15,reach:16,name:'DOLL'};
  if(id==='core')return{size:0,dmg:3,spd:1.5,reach:14,name:'CORE'};
  if(id.startsWith('e:')){const t=id.slice(2),T0=TYPES[t];return{foe:t,T:T0,size:ESIZE[t]||1,shell:Math.round(T0.hp*(t==='scrap'?1.3:1)),dmg:Math.max(3,Math.round(T0.dmg*.55)),spd:clamp((T0.spd||.6)*1.9,.95,1.7),reach:(T0.reach||12)+(T0.tw||10)/2+4,name:T0.name};}
  const f=FR[id];return{frame:id,size:FSIZE[id],shell:f.shell,dmg:f.dmg,spd:f.spd,reach:f.s.tw/2+f.s.ah+4,name:f.name};
}
const MEPAL={line:C.cy,fill:C.cyd,dark:C.cyx,mark:C.wh,eye:C.yl};
const HPAL={line:C.gr,fill:C.grd,dark:C.grx,mark:C.gr,eye:C.grx};
let bw=null,titleSel=0;
function campaignStart(){
  bw={cam:0,sec:-1,clear:false,score:0,ents:[],items:[],shots:[],rockets:[],beam:null,boss:null,bombs:[],strikes:[],plats:[],heads:[],drops:[],zaps:[],t:0,last:null,endT:0,win:false,stage:0,stageT:0,cont:0,rubble:[],
      p:{x:40,z:124,h:0,vx:0,vz:0,vh:0,face:1,layers:[],core:3,pow:50,atk:0,hitAt:0,kind:null,sp:null,combo:0,comboWin:0,buffer:false,inv:0,onG:true,walk:0,land:0,grab:null,hits:0,hitT:0,jt:99,boot:0}};
  parts=[];texts=[];bursts=[];state='brawl';banner=null;glitch=1;crunch(.25,.06);
  bw.stageT=1;nextSec();
  bw.ents.push({husk:true,id:'basic',shell:40,max:40,x:110,z:126,face:1});
}
function spawnSec(){
  const S=SECS[bw.sec],mult=1+FEEL.robots.hpPerTier*tierOf(S.stage);
  for(const [type,x,z,boss] of S.foes){
    if(type==='BOSS'){bw.boss=makeBoss(x,S.x0);bw.ents.push({crate:true,x:S.x0+70,z:132,h:0,hp:2,hurt:0,drop:'hook'});continue;}
    if(type==='C'){bw.ents.push({crate:true,x:S.x0+x,z,h:0,hp:3,hurt:0});continue;}
    const T0=TYPES[type],hp=Math.round(T0.hp*(boss?(boss===2?FEEL.robots.finalHp:FEEL.robots.miniBossHp):FEEL.robots.hp)*mult);
    bw.ents.push({type,T:T0,x:S.x0+x,z,h:0,vh:0,vx:0,face:-1,st:'walk',t:rnd(20,70)|0,hp,max:hp,dmg:Math.round(T0.dmg*FEEL.robots.damage*(1+FEEL.robots.damagePerTier*tierOf(S.stage))),hurt:0,walk:0,moving:false,boss:!!boss,final:boss===2,role:'wait',zo:rnd(-14,14)});
  }
  spawnStreetLife();
}
function nextSec(){
  bw.sec++;bw.clear=false;
  if(bw.sec>=SECS.length){state='ending';endT=0;glitch=1;parts=[];return;}
  spawnSec();
  const S=SECS[bw.sec];
  if(S.stage!==bw.stage||bw.sec===0){bw.stage=S.stage;bw.stageT=1;LV=LEVELS[Math.min(S.stage,LEVELS.length-1)];beep(392,.6,'sine',.04);}
  if(S.foes.some(f=>f[0]==='BOSS')){const bn=S.foes.find(f=>f[0]==='BOSS')[1];banner={s:'BOSS',t:70};say(TYPES[bn].name,S.x0+180,70,C.mg,120);}
  else if(S.foes.some(f=>f[3]))banner={s:'MINI BOSS',t:60};
  bw.checkpoint={sec:bw.sec,score:bw.score};
  glitch=Math.max(glitch,.5);
}
const bFoes=()=>bw.ents.filter(e=>e.type&&e.st!=='dead');
const pBody=()=>{const L=bw.p.layers;return L.length?bodyOf(L[L.length-1].id):bodyOf('core');};
function bDamage(e,d,dir,o={}){
  if(e.crate&&e.prop){if(e.dead)return false;e.hp--;e.hurt=8;spark(e.x,e.z-PROPS[e.prop].ht/2,8,PROPS[e.prop].cols,2);crunch(.08,.06);if(e.hp<=0){e.dead=true;breakProp(e);}return true;}
  if(e.crate){e.hp--;e.hurt=8;spark(e.x,e.z-8,8,[C.gr,C.yl,C.wh],2);crunch(.08,.06);
    if(e.hp<=0){e.dead=true;spark(e.x,e.z-6,16,[C.gr,C.grd,C.yl],2.6);const r=Math.random();bw.items.push(e.drop?{kind:'wpn',w:e.drop,x:e.x,z:e.z}:r<.4?{kind:'wpn',w:WEAPONS[(Math.random()*WEAPONS.length)|0],x:e.x,z:e.z}:{kind:r<.65?'cell':'scrap',x:e.x,z:e.z});bw.score+=50;}return true;}
  if(!e.type||e.st==='dead'||e.st==='held')return false;
  if(e.type==='guard'&&!o.heavy&&!o.force&&dir===-e.face&&['walk','wind','rec'].includes(e.st)){spark(e.x-e.face*8,e.z-14,5,[C.yl,C.wh],1.5);say('BLOCKED',e.x,e.z-30,C.yl,26);beep(1100,.05,'square',.03);return true;}
  e.hp-=d;e.hurt=8;e.x+=dir*(o.heavy?6:2);hitstop=o.heavy?FEEL.combat.hitstopHeavy:FEEL.combat.hitstopLight;bw.last=e;
  const p=bw.p;p.hits=p.hitT>0?p.hits+1:1;p.hitT=90;bw.score+=10*Math.min(p.hits,10);p.pow=Math.min(100,p.pow+FEEL.combat.powerPerHit);
  spark(e.x,e.z-12-e.h,o.heavy?12:6,[C.yl,C.mg,C.wh],o.heavy?3:2);say(String(d),e.x,e.z-24-e.h,C.yl,26);
  kick(o.heavy?4:2,o.heavy?.5:.2);beep(o.heavy?120:300,.1,'square',.06,-80);crunch(o.heavy?.15:.07,o.heavy?.09:.05);
  if(e.hp<=0){e.st='air';e.vh=3.2;e.vx=dir*1.6;e.dying=true;return true;}
  if(o.launch&&!e.boss){e.st='air';e.vh=3.6;e.vx=dir*.8;say('LAUNCH',e.x,e.z-34,C.cy,24);}
  else if(e.st==='air'){e.vh=Math.max(e.vh,2);e.vx=dir*.5;}
  else if(o.heavy){e.st='stun';e.t=e.boss?14:36;}
  else if(o.stun&&!e.boss){e.st='stun';e.t=34;}
  return true;
}
function bHitBox(x0,x1,dz,maxH,d,o){
  const p=bw.p,dir=p.face;let hit=false;
  for(const e of bw.ents){
    if(e.husk||e.civ||e.dead||e.st==='dead'||e===p.grab)continue;
    const ed=eDim(e);if(e.x+ed.hw<x0||e.x-ed.hw>x1||Math.abs(e.z-p.z)>dz+ed.dz-4)continue;
    if((e.h||0)>maxH&&!o.air)continue;
    if(bDamage(e,d,dir,o))hit=true;
  }
  if(bossHit(x0,x1,dz,d,o))hit=true;
  if(kickBombs(x0,x1,dz))hit=true;
  if(kickHeads(x0,x1,dz))hit=true;
  return hit;
}
// the outer layer takes the hit; when it breaks you fall back to the next layer, then to the core
function bHurt(d,src){
  const p=bw.p;if(p.inv>0||state!=='brawl'||p.inside)return;
  const front=(src.x-p.x)*p.face>0,b=pBody();
  if(p.kind==='sp'&&p.sp==='bash'&&front){say('BLOCK',p.x,p.z-36,C.cy,24);beep(900,.05,'square',.04);return;}
  if(b.foe==='guard'&&front){d=Math.ceil(d/2);say('BLOCK',p.x,p.z-36,C.cy,24);beep(900,.05,'square',.04);}
  p.inv=FEEL.combat.hurtInvuln;p.vx=(p.x<src.x?-1:1)*FEEL.combat.hurtKnockback;hitstop=FEEL.combat.hurtHitstop;kick(4,.6);beep(80,.18,'sawtooth',.07,-40);crunch(.12,.08);
  spark(p.x,p.z-14-p.h,10,[C.cy,C.wh,C.mg],2.4);p.atk=0;p.kind=null;
  if(p.grab){p.grab.st='down';p.grab.t=20;p.grab=null;}
  const L=p.layers;
  if(L.length){const top=L[L.length-1];top.shell-=d;say('-'+d,p.x,p.z-34,C.mg,30);
    if(top.shell<=0){L.pop();banner={s:'SHELL BREAK',t:60};kick(7,1);crunch(.35,.12);spark(p.x,p.z-14,24,[C.cy,C.gr,C.wh],3.4);
      say(L.length?'LAYER LOST':'BACK 2 KNIFE',p.x,p.z-44,C.yl,80);p.vh=3;p.onG=false;p.inv=60;}}
  else{p.core--;say('CORE HIT',p.x,p.z-26,C.mg,40);if(p.core<=0){p.core=0;bw.win=false;bw.endT=0;state='bover';kick(8,1);crunch(.6,.12);beep(60,.8,'sawtooth',.07,-30);}}
}
const nearHusk=()=>{const p=bw.p,sz=pBody().size;let best=null,bd=99;for(const e of bw.ents){if(!e.husk)continue;const d=Math.abs(e.x-p.x)+Math.abs(e.z-p.z)*1.5;if(d<16&&d<bd&&bodyOf(e.id).size>sz){best=e;bd=d;}}return best;};
// nesting is won by beating the Matryoshka; until then climbing in swaps bodies and leaves the old one standing
function climbIn(h){
  const p=bw.p;bw.ents=bw.ents.filter(e=>e!==h);
  if(p.layers.length&&!bw.nestOK){const old=p.layers.pop();bw.ents.push({husk:true,id:old.id,shell:old.shell,max:old.max,weapon:old.weapon,x:p.x-p.face*14,z:p.z,face:p.face});
    if(!bw.nestTold){bw.nestTold=true;say('NESTING LOCKED: BEAT THE MATRYOSHKA',p.x,p.z-58,C.gr,110);}}p.layers.push({id:h.id,shell:h.shell,max:h.max,weapon:h.weapon});p.x=h.x;p.z=h.z;p.boot=16;p.inv=Math.max(p.inv,16);p.atk=0;p.kind=null;p.grab=null;
  const b=bodyOf(h.id);bw.card={t:150,name:b.name,sub:SPNAME[SPOW[h.id]]||'',icon:SPOW[h.id]||'glove'};say(p.layers.length>1?'NESTED':b.name,p.x,p.z-44,C.cy,50);beep(180,.1,'square',.05,-60);setTimeout(()=>beep(880,.08,'square',.04,440),120);spark(p.x,p.z-14,14,[C.cy,C.yl,C.wh],1.8);glitch=Math.max(glitch,.4);
}
function ejectLayer(){
  const p=bw.p,top=p.layers.pop();
  bw.ents.push({husk:true,id:top.id,shell:top.shell,max:top.max,weapon:top.weapon,x:p.x,z:p.z,face:p.face});
  p.vh=3.8;p.onG=false;p.jt=0;p.vx=-p.face*1.6;p.inv=30;p.atk=0;p.kind=null;p.grab=null;
  banner={s:'EJECT',t:40};kick(3,.6);beep(600,.25,'square',.05,900);spark(p.x,p.z-14,10,[C.cy,C.wh],1.8);
}
function bStartAtk(n){const p=bw.p,b=pBody();
  if(b.foe==='hound'){p.kind='lunge';p.atk=16;p.hitAt=-1;p.vx=p.face*4.2;p.hitSet=new Set();beep(160,.12,'sawtooth',.04,-60);return;}
  const C2=FEEL.combat;p.kind='melee';p.combo=n;p.atk=[C2.jabTime,C2.slashTime,C2.finisherTime][n];p.hitAt=[C2.jabHitAt,C2.slashHitAt,C2.finisherHitAt][n];p.buffer=false;if(n===2)p.vx+=p.face*C2.finisherLunge;beep(b.size===0?[900,1000,700][n]:[500,600,260][n],.05,'square',.03,-200);}
function dust(x,z,n,dir=0){for(let i=0;i<n;i++)parts.push({x:x+rnd(-3,3),y:z-1-rnd(0,2),vx:rnd(-.5,.5)+dir*.4,vy:-rnd(.05,.35),t:12+rnd(0,8)|0,c:i%2?C.grd:C.gr,gv:-.004,s:Math.random()<.35?2:1});}
function stepBrawl(){
  const p=bw.p,b=pBody(),core=b.size===0,fid=b.frame||(core?'core':'basic'),mo=b.flyer?MOM.flyer:MOM[b.frame||(core?'core':b.size>=3?'walker':b.size===2?'brute':'basic')]||MOM.basic;
  bw.t++;for(const q of parts)if(q.ring)q.r+=2.2;for(const q of bursts)q.t--;bursts=bursts.filter(q=>q.t>0);
  if(p.inv>0)p.inv--;if(p.comboWin>0)p.comboWin--;if(p.hitT>0)p.hitT--;else p.hits=0;if(p.land>0)p.land--;if(p.boot>0)p.boot--;p.jt++;
  if(bw.stageT>0&&++bw.stageT>420)bw.stageT=0;
  const dx=K.right-K.left,dz=K.down-K.up;
  if(P.a)p.lastA=bw.t;if(P.b)p.lastB=bw.t;
  if(p.inside){toadInside();stepBrawlWorld();return;}
  // Start: climb into a bigger empty body if one is next to you, otherwise eject the outer layer
  if(P.start&&p.onG&&!p.grab){const h=nearHusk();if(h)climbIn(h);else if(p.layers.length)ejectLayer();else{say('NOTHING TO EJECT',p.x,p.z-30,C.gr,30);beep(160,.05,'square',.03);}}
  else if((P.sp||(P.b&&bw.t-(p.lastA||-99)<FEEL.player.abWindow)||(P.a&&bw.t-(p.lastB||-99)<FEEL.player.abWindow))&&(p.atk<=0||p.kind==='melee')&&p.boot<=0&&p.kind!=='sp'){if(!p.onG&&p.jt<5&&!p.plat){p.h=0;p.vh=0;p.onG=true;}p.atk=0;p.kind=null;startSpecial();}
  else if(P.a&&p.onG&&(p.atk<=0||p.kind==='melee')&&!p.grab){p.atk=0;p.kind=null;p.buffer=false;p.vh=core?FEEL.player.jumpCore:FEEL.player.jumpBody-b.size*FEEL.player.jumpSizeLoss;p.onG=false;p.jt=0;p.plat=null;beep(330,.06,'square',.03,300);dust(p.x,p.z,3);}
  else if(P.b&&p.boot<=0){
    if(p.grab){const e=p.grab;p.grab=null;e.st='thrown';e.vx=p.face*FEEL.combat.throwSpeed;e.vh=2.4;e.h=8;e.x=p.x+p.face*10;p.kind='throw';p.atk=14;p.hitAt=-1;say('THROW',p.x,p.z-36,C.cy,30);beep(180,.2,'square',.05,-60);kick(3,.3);}
    else if(!p.onG&&p.atk<=0){if(K.down){p.kind='dive';p.atk=999;p.hitAt=-5;p.vh=-FEEL.player.diveSpeed;beep(600,.12,'square',.04,-400);}else{p.kind='air';p.atk=FEEL.combat.airTime;p.hitAt=FEEL.combat.airHitAt;beep(700,.04,'square',.03,-200);}}
    else if(p.atk<=0)bStartAtk(p.comboWin>0&&p.combo<2?p.combo+1:0);
    else if(p.kind==='melee'&&p.combo<2)p.buffer=true;
  }
  const locked=p.atk>0&&p.onG&&p.kind!=='throw'&&p.kind!=='lunge'&&p.kind!=='sp',spd=b.spd*(p.grab?FEEL.player.grabSlow:1);
  if(p.kind==='sp'){}else if(dx&&!locked){p.vx=clamp(p.vx+dx*mo.a,-spd,spd);if(p.atk<=0)p.face=dx;}else if(p.kind!=='lunge')p.vx*=p.onG?mo.f:FEEL.player.airFriction;
  {const dp=FEEL.player.depthSpeed;if(dz&&!locked)p.vz=clamp((p.vz||0)+dz*mo.a*dp,-spd*dp,spd*dp);else p.vz=(p.vz||0)*(p.onG?mo.f:FEEL.player.airFriction);}
  p.x+=p.vx;p.z=clamp(p.z+p.vz,BZ0,BZ1);
  {const hz=hazAt(p.x);if(p.onG&&!b.flyer){if(hz.mud){p.x-=p.vx*FEEL.hazards.mudSlow;p.z=clamp(p.z-(p.vz||0)*FEEL.hazards.mudSlow,BZ0,BZ1);if(Math.abs(p.vx)>.3&&bw.t%9===0)dust(p.x,p.z,1);}if(hz.belt)p.x+=hz.belt*FEEL.hazards.beltPush;}}
  const S=SECS[bw.sec],lockR=bw.clear?(SECS[bw.sec+1]?SECS[bw.sec+1].x0+W:BLEN):S.x0+W;
  p.x=clamp(p.x,bw.cam+8,lockR-8);
  if(p.onG&&Math.abs(p.vx)+Math.abs(p.vz)>.3)p.walk+=Math.abs(p.vx)+Math.abs(p.vz);
  if(p.onG&&!pBody().flyer){if(Math.abs(p.vx)>.9&&bw.t%10===0)dust(p.x-p.face*4,p.z,1,-p.face);if(dx&&Math.sign(p.vx)===-dx&&Math.abs(p.vx)>.7&&bw.t%3===0)dust(p.x+Math.sign(p.vx)*3,p.z,2,Math.sign(p.vx));}
  if(p.plat&&p.onG){const q=p.plat;if(!bw.plats.includes(q)||p.x<q.x0-2||p.x>q.x1+2||p.z<q.z0-2||p.z>q.z1+2){p.plat=null;p.onG=false;p.vh=0;}else p.h=q.h;}
  // the Flyer's jetpack: hold A in the air to thrust upward while the fuel lasts; it refills on the ground
  if(b.flyer){if(p.fuel===undefined)p.fuel=JET.fuel;
    if(p.onG)p.fuel=Math.min(JET.fuel,p.fuel+JET.refill);
    else if(K.a&&p.jt>6&&p.fuel>0&&p.kind!=='dive'&&p.kind!=='sp'){p.fuel--;p.vh=Math.min(JET.vmax,p.vh+JET.thrust);if(p.h>=JET.cap){p.h=JET.cap;p.vh=Math.min(p.vh,0);}
      if(bw.t%2===0||p.fuel>12)for(const sx of [-7,6])parts.push({x:p.x+sx+rnd(-1,1),y:p.z-p.h-HOV+2,vx:rnd(-.2,.2),vy:rnd(.9,1.5),t:6+rnd(0,6)|0,c:[C.yl,C.yl,C.wh,C.mg][(Math.random()*4)|0],gv:0,s:Math.random()<.5?2:1});
      if(bw.t%6===0)beep(70+rnd(0,20),.06,'sawtooth',.02,-20);}}
  if(!p.onG){const h0=p.h;p.h+=p.vh;p.vh-=p.kind==='dive'?FEEL.player.diveGravity:(p.vh>0?FEEL.player.gravityUp:FEEL.player.gravityDown);
    if(p.vh<0)for(const q of bw.plats)if(p.x>=q.x0&&p.x<=q.x1&&p.z>=q.z0&&p.z<=q.z1&&h0>=q.h-1&&p.h<=q.h){p.h=q.h;p.vh=0;p.onG=true;p.plat=q;p.land=4;if(p.kind==='dive'||p.kind==='air'){p.kind=null;p.atk=0;}break;}
    if(!K.a&&p.vh>FEEL.player.jumpCutSpeed&&p.kind!=='dive'&&p.jt<20)p.vh*=FEEL.player.jumpCut;
    if(!p.onG&&p.h<=0){p.h=0;p.onG=true;p.land=6;dust(p.x,p.z,b.size>=2?7:4);
      if(p.kind==='dive'){p.atk=0;p.kind=null;p.land=10;kick(4,.3);crunch(.15,.08);bursts.push({x:Math.round(p.x-bw.cam),y:Math.round(p.z),t:12});bHitBox(p.x-22,p.x+22,10,10,b.dmg,{heavy:true});}
      else if(p.kind==='air'){p.atk=0;p.kind=null;}
      else if(p.kind==='sp'&&p.sp==='pounce'){p.kind=null;p.sp=null;p.atk=0;p.land=10;spHit(p.x-24,p.x+24,12,pBody().dmg*2+2,{heavy:true,launch:true});kick(5,.5);crunch(.2,.1);bursts.push({x:Math.round(p.x-bw.cam),y:Math.round(p.z),t:12});}}}
  if(!p.grab&&p.onG&&p.atk<=0&&dx===p.face&&!core){for(const e of bw.ents){if(e.type&&e.st==='stun'&&!e.boss&&Math.abs(e.x-p.x)<14&&Math.abs(e.z-p.z)<6&&(e.x-p.x)*p.face>0){p.grab=e;e.st='held';e.t=120;say('GRAB',p.x,p.z-36,C.cy,24);beep(400,.08,'square',.04);break;}}}
  if(p.grab&&--p.grab.t<=0){p.grab.st='walk';p.grab=null;}
  if(p.kind==='sp')stepSpecial();
  else if(p.atk>0){
    if(p.kind==='dive'){if(bHitBox(p.x-10,p.x+10,8,p.h+16,Math.round(b.dmg*1.5),{heavy:true,air:true})){p.vh=3.6;p.kind=null;p.atk=0;say('POGO',p.x,p.z-40-p.h,C.cy,24);}}
    else{
      p.atk--;
      if(p.kind==='lunge'){p.vx=p.face*Math.max(.5,p.atk/4);for(const e of bw.ents)if(e.type&&!p.hitSet.has(e)&&e.st!=='dead'&&Math.abs(e.x-p.x)<14&&Math.abs(e.z-p.z)<7){p.hitSet.add(e);bDamage(e,b.dmg+2,p.face,{stun:true});}}
      if(p.atk===p.hitAt){
        const reach=b.reach,x0=p.face>0?p.x:p.x-reach,x1=p.face>0?p.x+reach:p.x;
        if(p.kind==='melee'){const n=p.combo;bHitBox(x0,x1,8,p.h+14,n===2?b.dmg*2:b.dmg+(n===1?1:0),{launch:n===2&&!core,stun:n===1,heavy:n===2});}
        else if(p.kind==='air')bHitBox(x0,x1,9,p.h+20,b.dmg+2,{air:true});
        else if(p.kind==='burst'){bHitBox(p.x-44,p.x+44,16,30,6,{heavy:true,launch:true,force:true});spark(p.x,p.z-14,30,[C.cy,C.yl,C.wh],4);kick(6,.8);crunch(.3,.1);bursts.push({x:Math.round(p.x-bw.cam),y:Math.round(p.z-8),t:14});}
      }
      if(p.atk<=0){const k=p.kind;p.kind=null;if(k==='melee'){if(p.buffer&&p.combo<2)bStartAtk(p.combo+1);else p.comboWin=FEEL.combat.comboWindow;}}
    }
  }
  for(const it of bw.items){if(!it.got&&Math.abs(it.x-p.x)<9&&Math.abs(it.z-p.z)<7&&p.onG){
    if(it.kind==='wpn'){if(!p.layers.length){if(!it.warned){it.warned=1;say('NEEDS A BODY',p.x,p.z-36,C.gr,40);}continue;}p.layers[p.layers.length-1].weapon=it.w;it.got=true;bw.card={t:150,name:SPNAME[it.w],icon:it.w};say(SPNAME[it.w],p.x,p.z-40,C.yl,60);[523,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.1,'square',.04),i*70));continue;}
    it.got=true;
    if(it.kind==='cell'){p.core=Math.min(5,p.core+1);say('CORE CELL',p.x,p.z-36,C.yl,40);}
    else{const L=p.layers;if(L.length){const tp=L[L.length-1];tp.shell=Math.min(tp.max,tp.shell+20);say('FIX +20',p.x,p.z-36,C.cy,40);}else{p.core=Math.min(5,p.core+1);say('CORE +1',p.x,p.z-36,C.cy,40);}}
    [660,880].forEach((f,i)=>setTimeout(()=>beep(f,.08,'square',.03),i*70));}}
  bw.items=bw.items.filter(i=>!i.got);
  stepBrawlWorld();
}
function stepBrawlWorld(){
  const p=bw.p,S=SECS[bw.sec];
  stepShots();
  const foes=bFoes();
  if(bw.t%FEEL.robots.roleEvery===0)for(const e of foes.sort((a,c)=>Math.abs(a.x-p.x)-Math.abs(c.x-p.x)))if(e.role!=='attack'&&foes.filter(o=>o.role==='attack').length<FEEL.robots.maxAttackers)e.role='attack';
  for(const e of bw.ents)if(e.type)stepBrawlFoe(e);
  stepCivs();
  // walker-size bodies and up smash props just by walking into them
  if(pBody().size>=3&&p.onG&&Math.abs(p.vx)>.4){const pd=pDim();for(const e of bw.ents)if(e.prop&&!e.dead&&Math.abs(e.x-p.x)<PROPS[e.prop].hw+pd.hw&&Math.abs(e.z-p.z)<PROPS[e.prop].dz+3&&bw.t-(e.smashT||-99)>14){e.smashT=bw.t;bDamage(e,1,p.face,{});}}
  stepCampBoss();stepBombsB();stepStrikes();stepHeads();stepDrops();
  bw.ents=bw.ents.filter(e=>!(e.crate&&e.dead)&&!(e.civ&&e.gone)&&!(e.type&&e.st==='dead'&&e.t<=0)&&!(e.husk&&e.x<bw.cam-SECW));
  if(!bw.clear&&bFoes().length===0&&!bw.boss){
    bw.clear=true;
    if(!SECS[bw.sec+1]){nextSec();return;}
    say('GO',p.x,p.z-40,C.yl,50);[660,990].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.04),i*90));
  }
  const nx=SECS[bw.sec+1]?SECS[bw.sec+1].x0:BLEN-W;
  const camT=bw.clear?clamp(p.x-110,S.x0,nx):S.x0;
  bw.cam+=(camT-bw.cam)*.12;
  if(bw.clear&&bw.cam>=nx-1){bw.cam=nx;nextSec();}
}
function stepBrawlFoe(e){
  const p=bw.p,T0=e.T;if(e.hurt>0)e.hurt--;
  if(e.st==='dead'){
    if(--e.t<=0&&!e.final){bw.ents.push({husk:true,id:'e:'+e.type,shell:Math.round(bodyOf('e:'+e.type).shell*FEEL.robots.bodyShellLeft),max:bodyOf('e:'+e.type).shell,x:e.x,z:e.z,face:e.face});}
    return;
  }
  if(e.st==='held'){e.x=p.x+p.face*11;e.z=p.z+1;e.h=7;e.face=-p.face;return;}
  if(e.st==='air'||e.st==='thrown'){
    e.x=clamp(e.x+e.vx,bw.cam+6,bw.cam+W-6);e.h+=e.vh;e.vh-=.22;
    if(e.st==='thrown')for(const o of bw.ents)if(o!==e&&o.type&&o.st!=='dead'&&Math.abs(o.x-e.x)<12&&Math.abs(o.z-e.z)<8&&!o.thrownBy){o.thrownBy=e;bDamage(o,8,Math.sign(e.vx)||1,{heavy:true,force:true});}
    if(e.h<=0){e.h=0;kick(2,.2);crunch(.08,.05);spark(e.x,e.z,6,[C.grd,C.mgd],1.5);dust(e.x,e.z,6);squishAt(e.x,e.z,10);
      if(e.st==='thrown'){e.hp-=6;for(const o of bw.ents)o.thrownBy=null;}
      if(e.hp<=0||e.dying){popHead(e);const ed=eDim(e);say('HEAD OFF',e.x,e.z-ed.ht-10,C.mg,30);e.noHead=true;e.st='dead';e.t=50;bw.score+=e.boss?1000:150;bw.p.pow=Math.min(100,bw.p.pow+FEEL.combat.powerPerKill);spark(e.x,e.z-10,22,[C.mg,C.yl,C.wh],3);crunch(.3,.1);beep(90,.5,'sawtooth',.06,-60);if(Math.random()<FEEL.robots.scrapDrop)bw.items.push({kind:'scrap',x:e.x,z:e.z});}
      else{e.st='down';e.t=e.boss?20:40;}}
    return;
  }
  if(e.st==='down'){if(--e.t<=0){e.st='walk';e.t=24;}return;}
  if(e.st==='stun'){if(--e.t<=0){e.st='walk';e.t=12;}return;}
  const dx=p.x-e.x,dz=p.z-e.z,ad=Math.abs(dx),reach=(T0.reach||12)+eDim(e).hw+pDim().hw-2,sp=(T0.spd||.6)*(e.boss?FEEL.robots.bossSpeed:FEEL.robots.speed)*(hazAt(e.x).mud?FEEL.hazards.mudRobotSpeed:1);
  if(e.type!=='guard'||e.st==='walk'&&e.t%30===0)e.face=dx<0?-1:1;
  e.moving=false;
  switch(e.st){
    case 'walk':{
      if(e.t>0)e.t--;
      const tx=clamp(e.role==='attack'?p.x-Math.sign(dx||1)*(reach-3):p.x-Math.sign(dx||1)*(FEEL.robots.waitDistance+Math.abs(e.zo)*2),bw.cam+14,bw.cam+W-14),tz=e.role==='attack'?p.z:clamp(p.z+e.zo,BZ0,BZ1);
      const mx=tx-e.x,mz=tz-e.z;
      if(Math.abs(mx)>2){e.x+=Math.sign(mx)*Math.min(sp,Math.abs(mx));e.moving=true;}
      if(Math.abs(mz)>1){e.z+=Math.sign(mz)*Math.min(sp*.7,Math.abs(mz));e.moving=true;}
      if(e.moving){e.walk+=sp;if((ESIZE[e.type]||1)>=2)squishAt(e.x,e.z,5);}
      if(e.role==='attack'&&ad<=reach+2&&Math.abs(dz)<5&&e.t<=0&&state==='brawl'){e.st='wind';e.t=Math.max(16,T0.wind||24);e.face=dx<0?-1:1;beep(1000,.06,'square',.03);}
      break;}
    case 'wind':if(--e.t<=0){e.st='atk';e.t=e.type==='hound'?14:9;beep(160,.08,'sawtooth',.04,-60);}break;
    case 'atk':
      if(e.type==='hound'){e.x+=e.face*3.6;e.moving=true;e.walk+=3.6;const pd=pDim(),ed=eDim(e);if(ad<ed.hw+pd.hw&&Math.abs(dz)<pd.dz+2&&p.h+(pd.hov||0)<10)bHurt(e.dmg,e);}
      else if(e.t===5){const pd=pDim(),ed=eDim(e),r=T0.reach||12,a0=e.face>0?e.x:e.x-ed.hw-r,a1=e.face>0?e.x+ed.hw+r:e.x;if(p.x+pd.hw>a0&&p.x-pd.hw<a1&&Math.abs(dz)<pd.dz+2&&p.h+(pd.hov||0)<ed.ht*.7)bHurt(e.dmg,e);}
      if(--e.t<=0){e.st='rec';e.t=Math.round((T0.cd||60)*.6);if(Math.random()<.5)e.role='wait';}
      break;
    case 'rec':if(--e.t<=0){e.st='walk';e.t=rnd(10,40)|0;}break;
  }
  for(const o of bw.ents){if(o===e||!o.type||o.st==='dead')continue;const ddx=e.x-o.x,ddz=e.z-o.z;if(Math.abs(ddx)<10&&Math.abs(ddz)<5){e.x+=Math.sign(ddx||1)*.5;e.z=clamp(e.z+Math.sign(ddz||1)*.3,BZ0,BZ1);}}
  if(e.h<=0&&e.st!=='held'){const bt=hazAt(e.x).belt;if(bt)e.x+=bt*FEEL.hazards.beltPush;}
  if(e.x>bw.cam+8&&e.x<bw.cam+W-8)e.in=true;
  e.x=e.in?clamp(e.x,bw.cam+8,bw.cam+W-8):clamp(e.x,bw.cam-40,bw.cam+W+40);
}
function retrySection(){
  const cp=bw.checkpoint,S=SECS[cp.sec];
  bw.ents=bw.ents.filter(e=>e.husk);bw.items=[];bw.sec=cp.sec;bw.clear=false;bw.score=Math.floor(cp.score/2);bw.cont++;
  const p=bw.p;bw.boss=null;bw.bombs=[];bw.strikes=[];bw.plats=[];bw.heads=[];bw.drops=[];bw.zaps=[];
  Object.assign(p,{inside:false,x:S.x0+40,z:124,h:0,vx:0,vz:0,vh:0,face:1,layers:[],core:3,pow:50,plat:null,atk:0,kind:null,sp:null,inv:60,onG:true,grab:null,hits:0});bw.shots=[];bw.rockets=[];bw.beam=null;
  bw.cam=S.x0;spawnSec();state='brawl';glitch=1;banner={s:'FIGHT',t:50};
}
// ---------- street life: civilians who panic and can be squished, and props that break ----------
// civilian colours: skin, shirt, hair/trousers
const CIVPAL=[['#f2c49b','#ff2a6d','#26104a'],['#c98a5e','#00f0ff','#3b3452'],['#8a5a3c','#ffe600','#231d33'],['#f2c49b','#6e6488','#0d0321'],['#e0a878','#f2f7ff','#4a0a2c'],['#6b4430','#8c1248','#231d33']];
const PROPS={
  car:{hp:6,hw:16,ht:13,dz:6,drop:.6,pts:80,cols:[C.mgd,C.mgx,C.cyx,C.gr]},
  bin:{hp:2,hw:5,ht:10,dz:4,drop:.35,pts:30,cols:[C.gr,C.grd,C.grx]},
  barrel:{hp:2,hw:5,ht:11,dz:4,drop:0,pts:40,boom:true,cols:[C.mg,C.mgd,C.yl]},
  pine:{hp:3,hw:6,ht:26,dz:4,drop:.15,pts:40,cols:['#1f8a5a','#0b5a3a','#4a2a1a']},
  fence:{hp:1,hw:12,ht:8,dz:3,drop:0,pts:20,cols:['#8a6a4a','#4a2a1a']},
  lamp:{hp:2,hw:3,ht:28,dz:3,drop:.1,pts:30,cols:[C.gr,C.grd,C.yl]},
  tank:{hp:4,hw:9,ht:16,dz:5,drop:.4,pts:60,cols:[C.cyd,C.cyx,C.wh]},
  pot:{hp:2,hw:6,ht:8,dz:4,drop:.4,pts:30,cols:['#c9a46a','#5a3a1a','#1d4a5a']},
  blocks:{hp:2,hw:6,ht:12,dz:4,drop:.3,pts:30,cols:['#ff5a7a','#5ac8ff','#ffd84a']},
  cube:{hp:4,hw:9,ht:14,dz:5,drop:.5,pts:50,cols:['#5a4a2a','#2a2010','#ff9a2a']},
  can:{hp:3,hw:6,ht:16,dz:4,drop:.4,pts:40,cols:['#ff6a3d','#e8dcc0','#8c1248']},
  sugar:{hp:2,hw:6,ht:11,dz:4,drop:.5,pts:30,cols:['#f2f7ff','#b8ac90','#ffffff']}
};
const THEMEPROPS=[['car','bin','barrel'],['pine','fence','lamp'],['tank','barrel','lamp'],['blocks','bin','lamp'],['pot','barrel','fence'],['cube','barrel','tank'],['pine','fence','barrel'],['can','sugar','bin']];
// seeded so a retried section gets the same props
function srnd(seed){let s=(seed*9301+49297)%233280;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
function spawnStreetLife(){
  const S=SECS[bw.sec],th=STAGES[S.stage].theme,r=srnd(bw.sec*7+3),boss=S.foes.some(f=>f[0]==='BOSS');
  if(!boss){const kinds=THEMEPROPS[th],n=2+(r()*2|0);
    for(let i=0;i<n;i++){const k=kinds[(r()*kinds.length)|0],P=PROPS[k];bw.ents.push({crate:true,prop:k,x:S.x0+70+i*(150/n)+r()*30,z:BZ0+4+r()*(BZ1-BZ0-6),h:0,hp:P.hp,max:P.hp,hurt:0});}}
  const nc=boss?1:FEEL.civilians.perSection+(r()*2|0);for(let i=0;i<nc;i++)addCiv(S.x0+60+r()*170,BZ0+2+r()*(BZ1-BZ0-4));
}
function addCiv(x,z,run){const c={civ:true,x,z,face:Math.random()<.5?-1:1,walk:0,t:rnd(20,90)|0,st:run?'panic':'idle',pal:CIVPAL[(Math.random()*CIVPAL.length)|0],kid:Math.random()<.25,flat:0,spd:rnd(FEEL.civilians.runSpeed,FEEL.civilians.runSpeed+.4)};bw.ents.push(c);return c;}
const CIVCRY=['AAH!','HELP!','RUN!','EEK!'];
function squish(c){if(c.flat>0||c.gone)return;c.flat=FEEL.civilians.flatTime;c.st='flat';bw.score+=FEEL.civilians.squishScore;bw.p.pow=Math.min(100,bw.p.pow+FEEL.civilians.squishPower);
  say('SQUISH',c.x,c.z-14,C.yl,30);beep(140,.12,'square',.05,-90);crunch(.06,.05);spark(c.x,c.z-2,6,[c.pal[1],C.wh],1.4);}
function squishAt(x,z,r){for(const c of bw.ents)if(c.civ&&Math.abs(c.x-x)<r&&Math.abs(c.z-z)<Math.max(4,r*.4))squish(c);}
function stepCivs(){
  const p=bw.p,pb=pBody(),pd=pDim(),foes=bFoes();
  if(bw.t%FEEL.civilians.crossEvery===(FEEL.civilians.crossEvery>>1)&&bw.ents.filter(e=>e.civ&&!e.gone).length<FEEL.civilians.maxOnScreen&&!bw.boss){const l=Math.random()<.5,c=addCiv(bw.cam+(l?-8:W+8),BZ0+rnd(2,BZ1-BZ0-2),true);c.face=l?1:-1;c.cross=true;}
  for(const c of bw.ents){if(!c.civ||c.gone)continue;
    if(c.flat>0){if(--c.flat===0){c.st='dizzy';c.t=60;}continue;}
    // squished by the player: big bodies just walk over them, any body lands on them
    if(!p.inside&&Math.abs(c.x-p.x)<pd.hw+1&&Math.abs(c.z-p.z)<4&&p.h<3&&((pb.size>=2&&p.onG)||(pb.size>=1&&p.land===6))){squish(c);continue;}
    let dd=999,away=c.face;for(const d of [p,...foes]){const ad=Math.abs(c.x-d.x)+Math.abs(c.z-d.z)*2;if(ad<dd){dd=ad;away=c.x<d.x?-1:1;}}
    if((c.st==='idle'||c.st==='stroll')&&(dd<FEEL.civilians.panicRadius||bw.boss||!bw.clear&&foes.some(f=>f.st==='atk'))){c.st='panic';c.t=0;if(Math.random()<.5)say(CIVCRY[(Math.random()*CIVCRY.length)|0],c.x,c.z-16,C.wh,34);}
    let mx=0,mz=0;
    if(c.st==='idle'){if(--c.t<=0){c.st='stroll';c.t=rnd(40,120)|0;c.face=Math.random()<.5?-1:1;}}
    else if(c.st==='stroll'){mx=c.face*.3;if(--c.t<=0){c.st='idle';c.t=rnd(40,120)|0;}}
    else if(c.st==='dizzy'){mx=Math.sin(bw.t*.3)*.3;if(--c.t<=0){c.st='panic';}}
    else{if(!c.cross||dd<50)c.face=away;mx=c.face*c.spd*(c.kid?1.15:1);if(--c.t<=0){c.t=rnd(12,30)|0;c.dz=rnd(-.5,.5);}mz=c.dz||0;}
    c.x+=mx;c.z=clamp(c.z+mz,BZ0,BZ1);if(mx)c.walk+=Math.abs(mx);
    if(c.st==='panic'&&(c.x<bw.cam-24||c.x>bw.cam+W+24))c.gone=true;
  }
}
// a broken prop: debris, rubble left on the floor, maybe an item, and barrels explode
function breakProp(e){
  const P=PROPS[e.prop];bw.score+=P.pts;spark(e.x,e.z-P.ht/2,18,P.cols,2.6);crunch(.2,.08);kick(2,.3);
  for(let i=0;i<3+(P.hw>>2);i++)bw.rubble.push({x:e.x+rnd(-P.hw,P.hw),z:e.z+rnd(-2,2),w:1+(Math.random()*3|0),c:P.cols[(Math.random()*P.cols.length)|0]});
  if(bw.rubble.length>90)bw.rubble.splice(0,bw.rubble.length-90);
  if(Math.random()<P.drop)bw.items.push({kind:Math.random()<.7?'scrap':'cell',x:e.x,z:e.z});
  if(P.boom){say('BOOM',e.x,e.z-24,C.yl,40);bursts.push({x:Math.round(e.x-bw.cam),y:Math.round(e.z-6),t:14});kick(5,.6);crunch(.35,.12);beep(70,.4,'sawtooth',.07,-30);
    spark(e.x,e.z-8,26,[C.yl,C.mg,C.wh],3.4);squishAt(e.x,e.z,30);
    for(const o of bw.ents)if((o.type||o.crate)&&o!==e&&!o.dead&&o.st!=='dead'&&Math.abs(o.x-e.x)<FEEL.props.barrelRadius+eDim(o).hw&&Math.abs(o.z-e.z)<12)bDamage(o,o.crate?FEEL.props.barrelPropDamage:FEEL.props.barrelRobotDamage,o.x<e.x?-1:1,{heavy:true,force:true});
    const p=bw.p;if(Math.abs(p.x-e.x)<22&&Math.abs(p.z-e.z)<10&&p.h<12)bHurt(FEEL.props.barrelPlayerDamage,e);}
}
function drawCiv(c,x){
  const [sk,sh,pn]=c.pal,y=Math.round(c.z),k=c.kid?1:0;
  if(c.flat>0){px(x-4,y-1,9,1,sh);px(x-3,y-2,6,1,sh);px(c.face>0?x+3:x-5,y-2,2,1,sk);px(x-4,y,2,1,pn);px(x+3,y,2,1,pn);
    if(c.flat<40&&(T>>2)&1)px(x,y-4,1,1,C.yl);return;}
  const run=c.st==='panic',sw=Math.sin(c.walk*(run?.9:.6)),l=Math.round(sw*(run?1.5:1)),lh=3-k,th=3-k,top=y-lh-th-3;
  px(x-1+l,y-lh,1,lh,pn);px(x+1-l,y-lh,1,lh,pn);
  px(x-1,y-lh-th,3,th,sh);
  if(run){const f=(T>>2)&1;px(x-2,top+1-f,1,3,sk);px(x+2,top+f,1,3,sk);}else{px(x-2,y-lh-th,1,2,sk);px(x+2,y-lh-th,1,2,sk);}
  px(x-1,top+1,3,2,sk);px(x-1,top,3,1,pn);px(c.face>0?x+1:x-1,top+1,1,1,C.void);
  if(c.st==='dizzy'){const a=T*.25;px(x+Math.round(Math.cos(a)*3),top-2,1,1,C.yl);px(x-Math.round(Math.cos(a)*3),top-2,1,1,C.wh);}
}
function drawProp(e,x){
  const P=PROPS[e.prop],y=Math.round(e.z),hit=e.hurt>0&&(e.hurt&2),dmg=e.hp<=e.max/2,col=i=>hit?C.wh:P.cols[i];
  switch(e.prop){
    case 'car':px(x-16,y-9,32,6,col(0));px(x-16,y-9,32,1,col(1));px(x-9,y-14,16,5,col(0));px(x-7,y-13,5,3,dmg?C.void:col(2));px(x,y-13,5,3,col(2));
      if(dmg){pline(x+1,y-13,x+4,y-11,C.wh);px(x+8,y-8,4,2,C.grx);}px(x-12,y-4,6,4,C.grx);px(x+6,y-4,6,4,C.grx);px(x-11,y-3,4,2,col(3));px(x+7,y-3,4,2,col(3));px(x-16,y-8,2,2,C.yl);break;
    case 'bin':px(x-4,y-9,8,9,col(0));px(x-4,y-9,1,9,col(1));px(x-3,y-6,6,1,col(1));px(x-3,y-3,6,1,col(1));
      if(dmg){px(x-4,y-12,6,1,col(2));px(x+2,y-11,3,1,col(2));}else px(x-5,y-10,10,2,col(2));break;
    case 'barrel':px(x-4,y-11,8,11,col(0));px(x-4,y-9,8,1,col(1));px(x-4,y-3,8,1,col(1));px(x-4,y-11,8,1,col(2));px(x-1,y-7,2,2,col(2));
      if(dmg&&(T>>2)&1){px(x-1,y-14,2,2,C.yl);px(x,y-16,1,1,C.mg);}break;
    case 'pine':{const lean=dmg?2:0;px(x-1,y-6,2,6,col(2));
      for(let i=0;i<3;i++){const w=11-i*3,ty=y-9-i*6;px(x-(w>>1)+Math.round(lean*(i+1)/2),ty,w,4,col(1));px(x-(w>>1)+1+Math.round(lean*(i+1)/2),ty,w-2,2,col(0));}break;}
    case 'fence':for(let i=-12;i<=12;i+=6)px(x+i,y-8,2,8,col(0));px(x-12,y-6,26,1,col(1));if(!dmg)px(x-12,y-3,26,1,col(1));break;
    case 'lamp':px(x,y-26,1,26,col(0));px(x-1,y-1,3,1,col(1));px(x-2,y-28,5,2,col(1));if(!dmg||(T>>3)&1){px(x-1,y-26,3,1,col(2));if(!hit){g.globalAlpha=.25;px(x-4,y-25,9,3,C.yl);g.globalAlpha=1;}}break;
    case 'pot':px(x-6,y-8,12,8,col(1));for(let i=-5;i<6;i+=3)px(x+i,y-8,1,8,col(0));px(x-6,y-5,12,1,col(0));if(!dmg)px(x-2,y-10,4,2,col(2));break;
    case 'blocks':px(x-6,y-6,6,6,col(0));px(x,y-6,6,6,col(1));if(!dmg)px(x-3,y-12,6,6,col(2));px(x-5,y-5,1,1,C.wh);px(x+1,y-5,1,1,C.wh);break;
    case 'cube':px(x-9,y-14,18,14,col(0));for(let i=0;i<4;i++)px(x-9,y-12+i*3,18,1,col(1));px(x-6,y-9,4,3,col(2));if(dmg)pline(x-8,y-13,x+4,y-2,C.void);break;
    case 'can':px(x-6,y-16,12,16,col(1));px(x-6,y-12,12,8,col(0));px(x-6,y-16,12,1,C.wh);px(x-2,y-10,4,3,col(2));if(dmg)px(x+2,y-16,4,3,C.grx);break;
    case 'sugar':px(x-6,y-11,12,11,col(0));px(x-6,y-11,12,1,col(2));px(x+5,y-10,1,10,col(1));if(dmg){px(x-6,y-11,4,3,C.void);px(x-4,y-1,2,1,col(0));}break;
    case 'tank':px(x-8,y-15,16,15,col(0));px(x-8,y-15,16,2,col(1));px(x-8,y-8,16,1,col(1));px(x-6,y-13,1,10,col(2));px(x+5,y-18,2,3,col(1));
      if(dmg){g.globalAlpha=.6;px(x+5+((T>>2)&1),y-22-((T>>1)&3),2,2,C.wh);g.globalAlpha=1;}break;
  }
}
function drawHaz(cam){
  for(const S of [SECS[bw.sec-1],SECS[bw.sec],SECS[bw.sec+1]])if(S){
    for(const m of S.mud){const a=Math.round(m[0]-cam),w=Math.round(m[1]-m[0]);if(a>W||a+w<0)continue;
      for(let y=BZ0-2;y<=BZ1+2;y+=2){const ins=Math.round(Math.abs(Math.sin(y*.7+m[0]))*6);px(a+ins,y,w-ins*2,2,(y>>1)&1?'#1a2410':'#222e14');}
      for(let i=4;i<w-4;i+=11)px(a+i+(((T>>4)+i)%5),BZ0+((i*7)%(BZ1-BZ0)),2,1,'#4a5a2a');}
    for(const c of S.belt){const a=Math.round(c[0]-cam),w=Math.round(c[1]-c[0]);if(a>W||a+w<0)continue;
      px(a,BZ0-3,w,BZ1-BZ0+6,'#1e1428');px(a,BZ0-3,w,1,'#5ac8ff');px(a,BZ1+2,w,1,'#5ac8ff');const off=(T>>1)%8;
      for(let x=a+(c[2]<0?8-off:off);x<a+w-3;x+=8)for(let y=BZ0;y<BZ1;y+=6){px(x,y,1,3,'#3a2a4a');px(x+(c[2]<0?-1:1),y+1,1,1,'#3a2a4a');}}
  }
}
const BFLOOR=[{f:'#0b021c',l:C.grid,h:C.mg},{f:'#040b12',l:'#0b2230',h:C.cy},{f:'#0e0308',l:'#2a0a18',h:C.yl},
  {f:'#1a0e0a',l:'#3a2418',h:'#ff5a7a'},{f:'#120c06',l:'#2e2214',h:'#ffd84a'},{f:'#140e08',l:'#2a2010',h:'#ff9a2a'},{f:'#10180c',l:'#1e2c16',h:'#c6ff4a'},{f:'#b8ac90',l:'#8a8068',h:'#ff6a3d',tile:['#e8dcc0','#b8ac90']}];
function drawBody(id,x,fy,face,walk,moving,mode,pal,fp,st,lhd){
  // returns the y where the core sits
  const b=bodyOf(id);
  if(b.doll){const r=drawDollShape(x,fy,2,face,pal===HPAL?{body:C.gr,scarf:C.grd,face:C.gr,flower:C.grd,line:C.grx,apron:C.grd}:{body:FP.me.body,scarf:FP.me.shade,face:FP.me.hi,flower:C.yl,line:FP.me.deep,apron:FP.me.hi},{headless:true});if(mode===1||mode===3)px(face>0?x+10:x-14,fy-14,4,3,FP.me.body);return{top:r.top+2,lean:0};}
  if(b.flyer)return drawFlyer(x,fy,face,moving,mode,pal===HPAL?FP.husk:fp,pal===HPAL);
  if(b.frame){const s0=FR[id].s,s=lhd?Object.assign({},s0,{lh:Math.max(2,s0.lh+lhd)}):s0,r=drawFrame(x,fy,id,s,face,walk*.3,moving,mode,fp);return{top:r.topY,lean:r.lean};}
  const T0=lhd?Object.assign({},b.T,{lh:Math.max(2,b.T.lh+lhd)}):b.T,e={type:b.foe,T:T0,face,st:st||'walk',moving,walk,hurt:0,noHead:true};drawFoe(e,x,fy,T,pal);
  if(b.foe==='hound')return{top:fy-12,lean:face*11};
  return{top:fy-(T0.lh+T0.th)+1,lean:0};
}
function drawBrawlPlayer(p,cam){
  const x=Math.round(p.x-cam),fy=Math.round(p.z-p.h),moving=p.onG&&Math.abs(p.vx)+Math.abs(p.vz||0)>.3;
  if(p.inv>0&&p.inv<44&&(T>>1)&1||p.inside)return;
  const L=p.layers,mood=p.atk>0?'angry':'';
  if(!L.length){
    const f=p.face,ph=p.walk*.55,sw=moving?Math.sin(ph):0,cw=moving?Math.cos(ph):0;
    const bob=moving&&Math.abs(sw)>.7?1:((!moving&&p.onG)?((T>>5)&1):0),l=Math.round(sw*1.4),la=cw>.3?1:0,lb=cw<-.3?1:0;
    const sq=p.land>0?1:0,crouch=p.onG&&p.jt<3?1:0;
    if(!p.onG){px(x-3,fy-4,1,2,C.cy);px(x+2,fy-4,1,2,C.cy);}
    else{px(x-3+l,fy-3+bob,1,3-bob-la,C.cy);px(x-3+l+f,fy-1-la,1,1,C.cy);px(x+2-l,fy-3+bob,1,3-bob-lb,C.cy);px(x+2-l+f,fy-1-lb,1,1,C.cy);}
    const melee=(p.kind==='melee'||p.kind==='air')&&p.atk>0,lunge=melee&&p.atk<=p.hitAt+3?f:0;
    drawCore(x-4+lunge,fy-10+bob+sq+crouch,f,T,true,mood);
    // knife 4 life: jab, low slash, overhead chop
    let kw=2,ky=fy-6+bob+sq+(moving?Math.round(-sw):0);
    if(melee){const act=p.atk<=p.hitAt+3,n=p.kind==='air'?0:p.combo;
      if(act){kw=n===2?7:6;ky=fy-(n===1?4:n===2?9:6)+bob;
        if(p.atk>=p.hitAt-1){const sx=f>0?x+5+lunge:x-11+lunge;px(sx,n===2?ky-3:ky+2,6,1,C.cyd);px(f>0?sx+5:sx,n===2?ky-2:ky+1,1,1,C.cyd);}}
      else ky=fy-8+bob;}
    px(f>0?x+5+lunge:x-5-kw+lunge,ky,kw,1,C.wh);
    return;
  }
  let mode=0;
  if(p.atk>0){if(p.kind==='melee')mode=p.atk<=p.hitAt+3?[1,2,3][p.combo]:5;else if(p.kind==='air'||p.kind==='throw'||p.kind==='lunge')mode=1;else if(p.kind==='burst')mode=3;}
  if(p.kind==='sp')mode=p.atk>p.hitAt&&p.hitAt>=0?(['hammer','pound','giant','sword'].includes(p.sp)?3:5):1;
  if(p.grab)mode=3;
  const st=p.atk>0?(mode===5||mode===3&&p.kind==='sp'?'wind':'atk'):'walk';
  const lhd=p.land>0?-(p.land>3?2:1):(p.onG&&p.jt<3?-1:(!p.onG&&p.vh>.6?1:0));
  const outer=L[L.length-1],r=drawBody(outer.id,x,fy,p.face,p.walk,moving,mode,MEPAL,FP.me,st,lhd);
  let top=r.top,cx=x+r.lean;
  if(L.length>1){const inn=L[L.length-2],ib=bodyOf(inn.id),ilh=ib.frame?FR[inn.id].s.lh:ib.T?ib.T.lh:0,ir=drawRider(top,ilh,y=>drawBody(inn.id,cx,y,p.face,0,false,0,MEPAL,FP.me,'walk'));top=ir.top;cx+=ir.lean;}
  if(p.boot>0){const k=p.boot/16;top-=Math.round(k*20);}
  drawCore(cx-4,top-7,p.face,T,true,mood);drawDomes(cx-4,top-7,FP.me);
  if(p.kind==='melee'&&p.atk<=p.hitAt+2&&p.atk>=p.hitAt-3){const f=p.face,yy=top+8,up=p.combo===2;
    for(let i=0;i<3;i++){if(up)px(x+f*(6+i*3),yy+6-i*4,1,4-i,C.wh);else px(f>0?x+9+i*3:x-14-i*3,yy+2+i*3,5-i,1,C.wh);}}
  if(p.kind==='burst'&&p.atk>8){const R=(26-p.atk)*3;for(let a=0;a<24;a++){const aa=a/24*6.283;px(x+Math.cos(aa)*R,fy-10+Math.sin(aa)*R*.4,1,1,(T>>1)&1?C.cy:C.wh);}}
}
function drawStreet(cam){
  const s0=stageAt(cam),s1=stageAt(cam+W-1);
  for(let s=s0;s<=s1;s++){
    const a=Math.max(0,s*SL-cam),b2=Math.min(W,(s+1)*SL-cam),th=STAGES[s].theme,FL=BFLOOR[th];
    g.save();g.beginPath();g.rect(a,0,b2-a,H);g.clip();
    const sx=Math.round(cam*.35)%W;g.drawImage(bgs[th],0,0,W,104,-sx,0,W,104);g.drawImage(bgs[th],0,0,W,104,W-sx,0,W,104);
    px(0,104,W,40,FL.f);
    if(FL.tile){const rows=[104,107,111,116,122,129,137,144];for(let i=0;i<rows.length-1;i++){const tw=12+i*5,o=Math.round(cam*(.7+i*.08))%(tw*2);for(let x=-o-tw*2,k=0;x<W;x+=tw,k++)if((k+i)&1)px(x,rows[i],tw,rows[i+1]-rows[i],FL.tile[0]);}}
    for(let wx=Math.floor(cam/32)*32-64;wx<cam+W+64;wx+=32){const x0=wx-cam;pline(x0,105,x0+(x0-128)*.55,143,FL.l);}
    [107,111,116,122,129,137].forEach(y=>px(0,y,W,1,FL.l));px(0,104,W,1,FL.h);
    g.restore();
    if(s>s0){const x=Math.round(a);for(let y=0;y<H;y+=4)px(x,y,1,2,C.wh);}
  }
}
function drawBrawl(){
  const cam=Math.round(bw.cam);
  drawStreet(cam);
  drawHaz(cam);
  for(const r of bw.rubble)px(Math.round(r.x-cam),Math.round(r.z),r.w,1,r.c);
  const list=[];
  for(const e of bw.ents)list.push({z:e.z,e});
  for(const it of bw.items)list.push({z:it.z-.1,it});
  list.push({z:bw.p.z,p:1});
  for(const o of list){const x=(o.p?bw.p.x:o.e?o.e.x:o.it.x)-cam,w=o.p?12:o.e&&o.e.boss?30:o.e&&o.e.civ?(o.e.flat?0:6):o.e&&o.e.prop?PROPS[o.e.prop].hw*2:14;g.globalAlpha=.4;px(x-w/2,o.z-1,w,3,C.void);g.globalAlpha=1;}
  if(bw.boss&&bw.boss.type==='matry')list.push({z:bw.boss.z,boss:1});
  if(bw.boss&&NB[bw.boss.type])list.push({z:bw.boss.z,nb:1});
  list.sort((a,c)=>a.z-c.z);
  if(bw.boss&&bw.boss.type!=='warden'&&bw.boss.type!=='matry')drawCampBoss(cam);
  const nh=state==='brawl'?nearHusk():null;
  for(const o of list){
    if(o.boss){drawMatry(cam);continue;}
    if(o.nb){nbDraw(cam);continue;}
    if(o.p){drawBrawlPlayer(bw.p,cam);continue;}
    if(o.it){const x=Math.round(o.it.x-cam),y=o.it.z-6+Math.round(Math.sin(T*.12)*1.5);if(o.it.kind==='wpn'){const c=WCOL[o.it.w]||C.yl;px(x-5,y-6,11,10,c);px(x-4,y-5,9,8,C.void);drawPartIcon(o.it.w,x-3,y-4,true);}else if(o.it.kind==='cell'){pixHex(x,y,4,1,C.yl,true);px(x-1,y-1,2,2,C.wh);}else{px(x-3,y-2,7,5,C.gr);px(x-2,y-1,5,3,C.grd);px(x-1,y,3,1,C.yl);}continue;}
    const e=o.e,x=Math.round(e.x-cam);
    if(e.husk){const r=drawBody(e.id,x,e.z,e.face,0,false,0,HPAL,FP.husk,'idle');const fr=e.shell/e.max;px(x-8,e.z+2,16,2,'#0b2a3a');px(x-8,e.z+2,Math.round(16*fr),2,fr<.35?C.mg:C.cyd);
      if(e===nh&&(T>>3)&1){px(x-1,r.top-10,3,3,C.cy);px(x-3,r.top-12,7,1,C.cy);}continue;}
    if(e.civ){drawCiv(e,x);continue;}
    if(e.prop){drawProp(e,x);continue;}
    if(e.crate){const pal=e.hurt>0&&(e.hurt&2)?PAL.hit:{line:C.yld,fill:'#3a2a10',dark:'#2a1e08'};box(x-7,e.z-12,14,12,pal);px(x-6,e.z-11,12,1,C.yl);pline(x-6,e.z-11,x+5,e.z-2,C.yld);pline(x+5,e.z-11,x-6,e.z-2,C.yld);continue;}
    if(e.st==='dead'&&(T>>1)&1)continue;
    const pal=(e.hurt>0&&(e.hurt&2))?PAL.hit:e.st==='wind'&&(T>>2)&1?PAL.warn:e.type==='makercore'?PAL.maker:PAL.foe;
    drawFoe(e,x,e.z-e.h,T,pal);
    if(e.boss&&e.st!=='dead')px(x-1,e.z-e.T.lh-e.T.th-e.T.hh-8-e.h,3,3,(T>>3)&1?C.yl:C.mg);
  }
  if(bw.boss&&bw.boss.type==='warden')drawCampBoss(cam);
  drawCampHazards(cam);
  drawHeads(cam);drawDrops(cam);
  drawSpecials(cam);
  drawBursts();
  for(const q of parts)if(q.ring){for(let a=0;a<36;a++){const aa=a/36*6.283;px(q.x-cam+Math.cos(aa)*q.r,q.y+Math.sin(aa)*q.r*.4,1,1,C.wh);}}else px(q.x-cam,q.y,q.s,q.s,q.c);
  for(const t of texts)if(t.t>6||(T&1))txtS(t.s,t.x-cam,t.y,t.c,1,'c');
  // hud: the layer stack, the outer layer's shell, core pips, score
  const p=bw.p,L=p.layers;
  px(4,4,9,9,C.cyd);px(6,6,14,14,'#f4e9f7');g.save();g.translate(9,12);drawCore(0,0,1,T,true,'');g.restore();
  const cx0=23,cpx=cx0+textW('CORE')+3;txt('CORE',cx0,5,C.yl);for(let i=0;i<Math.max(3,p.core);i++)px(cpx+i*6,5,4,5,i<p.core?C.yl:C.grd);
  if(L.length){const tp=L[L.length-1];txt(bodyOf(tp.id).name,23,12,C.cy);bar(23,19,80,3,tp.shell/tp.max,tp.shell<=tp.max*.3?C.mg:C.cy,C.cyx);
    if(L.length>1){const inn=L[L.length-2];txt('+ '+bodyOf(inn.id).name,23,24,C.cyd);}}
  else txt('KNIFE ONLY',23,12,C.gr);
  txtS(String(bw.score).padStart(6,'0'),108,5,C.wh);
  {const sp=curSpecial(),ok=p.pow>=spCost(sp);txt('POWER',108,13,C.yl);bar(108+textW('POWER')+3,14,44,3,p.pow/100,ok&&(T>>3)&1?C.wh:C.yl,C.yld);px(108+textW('POWER')+3+Math.round(44*spCost(sp)/100),13,1,5,C.mg);txt(SPNAME[sp],108,20,ok?C.cy:C.cyd);}
  if(p.hits>=2){const big=p.hits>=6;txtS(p.hits+' HITS',6,32,big?C.yl:C.cy,big?2:1,'l');}
  const Lt=bw.boss&&bw.boss.st!=='dead'?bw.boss:bw.last&&bw.last.st!=='dead'?bw.last:null;
  if(Lt){txtS(scaled(Lt.T,Lt.type,0).name,252,5,C.wh,1,'r');bar(150,13,102,4,Lt.hp/Lt.max,C.mg,C.mgx);}
  const S=SECS[bw.sec]||SECS[SECS.length-1];txt('LEVEL '+(S.stage+1)+'  '+((bw.sec%5)+1)+'/5',252,21,C.grd,1,'r');
  if(bw.clear&&SECS[bw.sec+1]&&(T>>4)&1){txtS('GO',226,62,C.yl,2,'c');px(238,64,6,6,C.yl);px(244,66,2,2,C.yl);}
  // contextual hint
  let hint=null;if(state==='brawl'){if(nh)hint='START: CLIMB IN';else if(!bw.spTip&&p.pow>=spCost(curSpecial())&&bw.sec>=1&&bw.t%300<150)hint='A+B TOGETHER: SPECIAL';else if(bw.boss&&bw.boss.type==='warden'&&(bw.bombs.length||bw.heads.length)&&bw.boss.st!=='down')hint='KICK BOMBS OR HEADS UP AT THE WARDEN';else if(bw.heads.some(h=>h.bomb&&h.fuse<240&&Math.abs(h.x-p.x)<60))hint='TICKING HEAD! KICK IT AWAY';else if(bw.strikes.some(s=>s.bolt&&!s.mine&&Math.abs(s.x-p.x)<20))hint='LIGHTNING! KEEP MOVING';else if(bw.boss&&bw.boss.st==='topple')hint='ITS HEAD IS DOWN: HIT IT';else if(!bw.headTip&&bw.heads.some(h=>h.st==='rest'))hint='HIT A HEAD TO KICK IT';else if(bw.boss&&bw.boss.st==='kneel')hint=p.plat?'JUMP AND STRIKE THE HEAD':'HIT IT NOW, OR JUMP ON THE FIST';else if(!L.length&&bw.sec===0)hint='BEAT A ROBOT, THEN CLIMB INTO ITS BODY';else if(L.length&&bw.t%600<120)hint='START: EJECT';}
  if(hint){const w=textW(hint)+8;g.globalAlpha=.8;px(128-w/2,128,w,10,C.void);g.globalAlpha=1;txt(hint,128,130,C.cy,1,'c');}
  if(bw.card&&bw.card.t>0){const c=bw.card;c.t--;const nm=c.name,w=Math.max(textW(nm),c.sub?textW(c.sub):0)+28,x0=128-Math.round(w/2);
    g.globalAlpha=.88;px(x0,30,w,c.sub?20:14,C.void);g.globalAlpha=1;px(x0,30,w,1,C.cy);px(x0,c.sub?49:43,w,1,C.cy);
    px(x0+4,33,9,9,C.cyx);if(WCOL[c.icon])drawPartIcon(c.icon,x0+5,34,true);else px(x0+6,35,5,5,C.yl);
    txt(nm,x0+18,34,C.yl,1,'l');if(c.sub)txt(c.sub,x0+18,42,C.cy,1,'l');}
  if(bw.stageT>0){const S2=STAGES[bw.stage],a=bw.stageT<300||(T>>2)&1;if(a){g.globalAlpha=.8;px(0,44,W,34,C.void);g.globalAlpha=1;px(0,44,W,1,C.cyd);px(0,77,W,1,C.cyd);
    txt('LEVEL '+(bw.stage+1),128,48,C.mg,1,'c');txt(S2.name,129,57,C.mg,2,'c');txt(S2.name,128,56,C.yl,2,'c');
    const lines=bw.stage===0?STORY.slice(6):S2.intro||LEVELS[bw.stage].intro;const li=Math.min(lines.length-1,Math.floor(bw.stageT/100));txtS(lines[li],128,70,C.wh,1,'c');}}
  if(banner&&bw.stageT===0){const sc=banner.s.length>6?2:3;txt(banner.s,129,56,C.mg,sc,'c');if((banner.t>>2)&1||banner.t>40)txt(banner.s,128,55,C.yl,sc,'c');}
}
function drawBOver(){
  drawBrawl();g.globalAlpha=.85;px(0,0,W,H,C.void);g.globalAlpha=1;
  txt('SIGNAL LOST',129,41,C.mg,3,'c');txt('SIGNAL LOST',128,40,C.cy,3,'c');
  txtS('SCORE '+bw.score,128,72,C.wh,2,'c');
  if(bw.endT>60&&(T>>4)&1)txtS('A: TRY AGAIN   B: TITLE',128,110,C.cy,1,'c');
}

// ---------- specials: every body has its own power; weapons from crates replace it ----------
const SPOW={doll:'lightning',flyer:'bombs',core:'knife',basic:'glove',brute:'hammer',walker:'laser',titan:'giant','e:scrap':'spin','e:lancer':'spear','e:hound':'pounce','e:guard':'bash','e:brute':'pound','e:walker':'rocket','e:makercore':'spin'};
const SPNAME={lightning:'LIGHTNING CALL',bombs:'BOMB DROP',hook:'CHAIN HOOK',knife:'KNIFE THROW',glove:'POWER GLOVE',hammer:'HAMMER OF MIGHT',laser:'SHOULDER LASER',giant:'GIANT SWORD',spin:'SCRAP SPIN',spear:'SPEAR THRUST',pounce:'POUNCE',bash:'SHIELD BASH',pound:'GROUND POUND',rocket:'ROCKET LAUNCH',sword:'SWORD OF JUSTICE'};
const SPTIME={lightning:[30,12],bombs:[36,-1],hook:[24,10],knife:[14,6],glove:[22,-1],hammer:[30,14],laser:[24,8],giant:[34,16],spin:[30,-1],spear:[22,10],pounce:[60,-1],bash:[30,-1],pound:[30,14],rocket:[24,10],sword:[22,10]};
const WEAPONS=['sword','hammer','laser','rocket','hook'];
const WCOL={sword:C.cy,hammer:C.yl,laser:C.cy,rocket:C.mg,hook:C.wh};
function drawPartIcon(pt,x,y,on){
  const c=on?(WCOL[pt]||C.yl):C.gr;
  if(pt==='sword'){px(x+3,y,1,5,C.wh);px(x+1,y+5,5,1,c);px(x+3,y+6,1,1,c);}
  else if(pt==='hammer'){px(x+3,y+2,1,5,C.gr);px(x+1,y,5,3,c);}
  else if(pt==='laser'){px(x,y+3,7,1,c);px(x+1,y+2,3,3,c);px(x+6,y+2,1,3,C.mg);}
  else if(pt==='hook'){px(x+3,y,1,4,C.gr);px(x+1,y+4,1,2,c);px(x+1,y+6,4,1,c);px(x+5,y+4,1,2,c);}
  else if(pt==='rocket'){px(x+2,y+1,3,5,c);px(x+2,y,3,1,C.mg);px(x+3,y+6,1,1,C.yl);}
  else px(x+1,y+1,5,5,c);
}
function curSpecial(){const L=bw.p.layers;if(!L.length)return'knife';const t=L[L.length-1];return t.weapon||SPOW[t.id]||'glove';}
const spCost=sp=>sp==='knife'?FEEL.combat.knifeCost:FEEL.combat.specialCost;
function startSpecial(){
  const p=bw.p,sp=curSpecial(),cost=spCost(sp);
  if(p.pow<cost){say('NO POWER',p.x,p.z-36,C.gr,30);beep(160,.05,'square',.03);return;}
  bw.spTip=true;p.pow-=cost;p.kind='sp';p.sp=sp;p.hitSet=new Set();p.grab=null;glitch=Math.max(glitch,.35);
  say(SPNAME[sp],p.x,p.z-48,C.yl,40);
  [p.atk,p.hitAt]=SPTIME[sp];
  if(sp==='pounce'){p.vh=3;p.onG=false;p.jt=99;p.vx=p.face*2.1;}
  if(sp==='hammer'||sp==='pound'||sp==='giant')beep(150,.35,'sawtooth',.04,300);
  else if(sp==='laser')beep(500,.2,'sawtooth',.03,900);
  else if(sp==='rocket'){beep(200,.5,'sawtooth',.04,900);crunch(.2,.05);}
  else beep(700,.1,'square',.04,-300);
}
function spHit(x0,x1,dz,dmg,o){
  const p=bw.p,lo=Math.min(x0,x1),hi=Math.max(x0,x1);let n=0;
  for(const e of bw.ents){
    if(!(e.type||e.crate)||e.dead||e.st==='dead'||e.st==='held'||p.hitSet.has(e))continue;
    const ed=eDim(e);if(e.x+ed.hw<lo||e.x-ed.hw>hi||Math.abs(e.z-p.z)>dz+ed.dz-4)continue;
    p.hitSet.add(e);if(bDamage(e,dmg,p.face,o))n++;
  }
  if(!p.hitSet.has('boss')&&bossHit(lo,hi,dz,dmg,o)){p.hitSet.add('boss');n++;}
  kickBombs(lo,hi,dz);kickHeads(lo,hi,dz);
  return n;
}
function stepSpecial(){
  const p=bw.p,b=pBody(),sp=p.sp,d=b.dmg,f=p.face;
  if(sp!=='pounce')p.atk--;const t=p.atk;
  switch(sp){
    case 'pounce':p.vx=p.face*2.1;if(p.vh<0)spHit(p.x-10,p.x+12*p.face,8,pBody().dmg+2,{stun:true});break;
    case 'hook':p.vx*=.5;if(t===p.hitAt)fireHook();break;
    case 'lightning':p.vx*=.5;if(t===p.hitAt){const foes=bFoes().sort((a,c)=>Math.abs(a.x-p.x)-Math.abs(c.x-p.x)).slice(0,3);if(bw.boss&&bw.boss.st!=='dead')foes.unshift({x:bw.boss.x,z:bw.boss.z});if(!foes.length)foes.push({x:p.x+f*50,z:p.z});foes.slice(0,3).forEach((e,i)=>bw.strikes.push({x:e.x,z:e.z,t:12+i*5,bolt:true,mine:true,dmg:d*2+6}));beep(200,.4,'sawtooth',.04,900);}break;
    case 'bombs':p.vx=f*1.6;if(t===30||t===20||t===10){bw.drops.push({x:p.x+f*6,z:p.z,h:HOV+8,vh:0,dmg:d*2+4});beep(500,.12,'square',.04,-300);}break;
    case 'knife':if(t===p.hitAt){bw.shots.push({x:p.x+f*6,z:p.z,h:p.h+7,vx:f*5.2,t:50,dmg:6});beep(1400,.06,'square',.03,-600);}break;
    case 'glove':if(t<=18&&t>=6){p.vx=f*4.4;spHit(p.x,p.x+f*20,8,d*2+4,{heavy:true,launch:true});if(t%2===0)parts.push({x:p.x-f*6,y:p.z-14,vx:-f,vy:0,t:10,c:C.yl,gv:0,s:2});}else p.vx*=.6;break;
    case 'hammer':case 'pound':
      p.vx*=.5;
      if(t===p.hitAt){const cx=p.x+f*(sp==='pound'?0:18);spHit(cx-30,cx+30,14,d*3,{heavy:true,launch:true,force:true});kick(7,.8);crunch(.35,.12);beep(60,.4,'square',.07,-20);
        bursts.push({x:Math.round(cx-bw.cam),y:Math.round(p.z),t:14});spark(cx,p.z-4,20,[C.yl,C.gr,C.wh],3);for(let k=0;k<2;k++)parts.push({ring:1,x:cx,y:p.z,t:12,r:4});}
      break;
    case 'laser':p.vx*=.4;if(t===p.hitAt){spHit(p.x,p.x+f*W,7,d*2+2,{heavy:true});bw.beam={x:p.x+f*8,y:p.z-14,f,t:16};kick(3,.5);}break;
    case 'giant':p.vx*=.5;if(t===p.hitAt){spHit(p.x-f*16,p.x+f*74,16,d*3,{heavy:true,launch:true,force:true});kick(6,.7);crunch(.25,.1);spark(p.x+f*40,p.z-14,16,[C.wh,C.cy],3);}break;
    case 'sword':if(t===p.hitAt){spHit(p.x,p.x+f*54,10,d*2+3,{heavy:true});beep(1800,.08,'triangle',.04,-900);}break;
    case 'spear':if(t>=p.hitAt-2&&t<=p.hitAt+2){p.vx=f*2.6;spHit(p.x,p.x+f*66,7,d*2+3,{stun:true});}else p.vx*=.6;break;
    case 'spin':if(t%6===0){p.hitSet=new Set();spHit(p.x-34,p.x+34,10,Math.max(2,Math.round(d*.8)),{stun:true});beep(900,.03,'square',.02);}p.vx=clamp(p.vx+(K.right-K.left)*.25,-1.6,1.6);break;
    case 'bash':p.vx=f*3.1;for(const e of bw.ents)if(e.type&&e.st!=='dead'&&Math.abs(e.z-p.z)<9&&(e.x-p.x)*f>0&&Math.abs(e.x-p.x)<16){e.x+=f*3.1;}spHit(p.x,p.x+f*16,9,d+3,{heavy:true});break;
    case 'rocket':
      if(t===p.hitAt){const foes=bFoes().sort((a,c)=>Math.abs(a.x-p.x)-Math.abs(c.x-p.x)).slice(0,3);
        if(!foes.length)foes.push({x:p.x+f*60,z:p.z});
        foes.forEach((e,i)=>bw.rockets.push({x:e.x,z:e.z,t:30+i*8,dmg:d*2+4}));
        for(let k=0;k<3;k++)parts.push({x:p.x-f*4,y:p.z-30,vx:rnd(-.3,.3),vy:-3,t:16,c:C.yl,gv:0,s:2});}
      break;
  }
  if(sp!=='pounce'&&p.atk<=0){p.kind=null;p.sp=null;}
}
function stepShots(){
  for(const s of bw.shots){s.x+=s.vx;s.t--;
    for(const e of bw.ents){if(!(e.type||e.crate)||e.dead||e.st==='dead')continue;const ed=eDim(e);if(Math.abs(e.x-s.x)<ed.hw+2&&Math.abs(e.z-s.z)<ed.dz+3){bDamage(e,s.dmg,Math.sign(s.vx),{stun:true});s.t=0;break;}}
    if(s.t>0&&bossHit(s.x-3,s.x+3,7,s.dmg,{}))s.t=0;
    if(s.x<bw.cam-10||s.x>bw.cam+W+10)s.t=0;}
  bw.shots=bw.shots.filter(s=>s.t>0);
  for(const r of bw.rockets){if(--r.t===0){const p=bw.p,o={heavy:true,launch:true,force:true};
      for(const e of bw.ents)if((e.type||e.crate)&&!e.dead&&e.st!=='dead'&&Math.abs(e.x-r.x)<20+eDim(e).hw&&Math.abs(e.z-r.z)<12)bDamage(e,r.dmg,e.x<r.x?-1:1,o);
      bossHit(r.x-22,r.x+22,30,r.dmg,{sky:true,force:true});
      bursts.push({x:Math.round(r.x-bw.cam),y:Math.round(r.z),t:16});spark(r.x,r.z-4,16,[C.yl,C.wh,C.mg],3.4);kick(5,.6);crunch(.3,.12);beep(70,.35,'sawtooth',.07,-30);}}
  bw.rockets=bw.rockets.filter(r=>r.t>0);
  if(bw.beam&&--bw.beam.t<=0)bw.beam=null;
}
function drawSpecials(cam){
  const p=bw.p;
  for(const s of bw.shots){const x=Math.round(s.x-cam),y=Math.round(s.z-s.h);px(x-3,y,6,1,C.wh);px(s.vx>0?x+3:x-4,y-1,1,3,C.cy);}
  for(const r of bw.rockets){const x=Math.round(r.x-cam);if((T>>2)&1){px(x-7,r.z,5,1,C.yl);px(x+3,r.z,5,1,C.yl);px(x,r.z-6,1,4,C.yl);px(x,r.z+2,1,3,C.yl);}
    if(r.t<12){const y=r.z-r.t*9;px(x-1,y-7,3,7,C.cy);px(x-1,y,3,2,C.mg);px(x,y-10,1,3,C.yl);}}
  if(bw.chain){const Q=bw.chain,x0=Math.round(Q.x0-cam),x1=Math.round(Q.x1-cam),y=Math.round(Q.y);for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x+=3)px(x,y+((x>>1)&1),2,1,C.gr);px(x1-1,y-2,3,5,C.wh);if(--Q.t<=0)bw.chain=null;}
  if(bw.beam){const B=bw.beam,x=Math.round(B.x-cam),w=Math.max(1,Math.round(5*B.t/16)),x2=B.f>0?W:0;px(Math.min(x,x2),B.y-(w>>1),Math.abs(x2-x),w,C.cy);px(Math.min(x,x2),B.y,Math.abs(x2-x),1,C.wh);}
  if(p.kind!=='sp')return;
  const x=Math.round(p.x-cam),fy=Math.round(p.z-p.h),f=p.face,t=p.atk,act=p.hitAt<0||t<=p.hitAt+2;
  switch(p.sp){
    case 'glove':if(t<=18){px(f>0?x+8:x-14,fy-15,6,6,C.yl);px(f>0?x+8:x-14,fy-15,6,1,C.wh);for(let i=0;i<3;i++)px(f>0?x-4-i*5:x+2+i*5,fy-13+i*2,4,1,C.yld);}break;
    case 'hammer':case 'pound':{if(t>p.hitAt){px(x-f*2,fy-38,1,18,C.gr);px(x-f*2-4,fy-44,9,7,C.yl);px(x-f*2-4,fy-44,9,1,C.wh);}else{const hx=x+f*(p.sp==='pound'?0:16);px(Math.min(x,hx),fy-14,Math.abs(hx-x)+1,1,C.gr);px(hx-4,fy-9,9,8,C.yl);px(hx-4,fy-9,9,1,C.wh);}break;}
    case 'giant':if(t>p.hitAt){px(x+f*6-1,fy-62,3,44,C.wh);px(x+f*6-1,fy-62,1,44,C.cy);}else if(act){const L=72;px(f>0?x+6:x-6-L,fy-15,L,3,C.wh);px(f>0?x+6:x-6-L,fy-13,L,1,C.cy);for(let i=0;i<4;i++)px(f>0?x+12+i*14:x-24-i*14,fy-19-i,10,1,C.cyd);}break;
    case 'sword':if(act){const L=52;px(f>0?x+6:x-6-L,fy-14,L,2,C.wh);px(f>0?x+6:x-6-L,fy-13,L,1,C.cy);px(x+f*6,fy-16,1,5,C.yl);}else px(x+f*4,fy-30,1,16,C.wh);break;
    case 'spear':if(act){const L=64;px(f>0?x+6:x-6-L,fy-13,L,1,C.wh);px(f>0?x+6+L:x-8-L,fy-14,3,3,C.yl);}break;
    case 'spin':{const a=T*.6;for(let i=0;i<14;i++){px(x+Math.cos(a)*i,fy-12+Math.sin(a)*i*.4,1,1,C.wh);px(x-Math.cos(a)*i,fy-12-Math.sin(a)*i*.4,1,1,C.wh);}break;}
    case 'bash':{const sx=f>0?x+9:x-14;box(sx,fy-26,5,22,{line:C.yl,fill:C.mgd,dark:C.mgx});px(sx+1,fy-16,3,2,C.mg);for(let i=0;i<3;i++)px(f>0?x-8-i*5:x+6+i*5,fy-20+i*5,4,1,C.cyd);break;}
    case 'pounce':break;
    case 'pounce_fx':for(let i=0;i<3;i++)px(f>0?x-12-i*5:x+8+i*5,fy-10+i*3,4,1,C.cyd);break;
    case 'knife':if(t>p.hitAt)px(x-f*2,fy-14,1,5,C.wh);break;
  }
}

// ---------- hit boxes from body size ----------
function pDim(){const b=pBody();if(b.size===0)return{hw:3,ht:10,dz:3};
  if(b.flyer)return{hw:11,ht:14,dz:6,hov:HOV};
  if(b.doll)return{hw:11,ht:22,dz:6};
  if(b.frame){const s=FR[b.frame].s;return{hw:s.tw/2+1,ht:s.lh+s.th+7,dz:4+b.size};}
  const T0=b.T;return{hw:T0.tw/2+1,ht:T0.lh+T0.th+T0.hh+7,dz:4+b.size};}
function eDim(e){if(e.civ)return{hw:2,ht:9,dz:3};if(e.crate)return e.prop?PROPS[e.prop]:{hw:7,ht:12,dz:6};const T0=e.T;return{hw:(T0.tw||10)/2+1,ht:(T0.lh||6)+(T0.th||10)+(T0.hh||6),dz:3+(ESIZE[e.type]||1)+(e.boss?2:0)};}
// ---------- campaign bosses: the Colossus, the Warden, the Maker ----------
function makeBoss(type,x0){
  const hp=type==='matry'?255:FEEL.bosses[type+'Hp']||240;
  const b={type,T:TYPES[type],boss:true,hp,max:hp,x:x0+196,z:BZ0+2,st:'idle',t:90,k:0,fx:0,fy:GY-44,tx:0,tz:0,hurt:0,hurtHead:0,shk:0};
  if(type==='matry'){Object.assign(b,{x:x0+180,z:124,layer:3,lhp:MSH[3].hp,st:'walk',t:60,castT:120,face:-1,wob:0});}
  if(type==='warden'){Object.assign(b,{x:x0+150,z:124,h:62,lx:x0+90,lz:124,lock:0,dropT:110,wT:0,tx:x0+150});}
  if(NB[type]){Object.assign(b,{x:x0+190,z:124,h:0});NB[type].init(b,x0);}
  b.fx=b.x-66;return b;
}
const landY=(b,tz)=>GY-8+(tz-b.z);
function bossHit(x0,x1,dz,d,o){
  const b=bw.boss,p=bw.p;if(!b||b.st==='dead'||b.st==='phase')return false;
  if(b.type==='matry')return matryHit(x0,x1,dz,d,o);
  if(NB[b.type])return nbHit(b,x0,x1,dz,d,o);
  if(b.type==='warden'){
    const low=b.st==='down';
    if(!low&&!o.sky)return false;
    if(b.x+14<x0||b.x-14>x1||(!o.sky&&Math.abs(b.z-p.z)>dz+8))return false;
    b.hp-=low?Math.round(d*1.5):Math.round(d*.6);b.hurt=8;bw.last=b;hitstop=4;spark(b.x,b.z-b.h-4,10,[C.yl,C.mg,C.wh],2.4);say(String(d),b.x,b.z-b.h-22,C.yl,26);kick(3,.3);beep(300,.1,'square',.05,-80);
    p.pow=Math.min(100,p.pow+FEEL.combat.powerPerHit);
    if(b.hp<=0){b.hp=0;b.st='dead';b.t=110;}return true;
  }
  if(b.st==='topple'&&x1>=b.x-96&&x0<=b.x-62&&Math.abs((b.z+8)-p.z)<=dz+10){d=Math.round(d*1.5);b.hp-=d;b.hurt=8;b.hurtHead=10;bw.last=b;hitstop=7;p.pow=Math.min(100,p.pow+FEEL.combat.powerPerHit);p.hits=p.hitT>0?p.hits+1:1;p.hitT=90;bw.score+=10*Math.min(p.hits,10);
    spark(b.x-80,b.z-6,12,[C.yl,C.mg,C.wh],2.6);say('CRIT '+d,b.x-80,b.z-24,C.mg,40);kick(4,.5);beep(1600,.1,'square',.06,-1200);
    if(b.type==='maker'&&!b.split&&b.hp<=b.max/2){b.hp=Math.ceil(b.max/2);b.st='phase';b.t=90;b.split=true;say('ITS SHELL IS CRACKING',b.x-60,b.z-20,C.yl,70);}else if(b.hp<=0){b.hp=0;b.st='dead';b.t=110;}return true;}
  if(b.x+44<x0||b.x-62>x1||Math.abs(b.z-p.z)>dz+10)return false;
  if(b.st==='topple'){}
  else if(b.st!=='kneel'&&!o.force){spark((x0+x1)/2,p.z-14-p.h,5,[C.wh,C.gr],1.5);say('CLANG',(x0+x1)/2,p.z-30,C.gr,24);beep(1400,.05,'square',.03);return true;}
  const crit=p.h>=12||o.air;if(crit){d*=2;b.hurtHead=10;}
  b.hp-=d;b.hurt=8;bw.last=b;hitstop=crit?8:4;p.pow=Math.min(100,p.pow+FEEL.combat.powerPerHit);p.hits=p.hitT>0?p.hits+1:1;p.hitT=90;bw.score+=10*Math.min(p.hits,10);
  spark((x0+x1)/2,p.z-16-p.h,crit?14:8,[C.yl,C.mg,C.wh],2.6);say(crit?'CRIT '+d:String(d),(x0+x1)/2,p.z-30-p.h,crit?C.mg:C.yl,crit?45:28);kick(crit?5:3,crit?.6:.3);beep(crit?1600:300,.1,'square',.06,crit?-1200:-80);
  if(b.type==='maker'&&!b.split&&b.hp<=b.max/2){b.hp=Math.ceil(b.max/2);b.st='phase';b.t=90;b.split=true;say('ITS SHELL IS CRACKING',b.x-60,b.z-20,C.yl,70);beep(80,.9,'sawtooth',.06,60);}
  else if(b.hp<=0){b.hp=0;b.st='dead';b.t=110;}
  return true;
}
function stepCampBoss(){
  const b=bw.boss,p=bw.p;if(!b)return;
  if(b.hurt>0)b.hurt--;if(b.hurtHead>0)b.hurtHead--;if(b.brace>0)b.brace--;
  if(b.type==='warden'){stepCampWarden(b);return;}
  if(b.type==='matry'){stepMatry(b);return;}
  if(NB[b.type]){nbStep(b);return;}
  const pd=pDim();
  const tk=b.st==='kneel'?18:b.st==='slam'?6:0;b.k+=(tk-b.k)*.18;
  b.shk=b.st==='phase'?(Math.random()<.5?-2:2):0;
  const lerp=(tx,ty,a)=>{b.fx+=(tx-b.fx)*a;b.fy+=(ty-b.fy)*a;};
  const restX=b.x-66,restY=GY-44+b.k;
  // keep the player out of the giant's legs on the back line
  if(p.x>b.x-54&&p.x<b.x+62&&p.z<b.z+12)p.x=b.x-54;
  switch(b.st){
    case 'idle':lerp(restX,restY,.1);
      if(--b.t<=0){
        if(b.type==='maker'&&Math.random()<.35){b.st='rain';b.t=96;say('INCOMING',p.x,p.z-40,C.yl,50);beep(300,.5,'sawtooth',.04,-200);}
        else if(Math.random()<.4&&Math.abs(p.x-b.x)<150){b.st='swwind';b.t=46;b.tz=p.z;beep(90,.4,'sawtooth',.04,60);}
        else{b.st='slamwind';b.t=54;b.tx=p.x;b.tz=p.z;beep(140,.5,'sawtooth',.04,200);}
      }break;
    case 'slamwind':if(b.t>22){b.tx+=(p.x-b.tx)*.1;b.tz+=(p.z-b.tz)*.1;}b.tx=clamp(b.tx,bw.cam+14,b.x-56);lerp(b.tx,12,.14);if(--b.t<=0){b.st='slam';b.fx=b.tx;}break;
    case 'slam':{b.fy+=10;const ly=landY(b,b.tz);
      if(b.fy>=ly){b.fy=ly;
        if(Math.abs(p.x-b.tx)<13+pd.hw&&Math.abs(p.z-b.tz)<5+pd.dz&&p.h<16)bHurt(16,{x:b.tx});
        spark(b.tx,b.tz,18,[C.yl,C.mg,C.gr],3.5);kick(7,.7);crunch(.3,.12);beep(55,.4,'sawtooth',.08,-20);
        b.st='kneel';b.t=130;bw.plats=[{x0:b.tx-11,x1:b.tx+11,z0:b.tz-6,z1:b.tz+3,h:16}];say('JUMP ON THE FIST',b.tx,b.tz-30,C.cy,60);}
      break;}
    case 'kneel':if(--b.t<=0){b.st='rise';b.t=30;bw.plats=[];}break;
    case 'topple':b.k+=(40-b.k)*.2;b.fx+=((b.x-60)-b.fx)*.1;b.fy+=((GY-20)-b.fy)*.1;if(T%20===0)spark(b.x-80,b.z+4,3,[C.gr],1);if(--b.t<=0){b.st='rise';b.t=40;b.brace=420;}break;
    case 'rise':lerp(restX,restY,.1);if(--b.t<=0){b.st='idle';b.t=rnd(40,70)|0;}break;
    case 'swwind':lerp(b.x-50,landY(b,b.tz)-4,.15);if(--b.t<=0){b.st='sweep';b.fx=b.x-50;crunch(.2,.08);}break;
    case 'sweep':b.fx-=6;b.fy=landY(b,b.tz);
      if(Math.abs(p.x-b.fx)<12+pd.hw&&Math.abs(p.z-b.tz)<5+pd.dz&&p.h<10)bHurt(12,{x:b.fx});
      if(T%2===0)spark(b.fx,b.tz,2,[C.gr,C.yl],1.5);
      if(b.fx<b.x-210||b.fx<bw.cam+6){b.st='idle';b.t=60;}break;
    case 'rain':lerp(restX,restY,.1);if(b.t%16===0)bw.strikes.push({x:clamp(p.x+rnd(-20,20),bw.cam+10,b.x-60),z:clamp(p.z+rnd(-6,6),BZ0,BZ1),t:36});if(--b.t<=0){b.st='idle';b.t=60;}break;
    case 'phase':lerp(restX,restY,.1);if(b.t%5===0){spark(b.x+rnd(-44,44),b.z-rnd(20,90),6,[C.yl,C.wh,C.mg],2.5);crunch(.05,.04);}
      if(--b.t<=0){ // the Maker's core ejects; finish it as a duel
        for(let i=0;i<14;i++)spark(b.x+rnd(-40,40),b.z-rnd(10,90),4,[C.yl,C.mgd,C.mg],3);kick(8,1);crunch(.6,.12);beep(60,.8,'sawtooth',.07,40);
        const S=SECS[bw.sec],mk=(type,x,z,boss)=>{const T0=TYPES[type],hp=Math.round(T0.hp*(boss===2?1.2:1)*1.6);bw.ents.push({type,T:T0,x,z,h:0,vh:0,vx:0,face:-1,st:'stun',t:50,hp,max:hp,dmg:Math.round(T0.dmg*1.1),hurt:0,walk:0,moving:false,boss:!!boss,final:boss===2,role:'attack',zo:0});};
        mk('makercore',b.x-40,124,2);mk('walker',b.x+20,134,0);
        banner={s:'IT EJECTED',t:80};glitch=1;bw.boss=null;bw.plats=[];return;}
      break;
    case 'dead':b.k+=(30-b.k)*.02;if(b.t%6===0){spark(b.x+rnd(-44,44),b.z-rnd(10,90),10,[C.mg,C.yl,C.wh,C.cy],3);crunch(.1,.06);kick(4,.7);}
      if(--b.t<=0){bw.score+=3000;bw.boss=null;bw.plats=[];bw.ents.push({husk:true,id:'titan',shell:100,max:140,x:b.x-70,z:126,face:1});say('ITS CORE FRAME: TITAN',b.x-70,96,C.cy,90);}
      break;
  }
}
function stepCampWarden(b){
  const p=bw.p,pd=pDim();b.bob=(b.bob||0)+.05;
  switch(b.st){
    case 'idle':
      if(--b.wT<=0){b.tx=bw.cam+rnd(60,220);b.wT=140;}
      b.x+=(b.tx-b.x)*.012;b.h+=((62+Math.sin(b.bob)*4)-b.h)*.1;
      b.lx+=clamp(p.x-b.lx,-.9,.9);b.lz+=clamp(p.z-b.lz,-.5,.5);
      if(Math.abs(p.x-b.lx)<12+pd.hw&&Math.abs(p.z-b.lz)<6)b.lock++;else b.lock=Math.max(0,b.lock-.5);
      if(b.lock>40){b.st='wind';b.t=30;b.lock=0;beep(200,.5,'sawtooth',.04,600);break;}
      if(--b.dropT<=0){b.st='drop';b.t=26;}
      break;
    case 'wind':if(--b.t<=0){b.st='beam';b.t=20;kick(3,.6);crunch(.3,.08);beep(90,.35,'square',.06,-40);}break;
    case 'beam':if(Math.abs(p.x-b.lx)<8+pd.hw&&Math.abs(p.z-b.lz)<5+pd.dz)bHurt(14,{x:b.lx});if(T%2===0)spark(b.lx,b.lz,3,[C.mg,C.wh],2);if(--b.t<=0)b.st='idle';break;
    case 'drop':if(b.t===14){for(const dx of [-8,8])if(bw.bombs.length<4)bw.bombs.push({x:b.x+dx,z:clamp(p.z+rnd(-8,8),BZ0,BZ1),h:b.h,vh:0,st:'fall',t:0,f:0});beep(500,.1,'square',.04,-200);}if(--b.t<=0){b.st='idle';b.dropT=170;}break;
    case 'down':b.h+=(4-b.h)*.2;if(!b.landed&&b.h<8){b.landed=true;kick(5,.5);crunch(.25,.1);spark(b.x,b.z,14,[C.gr,C.yl],3);}if(--b.t<=0){b.st='rise';b.t=40;b.landed=false;}break;
    case 'rise':b.h+=(62-b.h)*.06;if(--b.t<=0){b.st='idle';b.dropT=90;}break;
    case 'dead':b.h+=(4-b.h)*.08;if(b.t%6===0){spark(b.x+rnd(-12,12),b.z-b.h+rnd(-12,12),10,[C.mg,C.yl,C.wh],3);crunch(.1,.06);kick(3,.5);}
      if(--b.t<=0){bw.score+=3000;bw.boss=null;bw.bombs=[];bw.ents.push({husk:true,id:'flyer',shell:70,max:80,x:b.x,z:b.z,face:1});say('A FLYING FRAME WAS INSIDE',b.x,90,C.cy,90);}
      break;
  }
}
// the Warden's walking bombs: hit one to kick it up at the Warden
function stepBombsB(){
  const p=bw.p,b=bw.boss,pd=pDim();
  for(const m of bw.bombs){
    m.f++;
    if(m.st==='fall'){m.vh-=.25;m.h+=m.vh;if(m.h<=0){m.h=0;m.st='walk';}}
    else if(m.st==='walk'){m.x+=Math.sign(p.x-m.x)*.6;m.z+=Math.sign(p.z-m.z)*.3;if(Math.abs(p.x-m.x)<10+pd.hw&&Math.abs(p.z-m.z)<6&&p.h<10){m.st='fuse';m.t=34;beep(1500,.05,'square',.03);}}
    else if(m.st==='fuse'){if(--m.t<=0)bombBoom(m,true);}
    else if(m.st==='kick'){m.x+=m.vx;m.h+=m.vh;m.vh-=.12;
      if(b&&b.type==='warden'&&b.st!=='down'&&b.st!=='dead'){m.vx+=clamp((b.x-m.x)*.01,-.12,.12);if(Math.abs(m.x-b.x)<16&&Math.abs(m.h-b.h)<16){bombBoom(m,false);b.st='down';b.t=180;b.landed=false;b.hp-=12;bw.last=b;say('DOWNED',b.x,b.z-30,C.yl,60);}}
      if(!m.dead&&m.h<=0)bombBoom(m,true);}
  }
  bw.bombs=bw.bombs.filter(m=>!m.dead);
}
function bombBoom(m,hurtsYou){
  m.dead=true;const p=bw.p,pd=pDim();bursts.push({x:Math.round(m.x-bw.cam),y:Math.round(m.z-m.h),t:14});spark(m.x,m.z-m.h-4,14,[C.yl,C.wh,C.mg],3);kick(4,.5);crunch(.3,.1);beep(70,.35,'sawtooth',.06,-30);
  if(hurtsYou&&Math.abs(p.x-m.x)<18+pd.hw&&Math.abs(p.z-m.z)<8+pd.dz&&p.h<14)bHurt(10,m);
  for(const e of bw.ents)if(e.type&&e.st!=='dead'&&Math.abs(e.x-m.x)<20&&Math.abs(e.z-m.z)<10)bDamage(e,6,e.x<m.x?-1:1,{heavy:true,force:true});
}
function kickBombs(x0,x1,dz){
  const p=bw.p;let k=false;
  for(const m of bw.bombs)if((m.st==='walk'||m.st==='fuse')&&m.x>x0-4&&m.x<x1+4&&Math.abs(m.z-p.z)<dz+4){m.st='kick';m.vx=p.face*2.4;m.vh=4.6;say('KICK',m.x,m.z-16,C.cy,24);beep(900,.08,'square',.04,500);k=true;}
  return k;
}
function stepStrikes(){
  const p=bw.p,pd=pDim();
  for(const s of bw.strikes){if(s.bolt&&s.t===1){bw.zaps.push({x:s.x,z:s.z,t:7});glitch=Math.max(glitch,.5);beep(1800,.12,'sawtooth',.05,-1500);}
    if(s.mine&&--s.t<=0){s.dead=true;bursts.push({x:Math.round(s.x-bw.cam),y:Math.round(s.z),t:12});for(const e of bw.ents)if((e.type||e.crate)&&!e.dead&&e.st!=='dead'&&Math.abs(e.x-s.x)<16+eDim(e).hw&&Math.abs(e.z-s.z)<10)bDamage(e,s.dmg,e.x<s.x?-1:1,{heavy:true,force:true});bossHit(s.x-16,s.x+16,10,s.dmg,{force:true,sky:true});kick(4,.5);crunch(.2,.08);continue;}
    if(!s.mine&&--s.t<=0){s.dead=true;bursts.push({x:Math.round(s.x-bw.cam),y:Math.round(s.z),t:14});spark(s.x,s.z-4,12,[C.yl,C.wh,C.mg],3);kick(4,.5);crunch(.25,.1);beep(70,.3,'sawtooth',.06,-30);
    if(Math.abs(p.x-s.x)<14+pd.hw&&Math.abs(p.z-s.z)<6+pd.dz&&p.h<14)bHurt(12,s);}}
  bw.strikes=bw.strikes.filter(s=>!s.dead);
}
function drawCampBoss(cam){
  const b=bw.boss;if(!b||NB[b.type])return;
  const pal=b.hurt>0&&(b.hurt&2)?PAL.hit:(b.st==='phase'&&(T>>2)&1)?PAL.hit:b.type==='maker'?PAL.maker:PAL.foe;
  if(b.type==='warden'){
    const x=Math.round(b.x-cam),y=Math.round(b.z-b.h);
    g.globalAlpha=.4;px(x-12,b.z-1,24,3,C.void);g.globalAlpha=1;
    if(b.st==='idle'||b.st==='wind'||b.st==='beam'){
      const lx=Math.round(b.lx-cam),col=b.st!=='idle'||b.lock>24?C.yl:C.mg;
      g.globalAlpha=.16;for(let yy=y+12;yy<b.lz;yy+=2){const k=(yy-y)/(b.lz-y),cx=x+(lx-x)*k,w=3+12*k;px(cx-w,yy,w*2,1,col);}g.globalAlpha=.35;px(lx-14,b.lz-2,28,4,col);g.globalAlpha=1;
      if(b.st==='wind'&&(T>>1)&1)px(lx,y+12,1,b.lz-y-12,C.yl);
      if(b.st==='beam'){px(lx-4,y+10,9,b.lz-y-10,C.mg);px(lx-1,y+10,3,b.lz-y-10,C.wh);}
    }
    px(x-8,y-21,2,10,'#05010d');px(x+6,y-21,2,10,'#05010d');
    pixCircle(x,y,13,pal.line);pixCircle(x,y,12,pal.fill);
    const ex=x+Math.round(clamp((bw.p.x-b.x)/40,-1,1)*4),down=b.st==='down'||b.st==='dead';
    pixCircle(ex,y+3,6,down?C.gr:C.wh);pixCircle(ex,y+3,3,down?C.grd:b.st==='wind'||b.st==='beam'?C.yl:C.mg);px(ex-1,y+1,1,1,C.wh);
    if(!down){px(x-6,y+13,3,2+((T>>1)&1),C.yl);px(x+4,y+13,3,2+((T>>2)&1),C.yl);}
    if(b.st==='down')for(let i=0;i<3;i++){const a=T*.18+i*2.1;px(x+Math.cos(a)*8,y-16+Math.sin(a)*2,1,1,C.yl);}
    return;
  }
  if(b.st==='dead'&&(T>>1)&1)return;
  const L={x:b.x-cam,k:b.k,fx:b.fx-cam,fy:b.fy,st:b.st,shk:b.shk,hurtHead:b.hurtHead,type:b.type,headDown:b.st==='topple'};
  g.globalAlpha=.4;px(L.x-48,b.z-1,96,3,C.void);g.globalAlpha=1;
  if(b.st==='slamwind'&&(T>>2)&1){const x=Math.round(b.tx-cam);px(x-12,b.tz-1,24,2,C.yl);}
  if(b.st==='swwind'&&(T>>2)&1)for(let x=Math.round(b.x-cam-210);x<b.x-cam-44;x+=6)px(x,b.tz-1,3,2,C.yl);
  g.save();g.translate(0,b.z-GY);drawBoss(L,T,pal);g.restore();
}
function drawCampHazards(cam){
  for(const m of bw.bombs){const x=Math.round(m.x-cam),y=Math.round(m.z-m.h),bl=m.st==='fuse'&&(m.t>>1)&1;
    g.globalAlpha=.4;px(x-4,m.z-1,8,2,C.void);g.globalAlpha=1;
    pixHex(x,y-6,4,1,bl?C.wh:C.mgd,true);pixHex(x,y-6,4,1,C.yl);px(x-1,y-7,2,2,bl?C.mg:C.void);px(x,y-12,1,2,C.gr);if((T>>1)&1)px(x,y-13,1,1,C.yl);
    if(m.st==='walk'||m.st==='fuse'){const st=(m.f>>2)&1;px(x-3,y-2,1,2-st,C.mg);px(x+2,y-2,1,1+st,C.mg);}}
  for(const z2 of bw.zaps){drawBolt(Math.round(z2.x-cam),z2.z);if(--z2.t<=0)z2.dead=true;}bw.zaps=bw.zaps.filter(z2=>!z2.dead);
  for(const s of bw.strikes){const x=Math.round(s.x-cam);if(s.bolt){const r=4+((44-Math.min(44,s.t))>>3),c=s.mine?C.cy:((T>>1)&1?C.wh:C.cy);for(let a=0;a<20;a++){const aa=a/20*6.283;px(x+Math.cos(aa)*r,s.z+Math.sin(aa)*r*.4,1,1,c);}if(s.t<10)px(x-1,s.z-2,3,3,C.wh);continue;}
    if((T>>2)&1){px(x-7,s.z,5,1,C.yl);px(x+3,s.z,5,1,C.yl);px(x,s.z-6,1,4,C.yl);px(x,s.z+2,1,3,C.yl);}
    if(s.t<12){const y=s.z-s.t*9;px(x-1,y-7,3,7,C.mg);px(x,y-9,1,2,C.wh);}}
  for(const pl2 of bw.plats){const x0=Math.round(pl2.x0-cam);if((T>>3)&1)px(x0,pl2.z0+3-pl2.h,pl2.x1-pl2.x0,1,C.yl);}
}

// ---------- heads: knocked off beaten robots, kickable like the Warden's bombs ----------
function popHead(e){
  const ed=eDim(e),T0=e.T;
  const bomb=Math.random()<FEEL.robots.headBombChance;bursts.push({x:Math.round(e.x-bw.cam),y:Math.round(e.z-ed.ht),t:10});
  bw.heads.push({bomb,fuse:bomb?380:0,type:e.type,x:e.x+(e.type==='hound'?e.face*12:0),z:e.z,h:ed.ht,vx:-e.face*rnd(.8,1.6),vh:2.6,st:'fly',hot:false,w:e.type==='hound'?9:Math.max(T0.hw||8,T0.hh||6),hh:e.type==='hound'?9:Math.max(T0.hw||8,T0.hh||6),spin:0,life:1500});
}
function kickHeads(x0,x1,dz){
  const p=bw.p,wd=bw.boss&&bw.boss.type==='warden'&&bw.boss.st!=='down'&&bw.boss.st!=='dead';let k=false;
  for(const hd of bw.heads){
    if(hd.h>18||hd.kickT>0)continue;
    if(hd.x+hd.w/2<x0||hd.x-hd.w/2>x1||Math.abs(hd.z-p.z)>dz+4)continue;
    hd.st='fly';hd.hot=true;hd.kickT=8;hd.vx=p.face*(wd?2.4:3.6);hd.vh=wd?5.6:2.8;hd.life=1500;
    say('KICK',hd.x,hd.z-16,C.cy,24);beep(900,.08,'square',.04,500);crunch(.05,.04);k=true;
    if(!bw.headTip){bw.headTip=true;}
  }
  return k;
}
function stepHeads(){
  const b=bw.boss;
  for(const hd of bw.heads){
    if(hd.kickT>0)hd.kickT--;
    if(hd.bomb){hd.fuse--;const iv=hd.fuse>180?30:hd.fuse>80?14:6;if(hd.fuse%iv===0)beep(hd.fuse>80?1200:1800,.03,'square',.025);if(hd.fuse<=0){headBoom(hd);continue;}}
    if(--hd.life<=0||hd.x<bw.cam-30){hd.gone=true;continue;}
    if(hd.st!=='fly')continue;
    hd.x+=hd.vx;hd.h+=hd.vh;hd.vh-=.22;hd.spin++;
    if(hd.x<bw.cam+4||hd.x>bw.cam+W-4){hd.vx*=-.6;hd.x=clamp(hd.x,bw.cam+4,bw.cam+W-4);}
    if(hd.hot){
      // homes in on the Warden like the bombs did
      if(b&&b.type==='warden'&&b.st!=='down'&&b.st!=='dead'){hd.vx+=clamp((b.x-hd.x)*.01,-.12,.12);
        if(Math.abs(hd.x-b.x)<16&&Math.abs(hd.h-b.h)<18){if(hd.bomb){headBoom(hd);continue;}hd.hot=false;hd.vx*=-.4;hd.vh=1;b.st='down';b.t=180;b.landed=false;b.hp-=10;b.hurt=8;bw.last=b;
          spark(b.x,b.z-b.h,14,[C.yl,C.wh,C.mg],3);kick(5,.6);crunch(.3,.1);beep(120,.3,'square',.06,-60);say('DOWNED',b.x,b.z-30,C.yl,60);}}
      for(const e of bw.ents){
        if(!(e.type||e.crate)||e.dead||e.st==='dead'||e.st==='held')continue;
        const ed=eDim(e);if(Math.abs(e.x-hd.x)<ed.hw+hd.w/2&&Math.abs(e.z-hd.z)<ed.dz+3&&hd.h<ed.ht){
          if(hd.bomb){headBoom(hd);break;}
          bDamage(e,8,Math.sign(hd.vx)||1,{heavy:true,force:true});say('HEADSHOT',e.x,e.z-ed.ht-12,C.yl,40);
          hd.hot=false;hd.vx*=-.4;hd.vh=Math.max(hd.vh,1.6);break;}
      }
      if(hd.hot&&hd.bomb&&b&&b.type==='matry'&&Math.abs(hd.x-b.x)<matryDim(b).hw+4&&Math.abs(hd.z-b.z)<10){headBoom(hd);continue;}
      if(hd.hot&&hd.bomb&&b&&NB[b.type]){const c=NB[b.type].c(b);if(Math.abs(hd.x-c.x)<26&&Math.abs(hd.z-c.z)<14){headBoom(hd);continue;}}
      if(hd.hot&&hd.bomb&&b&&b.type!=='warden'&&b.type!=='matry'&&!NB[b.type]&&hd.x>b.x-96&&hd.x<b.x+50&&Math.abs(hd.z-b.z)<26&&hd.h<50){headBoom(hd);continue;}
      if(hd.hot&&b&&b.type!=='warden'&&hd.h<40&&bossHit(hd.x-4,hd.x+4,10,8,{})){hd.hot=false;hd.vx*=-.4;hd.vh=1.6;}
    }
    if(hd.h<=0){hd.h=0;if(Math.abs(hd.vh)>1){hd.vh=-hd.vh*.45;hd.vx*=.6;crunch(.03,.02);}else{hd.vh=0;hd.vx=0;hd.st='rest';hd.hot=false;}}
  }
  bw.heads=bw.heads.filter(h=>!h.gone);
}
function drawHeads(cam){
  for(const hd of bw.heads){
    const x=Math.round(hd.x-cam),y=Math.round(hd.z-hd.h),q=(hd.spin>>2)&1,w=q?hd.hh:hd.w,h=q?hd.w:hd.hh;
    g.globalAlpha=.4;px(x-hd.w/2,hd.z-1,hd.w,2,C.void);g.globalAlpha=1;
    const pal=hd.hot&&(T>>1)&1?PAL.warn:{line:C.mg,fill:C.mgd,dark:C.mgx};
    box(x-(w>>1),y-h,w,h,pal);
    if(!q){if(hd.type==='hound'){for(let i=0;i<4;i++)px(x-(w>>1)+1+i*2,y-2,1,1,C.wh);}px(x+1,y-h+2,2,2,hd.bomb?((hd.fuse>>(hd.fuse>80?3:1))&1?C.wh:C.yl):C.grx);}
    if(hd.bomb){px(x,y-h-3,1,3,C.gr);if((T>>1)&1)px(x,y-h-4,1,1,(T>>2)&1?C.yl:C.wh);if(hd.fuse<120&&(T>>2)&1)txt(String(Math.ceil(hd.fuse/60)),x,y-h-11,C.yl,1,'c');}
    if(hd.st==='rest'&&!bw.headTip&&(T>>3)&1){px(x-1,y-h-6,3,3,C.cy);}
  }
}

// ---------- topple: knock a giant over so its head lies on the floor ----------
function toppleBoss(why){
  const b=bw.boss;if(b&&NB[b.type]){if(b.st==='dead'||b.st==='down')return false;if(NB[b.type].topple)return NB[b.type].topple(b);nbDown(b,150,'TOPPLED');return true;}
  if(b&&b.type==='matry'){if(['dead','pop'].includes(b.st))return false;b.st='down';b.t=90;say('TOPPLED',b.x,b.z-50,C.yl,50);kick(5,.6);crunch(.3,.1);return true;}
  if(!b||b.type==='warden'||['dead','phase','topple'].includes(b.st))return false;
  if(b.brace>0){say('IT BRACES ITSELF',b.x-70,b.z-40,C.gr,40);beep(200,.1,'square',.04);return false;}
  b.st='topple';b.t=150;bw.plats=[];bw.p.plat=null;if(!bw.p.onG){}else if(bw.p.h>0){bw.p.onG=false;}
  b.fx=b.x-66;b.fy=GY-30;kick(8,.9);crunch(.5,.12);beep(50,.7,'sawtooth',.08,-20);
  spark(b.x-80,b.z+6,24,[C.yl,C.gr,C.wh],3.5);say('TOPPLED',b.x-80,b.z-40,C.yl,70);bw.last=b;return true;
}
// ticking heads: some heads are bombs
function headBoom(hd){
  hd.gone=true;const p=bw.p,pd=pDim(),b=bw.boss;
  bursts.push({x:Math.round(hd.x-bw.cam),y:Math.round(hd.z-hd.h),t:18});spark(hd.x,hd.z-hd.h-4,22,[C.yl,C.wh,C.mg,C.mg],3.8);kick(6,.7);crunch(.4,.12);beep(60,.45,'sawtooth',.07,-30);
  if(Math.abs(p.x-hd.x)<20+pd.hw&&Math.abs(p.z-hd.z)<9+pd.dz&&p.h<18)bHurt(12,hd);
  for(const e of bw.ents)if((e.type||e.crate)&&!e.dead&&e.st!=='dead'&&Math.abs(e.x-hd.x)<22+eDim(e).hw&&Math.abs(e.z-hd.z)<12)bDamage(e,10,e.x<hd.x?-1:1,{heavy:true,launch:true,force:true});
  for(const o of bw.heads)if(o!==hd&&o.bomb&&!o.gone&&Math.abs(o.x-hd.x)<24&&Math.abs(o.z-hd.z)<10)o.fuse=Math.min(o.fuse,6);
  if(b&&b.type==='warden'&&b.st!=='down'&&b.st!=='dead'&&Math.abs(b.x-hd.x)<24&&Math.abs(b.h-hd.h)<24){b.st='down';b.t=180;b.landed=false;b.hp-=16;b.hurt=8;say('DOWNED',b.x,b.z-30,C.yl,60);}
  else if(b&&b.type==='matry'){bossHit(hd.x-20,hd.x+20,12,15,{force:true,heavy:true});}
  else if(b&&NB[b.type])nbBomb(b,hd.x,hd.z,15);
  else if(b&&b.type!=='warden'&&!NB[b.type]&&hd.x>b.x-96&&hd.x<b.x+50&&Math.abs(hd.z-b.z)<26&&hd.h<50){b.hp-=15;b.hurt=8;if(!toppleBoss('bomb')&&b.st==='topple')b.t+=40;}
}
// the chain hook: yanks giants over, pulls the Warden down, drags robots to you
function fireHook(){
  const p=bw.p,f=p.face,reach=132,b=bw.boss;let end=p.x+f*reach,done=false;
  if(b&&b.st!=='dead'&&b.st!=='phase'){
    if(b.type==='warden'){if((b.x-p.x)*f>0&&Math.abs(b.x-p.x)<reach+20&&b.st!=='down'){end=b.x;b.st='down';b.t=170;b.landed=false;b.hp-=8;b.hurt=8;say('HOOKED',b.x,b.z-b.h-14,C.cy,50);done=true;}}
    else if(NB[b.type]){const c=NB[b.type].c(b);if((c.x-p.x)*f>0&&Math.abs(c.x-p.x)<reach+20){end=c.x;const B=NB[b.type];if(B.hook?B.hook(b):toppleBoss('hook'))say('HOOKED',c.x,c.z-40,C.cy,50);done=true;}}
    else{const lx=b.x-62;if((lx-p.x)*f>0&&Math.abs(lx-p.x)<reach+30){end=lx;if(toppleBoss('hook'))say('HOOKED',lx,b.z-50,C.cy,50);done=true;}}
  }
  if(!done){let best=null,bd=1e9;
    for(const e of bw.ents){if(!e.type||e.st==='dead'||e.boss&&e.final)continue;const dx=(e.x-p.x)*f;if(dx>0&&dx<reach&&Math.abs(e.z-p.z)<eDim(e).dz+5&&dx<bd){best=e;bd=dx;}}
    if(best){end=best.x;best.x=p.x+f*(pDim().hw+eDim(best).hw+2);best.z=p.z;best.st='stun';best.t=60;best.h=0;say('HOOKED',best.x,best.z-30,C.cy,40);bDamage(best,4,f,{stun:true});}}
  bw.chain={x0:p.x+f*6,x1:end,y:p.z-14-p.h,t:16};kick(3,.4);beep(300,.25,'square',.05,-200);crunch(.15,.06);
}

// ---------- the Flyer: the frame inside the Warden; hovers, and drops bombs ----------
const FLYER={flyer:true,size:3,shell:80,dmg:5,spd:1.4,reach:16,name:'FLYER'};
const HOV=12;
const JET=FEEL.jetpack;
function drawFlyer(x,fy,face,moving,mode,fp,husk){
  // fy is the floor point under it; the body floats above
  const bob=husk?0:Math.round(Math.sin(T*.12)*1.5),y=husk?fy-6:fy-HOV-bob;
  if(!husk){for(let i=0;i<2;i++){const fx=x-8+i*13;px(fx,y+1,3,2+((T>>1)&1),C.yl);px(fx+1,y+3,1,1+((T>>2)&1),C.wh);}}
  px(x-12,y-9,5,6,fp.shade);px(x+7,y-9,5,6,fp.body);px(x-12,y-9,5,1,fp.hi);px(x+7,y-9,5,1,fp.hi);
  px(x-8,y-12,16,10,fp.body);px(x-8,y-12,16,1,fp.hi);px(x-8,y-3,16,1,fp.deep);px(x-10,y-10,20,2,fp.body);
  px(x,y-9,1,1,fp.mark);px(x-1,y-8,3,1,fp.mark);px(x-2,y-7,5,1,fp.mark);
  const claw=mode===1||mode===3?4:2;px(x-5,y-2,1,claw,fp.shade);px(x+4,y-2,1,claw,fp.shade);px(x-6,y-2+claw,2,1,fp.shade);px(x+4,y-2+claw,2,1,fp.shade);
  if(mode===1){px(face>0?x+8:x-14,y-7,6,2,fp.body);px(face>0?x+13:x-15,y-8,2,4,C.yl);}
  return{top:y-12,lean:0};
}
function stepDrops(){
  const p=bw.p;
  for(const d of bw.drops){d.vh-=.3;d.h+=d.vh;
    if(d.h<=0){d.gone=true;
      bursts.push({x:Math.round(d.x-bw.cam),y:Math.round(d.z),t:14});spark(d.x,d.z-4,16,[C.yl,C.wh,C.mg],3.2);kick(4,.5);crunch(.28,.1);beep(70,.3,'sawtooth',.06,-30);
      const o={heavy:true,launch:true,force:true};
      for(const e of bw.ents)if((e.type||e.crate)&&!e.dead&&e.st!=='dead'&&e.st!=='held'&&Math.abs(e.x-d.x)<18+eDim(e).hw&&Math.abs(e.z-d.z)<12)bDamage(e,d.dmg,e.x<d.x?-1:1,o);
      for(const hd of bw.heads)if(Math.abs(hd.x-d.x)<18&&Math.abs(hd.z-d.z)<10&&hd.h<10){hd.st='fly';hd.hot=true;hd.vh=3.4;hd.vx=hd.x<d.x?-2:2;if(hd.bomb)hd.fuse=Math.min(hd.fuse,8);}
      const b=bw.boss;
      if(b&&b.type==='matry')bossHit(d.x-18,d.x+18,12,d.dmg,{force:true,heavy:true});
      else if(b&&NB[b.type])nbBomb(b,d.x,d.z,Math.round(d.dmg*.6));
      else if(b&&b.type!=='warden'&&!NB[b.type]&&d.x>b.x-96&&d.x<b.x+50&&Math.abs(d.z-b.z)<26){b.hp-=Math.round(d.dmg*.6);b.hurt=8;bw.last=b;if(!toppleBoss('bomb')&&b.st==='topple')b.t+=20;if(b.hp<=0&&b.st!=='dead'){b.hp=0;b.st='dead';b.t=110;}}
      if(b&&b.type==='warden'&&b.st==='down'&&Math.abs(b.x-d.x)<22)bossHit(d.x-18,d.x+18,12,d.dmg,{force:true});
    }}
  bw.drops=bw.drops.filter(d=>!d.gone);
}
function drawDrops(cam){for(const d of bw.drops){const x=Math.round(d.x-cam),y=Math.round(d.z-d.h);g.globalAlpha=.4;px(x-3,d.z-1,6,2,C.void);g.globalAlpha=1;px(x-2,y-5,5,5,C.mgd);px(x-2,y-5,5,1,C.yl);px(x,y-7,1,2,C.gr);if((T>>1)&1)px(x,y-8,1,1,C.yl);}}

// ---------- the new bosses (levels 3-7): one table entry each; shared hit, topple, hook and death handling ----------
// box(b): the parts you can hit right now [{x,z,hw,dz,hi?,m?}]; c(b): where blasts and the hook aim; mult(b,o): damage multiplier;
// onHit(b,d,o): return true to take the hit some other way (the crab's shell); hook(b): Chain Hook reaction; up(b): back up after 'down'
const nbP=()=>bw.p;
function nbHurt(x,z,r,dz,maxH,d){const p=bw.p,pd=pDim();if(!p.inside&&Math.abs(p.x-x)<r+pd.hw&&Math.abs(p.z-z)<dz+pd.dz&&p.h<maxH){bHurt(d,{x});return true;}return false;}
function nbSmash(x,z,r){squishAt(x,z,r+6);for(const e of bw.ents)if(e.prop&&!e.dead&&Math.abs(e.x-x)<r+PROPS[e.prop].hw&&Math.abs(e.z-z)<10)bDamage(e,9,e.x<x?-1:1,{heavy:true});}
function nbDown(b,t,msg){b.st='down';b.t=t;const c=NB[b.type].c(b);say(msg||'TOPPLED',c.x,c.z-46,C.yl,60);kick(6,.7);crunch(.4,.12);beep(50,.6,'sawtooth',.07,-20);spark(c.x,c.z-8,18,[C.yl,C.gr,C.wh],3);bw.last=b;}
function nbDie(b){if(b.hp<=0&&b.st!=='dead'){b.hp=0;b.st='dead';b.t=110;if(bw.p.inside)toadSpit(b,true);bw.plats=[];}}
function nbHit(b,x0,x1,dz,d,o){
  const B=NB[b.type],p=bw.p;
  for(const hb of B.box(b)){
    if(hb.x+hb.hw<x0||hb.x-hb.hw>x1||(!o.sky&&Math.abs(hb.z-p.z)>dz+hb.dz))continue;
    if(hb.hi&&!(p.h>=hb.hi||o.air||o.sky))continue;
    let m=(hb.m||1)*(B.mult?B.mult(b,o):1);if(b.st==='down'||b.st==='dazed')m*=1.5;
    const crit=m>=1.5,dd=Math.max(1,Math.round(d*m));
    p.pow=Math.min(100,p.pow+FEEL.combat.powerPerHit);p.hits=p.hitT>0?p.hits+1:1;p.hitT=90;bw.score+=10*Math.min(p.hits,10);b.hurt=8;bw.last=b;hitstop=crit?7:4;
    if(B.onHit&&B.onHit(b,dd,o,hb))return true;
    if(m<1){spark((x0+x1)/2,p.z-14-p.h,5,[C.wh,C.gr],1.5);say('CLANG',(x0+x1)/2,p.z-30-p.h,C.gr,24);beep(1400,.05,'square',.03);}
    b.hp-=dd;spark(hb.x,hb.z-14,crit?14:8,[C.yl,C.mg,C.wh],2.6);say(crit?'CRIT '+dd:String(dd),hb.x,hb.z-30,crit?C.mg:C.yl,crit?40:26);kick(crit?5:3,crit?.5:.3);beep(crit?1600:300,.1,'square',.06,crit?-1200:-80);
    nbDie(b);return true;
  }
  return false;
}
function nbStep(b){
  const B=NB[b.type];
  if(b.st==='dead'){const c=B.c(b);if(b.t%6===0){spark(c.x+rnd(-20,20),c.z-rnd(6,40),10,[C.mg,C.yl,C.wh,C.cy],3);crunch(.1,.06);kick(3,.6);}
    if(--b.t<=0){const D=B.drop;bw.score+=3000;bw.boss=null;bw.plats=[];bw.ents.push({husk:true,id:D.id,shell:D.shell,max:D.max,x:clamp(c.x,bw.cam+20,bw.cam+W-20),z:clamp(c.z,BZ0+2,BZ1-2),face:1});say(D.say,c.x,88,C.cy,100);}
    return;}
  if(b.st==='down'){if(B.downStep)B.downStep(b);if(--b.t<=0)B.up(b);return;}
  B.step(b);
}
function nbBomb(b,x,z,dmg){const c=NB[b.type].c(b);if(Math.abs(x-c.x)<34&&Math.abs(z-c.z)<18){b.hp-=dmg;b.hurt=8;bw.last=b;nbDie(b);if(b.st!=='dead')toppleBoss('bomb');return true;}return false;}
function nbDraw(cam){const b=bw.boss;if(b.st==='dead'&&(T>>1)&1)return;NB[b.type].draw(b,cam,b.hurt>0&&(b.hurt&2));}
function nbShadow(x,z,w){g.globalAlpha=.4;px(Math.round(x-w/2),Math.round(z-1),w,3,C.void);g.globalAlpha=1;}
function nbMarker(x,z,w){if((T>>2)&1){px(Math.round(x-w/2),Math.round(z-1),w,2,C.yl);px(Math.round(x)-1,Math.round(z)-3,2,6,C.yl);}}
function nbStars(x,y){for(let i=0;i<3;i++){const a=T*.18+i*2.1;px(Math.round(x+Math.cos(a)*9),Math.round(y+Math.sin(a)*2),1,1,i?C.yl:C.wh);}}
const toward=(a,t,s)=>a+clamp(t-a,-s,s);

// --- the Wind-Up Knight: a tin knight with a lance; hit the brass key on its back to unwind it ---
function knightStep(b){
  const p=bw.p;b.key-=FEEL.bosses.knightKeyDrain;if(b.key<=0){b.key=0;nbDown(b,170,'UNWOUND');return;}
  const dx=p.x-b.x;
  switch(b.st){
    case 'walk':b.face=dx<0?-1:1;if(Math.abs(dx)>26){b.x+=Math.sign(dx)*.55;b.walk+=.55;}b.z=toward(b.z,p.z,.35);if((b.walk|0)%24===0&&Math.abs(dx)>26)dust(b.x,b.z,2);
      if(--b.t<=0){if(Math.random()<.55){b.st='lwind';b.t=42;beep(220,.5,'square',.03,400);}else{b.st='swind';b.t=36;beep(160,.4,'sawtooth',.03,300);}}break;
    case 'lwind':b.face=dx<0?-1:1;b.z=toward(b.z,p.z,.5);if(--b.t<=0){b.st='charge';b.vx=b.face*3.8;b.hitDone=false;crunch(.15,.06);}break;
    case 'charge':b.x+=b.vx;if(bw.t%3===0)dust(b.x-b.face*8,b.z,2,-b.face);if(!b.hitDone&&nbHurt(b.x+b.face*14,b.z,10,6,14,14))b.hitDone=true;nbSmash(b.x+b.face*12,b.z,6);
      if(b.x<bw.cam+16||b.x>bw.cam+W-16){b.x=clamp(b.x,bw.cam+16,bw.cam+W-16);b.st='skid';b.t=34;kick(3,.3);}break;
    case 'skid':if(--b.t<=0){b.st='walk';b.t=rnd(50,90)|0;}break;
    case 'swind':if(--b.t<=0){b.st='spin';b.t=110;}break;
    case 'spin':b.x=toward(b.x,p.x,.8);b.z=toward(b.z,p.z,.4);if(bw.t%16===0)nbHurt(b.x,b.z,22,7,16,10);nbSmash(b.x,b.z,16);if(--b.t<=0){b.st='dizzy';b.t=80;say('DIZZY',b.x,b.z-50,C.yl,40);}break;
    case 'dizzy':if(--b.t<=0){b.st='walk';b.t=60;}break;
  }
  b.x=clamp(b.x,bw.cam+12,bw.cam+W-12);
}
function knightDraw(b,cam,hit){
  const x=Math.round(b.x-cam),y=Math.round(b.z),f=b.face,dn=b.st==='down',tin=hit?C.wh:'#c0c8d8',tinD=hit?C.wh:'#7a8298',red=hit?C.wh:'#ff5a7a',brass='#ffd84a';
  nbShadow(x,y,26);
  const sl=dn?8:0,lean=dn?f*5:0,sw=b.st==='walk'?Math.round(Math.sin(b.walk*.4)*2):0,spin=b.st==='spin',sf=spin?((T>>2)&1?1:-1):f;
  px(x-6+sw,y-12,4,12,tinD);px(x+2-sw,y-12,4,12,tin);px(x-7+sw,y-2,6,2,tinD);px(x+1-sw,y-2,6,2,tin);
  const ty=y-30+sl,tx=x-9+lean;
  px(tx,ty,18,18,tin);px(tx,ty,18,1,C.wh);px(tx,ty+17,18,1,tinD);for(let i=0;i<3;i++)px(tx+2,ty+4+i*5,14,2,red);
  const hx=x-6+lean+sf,hy=ty-12;px(hx,hy,12,12,tin);px(hx,hy+5,12,2,C.void);if(!dn)px(sf>0?hx+8:hx+2,hy+5,2,2,b.st==='lwind'||b.st==='charge'?C.yl:C.mg);
  px(hx+4,hy-5,4,5,red);px(hx+5,hy-7,4,2,red);
  // the key on its back
  const kx=x-f*12+lean,ky=ty+6,fast=b.st==='lwind'||b.st==='charge'?1:3,q=(T>>fast)&1;
  px(f>0?kx-3:kx+1,ky+1,3,2,brass);if(q){px(kx-4,ky-3,2,8,brass);px(kx-5,ky-3,4,2,brass);px(kx-5,ky+3,4,2,brass);}else{px(kx-6,ky,8,2,brass);px(kx-6,ky-1,2,4,brass);px(kx,ky-1,2,4,brass);}
  // the lance
  const lowered=b.st==='lwind'||b.st==='charge'||spin;
  if(lowered){const ld=spin?sf:f,lx=ld>0?x+8+lean:x-34+lean;px(lx,ty+8,26,2,C.wh);px(ld>0?lx+26:lx-3,ty+7,3,4,C.yl);}
  else{px(x+f*11+lean,ty-14,2,30,C.wh);px(x+f*11+lean-1,ty-17,4,3,C.yl);}
  if(spin)for(let a=0;a<20;a++){const aa=a/20*6.283+T*.4;px(x+Math.cos(aa)*20,y-2+Math.sin(aa)*5,1,1,(a&1)?C.wh:C.cy);}
  if(b.st==='dizzy')nbStars(x,hy-9);if(dn&&(T>>4)&1)txt('Z',x+f*12,hy-12,C.wh);
  const kw=Math.round(16*b.key/100);px(x-8,y+3,16,2,C.grx);px(x-8,y+3,kw,2,brass);
}
// --- the Hermit Crab: wears an empty robot body as a shell and steals new ones off the street ---
function crabCrack(b,why){
  const sh=b.shell;b.shell=null;b.st='seek';b.t=0;b.digT=330;banner={s:'SHELL BREAK',t:60};kick(6,.8);crunch(.4,.12);beep(90,.5,'sawtooth',.06,100);
  for(const side of [-1,1])parts.push({x:b.x+side*4,y:b.z-24,vx:side*rnd(1,2),vy:-2.4,t:46,c:C.gr,gv:.14,s:5});
  say(why||'NOW IT IS SOFT',b.x,b.z-48,C.yl,60);if(sh)spark(b.x,b.z-22,20,[C.gr,C.grd,C.wh],3);
}
function crabStep(b){
  const p=bw.p,dx=p.x-b.x,adx=Math.abs(dx),naked=!b.shell,sp=naked?1.1:.7;
  if(b.st==='seek'){let best=null,bd=1e9;for(const e of bw.ents)if(e.husk&&e.x>bw.cam&&e.x<bw.cam+W){const d=Math.abs(e.x-b.x)+Math.abs(e.z-b.z)*2;if(d<bd){bd=d;best=e;}}
    if(best){b.face=best.x<b.x?-1:1;b.x=toward(b.x,best.x,1.7);b.z=toward(b.z,best.z,1);b.walk+=1.7;
      if(Math.abs(best.x-b.x)<6&&Math.abs(best.z-b.z)<4){bw.ents=bw.ents.filter(e=>e!==best);b.shell=best.id;b.shp=b.smax=Math.max(30,best.shell);b.st='climb';b.t=30;say('IT STEALS A SHELL',b.x,b.z-50,C.mg,60);beep(180,.3,'square',.05,200);}}
    else{b.face=dx<0?-1:1;if(adx>24)b.x+=Math.sign(dx)*1.1;b.z=toward(b.z,p.z,.6);b.walk+=1;if(adx<34&&Math.random()<.02){b.st='pwind';b.t=24;}
      if(--b.digT<=0){b.st='dig';b.t=70;say('IT DIGS A NEW SHELL',b.x,b.z-46,C.gr,60);}}
    return;}
  switch(b.st){
    case 'dig':if(bw.t%5===0)dust(b.x,b.z,3);if(--b.t<=0){b.shell='basic';b.shp=b.smax=35;b.st='walk';b.t=60;}break;
    case 'climb':if(--b.t<=0){b.st='walk';b.t=50;}break;
    case 'walk':b.face=dx<0?-1:1;if(adx>30){b.x+=Math.sign(dx)*sp;b.walk+=sp;}b.z=toward(b.z,p.z,.5);
      if(--b.t<=0){if(adx<60&&Math.random()<.6){b.st='pwind';b.t=30;beep(900,.06,'square',.03);}else{b.st='swind';b.t=40;b.tz=p.z;beep(120,.4,'sawtooth',.04,80);}}break;
    case 'pwind':b.face=dx<0?-1:1;if(--b.t<=0){b.st='pinch';b.t=12;b.vx=b.face*3;}break;
    case 'pinch':b.x+=b.vx;b.vx*=.9;if(!p.inside&&p.inv<=0&&Math.abs(p.x-(b.x+b.face*18))<10+pDim().hw&&Math.abs(p.z-b.z)<7&&p.h<12){b.st='hold';b.t=70;say('GOTCHA',p.x,p.z-36,C.mg,40);say('MASH B',p.x,p.z-46,C.yl,60);p.grab=null;p.atk=0;p.kind=null;}
      else if(--b.t<=0){b.st='rec';b.t=36;}break;
    case 'hold':p.x=b.x+b.face*20;p.z=b.z;p.h=0;p.vx=0;p.vz=0;if(P.b)b.t-=9;if(bw.t%8===0){kick(2,.2);beep(200,.04,'square',.03);}
      if(--b.t<=0){b.st='rec';b.t=50;bHurt(12,{x:b.x});p.vx=b.face*3.2;}break;
    case 'swind':b.z=toward(b.z,b.tz,.8);b.face=dx<0?-1:1;if(--b.t<=0){b.st='scuttle';b.vx=b.face*4;b.hitDone=false;}break;
    case 'scuttle':b.x+=b.vx;b.walk+=4;if(!b.hitDone&&nbHurt(b.x,b.z,16,6,12,12))b.hitDone=true;nbSmash(b.x,b.z,12);if(b.x<bw.cam+18||b.x>bw.cam+W-18){b.x=clamp(b.x,bw.cam+18,bw.cam+W-18);b.st='rec';b.t=30;}break;
    case 'rec':if(--b.t<=0){b.st='walk';b.t=rnd(50,90)|0;}break;
  }
  b.x=clamp(b.x,bw.cam+16,bw.cam+W-16);
}
function crabDraw(b,cam,hit){
  const x=Math.round(b.x-cam),y=Math.round(b.z),f=b.face,dn=b.st==='down',pink=hit?C.wh:'#e8506e',pd=hit?C.wh:'#8c1a3a',pl=hit?C.wh:'#ff8aa0';
  nbShadow(x,y,40);
  if(dn){px(x-15,y-9,30,7,pink);px(x-15,y-3,30,2,pd);for(let i=0;i<4;i++){const w=(T>>2)+i&1;px(x-12+i*7,y-12-w,1,4,pd);}px(x-20,y-8,6,5,pink);px(x+14,y-8,6,5,pink);nbStars(x,y-18);return;}
  const legs=b.walk*.5;for(let i=0;i<3;i++)for(const s of [-1,1]){const k=Math.round(Math.sin(legs+i*2)*1.5);px(x+s*(8+i*4),y-5,1,4+k,pd);px(x+s*(9+i*4),y-1,2,1,pd);}
  px(x-14,y-11,28,7,pink);px(x-14,y-11,28,1,pl);px(x-14,y-5,28,1,pd);
  // claws: spread on the wind-up, out on the pinch, closed on you
  const reach=b.st==='pinch'||b.st==='hold'?14:b.st==='pwind'?6:3,cx=x+f*(14+reach),open=b.st==='pwind'&&(T>>2)&1;
  px(f>0?x+12:x-12-reach,y-10,reach+2,3,pink);px(f>0?cx-2:cx-6,y-15,8,6,pink);px(f>0?cx-2:cx-6,y-15,8,1,pl);
  if(open){px(f>0?cx+4:cx-8,y-18,3,3,pink);px(f>0?cx+4:cx-8,y-9,3,3,pink);}else px(f>0?cx+5:cx-8,y-13,3,2,pd);
  px(f>0?x-16:x+12,y-9,4,4,pink);
  if(b.shell)drawRider(y-11,bodyOf(b.shell).frame?FR[b.shell].s.lh:(bodyOf(b.shell).T?bodyOf(b.shell).T.lh:0),yy=>drawBody(b.shell,x-f*2,yy,f,0,false,0,HPAL,FP.husk,'idle'));
  else if(b.st==='dig'){px(x-6,y-13,12,2,C.grd);if((T>>2)&1)dust(b.x,b.z,1);}
  // eye stalks, on long stalks so they show over the shell
  {const top=b.shell?y-30:y-19;for(const s of [-3,3]){px(x+f*12+s,top+2,1,y-11-top-2,pd);px(x+f*12+s-1,top,3,3,C.wh);px(x+f*13+s,top+1,1,1,C.void);}}
  if(b.shell){const w=Math.round(20*b.shp/b.smax);px(x-10,y+3,20,2,C.grx);px(x-10,y+3,w,2,C.gr);}
  if(b.st==='swind'&&(T>>2)&1)for(let xx=bw.cam;xx<bw.cam+W;xx+=8)px(Math.round(xx-cam),b.z-1,3,2,C.yl);
}
// --- the Crane: a gantry over the yard; its magnet slams, lifts bodies and heads, and drops them on you ---
function crPullable(){const out=[];for(const e of bw.ents)if(e.husk||e.type&&e.st!=='dead'&&e.st!=='held')out.push(e);for(const h of bw.heads)out.push(h);return out;}
function craneStep(b){
  const p=bw.p;b.x=clamp(b.x,b.ax0+24,b.ax1-24);
  switch(b.st){
    case 'track':b.x=toward(b.x,p.x,1.2);b.z=toward(b.z,p.z,.6);b.h=toward(b.h,58,2);
      if(--b.t<=0){const r=Math.random();if(r<.45){b.st='mwind';b.t=48;beep(140,.5,'sawtooth',.04,200);}else if(r<.78){b.st='lwind';b.t=60;beep(80,.8,'sine',.04,300);}else{b.st='roll';b.t=60;}}break;
    case 'mwind':if(b.t>16){b.x=toward(b.x,p.x,1.4);b.z=toward(b.z,p.z,.8);}if(--b.t<=0)b.st='mslam';break;
    case 'mslam':b.h-=9;if(b.h<=0){b.h=0;nbHurt(b.x,b.z,14,6,16,16);nbSmash(b.x,b.z,14);spark(b.x,b.z,16,[C.yl,C.gr,'#ff9a2a'],3.4);kick(7,.7);crunch(.3,.12);beep(55,.4,'sawtooth',.08,-20);b.st='stuck';b.t=FEEL.bosses.craneStuck;say('HIT THE MAGNET',b.x,b.z-30,C.cy,60);}break;
    case 'stuck':if(--b.t<=0)b.st='mrise';break;
    case 'mrise':b.h=toward(b.h,58,2.4);if(b.h>=58){b.st='track';b.t=rnd(50,80)|0;}break;
    case 'lwind':{b.h=toward(b.h,30,2);const R=72,light=pBody().size===0;
      for(const o of crPullable()){if(Math.abs(o.x-b.x)<R&&Math.abs(o.z-b.z)<20){o.x=toward(o.x,b.x,1.1);o.z=toward(o.z,b.z,.5);}}
      if(!light&&!p.inside&&Math.abs(p.x-b.x)<R){p.x=toward(p.x,b.x,.85);p.z=toward(p.z,b.z,.35);}
      if(--b.t<=0){
        let best=null,bd=16;for(const o of crPullable()){const d=Math.abs(o.x-b.x)+Math.abs(o.z-b.z);if(d<bd&&!o.boss){bd=d;best=o;}}
        if(!light&&Math.abs(p.x-b.x)<14&&Math.abs(p.z-b.z)<8){b.st='mrise';bHurt(12,{x:b.x});say('MAGNET SLAM',p.x,p.z-36,C.mg,40);}
        else if(best){if(bw.heads.includes(best))bw.heads=bw.heads.filter(h=>h!==best);else bw.ents=bw.ents.filter(e=>e!==best);b.carry=best;b.st='carry';b.t=70;say('LIFTED',b.x,b.z-60,C.gr,40);}
        else b.st='mrise';}
      break;}
    case 'carry':b.h=toward(b.h,52,2);b.x=toward(b.x,p.x,1.6);b.z=toward(b.z,p.z,.8);if(--b.t<=0){b.st='drop';b.dh=b.h;}break;
    case 'drop':{b.dh-=7;const o=b.carry;if(b.dh<=0){b.carry=null;b.st='mrise';
      nbHurt(b.x,b.z,14,6,14,o.bomb!==undefined?8:12);nbSmash(b.x,b.z,10);kick(4,.4);crunch(.2,.08);spark(b.x,b.z,12,[C.gr,C.yl],2.6);
      if(o.bomb!==undefined){o.x=b.x;o.z=b.z;o.h=0;o.st='rest';o.vx=0;o.vh=0;bw.heads.push(o);if(o.bomb)headBoom(o);}
      else{o.x=b.x;o.z=b.z;o.h=0;if(o.type){o.st='down';o.t=40;bDamage(o,10,1,{force:true});}bw.ents.push(o);}}
      break;}
    case 'roll':if(b.t===50)for(let i=0;i<3;i++)bw.strikes.push({x:clamp(p.x-30+i*30,bw.cam+10,bw.cam+W-10),z:clamp(p.z,BZ0,BZ1),t:40+i*8});if(--b.t<=0){b.st='track';b.t=70;}break;
  }
}
function craneDraw(b,cam,hit){
  const ax0=Math.round(b.ax0-cam),ax1=Math.round(b.ax1-cam),by=24,x=Math.round(b.x-cam),dn=b.st==='down',rust=hit?C.wh:'#5a4a2a',rd=hit?C.wh:'#2a2010',org='#ff9a2a';
  for(const lx of [ax0,ax1]){px(lx-3,by,6,118-by,rd);px(lx-2,by,4,118-by,rust);for(let yy=by+6;yy<116;yy+=10){pline(lx-2,yy,lx+1,yy+8,rd);}}
  px(ax0-4,by-4,ax1-ax0+8,5,rust);px(ax0-4,by-4,ax1-ax0+8,1,org);
  const my=Math.round(b.z-b.h)-6,cabX=dn?x:x,cabY=dn?Math.round(b.z)-14:by+1;
  if(!dn){pline(x,by+12,x,my-4,C.grd);px(x-11,by+1,22,12,rust);px(x-11,by+1,22,1,org);px(x-7,by+4,14,6,C.void);px(x-4+((T>>5)&1),by+6,3,2,C.yl);px(x+2+((T>>5)&1),by+6,3,2,C.yl);}
  nbShadow(x,b.z,Math.max(8,22-b.h/4));
  if(b.st==='mwind')nbMarker(x,b.z,24);
  if(b.st==='lwind'){for(let i=0;i<3;i++){const r=((T*2+i*14)%40)+6;g.globalAlpha=.5;for(let a=0;a<16;a++){const aa=a/16*6.283;px(x+Math.cos(aa)*r,my+4+Math.sin(aa)*r*.35,1,1,'#7affd0');}g.globalAlpha=1;}}
  if(dn){px(cabX-11,cabY,22,12,rust);px(cabX-7,cabY+3,14,6,C.void);px(cabX-5,cabY+5,4,1,C.yl);px(cabX+1,cabY+5,4,1,C.yl);nbStars(cabX,cabY-4);pline(x,by+12,x+18,my,C.grd);}
  // the magnet: a horseshoe with white tips
  const mx=x-8;px(mx,my,16,4,hit?C.wh:C.mg);px(mx,my+4,4,6,hit?C.wh:C.mg);px(mx+12,my+4,4,6,hit?C.wh:C.mg);px(mx,my+9,4,2,C.wh);px(mx+12,my+9,4,2,C.wh);px(mx+4,my,8,1,C.mgd);
  if(b.carry){const o=b.carry;if(o.bomb!==undefined){box(x-4,my+12,8,7,{line:C.mg,fill:C.mgd,dark:C.mgx});}else drawBody(o.husk?o.id:'e:'+o.type,x,my+12+30,1,0,false,0,HPAL,FP.husk,'idle');}
  if(b.st==='drop'&&b.carry){}
}
// --- the Toad King: tongue lash, belly flop, croaks up robots; if its tongue catches you, it swallows you ---
function toadSpit(b,free){
  const p=bw.p;if(!p.inside)return;p.inside=false;p.x=clamp(b.x+b.face*28,bw.cam+10,bw.cam+W-10);p.z=b.z;p.h=6;p.vh=3;p.onG=false;p.inv=70;p.vx=b.face*2;
  if(!free){const L=p.layers;
    if(L.length){const top=L.pop();bw.ents.push({husk:true,id:top.id,shell:Math.max(1,top.shell>>1),max:top.max,weapon:top.weapon,x:clamp(b.x+b.face*48,bw.cam+12,bw.cam+W-12),z:b.z,face:b.face});say('IT DIGESTS YOUR BODY',b.x,b.z-60,C.mg,70);}
    else{p.core--;say('CORE HIT',p.x,p.z-26,C.mg,40);if(p.core<=0){p.core=0;bw.win=false;bw.endT=0;state='bover';}}}
  kick(5,.6);crunch(.3,.1);beep(160,.3,'square',.05,300);spark(b.x+b.face*16,b.z-16,16,['#c6ff4a',C.wh],3);
  if(b.st!=='dead'){b.st='dazed';b.t=80;}
}
function toadInside(){
  const p=bw.p,b=bw.boss;if(!b||b.type!=='toad'){p.inside=false;return;}
  p.x=b.x;p.z=b.z;p.h=0;p.vx=p.vz=0;
  const burst=P.sp||(P.a&&P.b)||(P.b&&bw.t-(p.lastA||-99)<6)||(P.a&&bw.t-(p.lastB||-99)<6);
  if(burst){b.hp-=FEEL.bosses.toadBurstDamage;b.hurt=8;say('BURST OUT',b.x,b.z-50,C.cy,50);nbDie(b);toadSpit(b,true);return;}
  if(P.b&&bw.t-(p.inHit||-99)>=FEEL.bosses.toadInsideRate){p.inHit=bw.t;const d=FEEL.bosses.toadInsideDamage;b.hp-=d;b.hurt=8;bw.last=b;p.pow=Math.min(100,p.pow+4);say('CRIT '+d,b.x+rnd(-8,8),b.z-36,C.mg,26);kick(3,.3);beep(1200,.06,'square',.04,-600);nbDie(b);}
}
function toadStep(b){
  const p=bw.p,dx=p.x-b.x;
  switch(b.st){
    case 'idle':b.face=dx<0?-1:1;b.hop=(b.hop||0)+1;if(b.hop%60<16&&Math.abs(dx)>50){b.x+=Math.sign(dx)*1.2;b.z=toward(b.z,p.z,.4);b.h=Math.sin((b.hop%60)/16*Math.PI)*6;}else b.h=0;
      if(--b.t<=0){b.h=0;const r=Math.random();if(r<.45){b.st='twind';b.t=32;beep(300,.5,'sine',.04,500);}else if(r<.75){b.st='fwind';b.t=30;}else if(bFoes().length<2){b.st='croak';b.t=40;beep(70,.6,'sawtooth',.05,-20);}else{b.st='twind';b.t=32;}}break;
    case 'twind':b.face=dx<0?-1:1;b.z=toward(b.z,p.z,.6);if(--b.t<=0){b.st='tongue';b.t=20;b.tl=0;}break;
    case 'tongue':{const out=b.t>10;b.tl=out?Math.min(112,b.tl+14):Math.max(0,b.tl-14);
      const tip=b.x+b.face*(18+b.tl);if(!p.inside&&p.inv<=0&&Math.abs(p.z-b.z)<6&&p.h<10&&(p.x-(b.x+b.face*16))*b.face>0&&(tip-p.x)*b.face>-pDim().hw){
        p.inside=true;p.x=b.x;p.z=b.z;p.h=0;p.vx=p.vz=0;p.atk=0;p.kind=null;p.grab=null;b.st='full';b.t=FEEL.bosses.toadSwallow;b.tl=0;say('GULP',b.x,b.z-56,C.mg,50);say('HIT IT FROM INSIDE',b.x,b.z-66,C.yl,90);beep(90,.4,'square',.06,-40);kick(4,.4);break;}
      if(--b.t<=0){b.st='idle';b.t=rnd(50,80)|0;}break;}
    case 'full':if(bw.t%10===0)kick(1,.1);if(--b.t<=0)toadSpit(b,false);break;
    case 'fwind':if(--b.t<=0){b.st='fair';b.t=70;b.vh=6;crunch(.2,.08);beep(400,.3,'square',.04,600);}break;
    case 'fair':b.h+=b.vh;b.vh=Math.max(0,b.vh-.15);if(b.t>18){b.x=toward(b.x,p.x,2.2);b.z=toward(b.z,p.z,1.2);}if(--b.t<=0)b.st='fland';break;
    case 'fland':b.h-=10;if(b.h<=0){b.h=0;nbHurt(b.x,b.z,24,8,14,16);nbSmash(b.x,b.z,22);spark(b.x,b.z,22,['#4a5a2a','#c6ff4a',C.wh],3.6);kick(8,.8);crunch(.4,.12);beep(50,.5,'sawtooth',.08,-20);bursts.push({x:Math.round(b.x-bw.cam),y:Math.round(b.z),t:14});b.st='dazed';b.t=100;}break;
    case 'dazed':if(--b.t<=0){b.st='idle';b.t=50;}break;
    case 'croak':if(b.t===18){for(const s of [-1,1]){const T0=TYPES.scrap,hp=Math.round(T0.hp*1.2);bw.ents.push({type:'scrap',T:T0,x:clamp(b.x+b.face*22+s*6,bw.cam+12,bw.cam+W-12),z:clamp(b.z+s*8,BZ0,BZ1),h:8,vh:2,vx:b.face,face:b.face,st:'air',t:0,hp,max:hp,dmg:8,hurt:0,walk:0,moving:false,boss:false,role:'attack',zo:0});}say('CROAK',b.x,b.z-50,C.gr,40);}if(--b.t<=0){b.st='idle';b.t=70;}break;
  }
  b.x=clamp(b.x,bw.cam+24,bw.cam+W-24);
}
function toadDraw(b,cam,hit){
  const x=Math.round(b.x-cam),z=Math.round(b.z),y=Math.round(b.z-b.h),f=b.face,body=hit?C.wh:'#3a5a2a',dark=hit?C.wh:'#1e3214',lite=hit?C.wh:'#6a8a3a',eye='#c6ff4a';
  nbShadow(x,z,b.h>20?Math.max(10,44-b.h/3):44);
  if(b.st==='fair'||b.st==='fland'){nbMarker(x,z,34);if(b.h>110)return;}
  const sq=b.st==='fwind'?3:b.st==='dazed'?2:0,full=b.st==='full',wob=full?Math.round(Math.sin(bw.t*.5)*2):0;
  for(let i=0;i<26-sq;i++){const k=i/(26-sq),w=Math.round(22*Math.sqrt(1-(1-k)*(1-k)*.8))+(full?3:0)+(i>18?2:0);px(x-w+wob,y-26+sq+i,w*2,1,i<2?lite:body);}
  px(x-22,y-4,44,4,dark);for(let i=-16;i<=16;i+=8)px(x+i,y-16+sq,1,1,lite);
  for(const s of [-1,1]){px(x+s*16-3,y-1,7,2,dark);px(x+s*20-2,y-1,5,1,body);}
  const ex=x+f*6;for(const s of [-8,4]){px(ex+s,y-31+sq,6,6,body);px(ex+s+1,y-30+sq,4,4,eye);px(ex+s+(f>0?3:1),y-29+sq,1,2,C.void);}
  for(let i=0;i<3;i++)px(x-6+i*5,y-35+sq,2,5,C.yl);
  const sac=b.st==='twind'?Math.round((32-b.t)/32*7):b.st==='croak'?((T>>2)&1)*4:0;if(sac){g.fillStyle=hit?C.wh:'#ff8aa0';for(let i=-sac;i<=sac;i++){const w=Math.round(Math.sqrt(sac*sac-i*i));g.fillRect(x+f*12-w,y-10+i,w*2,1);}}
  px(x+f*8-(f<0?10:0),y-14+sq,12,1,dark);
  if(b.st==='twind'&&(T>>2)&1)for(let xx=x+f*20;f>0?xx<x+f*134:xx>x+f*134;xx+=f*6)px(xx,z-1,3,2,C.yl);
  if(b.st==='tongue'&&b.tl>0){const tx=x+f*14;px(f>0?tx:tx-b.tl,y-12,b.tl,2,C.mg);px(f>0?tx+b.tl-2:tx-b.tl-2,y-14,5,5,'#ff8aa0');}
  if(full){px(x-4+wob,y-14,8,6,C.cyd);if((T>>3)&1)px(x-1+wob,y-12,2,2,C.cy);}
  if(b.st==='dazed'||b.st==='down')nbStars(x,y-38);
}
// --- the Cook: a giant's two hands come down from above; jump on its pan to hit the face peering in ---
function cookStep(b){
  const p=bw.p,restL=b.ax0+70,restR=b.ax0+190;
  b.peer=toward(b.peer,b.st==='pan'?1:0,.05);
  switch(b.st){
    case 'idle':b.lx=toward(b.lx,restL,1.5);b.lh=toward(b.lh,70,2);b.rx=toward(b.rx,restR,1.5);b.rh=toward(b.rh,70,2);
      if(--b.t<=0){const r=Math.random();if(r<.45){b.st='pwind';b.t=52;beep(140,.5,'sawtooth',.04,200);}else if(r<.8){b.st='kwind';b.t=34;b.chops=3;beep(900,.1,'square',.03,-200);}else{b.st='pepper';b.t=96;say('PEPPER',p.x,p.z-40,C.yl,40);}}break;
    case 'pwind':if(b.t>16){b.lx=toward(b.lx,p.x,2);b.lz=toward(b.lz,p.z,1);}b.lh=toward(b.lh,60,2);if(--b.t<=0)b.st='pslam';break;
    case 'pslam':b.lh-=10;if(b.lh<=0){b.lh=0;nbHurt(b.lx,b.lz,16,6,16,16);nbSmash(b.lx,b.lz,16);spark(b.lx,b.lz,18,[C.yl,C.gr,C.wh],3.4);kick(7,.7);crunch(.3,.12);beep(55,.4,'sawtooth',.08,-20);
      bw.plats=[{x0:b.lx-13,x1:b.lx+13,z0:b.lz-6,z1:b.lz+3,h:12}];b.st='pan';b.t=FEEL.bosses.cookPanTime;say('JUMP ON THE PAN',b.lx,b.lz-30,C.cy,70);}break;
    case 'pan':if(--b.t<=0){b.st='prise';bw.plats=[];p.plat=null;}break;
    case 'prise':b.lh=toward(b.lh,70,2.5);if(b.lh>=70){b.st='idle';b.t=rnd(40,70)|0;}break;
    case 'kwind':b.rx=toward(b.rx,p.x+(p.x<b.rx?10:-10),2.6);b.rz=toward(b.rz,p.z,1.4);b.rh=toward(b.rh,50,3);if(--b.t<=0)b.st='chop';break;
    case 'chop':b.rh-=12;if(b.rh<=0){b.rh=0;nbHurt(b.rx,b.rz,10,5,14,12);nbSmash(b.rx,b.rz,8);spark(b.rx,b.rz,10,[C.wh,C.gr],2.6);kick(4,.4);crunch(.2,.08);beep(300,.1,'square',.05,-200);b.st='stuck';b.t=26;}break;
    case 'stuck':if(--b.t<=0){if(--b.chops>0){b.st='kwind';b.t=16;}else b.st='krise';}break;
    case 'krise':b.rh=toward(b.rh,70,3);if(b.rh>=70){b.st='idle';b.t=rnd(40,70)|0;}break;
    case 'pepper':b.rx=toward(b.rx,p.x,2);b.rh=toward(b.rh,74,2);if(b.t%14===0)bw.strikes.push({x:clamp(p.x+rnd(-24,24),bw.cam+10,bw.cam+W-10),z:clamp(p.z+rnd(-6,6),BZ0,BZ1),t:36});if(--b.t<=0){b.st='idle';b.t=60;}break;
  }
  b.x=b.lx;b.z=b.lz;
}
function cookDraw(b,cam,hit){
  const glove=hit?C.wh:'#e8dcc0',gd=hit?C.wh:'#b8ac90',sleeve='#f2f7ff';
  // the face peering in over the top edge
  if(b.peer>.05){const fx=Math.round(b.lx-cam),fy=Math.round(-26+b.peer*34);px(fx-22,fy-14,44,12,sleeve);px(fx-18,fy-20,36,8,sleeve);px(fx-20,fy-2,40,10,hit?C.wh:'#e0a878');
    for(const s of [-9,5]){px(fx+s,fy+1,6,5,C.wh);px(fx+s+2,fy+2,3,3,C.void);}px(fx-6,fy+8,12,2,'#8a5a3c');}
  const hand=(hx,hh,hz,kind)=>{const x=Math.round(hx-cam),y=Math.round(hz-hh);
    nbShadow(x,hz,Math.max(8,26-hh/4));
    px(x-5,0,10,Math.max(0,y-16),sleeve);px(x-6,Math.max(0,y-20),12,4,gd);
    px(x-8,y-16,16,12,glove);px(x-8,y-16,16,1,C.wh);for(let i=0;i<4;i++)px(x-8+i*4,y-5,3,3,glove);
    if(kind==='pan'){px(x-14,y-3,28,3,C.grx);px(x-12,y-4,24,1,C.grd);}
    else{px(x-1,y-4,3,4,C.grd);px(x-1,y,3,12,C.wh);px(x,y,1,12,'#9aa8b8');}};
  if(b.st==='pwind')nbMarker(b.lx-cam,b.lz,28);if(b.st==='kwind')nbMarker(b.rx-cam,b.rz,14);
  hand(b.lx,b.lh,b.lz,'pan');hand(b.rx,b.rh,b.rz,'knife');
  if(b.st==='down')nbStars(Math.round(b.lx-cam),Math.round(b.lz)-24);
}
const NB={
  knight:{drop:{id:'walker',shell:80,max:110,say:'ITS EMPTY ARMOUR: WALKER'},
    init(b){b.key=100;b.st='walk';b.t=80;b.face=-1;b.walk=0;},
    c:b=>({x:b.x,z:b.z}),box:b=>[{x:b.x,z:b.z,hw:10,dz:7}],
    mult(b,o){if(o.sky||o.force)return 1;if((bw.p.x-b.x)*b.face<0){b.key=Math.max(0,b.key-FEEL.bosses.knightKeyHit);return 1.5;}return b.st==='dizzy'?1.5:.5;},
    hook(b){b.key=0;nbDown(b,200,'KEY PULLED');return true;},up(b){b.key=100;b.st='walk';b.t=50;say('REWOUND',b.x,b.z-50,C.gr,50);beep(400,.5,'square',.03,600);},
    step:knightStep,draw:knightDraw},
  crab:{drop:{id:'titan',shell:100,max:140,say:'ITS DREAM SHELL: TITAN'},
    init(b,x0){b.shell='e:walker';b.shp=b.smax=FEEL.bosses.crabShell;b.st='walk';b.t=80;b.face=-1;b.walk=0;
      bw.ents.push({husk:true,id:'e:scrap',shell:30,max:39,x:x0+110,z:116,face:1},{husk:true,id:'e:lancer',shell:40,max:46,x:x0+60,z:134,face:1});},
    c:b=>({x:b.x,z:b.z}),box:b=>[{x:b.x,z:b.z,hw:17,dz:7}],
    mult:b=>b.shell?1:1.5,
    onHit(b,dd,o){if(!b.shell)return false;const front=(bw.p.x-b.x)*b.face>0&&!o.sky&&!o.air,sd=front?Math.ceil(dd/2):dd;b.shp-=sd;
      spark(b.x,b.z-22,6,[C.gr,C.wh],1.8);say((front?'CLANG ':'')+sd,b.x,b.z-36,C.gr,26);beep(front?1400:600,.05,'square',.03);if(b.shp<=0)crabCrack(b);return true;},
    hook(b){if(b.shell){crabCrack(b,'HOOKED: SHELL OFF');return true;}return toppleBoss('hook');},
    up(b){b.st=b.shell?'walk':'seek';b.t=40;},step:crabStep,draw:crabDraw},
  crane:{drop:{id:'e:brute',shell:64,max:64,say:'THE OPERATOR CLIMBS OUT'},
    init(b,x0){b.ax0=x0+14;b.ax1=x0+242;b.x=x0+150;b.z=124;b.h=58;b.st='track';b.t=90;},
    c:b=>({x:b.x,z:b.z}),box:b=>b.st==='down'?[{x:b.x,z:b.z,hw:14,dz:8}]:b.h<14?[{x:b.x,z:b.z,hw:10,dz:6}]:[],
    downStep(b){b.h=toward(b.h,0,6);},up(b){b.st='mrise';},
    topple(b){if(b.carry){const o=b.carry;b.carry=null;o.x=b.x;o.z=b.z;o.h=0;if(o.bomb!==undefined){o.st='rest';bw.heads.push(o);}else bw.ents.push(o);}nbDown(b,160,'THE CAB CRASHES');return true;},
    step:craneStep,draw:craneDraw},
  toad:{drop:{id:'brute',shell:70,max:70,say:'IT COUGHS UP A BRUTE FRAME'},
    init(b,x0){b.x=x0+170;b.z=124;b.h=0;b.st='idle';b.t=70;b.face=-1;b.tl=0;},
    c:b=>({x:b.x,z:b.z}),box:b=>b.h>20?[]:[{x:b.x,z:b.z,hw:20,dz:8}],
    hook(b){if(b.st==='tongue'||b.st==='twind'){nbDown(b,190,'TONGUE PULLED');return true;}return toppleBoss('hook');},
    topple(b){if(b.st==='full')toadSpit(b,true);b.h=0;nbDown(b,150,'BURP');return true;},
    up(b){b.st='idle';b.t=50;},step:toadStep,draw:toadDraw},
  cook:{drop:{id:'walker',shell:90,max:110,say:'IN ITS SLEEVE: A WALKER FRAME'},
    init(b,x0){b.ax0=x0;b.lx=x0+70;b.lz=124;b.lh=70;b.rx=x0+190;b.rz=124;b.rh=70;b.peer=0;b.st='idle';b.t=80;b.x=b.lx;b.z=b.lz;},
    c:b=>({x:b.lx,z:b.lz}),
    box(b){const o=[];if(b.lh<4)o.push({x:b.lx,z:b.lz,hw:12,dz:6});if(b.rh<4)o.push({x:b.rx,z:b.rz,hw:8,dz:5});if(b.peer>.6)o.push({x:b.lx,z:bw.p.z,hw:18,dz:30,hi:10,m:2});return o;},
    topple(b){bw.plats=[];bw.p.plat=null;b.lh=0;nbDown(b,160,'THE HAND IS DOWN');return true;},
    downStep(b){b.lh=toward(b.lh,0,8);b.peer=toward(b.peer,0,.05);},up(b){b.st='prise';},
    step:cookStep,draw:cookDraw}
};

// ---------- the Matryoshka Zombie: nested shells, each one smaller and angrier; calls lightning ----------
const MSH=[0,{h:26,w:16,hp:60},{h:36,w:22,hp:85},{h:48,w:30,hp:110}];
const matryDim=b=>{const m=MSH[b.layer];return{hw:m.w/2,ht:m.h,dz:5+b.layer};};
const DOLLPAL={body:'#b0103c',scarf:'#5a0a2a',face:'#cfe8c8',flower:C.yl,line:'#2a0318',apron:'#d8406a'};
function drawDollShape(x,fy,sc,face,P,o={}){
  // a hexagonal nested doll: hex head on a bigger hex body, scarf, hex face, hex apron with painted flowers
  const m=MSH[sc],H=m.h,Wd=m.w,headCy=fy-H+Math.round(H*.22),headR=Math.round(Wd*.36),bodyCy=fy-Math.round(H*.32),bodyRy=Math.round(H*.32),bodyRx=Math.round(Wd/2);
  const hexW=(dy,r,wm)=>Math.abs(dy)>r?-1:Math.round(wm*(1-.5*Math.abs(dy)/r));
  const top=o.headless?fy-Math.round(H*.6):fy-H;
  for(let y=top;y<=fy;y++){
    const wb=hexW(y-bodyCy,bodyRy,bodyRx),wh=o.headless?-1:hexW(y-headCy,headR,Math.round(headR*1.15)),w=Math.max(wb,wh);
    if(w<0)continue;
    const edge=(wb>=0&&Math.abs(y-bodyCy)===bodyRy&&wb>=wh)||(wh>=0&&Math.abs(y-headCy)===headR&&wh>wb);
    px(x-w,y,w*2+1,1,P.line);if(edge)continue;
    if(w>1)px(x-w+1,y,w*2-1,1,wh>=wb&&!o.headless?P.scarf:P.body);
  }
  px(x-bodyRx+1,bodyCy-2,bodyRx*2-1,1,P.line);
  if(!o.headless){
    const fr=Math.max(3,headR-2),fcy=headCy+1;
    for(let y=-fr+1;y<fr;y++){const w=Math.round(fr*.85*(1-.5*Math.abs(y)/fr));px(x-w+face,fcy+y,w*2+1,1,P.face);}
    const ex1=x-Math.round(fr*.4)+face,ex2=x+Math.round(fr*.4)+face,ey=fcy-1;
    if(o.zombie){px(ex1-1,ey-1,1,1,P.line);px(ex1+1,ey+1,1,1,P.line);px(ex1,ey,1,1,P.line);px(ex1+1,ey-1,1,1,P.line);px(ex1-1,ey+1,1,1,P.line);}
    else px(ex1,ey,1,1,P.line);
    px(ex2,ey,2,2,o.glow?((T>>1)&1?C.wh:C.cy):(o.zombie?C.yl:P.line));
    px(x-2+face,fcy+Math.round(fr*.5),5,1,P.line);if(o.zombie)for(let i=0;i<3;i++)px(x-2+face+i*2,fcy+Math.round(fr*.5)-1,1,3,P.line);
  }
  const ar=Math.max(3,Math.round(bodyRx*.6)),acy=bodyCy+2;
  for(let y=-ar;y<=ar;y++){const w=Math.round(ar*.8*(1-.5*Math.abs(y)/ar));px(x-w,acy+y,w*2+1,1,P.apron);}
  px(x,acy-1,1,1,P.flower);px(x-1,acy,3,1,P.flower);px(x,acy+1,1,1,P.flower);px(x-ar+2,acy+2,1,1,P.flower);px(x+ar-2,acy-2,1,1,P.flower);
  if(o.cracks){for(let i=0;i<o.cracks;i++){let cx=x-bodyRx+4+i*6,cy=bodyCy-bodyRy+4;for(let k=0;k<6;k++){px(cx,cy,1,1,P.line);cx+=((k+i)%2?1:-1);cy++;}}}
  return{top,headCy};
}
function matryStrikes(b){
  const p=bw.p,n=b.layer===3?2:b.layer===2?3:4;
  for(let i=0;i<n;i++){const ox=i===0?0:rnd(-34,34),oz=i===0?0:rnd(-10,10);bw.strikes.push({x:clamp(p.x+ox,bw.cam+10,bw.cam+W-10),z:clamp(p.z+oz,BZ0,BZ1),t:44+i*6,bolt:true});}
  beep(120,.6,'sawtooth',.04,400);glitch=Math.max(glitch,.4);
}
function matryPop(b){
  // the shell splits in half and a smaller doll climbs out
  const m=MSH[b.layer];
  for(const side of [-1,1]){parts.push({x:b.x+side*4,y:b.z-m.h*.7,vx:side*rnd(1.2,2),vy:-2.4,t:50,c:DOLLPAL.body,gv:.14,s:6});parts.push({x:b.x+side*6,y:b.z-m.h*.4,vx:side*rnd(1,1.8),vy:-1.8,t:46,c:DOLLPAL.apron,gv:.14,s:4});}
  spark(b.x,b.z-m.h/2,24,[C.yl,C.wh,DOLLPAL.body],3.4);kick(6,.8);crunch(.4,.12);beep(90,.6,'sawtooth',.06,120);
  b.layer--;b.lhp=MSH[b.layer].hp;b.st='pop';b.t=46;bw.strikes=bw.strikes.filter(s=>!s.bolt);
  say(b.layer===1?'THE LAST DOLL':'ANOTHER ONE INSIDE',b.x,b.z-60,C.yl,70);
}
function stepMatry(b){
  const p=bw.p,pd=pDim(),D=matryDim(b),dx=p.x-b.x,dz=p.z-b.z,ad=Math.abs(dx);
  const sp=.42+.18*(3-b.layer),reach=D.hw+pd.hw+10;
  b.wob=(b.wob||0)+.12+.04*(3-b.layer);
  switch(b.st){
    case 'idle':case 'walk':
      b.st='walk';if(b.st==='walk'&&!(b.t>0))b.t=0;
      b.face=dx<0?-1:1;
      if(ad>reach-4){b.x+=Math.sign(dx)*sp;b.moving=true;}else b.moving=false;
      if(Math.abs(dz)>1)b.z=clamp(b.z+Math.sign(dz)*sp*.7,BZ0,BZ1);
      if(b.t>0)b.t--;
      if(--b.castT<=0){b.st='cast';b.t=50;b.castT=200-40*(3-b.layer);break;}
      if(ad<=reach&&Math.abs(dz)<6&&b.t<=0){b.st='wind';b.t=Math.max(14,30-6*(3-b.layer));beep(140,.3,'sawtooth',.04,120);}
      break;
    case 'wind':if(--b.t<=0){b.st='lurch';b.t=12;crunch(.15,.06);}break;
    case 'lurch':
      b.x+=b.face*(1.6+.4*(3-b.layer));
      if(b.t===6){const a0=b.face>0?b.x:b.x-D.hw-20,a1=b.face>0?b.x+D.hw+20:b.x;if(p.x+pd.hw>a0&&p.x-pd.hw<a1&&Math.abs(dz)<pd.dz+4&&p.h+(pd.hov||0)<D.ht*.6)bHurt(12+3*(3-b.layer),b);kick(4,.4);crunch(.2,.08);spark(b.x+b.face*D.hw,b.z,8,[C.gr,C.yl],2);}
      if(--b.t<=0){b.st='down';b.t=42-8*(3-b.layer);}
      break;
    case 'down':if(--b.t<=0){b.st='walk';b.t=rnd(20,50)|0;}break;
    case 'cast':if(b.t===40)matryStrikes(b);if(--b.t<=0){b.st='walk';b.t=20;}break;
    case 'pop':if(--b.t<=0){b.st='walk';b.t=30;b.castT=60;}break;
    case 'dead':
      if(b.t%6===0){spark(b.x+rnd(-10,10),b.z-rnd(4,20),8,[DOLLPAL.body,C.yl,C.wh],2.6);crunch(.08,.05);}
      if(--b.t<=0){bw.score+=3000;bw.boss=null;bw.strikes=[];bw.ents.push({husk:true,id:'doll',shell:60,max:70,x:b.x,z:b.z,face:1});say('ITS SMALLEST SHELL: THE DOLL',b.x,80,C.cy,90);
        bw.nestOK=true;banner={s:'NESTING UNLOCKED',t:150};say('CLIMB INTO A BIGGER BODY TO NEST',b.x,100,C.yl,150);[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.04),i*90));}
      break;
  }
  b.x=clamp(b.x,bw.cam+16,bw.cam+W-16);
}
function matryHit(x0,x1,dz,d,o){
  const b=bw.boss,p=bw.p;if(['pop','dead'].includes(b.st))return false;
  const D=matryDim(b);if(b.x+D.hw<x0||b.x-D.hw>x1||(!o.sky&&Math.abs(b.z-p.z)>dz+D.dz-2))return false;
  if(b.st==='down')d=Math.round(d*1.5);
  b.lhp-=d;b.hp=Math.max(0,b.hp-d);b.hurt=8;bw.last=b;hitstop=o.heavy?FEEL.combat.hitstopHeavy:FEEL.combat.hitstopLight;p.pow=Math.min(100,p.pow+FEEL.combat.powerPerHit);p.hits=p.hitT>0?p.hits+1:1;p.hitT=90;bw.score+=10*Math.min(p.hits,10);
  spark(b.x,b.z-D.ht*.5,o.heavy?12:7,[C.yl,DOLLPAL.body,C.wh],2.4);say(String(d),b.x,b.z-D.ht-8,C.yl,26);kick(o.heavy?4:2,o.heavy?.5:.2);beep(o.heavy?120:300,.1,'square',.06,-80);crunch(o.heavy?.15:.07,o.heavy?.09:.05);
  if(b.lhp<=0){if(b.layer>1)matryPop(b);else{b.hp=0;b.st='dead';b.t=90;b.layer=1;}}
  return true;
}
function drawMatry(cam){
  const b=bw.boss,x=Math.round(b.x-cam),D=matryDim(b);
  g.globalAlpha=.4;px(x-D.hw-2,b.z-1,D.hw*2+4,3,C.void);g.globalAlpha=1;
  if(b.st==='dead'&&(T>>1)&1)return;
  let lean=0,yo=0;
  if(b.moving)lean=Math.round(Math.sin(b.wob)*1.5);
  if(b.st==='wind')lean=-b.face*2;
  if(b.st==='lurch')lean=b.face*4;
  if(b.st==='down'){yo=Math.round(D.ht*.25);lean=b.face*3;}
  if(b.st==='pop'){yo=Math.round(Math.max(0,b.t-24)*1.2);}
  const P=b.hurt>0&&(b.hurt&2)?{body:C.wh,scarf:C.wh,face:C.wh,flower:C.wh,line:C.wh,apron:C.wh}:DOLLPAL;
  drawDollShape(x+lean,b.z+yo,b.layer,b.face,P,{zombie:true,glow:b.st==='cast',cracks:b.lhp<MSH[b.layer].hp*.5?2:0});
  if(b.st==='cast'&&(T>>1)&1)for(let i=0;i<5;i++){const a=rnd(0,6.28),r=D.hw+4;px(x+Math.cos(a)*r,b.z-D.ht*.6+Math.sin(a)*r*.6,1,3,C.cy);}
  if(b.st==='down')for(let i=0;i<3;i++){const a=T*.18+i*2.1;px(x+Math.cos(a)*7,b.z-D.ht+yo-4+Math.sin(a)*2,1,1,C.yl);}
}
// lightning bolts (the boss's strikes, and the Doll's special)
function drawBolt(x,z){
  let bx=x+rnd(-6,6),by=-4;const pts=[[bx,by]];while(by<z){by+=rnd(8,16);bx+=rnd(-7,7)+(x-bx)*.3;pts.push([bx,Math.min(by,z)]);}
  for(let i=0;i<pts.length-1;i++){const [x0,y0]=pts[i],[x1,y1]=pts[i+1],n=Math.ceil(Math.hypot(x1-x0,y1-y0));for(let k=0;k<=n;k++){px(x0+(x1-x0)*k/n-1,y0+(y1-y0)*k/n,3,1,'#9fdcff');px(x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,1,1,C.wh);}}
}

// ======================= v3.0: vector art in the language of The Binding of Isaac =======================
// heavy dark outlines, rounded shapes, one cel-shade band, a highlight blob; paper notes; chunky letters
const VS=4,vcan=document.createElement('canvas');vcan.width=W*VS;vcan.height=H*VS;let vc=vcan.getContext('2d');
const INK='#160e10';
const RR=(x,y,w,h,r)=>{const p=new Path2D();w=Math.max(.3,w);h=Math.max(.3,h);p.roundRect(x,y,w,h,Math.max(0,Math.min(r??Math.min(w,h)*.35,w/2,h/2)));return p;};
const EL=(cx,cy,rx,ry,rot=0)=>{const p=new Path2D();p.ellipse(cx,cy,Math.max(.2,rx),Math.max(.2,ry),rot,0,6.2832);return p;};
const CAP=(x0,y0,x1,y1,r)=>{const L=Math.hypot(x1-x0,y1-y0),a=Math.atan2(y1-y0,x1-x0),q=new Path2D();q.roundRect(-r,-r,L+2*r,2*r,r);const p=new Path2D();p.addPath(q,new DOMMatrix().translateSelf(x0,y0).rotateSelf(a*57.2958));return p;};
const POLY=pts=>{const p=new Path2D();p.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)p.lineTo(pts[i],pts[i+1]);p.closePath();return p;};
// the Isaac look: shade colour underneath, base colour shifted up-left inside the shape, highlight, outline
function ish(p,b,s,o={}){
  vc.save();vc.fillStyle=s;vc.fill(p);vc.clip(p);vc.translate(o.sx??-.9,o.sy??-1.2);vc.fillStyle=b;vc.fill(p);vc.restore();
  if(o.hi){vc.save();vc.clip(p);vc.globalAlpha=.4;vc.fillStyle='#fff';vc.fill(EL(...o.hi));vc.restore();}
  if(o.lw!==0){vc.lineWidth=o.lw||1.1;vc.strokeStyle=o.ink||INK;vc.stroke(p);}
}
const vfill=(p,c)=>{vc.fillStyle=c;vc.fill(p);};
const vline=(pts,w,c)=>{vc.beginPath();vc.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)vc.lineTo(pts[i],pts[i+1]);vc.lineWidth=w;vc.strokeStyle=c||INK;vc.stroke();};
const dot=(x,y,r,c)=>{vc.fillStyle=c;vc.beginPath();vc.arc(x,y,Math.max(.1,r),0,6.2832);vc.fill();};
const odot=(x,y,r,c)=>{dot(x,y,r+.45,INK);dot(x,y,r,c);};
function vfont(sz){return LANG==='he'?`${sz}px "Secular One", sans-serif`:`700 ${sz}px Silkscreen, monospace`;}
function vtext(s,x,y,sz,col,al='c',ink=INK,lw){
  s=tr(String(s));vc.font=vfont(sz);vc.textAlign=al==='l'?'left':al==='r'?'right':'center';vc.textBaseline='middle';vc.direction=LANG==='he'?'rtl':'ltr';
  if(ink){vc.lineJoin='round';vc.lineWidth=lw??Math.max(.9,sz*.3);vc.strokeStyle=ink;vc.strokeText(s,x,y);}
  vc.fillStyle=col;vc.fillText(s,x,y);
}
function vwrap(s,maxW,sz){s=tr(String(s));vc.font=vfont(sz);const words=s.split(' '),lines=[];let cur='';for(const w of words){const t=cur?cur+' '+w:w;if(vc.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;}else cur=t;}if(cur)lines.push(cur);return lines;}
// palettes: b base, s shade, d deep shade, a accent stripe, r rivets, m mechanical dark parts
const IP={
  me:{b:'#d9c9a3',s:'#a08b60',d:'#6f5f42',a:'#efbe4b',r:'#c9473a',m:'#5d5042'},
  foe:{b:'#e99c9a',s:'#ad5961',d:'#743640',a:'#f2c04e',r:'#7a1a28',m:'#5a2731'},
  maker:{b:'#eac76c',s:'#aa8430',d:'#74581f',a:'#c9473a',r:'#6e4310',m:'#5e4518'},
  husk:{b:'#b8b1a6',s:'#7d776e',d:'#5a554e',a:'#9b9580',r:'#5b5650',m:'#4c4843'},
  hit:{b:'#ffffff',s:'#e8e8e8',d:'#d0d0d0',a:'#fff',r:'#fff',m:'#ddd'},
  warn:{b:'#ffe48e',s:'#dba93c',d:'#a77a1e',a:'#fff',r:'#c9473a',m:'#a07020'},
  core:{b:'#a9e4df',s:'#5d9e9b'}
};
function ip(pal){
  if(!pal)return IP.me;if(pal.b&&pal.s)return pal;
  if(pal===PAL.foe)return IP.foe;if(pal===PAL.maker)return IP.maker;
  if(pal===PAL.hit||pal===FP.hit)return IP.hit;if(pal===PAL.warn||pal===FP.warn)return IP.warn;
  if(pal===PAL.husk||pal===FP.husk||(typeof HPAL!=='undefined'&&pal===HPAL))return IP.husk;
  return IP.me;
}
// ---------- Onion Head's core: cyan shell, yellow eye, sprout on top ----------
function vCore(x,y,face,mood='',eyeOn=true){
  const cx=x+4,sw=Math.sin(T*.08)*.22;
  for(const [a,l,c] of [[-.55,3.6,'#6fae4c'],[.05,5.6,'#8ccf5a'],[.6,4,'#6fae4c']]){vc.save();vc.translate(cx+.4,y+.7);vc.rotate(a+sw);ish(EL(0,-l/2,1.05,l/2),c,'#4b7d32',{lw:.75});vc.restore();}
  odot(cx+.4+Math.sin(.05+sw)*5.6,y+.7-Math.cos(.05+sw)*5.6,.55,'#f28ba2');
  ish(RR(x-1.3,y+2.4,1.8,2.6,.7),IP.core.b,IP.core.s,{lw:.75});ish(RR(x+7.5,y+2.4,1.8,2.6,.7),IP.core.b,IP.core.s,{lw:.75});
  ish(RR(x,y,8,7,2.4),IP.core.b,IP.core.s,{hi:[x+2.3,y+1.6,1.7,.9,-.4]});
  const ex=cx+face*1.1,ey=y+3.7;
  if(!eyeOn||(mood!=='angry'&&mood!=='hurt'&&T%200<6)){vline([ex-1.4,ey,ex+1.4,ey],.75);return;}
  ish(EL(ex,ey,1.9,1.9),'#ffd84a','#d9a42a',{lw:.75});
  if(mood==='hurt'){vline([ex-1,ey-1,ex+1,ey+1],.6);vline([ex+1,ey-1,ex-1,ey+1],.6);}
  else{dot(ex+face*.55,ey+.2,.9,INK);dot(ex+face*.55-.35,ey-.25,.32,'#fff');}
  if(mood==='angry')vline([ex-face*1.9,ey-3,ex+face*1.7,ey-2.1],.8);
  else if(mood==='curious'){vc.beginPath();vc.arc(ex,ey-.6,2.5,Math.PI*1.15,Math.PI*1.85);vc.lineWidth=.6;vc.strokeStyle=INK;vc.stroke();}
  else if(mood==='idle'){vc.save();vc.clip(EL(ex,ey,1.9,1.9));vfill(RR(ex-2.2,ey-2.2,4.4,2.1,0),IP.core.s);vc.restore();vline([ex-1.9,ey-.1,ex+1.9,ey-.1],.6);}
}
function vDomes(x,y,P){ish(EL(x-.9,y+3.8,1.6,2.1),P.b,P.s,{lw:.8});ish(EL(x+8.9,y+3.8,1.6,2.1),P.b,P.s,{lw:.8});}
// ---------- rigs: chubby rounded mech bodies for frames and robots ----------
function vRig(x,fy,s,face,ph,moving,atk,P,o={}){
  atk=atk===true?1:(atk||0);
  const lw=Math.max(2,s.lw||3),sw=moving?Math.sin(ph):0,cw=moving?Math.cos(ph):0,stride=Math.max(1,s.lh/4),sx=sw*stride,lift=Math.max(1,s.lh/5);
  const liftA=cw>.35?lift*cw:0,liftB=cw<-.35?-lift*cw:0,bob=moving?Math.abs(sw)*.8:0;
  const lean=(atk===2||atk===3)?1:0,tw=s.tw,th=s.th,top=fy-s.lh-th+bob,pelY=fy-s.lh+bob,aw=s.aw,ah=s.ah;
  vc.save();vc.translate(x,0);vc.scale(face,1);
  const leg=(lx,lv,back,front)=>{const b=back?P.s:P.b,s2=back?P.d:P.s,L=s.lh+1,t2=Math.max(2,L*.5),kx=o.knee?-1.3:0;
    ish(RR(lx,pelY+.5,lw+1.4,t2,1.2),b,s2,{lw:.9});
    if(front&&o.stripe&&t2>=5)vfill(RR(lx+.7,pelY+2.3,lw,1.4,.5),P.a);
    const shY=pelY+t2-1.2,shH=Math.max(2,fy-lv-2.2-shY);
    ish(RR(lx+kx,shY,lw+1.4,shH,1.2),b,s2,{lw:.9});
    odot(lx+kx+(lw+1.4)/2,shY+.3,.6,P.m);
    ish(RR(lx+kx-1.2,fy-lv-2.9,lw+4.6,2.9,1.4),b,s2,{lw:.9});};
  const lb=-tw/2+1+sx,lf=tw/2-lw-2-sx;
  leg(lf,liftB,true,false);
  const armY=top+Math.max(2,th*.18);
  if(o.pad){const pw=aw+3+o.pad,ph2=th*.95+o.pad*2,px0=-tw/2-pw+3,py0=top-1-o.pad/2;ish(RR(px0,py0,pw,ph2,2.4),P.s,P.d);
    odot(px0+1.6,py0+1.6,.5,P.r);odot(px0+1.6,py0+ph2-1.6,.5,P.r);
    if(o.vent&&pw>=8){ish(RR(px0+2,py0+ph2*.55,pw-4,ph2*.28,1),P.m,INK,{lw:.7});for(let i=0;i<3;i++)vline([px0+3+i*1.6,py0+ph2*.6,px0+3+i*1.6,py0+ph2*.78],.5,P.s);}}
  if(atk!==2){ish(CAP(-tw/2+1,armY+1,-tw/2+.5,armY+ah*.85,aw/2+.3),P.s,P.d,{lw:.9});ish(RR(-tw/2-aw/2-.5,armY+ah*.75,aw+2,3,1.2),P.s,P.d,{lw:.9});}
  ish(RR(-tw/2+2,pelY-1.2,tw-4,3,1.3),P.m,INK,{lw:.8});
  leg(lb,liftA,false,true);
  const tx=-tw/2+lean;
  ish(RR(tx,top,tw,th,Math.min(4,th*.38)),P.b,P.s,{hi:[tx+tw*.32,top+th*.26,tw*.24,th*.13,-.3]});
  vfill(RR(tx+tw*.22,top-.6,tw*.56,1.9,.9),P.m);
  if(tw>=10){
    odot(tx+tw-2.3,top+th*.42,.65,P.r);odot(tx+tw-2.3,top+th*.42+2.4,.65,P.r);
    const sy=top+th*.66;vline([tx+1.8,sy,tx+tw*.62,sy],.55);for(let k=tx+2.6;k<tx+tw*.6;k+=1.7)vline([k,sy-.7,k,sy+.7],.45);
  }else odot(tx+tw-2,top+th*.45,.55,P.r);
  if(o.chestStripe&&th>=10)vfill(RR(tx+1.2,top+th-3.8,tw-2.4,1.6,.7),P.a);
  // front arm, by attack mode; fists are chunky rounded blocks
  const fist=o.fist||0,fs=aw+2+fist;
  const fistAt=(cx,cy)=>{ish(RR(cx-fs/2,cy-fs*.45,fs,fs*.9,fs*.32),P.b,P.s,{lw:.9});vline([cx-fs*.25,cy-fs*.1,cx-fs*.25,cy+fs*.3],.45);vline([cx+fs*.1,cy-fs*.1,cx+fs*.1,cy+fs*.3],.45);};
  const shX=tx+tw-aw*.4;let hx,hy;
  if(atk===1){ish(CAP(shX,armY+1.5,shX+ah,armY+1.5,aw/2+.35),P.b,P.s,{lw:.9});fistAt(shX+ah+fs*.3,armY+1.5);hx=shX+ah+fs*.4;hy=armY+1.5;}
  else if(atk===2){ish(CAP(shX-1,armY+1,shX-1.5,armY+ah*.55,aw/2+.3),P.b,P.s,{lw:.9});ish(CAP(tx+tw-3,armY+3,tx+tw-2+ah,armY+3,aw/2+.3),P.s,P.d,{lw:.9});fistAt(tx+tw-1+ah+fs*.3,armY+3);hx=tx+tw+ah+fs*.4;hy=armY+3;}
  else if(atk===3){ish(CAP(shX,armY,shX+.5,armY-ah+3,aw/2+.35),P.b,P.s,{lw:.9});fistAt(shX+.5,armY-ah+1.5);hx=shX+.5;hy=armY-ah;}
  else if(atk===4){ish(CAP(shX+1.5,armY+ah*.55,shX+2,armY-2.5,aw/2+.5),P.b,P.s,{lw:.9});hx=shX+2.5;hy=armY-2;}
  else if(atk===5){ish(CAP(shX-1,armY,tx-1,armY+ah*.7,aw/2+.35),P.b,P.s,{lw:.9});fistAt(tx-1.5,armY+ah*.75);hx=tx-1.5;hy=armY+ah*.75;}
  else{const sw2=moving?sw*Math.max(1,ah/6):0;ish(CAP(shX,armY+1,shX-sw2*.4,armY+ah*.62-sw2,aw/2+.3),P.b,P.s,{lw:.9});fistAt(shX-sw2*.5,armY+ah-sw2*.9);hx=shX-sw2*.5;hy=armY+ah+1-sw2;}
  ish(EL(shX,armY,aw*.75+.6,aw*.62+.6),P.b,P.s,{lw:.9,hi:[shX-.6,armY-.8,aw*.3,aw*.2,0]});
  if(o.stripe)vfill(RR(shX-aw*.55,armY-.4,aw*1.1,1.1,.5),P.a);
  vc.restore();
  return{topY:top,hx:x+face*hx,hy,lean:face*lean};
}
const VFOPT={basic:{},brute:{pad:2,stripe:1,fist:2},walker:{knee:1,stripe:1},titan:{pad:4,vent:1,stripe:1,fist:1,chestStripe:1},king:{pad:8,vent:1,stripe:1,fist:2,chestStripe:1}};
// ---------- robot heads: round box, one big staring eye, stitched mouth, antenna ----------
function vHead(hx,hy,w,h,face,P,eyeOn,type){
  vc.save();vc.translate(hx+w/2,0);vc.scale(face,1);const x0=-w/2;
  vline([0,hy,0,hy-3.2],.8);odot(0,hy-3.6,.9,P.r);
  ish(RR(x0,hy,w,h,Math.min(w,h)*.42),P.b,P.s,{hi:[x0+w*.3,hy+h*.28,w*.2,h*.14,-.3]});
  if(type==='walker'){ish(RR(x0+1.3,hy+1.3,w-2.6,h*.55,1.2),'#3a4a5a','#202a34',{lw:.7});dot(x0+w-3.2,hy+2.6,.7,eyeOn?'#ffd84a':'#666');}
  else if(type==='makercore'){ish(EL(x0+w/2+.8,hy+h*.48,h*.36,h*.36),'#fff3c4','#d9b45a',{lw:.8});dot(x0+w/2+1.2,hy+h*.5,h*.16,eyeOn?'#c9473a':INK);}
  else{const er=Math.max(1.4,Math.min(w,h)*.3),ex=x0+w*.64,ey=hy+h*.42;
    ish(EL(ex,ey,er,er),'#fbf6ee','#d8cfc2',{lw:.8});
    if(eyeOn){dot(ex+er*.35,ey+.2,er*.45,INK);dot(ex+er*.2,ey-.35,er*.15,'#fff');}else vline([ex-er*.8,ey,ex+er*.8,ey],.6);
    const my=hy+h*.78;vline([x0+w*.3,my,x0+w*.82,my],.55);for(let k=x0+w*.36;k<x0+w*.8;k+=1.4)vline([k,my-.6,k,my+.6],.4);}
  vc.restore();
}
function vStars(cx,cy){for(let i=0;i<3;i++){const a=T*.15+i*2.1,x=cx+Math.cos(a)*5,y=cy+Math.sin(a)*1.6;const p=new Path2D();for(let k=0;k<10;k++){const r=k%2?.6:1.5,aa=k*Math.PI/5-Math.PI/2;k?p.lineTo(x+Math.cos(aa)*r,y+Math.sin(aa)*r):p.moveTo(x+Math.cos(aa)*r,y+Math.sin(aa)*r);}p.closePath();ish(p,'#ffd84a','#d9a42a',{lw:.5});}}
// ---------- robots ----------
function vHound(e,x,fy,P){
  const f=e.face,w=e.walk||0,st=(e.st==='atk'),ph=Math.sin(w*.5);
  vc.save();vc.translate(x,0);vc.scale(f,1);
  for(const [lx,back] of [[-8,1],[4,1],[-6,0],[6,0]]){const k=(back?-1:1)*ph*1.5;ish(CAP(lx,fy-7,lx+k,fy-1.4,1.3),back?P.s:P.b,back?P.d:P.s,{lw:.8});}
  ish(RR(-12,fy-14,22,8,4),P.b,P.s,{hi:[-6,fy-12,4,1.2,0]});
  for(let k=-8;k<6;k+=3)odot(k,fy-14,.45,P.r);
  vline([-12,fy-12,-15,fy-16],.8);odot(-15.3,fy-16.5,.8,P.r);
  if(!e.noHead){
    const jo=st?2.2:.6;ish(RR(7,fy-12+jo,9,3.2,1.2),P.s,P.d,{lw:.8});
    ish(RR(6,fy-18,11,7,3),P.b,P.s,{hi:[9,fy-16,2.2,1,0]});
    for(let k=0;k<4;k++){vfill(POLY([8+k*2,fy-11,9+k*2,fy-11,8.5+k*2,fy-9.6]),'#fbf6ee');}
    ish(EL(13.5,fy-15.5,1.7,1.7),'#fbf6ee','#d8cfc2',{lw:.7});dot(14.2,fy-15.3,.8,INK);
  }else vfill(RR(7,fy-14,2,4,.8),INK);
  vc.restore();
}
function vFoe(e,x,fy,pal){
  const P=ip(pal),s=e.T;
  if(s.dash){vHound(e,x,fy,P);if(e.st==='stun')vStars(x,fy-22);return{topY:fy-14};}
  const mode=e.st==='atk'?1:e.st==='wind'?5:0,o={pad:s.tw>=20?2:0,stripe:s.tw>=16?1:0,fist:s.tw>=18?1:0};
  const r=vRig(x+(e.hurt>0?-e.face:0),fy,s,e.face,(e.walk||0)*.35,e.moving,mode,P,o);
  const hw=Math.max(7,s.hw||8),hh=Math.max(6,s.hh||6),hy=r.topY-hh+(e.st==='stun'?1:0);
  if(e.noHead){vfill(RR(x-2.2,r.topY-1.4,4.4,1.8,.8),INK);odot(x,r.topY-1.6,.6,P.r);}
  else vHead(x-hw/2,hy,hw,hh,e.face,P,e.st!=='stun',e.type);
  if(e.type==='lancer'&&r.hx!==undefined){const L=mode===1?(s.reach||16)+8:e.st==='wind'?6:12;vline([r.hx,r.hy,r.hx+e.face*L,r.hy],1.3);vline([r.hx,r.hy,r.hx+e.face*L,r.hy],.6,'#d8cfc2');ish(POLY([r.hx+e.face*L,r.hy-1.6,r.hx+e.face*(L+3.5),r.hy,r.hx+e.face*L,r.hy+1.6]),'#e8e2d8','#a8a094',{lw:.7});}
  if(e.type==='guard'&&!['stun','air','down','dead'].includes(e.st)){const sx=x+e.face*(s.tw/2+2.5);ish(RR(sx-2.2,r.topY-2,4.4,s.th+3,2),P.s,P.d,{lw:.9});
    const hy2=r.topY+s.th*.45,p=new Path2D();p.moveTo(sx,hy2+1.6);p.bezierCurveTo(sx-2.6,hy2-.6,sx-1.2,hy2-2.4,sx,hy2-1);p.bezierCurveTo(sx+1.2,hy2-2.4,sx+2.6,hy2-.6,sx,hy2+1.6);ish(p,'#d83a3a','#8a1f22',{lw:.6});}
  if(e.st==='wind')vtext('!',x,hy-5,7,'#ffd84a');
  if(e.st==='stun')vStars(x,hy-3);
  return r;
}
// ---------- bodies Onion Head pilots (and their empty husks) ----------
function vFlyer(x,fy,face,mode,P,husk){
  // a fat drone fly: round body, buzzing wings, two little thrusters
  const bob=husk?0:Math.sin(T*.12)*1.5,y=husk?fy-6:fy-HOV-bob;
  vc.save();vc.translate(x,0);vc.scale(face,1);
  if(!husk){const fl=Math.sin(T*.9)*.5+.5;vc.globalAlpha=.6;ish(EL(-6,y-14,6.2,2.2+fl*1.6,-.5),'#f2f8ff','#b9c9da',{lw:.7});ish(EL(6,y-14,6.2,2.2+fl*1.6,.5),'#f2f8ff','#b9c9da',{lw:.7});vc.globalAlpha=1;
    for(const dx of [-6,6]){dot(dx,y+1.6,1.3+Math.random()*.6,'#ff9f3d');dot(dx,y+1.2,.6,'#fff4c0');}}
  ish(EL(-8.5,y-6,3.4,3),P.s,P.d,{lw:.9});ish(EL(8.5,y-6,3.4,3),P.b,P.s,{lw:.9});
  ish(EL(0,y-7,10,6.6),P.b,P.s,{hi:[-3.5,y-10,3.2,1.4,-.2]});
  vfill(RR(-7.5,y-4.4,15,1.4,.6),P.a);odot(-4,y-8.5,.6,P.r);odot(4,y-8.5,.6,P.r);
  vline([-4,y-1.2,-5,y+2,-3.4,y+2.8],.75);vline([4,y-1.2,5,y+2,3.4,y+2.8],.75);
  if(mode===1)ish(CAP(7,y-5,15,y-5,1.6),P.b,P.s,{lw:.8});
  vc.restore();return{top:y-13.6,lean:0};
}
const DOLLB={body:'#b8213f',shade:'#7a1028',scarf:'#4b1631',scarfS:'#2c0b1c',face:'#cfe6c4',faceS:'#9ab793',apron:'#ec7f97',apronS:'#b8526a',flower:'#ffd84a'};
function vDoll(x,fy,sc,face,Cc,o={}){
  const m=MSH[sc],H=m.h,Wd=m.w,hcy=fy-H+H*.22,hr=Wd*.36,bcy=fy-H*.32,bry=H*.32,brx=Wd/2;
  vc.save();if(o.rot){vc.translate(x,fy);vc.rotate(o.rot);vc.translate(-x,-fy);}
  ish(EL(x,bcy,brx,bry),Cc.body,Cc.shade,{hi:[x-brx*.45,bcy-bry*.45,brx*.25,bry*.18,-.4]});
  ish(EL(x,bcy+bry*.12,brx*.6,bry*.62),Cc.apron,Cc.apronS,{lw:.7});
  const fx=x,fy2=bcy+bry*.08,pr=Math.max(.6,brx*.12);for(let i=0;i<5;i++){const a=i*1.2566;odot(fx+Math.cos(a)*pr*1.4,fy2+Math.sin(a)*pr*1.4,pr*.75,Cc.flower);}odot(fx,fy2,pr*.6,'#c9473a');
  if(o.cracks)for(let i=0;i<o.cracks;i++){const cx=x-brx*.5+i*brx*.6,cy=bcy-bry*.7;vline([cx,cy,cx+1.2,cy+2,cx-.4,cy+3.6,cx+.8,cy+5.5],.6);}
  if(!o.headless){
    ish(EL(x,hcy,hr,hr),Cc.scarf,Cc.scarfS,{hi:[x-hr*.4,hcy-hr*.5,hr*.3,hr*.15,-.3]});
    ish(EL(x+face*.6,hcy+hr*.18,hr*.72,hr*.66),Cc.face,Cc.faceS,{lw:.7});
    const ey=hcy+hr*.05,e1=x+face*.6-hr*.3,e2=x+face*.6+hr*.3,es=Math.max(.7,hr*.16);
    if(o.zombie){vline([e1-es,ey-es,e1+es,ey+es],.6);vline([e1+es,ey-es,e1-es,ey+es],.6);}else dot(e1,ey,es*.7,INK);
    odot(e2,ey,es,o.glow?((T>>1)&1?'#ffffff':'#7fe6ff'):(o.zombie?'#ffd84a':INK));
    const my=hcy+hr*.55;vline([x-hr*.3,my,x+hr*.35,my],.55);if(o.zombie)for(let k=x-hr*.25;k<x+hr*.3;k+=1.2)vline([k,my-.6,k,my+.6],.45);
    odot(x-hr*.2,hcy+hr*.95,hr*.18,Cc.scarf);odot(x+hr*.2,hcy+hr*.95,hr*.18,Cc.scarf);
  }
  vc.restore();return{top:o.headless?fy-H*.62:fy-H};
}
function vBody(id,x,fy,face,walk,moving,mode,P,st){
  const b=bodyOf(id);
  if(b.flyer)return vFlyer(x,fy,face,mode,P,P===IP.husk);
  if(b.doll){const Cc=P===IP.husk?{body:'#b8b1a6',shade:'#7d776e',apron:'#d0cac0',apronS:'#9a948a',flower:'#9a9480'}:{body:P.b,shade:P.s,apron:'#f0e6cf',apronS:'#c8b996',flower:P.a};const r=vDoll(x,fy,2,face,Cc,{headless:true});if(mode===1||mode===3)ish(CAP(x+face*8,fy-14,x+face*13,fy-14,1.6),P.b,P.s,{lw:.8});return{top:r.top+1,lean:0};}
  if(b.frame){const r=vRig(x,fy,FR[id].s,face,walk*.3,moving,mode,P,VFOPT[id]||{});return{top:r.topY,lean:r.lean};}
  const e={type:b.foe,T:b.T,face,st:st||'walk',moving,walk,hurt:0,noHead:true};const r=vFoe(e,x,fy,P);
  if(b.foe==='hound')return{top:fy-12.5,lean:face*11};
  return{top:r.topY+.6,lean:0};
}
// ---------- bosses ----------
function vMatry(b,cam){
  const x=b.x-cam,D=matryDim(b);
  vc.globalAlpha=.35;vfill(EL(x,b.z,D.hw+2,2),INK);vc.globalAlpha=1;
  if(b.st==='dead'&&(T>>1)&1)return;
  let rot=0,yo=0;if(b.moving)rot=Math.sin(b.wob)*.08;if(b.st==='wind')rot=-b.face*.14;if(b.st==='lurch')rot=b.face*.28;
  if(b.st==='down'){yo=D.ht*.22;rot=b.face*.5;}if(b.st==='pop')yo=Math.max(0,b.t-24)*1.2;
  const Cc=b.hurt>0&&(b.hurt&2)?{body:'#fff',shade:'#ddd',scarf:'#fff',scarfS:'#ddd',face:'#fff',faceS:'#ddd',apron:'#fff',apronS:'#ddd',flower:'#fff'}:DOLLB;
  vDoll(x,b.z+yo,b.layer,b.face,Cc,{zombie:true,glow:b.st==='cast',cracks:b.lhp<MSH[b.layer].hp*.5?2:0,rot});
  if(b.st==='cast'){for(let i=0;i<4;i++){const a=T*.3+i*1.57,r=D.hw+4;vline([x+Math.cos(a)*r,b.z-D.ht*.6+Math.sin(a)*r*.6,x+Math.cos(a)*(r+3),b.z-D.ht*.6+Math.sin(a)*(r+3)*.6],.9,'#7fe6ff');}}
  if(b.st==='down')vStars(x,b.z-D.ht+yo-4);
}
function vWarden(b,cam){
  const x=b.x-cam,y=b.z-b.h,down=b.st==='down'||b.st==='dead';
  vc.globalAlpha=.35;vfill(EL(x,b.z,12,2.2),INK);vc.globalAlpha=1;
  if(b.st==='idle'||b.st==='wind'||b.st==='beam'){
    const lx=b.lx-cam,hot=b.st!=='idle'||b.lock>24,col=hot?'#ffe27a':'#ff8fa3';
    vc.globalAlpha=.18;vfill(POLY([x-3,y+10,x+3,y+10,lx+14,b.lz,lx-14,b.lz]),col);vc.globalAlpha=.35;vfill(EL(lx,b.lz,14,3.2),col);vc.globalAlpha=1;
    if(b.st==='wind'&&(T>>1)&1)vline([lx,y+12,lx,b.lz],.6,'#ffe27a');
    if(b.st==='beam'){vc.lineCap='round';vline([lx,y+10,lx,b.lz],7,INK);vline([lx,y+10,lx,b.lz],5.4,'#e8364f');vline([lx,y+10,lx,b.lz],2,'#fff');}
  }
  for(const dx of [-7,7]){vline([x+dx*.6,y-10,x+dx,y-19],.9);odot(x+dx,y-19.6,1.1,'#c9473a');}
  if(!down)for(const dx of [-5,5]){ish(RR(x+dx-1.6,y+10,3.2,3,1),'#7d776e','#4c4843',{lw:.7});dot(x+dx,y+14+Math.random(),1.1,'#ff9f3d');}
  const hit=b.hurt>0&&(b.hurt&2);
  ish(EL(x,y,13,13),hit?'#fff':'#f3ece0',hit?'#ddd':'#c9bdab',{hi:[x-5,y-6,4,2.2,-.5],lw:1.3});
  if(!hit){vc.save();vc.clip(EL(x,y,13,13));for(const a of [.3,1.4,2.6,3.6,4.8,5.6]){vline([x+Math.cos(a)*13,y+Math.sin(a)*13,x+Math.cos(a)*8,y+Math.sin(a)*8+1,x+Math.cos(a)*6.5,y+Math.sin(a)*6.5],.55,'#c9473a');}vc.restore();}
  const ex=x+clamp((bw.p.x-b.x)/40,-1,1)*3.5;
  if(down){vc.save();vc.clip(EL(x,y,13,13));vfill(RR(x-14,y-14,28,13,0),'#c9bdab');vc.restore();vline([x-12.5,y-.5,x+12.5,y-.5],1.1);vStars(x,y-16);}
  else{const ic=b.st==='wind'||b.st==='beam'?'#ffd84a':'#6fb3d9';ish(EL(ex,y+1,6,6),ic,'#3d7fa8',{lw:.9});dot(ex,y+1.2,3,INK);dot(ex-1.6,y-.6,1,'#fff');}
}
function vBig(b,cam){
  // the Maker (and the old Colossus): huge rounded slabs, a skull-ish head, a glowing core plate
  const P=b.hurt>0&&(b.hurt&2)||b.st==='phase'&&(T>>2)&1?IP.hit:b.type==='maker'?IP.maker:IP.foe;
  const bx=b.x-cam+(b.shk||0),k=b.k,B=GY;
  vc.globalAlpha=.35;vfill(EL(bx,b.z,50,3),INK);vc.globalAlpha=1;
  if(b.st==='dead'&&(T>>1)&1)return;
  vc.save();vc.translate(0,b.z-GY);
  if(b.st==='slamwind'&&(T>>2)&1){const tx=b.tx-cam;vc.globalAlpha=.5;vfill(EL(tx,b.tz-(b.z-GY),13,3),'#e8364f');vc.globalAlpha=1;}
  for(const dx of [-38,22]){ish(RR(bx+dx,B-27,16,27,4),P.s,P.d);odot(bx+dx+8,B-18,.9,P.r);}
  for(const dx of [-44,20])ish(RR(bx+dx,B-7,24,7,3),P.b,P.s);
  ish(RR(bx-30,B-37+k,60,13,4),P.m,INK);
  ish(RR(bx-46,B-82+k,92,48,10),P.b,P.s,{hi:[bx-20,B-74+k,16,4,-.1]});
  vline([bx-38,B-46+k,bx+38,B-46+k],.8);for(let i=-36;i<38;i+=4)vline([i+bx,B-47.2+k,i+bx,B-44.8+k],.6);
  ish(RR(bx-60,B-88+k,24,20,7),P.b,P.s);ish(RR(bx+36,B-88+k,24,20,7),P.b,P.s);
  for(const dx of [-48,48]){odot(bx+dx,B-80+k,1.2,P.r);odot(bx+dx,B-75+k,1.2,P.r);}
  const hp2=b.hurtHead>0&&(b.hurtHead&2)?IP.hit:P;
  if(b.st==='topple'){for(let i=0;i<4;i++)ish(EL(bx-36-i*10,B-60+k+i*12,4.5,4.5),P.s,P.d);const hx=bx-90,hy=B-15;ish(RR(hx,hy,26,17,6),hp2.b,hp2.s);ish(EL(hx+9,hy+7,4.5,4.5),'#fbf6ee','#d8cfc2');dot(hx+9.5,hy+7.5,2,(T>>2)&1?'#c9473a':INK);vline([hx+15,hy+12,hx+23,hy+12],.7);vStars(hx+12,hy-5);}
  else{ish(RR(bx-11,B-98+k,22,16,6),hp2.b,hp2.s,{hi:[bx-5,B-94+k,4,1.5,0]});
    if(b.type==='maker'){ish(RR(bx-17,B-108+k,5,13,2.5),hp2.b,hp2.s);ish(RR(bx+12,B-108+k,5,13,2.5),hp2.b,hp2.s);}
    ish(EL(bx,B-91+k,4.6,4.6),'#fbf6ee','#d8cfc2');dot(bx+.8,B-90.6+k,2.1,b.type==='maker'?'#c9473a':INK);
    const my=B-85+k;vline([bx-6,my,bx+6,my],.7);for(let i=-5;i<6;i+=2)vline([bx+i,my-.8,bx+i,my+.8],.55);}
  ish(RR(bx+44,B-70+k,13,42,6),P.s,P.d);ish(RR(bx+41,B-31+k,18,11,5),P.b,P.s);
  const vul=b.st==='kneel';
  const pent2=(cx,cy,r)=>{const pts=[];for(let i=0;i<5;i++){const a=-Math.PI/2+i*1.2566;pts.push(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}return POLY(pts);};
  if(vul){vc.globalAlpha=.4+.3*Math.sin(T*.3);vfill(EL(bx,B-60+k,11,11),'#ffe27a');vc.globalAlpha=1;}
  ish(pent2(bx,B-60+k,6.5),vul?'#ffe27a':'#d8cfc2',vul?'#e0a52a':'#a8a094');
  const sx=b.x-cam-50,sy=B-74+k;
  for(let i=1;i<=3;i++){const a=i/4,cx=sx+(b.fx-cam-sx)*a,cy=sy+(b.fy-sy)*a;ish(EL(cx,cy,5,5),P.s,P.d);}
  ish(RR(b.fx-cam-12,b.fy-9,24,18,6),P.b,P.s,{hi:[b.fx-cam-6,b.fy-5,4,1.6,0]});
  for(let i=-6;i<=6;i+=4)vline([b.fx-cam+i,b.fy-1,b.fx-cam+i,b.fy+6],.6);
  vc.restore();
}
// ---------- effects, pickups, crates, bombs, heads ----------
function vBomb(x,y,r,fuseCol,blink){
  vline([x+r*.3,y-r*.9,x+r*.6,y-r*1.6,x+r*1.1,y-r*1.8],.8,'#7a6a50');
  if((T>>1)&1){odot(x+r*1.15,y-r*1.85,.9,fuseCol||'#ffd84a');}
  ish(EL(x,y,r,r),blink?'#e8364f':'#55525e','#2c2a33',{hi:[x-r*.35,y-r*.4,r*.3,r*.18,-.5]});
  ish(RR(x-r*.25,y-r*1.15,r*.5,r*.35,.4),'#8a8696','#55525e',{lw:.6});
}
function vBurst(x,y,t){
  const a=1-t/16,r=3+a*11;
  vc.globalAlpha=Math.max(0,1-a*.9);
  for(let i=0;i<6;i++){const ang=i*1.05+t*.1;ish(EL(x+Math.cos(ang)*r*.8,y+Math.sin(ang)*r*.5,r*.42,r*.36),'#9a9286','#6a6258',{lw:.7});}
  ish(EL(x,y,r*.75,r*.6),'#ffb347','#e06a2a',{lw:.9});ish(EL(x,y-r*.1,r*.42,r*.34),'#fff4c0','#ffd84a',{lw:0});
  vc.globalAlpha=1;
}
function vBolt(x,z){
  let bx=x+rnd(-6,6),by=-4;const pts=[bx,by];while(by<z){by+=rnd(9,16);bx+=rnd(-7,7)+(x-bx)*.3;pts.push(bx,Math.min(by,z));}
  vc.lineCap='round';vc.lineJoin='round';vline(pts,3.6,INK);vline(pts,2.4,'#9fdcff');vline(pts,1,'#fff');
  ish(EL(x,z,6,2),'#ffffff','#9fdcff',{lw:.7});
}
function vItemIcon(id,cx,cy,sz){
  const s=sz/10;vc.save();vc.translate(cx,cy);vc.scale(s,s);
  switch(id){
    case 'sword':case 'giant':ish(CAP(-4,4,3.5,-3.5,1.1),'#e8eef2','#9aa8b4',{lw:.8});ish(RR(-5.6,1.8,4.6,1.6,.7),'#efbe4b','#b88a24',{lw:.7});ish(CAP(-5.5,5.5,-4.3,4.3,.8),'#8a5a3c','#5a3a24',{lw:.7});break;
    case 'hammer':case 'pound':ish(CAP(-3.5,4.5,1.5,-.5,.8),'#9a6a44','#6a4428',{lw:.7});ish(RR(-.5,-5,7,5,1.4),'#9aa3ad','#5f6670',{lw:.8,hi:[1.5,-4,1.4,.6,0]});break;
    case 'laser':ish(RR(-5,-1.6,9,3.6,1.4),'#9aa3ad','#5f6670',{lw:.8});ish(RR(-3,1.6,2.4,3.2,.8),'#5f6670','#3a4048',{lw:.7});odot(4.6,.2,1.1,'#ff5a6a');break;
    case 'rocket':ish(CAP(-4,3.5,3.5,-3,1.8),'#e8e2d8','#a8a094',{lw:.8});ish(POLY([3,-4.6,5.4,-5.4,4.6,-2.6]),'#c9473a','#8a1f22',{lw:.7});dot(-4.6,4.4,1.3,'#ff9f3d');break;
    case 'hook':vc.lineCap='round';vline([0,-5,0,1.5],1.6);vline([0,-5,0,1.5],.8,'#b9c0c8');vc.beginPath();vc.arc(-1.8,1.6,1.9,0,Math.PI);vc.lineWidth=1.6;vc.strokeStyle=INK;vc.stroke();vc.lineWidth=.8;vc.strokeStyle='#b9c0c8';vc.stroke();break;
    case 'knife':ish(POLY([-4.5,3.5,2.5,-3.8,4,-4.4,3.4,-2.8,-3.4,4.4]),'#e8eef2','#9aa8b4',{lw:.7});ish(CAP(-5,5,-3.8,3.8,.8),'#8a5a3c','#5a3a24',{lw:.6});break;
    case 'glove':ish(RR(-4,-3.5,8,7.5,2.6),'#c9473a','#8a1f22',{lw:.8,hi:[-1.5,-2,1.6,.8,0]});ish(RR(-4.5,2.5,9,2.4,1),'#efbe4b','#b88a24',{lw:.7});break;
    case 'spin':vc.beginPath();for(let i=0;i<40;i++){const a=i*.35,r=i*.13;i?vc.lineTo(Math.cos(a)*r,Math.sin(a)*r):vc.moveTo(0,0);}vc.lineWidth=1.6;vc.strokeStyle=INK;vc.stroke();vc.lineWidth=.8;vc.strokeStyle='#ffd84a';vc.stroke();break;
    case 'spear':ish(CAP(-5,4.5,3,-3.5,.6),'#9a6a44','#6a4428',{lw:.6});ish(POLY([2.4,-2.6,5.6,-5.6,3.4,-1.8]),'#e8eef2','#9aa8b4',{lw:.7});break;
    case 'pounce':for(const [dx,dy,r] of [[0,1.5,2.6],[-3,-2,1.1],[-1,-3.4,1.1],[1.4,-3.4,1.1],[3.4,-2,1.1]])ish(EL(dx,dy,r,r),'#e99c9a','#ad5961',{lw:.6});break;
    case 'bash':{const p=new Path2D();p.moveTo(0,5);p.lineTo(-4.5,1);p.lineTo(-4.5,-4);p.lineTo(4.5,-4);p.lineTo(4.5,1);p.closePath();ish(p,'#b8b1a6','#7d776e',{lw:.8});odot(0,-.5,1.4,'#d83a3a');break;}
    case 'bombs':vBomb(0,.8,3.6);break;
    case 'lightning':ish(POLY([1,-5.5,-3,.8,-.2,.8,-1.5,5.5,3.4,-1.2,.4,-1.2]),'#ffe27a','#d9a42a',{lw:.8});break;
    case 'cell':ish(RR(-3.4,-3,6.8,6,1.8),IP.core.b,IP.core.s,{lw:.8});odot(.4,0,1.2,'#ffd84a');break;
    case 'scrap':{const p=new Path2D();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?3:4.4;i?p.lineTo(Math.cos(a)*r,Math.sin(a)*r):p.moveTo(r,0);}p.closePath();ish(p,'#9aa3ad','#5f6670',{lw:.8});odot(0,0,1.3,'#5f6670');break;}
    default:ish(EL(0,0,3,3),'#ddd','#999');
  }
  vc.restore();
}
function vCrate(x,z,hurt){
  const P=hurt?{b:'#fff',s:'#ddd'}:{b:'#c08a52',s:'#83582f'};
  ish(RR(x-7.5,z-13,15,13,2),P.b,P.s,{hi:[x-4,z-11,2.6,.9,0]});
  vline([x-7,z-8.6,x+7,z-8.6],.6);vline([x-7,z-4.4,x+7,z-4.4],.6);
  for(const [dx,dy] of [[-5.6,-11.2],[5.6,-11.2],[-5.6,-1.8],[5.6,-1.8]])odot(x+dx,z+dy,.55,'#5f6670');
}
// ---------- the three levels as basement rooms (pre-drawn strips) ----------
function vrng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
const STHEME=[
  {wall:'#4e3a2e',brick:'#634a39',floor:'#76573f',patch:'#664b36',stone:'#8f8679',prop:'grave'},
  {wall:'#22342b',brick:'#2e463a',floor:'#465e3f',patch:'#55704a',stone:'#7c8a74',prop:'pine'},
  {wall:'#43201c',brick:'#5a2a25',floor:'#5e2b22',patch:'#6f3428',stone:'#8a6a5e',prop:'pipe'}];
const vStages=[];let vVig=null;
function vStageCan(si){
  if(vStages[si])return vStages[si];
  const th=STHEME[STAGES[si].theme],c=document.createElement('canvas');c.width=SL*VS;c.height=H*VS;
  const keep=vc;vc=c.getContext('2d');vc.setTransform(VS,0,0,VS,0,0);vc.lineJoin='round';vc.lineCap='round';const R=vrng(si*977+13);
  vfill(RR(0,0,SL,104,0),th.wall);
  for(let y=3,row=0;y<100;y+=9,row++){for(let x=-(row%2)*11;x<SL;){const w=18+R()*10;vc.globalAlpha=.45+R()*.45;ish(RR(x+.6,y,w-1.2,8,2.4),th.brick,th.wall,{lw:.5,ink:'rgba(10,6,6,.6)'});vc.globalAlpha=1;x+=w;}}
  for(let x=20;x<SL;x+=60+R()*80){
    if(th.prop==='grave'){const h=14+R()*10,w=10+R()*6;ish(RR(x,104-h,w,h+4,w/2),'#8f8679','#5f574c',{hi:[x+w*.3,104-h+3,w*.15,1,0]});vline([x+w/2,104-h+4,x+w/2,104-h+10],.7);vline([x+w/2-2.5,104-h+6,x+w/2+2.5,104-h+6],.7);}
    else if(th.prop==='pine'){const h=50+R()*30,w=22+R()*10;for(let k=0;k<3;k++){const yy=104-h+k*h*.28;ish(POLY([x,yy,x+w*(.35+k*.12),yy+h*.42,x-w*(.35+k*.12),yy+h*.42]),'#2c4a37','#1c3226',{lw:.8});}ish(RR(x-1.6,104-h*.18,3.2,h*.18+2,1),'#5a4030','#3a2a20',{lw:.7});}
    else{const h=70+R()*20;ish(RR(x,104-h,7,h+2,2.5),'#6b5a52','#463a35',{lw:.8});for(let yy=104-h+10;yy<100;yy+=22){ish(RR(x-1.5,yy,10,4,1.5),'#7d6b62','#4f433d',{lw:.7});}if(R()<.6){ish(RR(x+14,40+R()*30,16,10,3),'#2a1a18','#160e0e',{lw:.8});vfill(RR(x+16,42+R()*26,12,6,2),'#ff8a3d');}}
  }
  vfill(RR(0,104,SL,40,0),th.floor);
  for(let i=0;i<SL/9;i++){vc.globalAlpha=.5;vfill(EL(R()*SL,108+R()*34,4+R()*10,1.4+R()*3),th.patch);vc.globalAlpha=1;}
  for(let i=0;i<SL/26;i++){const x=R()*SL,y=110+R()*30,r=1.2+R()*2.4;ish(EL(x,y,r*1.3,r),th.stone,'#4d453c',{lw:.6,hi:[x-r*.4,y-r*.4,r*.4,r*.25,0]});}
  for(let i=0;i<SL/60;i++){const x=R()*SL,y=112+R()*28;vline([x,y,x+3,y+1.5,x+5,y+.5,x+8,y+2.2],.5,'rgba(10,6,6,.6)');}
  if(th.prop==='pipe')for(let i=0;i<SL/30;i++)dot(R()*SL,R()*100,.4+R()*.5,'#ffb347');
  let gr=vc.createLinearGradient(0,98,0,114);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');vc.fillStyle=gr;vc.fillRect(0,98,SL,16);
  gr=vc.createLinearGradient(0,0,0,26);gr.addColorStop(0,'rgba(0,0,0,.6)');gr.addColorStop(1,'rgba(0,0,0,0)');vc.fillStyle=gr;vc.fillRect(0,0,SL,26);
  vline([0,104,SL,104],1,INK);
  vc=keep;vStages[si]=c;return c;
}
function vVignette(){
  if(!vVig){vVig=document.createElement('canvas');vVig.width=W*VS;vVig.height=H*VS;const x=vVig.getContext('2d'),g2=x.createRadialGradient(W*VS/2,H*VS*.55,H*VS*.35,W*VS/2,H*VS*.55,W*VS*.62);g2.addColorStop(0,'rgba(0,0,0,0)');g2.addColorStop(1,'rgba(8,4,4,.72)');x.fillStyle=g2;x.fillRect(0,0,W*VS,H*VS);}
  vc.save();vc.setTransform(1,0,0,1,0,0);vc.drawImage(vVig,0,0);vc.restore();
}
// ---------- torn paper notes with a push pin ----------
function vNote(cx,cy,w,h,rot,seed,fn,pin=true){
  vc.save();vc.translate(cx,cy);vc.rotate(rot);const R=vrng(seed),pts=[];
  const jag=(x0,y0,x1,y1,n)=>{for(let i=0;i<n;i++){const t=i/n;pts.push(x0+(x1-x0)*t+(R()-.5)*1.6,y0+(y1-y0)*t+(R()-.5)*1.6);}};
  const hw=w/2,hh=h/2,n=Math.max(4,Math.round(w/7)),m=Math.max(3,Math.round(h/7));
  jag(-hw,-hh,hw,-hh,n);jag(hw,-hh,hw,hh,m);jag(hw,hh,-hw,hh,n);jag(-hw,hh,-hw,-hh,m);
  vc.save();vc.globalAlpha=.35;vc.translate(1.6,2.2);vfill(POLY(pts),'#000');vc.restore();
  ish(POLY(pts),'#ebe6dd','#cbc3b6',{lw:1.1,sx:-1.3,sy:-1.7});
  if(pin)ish(EL(0,-hh+2.6,2.3,2.3),'#8a8a92','#55555c',{hi:[-.7,-hh+1.8,.7,.5,0],lw:.8});
  if(fn)fn(hw,hh);
  vc.restore();
}
function vSkull(x,y,s){vc.save();vc.translate(x,y);vc.scale(s,s);ish(EL(0,-.6,3.4,3),'#ebe6dd','#b5ad9f',{lw:.8});ish(RR(-2,1.4,4,2.2,.8),'#ebe6dd','#b5ad9f',{lw:.7});dot(-1.2,-.8,.9,INK);dot(1.2,-.8,.9,INK);vline([-.8,1.6,-.8,3.2],.4);vline([.8,1.6,.8,3.2],.4);vc.restore();}
// ---------- the player ----------
function vPlayer(p,cam){
  const x=p.x-cam,fy=p.z-p.h,moving=p.onG&&Math.abs(p.vx)+Math.abs(p.vz||0)>.3;
  if(p.inv>0&&p.inv<44&&(T>>1)&1)return;
  const L=p.layers,mood=p.atk>0?'angry':'';
  if(!L.length){
    const sw=moving?Math.sin(p.walk*.55):0,bob=moving&&Math.abs(sw)>.7?.8:0;
    ish(CAP(x-2.4+sw,fy-3.4,x-2.4+sw,fy-.6,.8),IP.core.b,IP.core.s,{lw:.6});ish(CAP(x+2.4-sw,fy-3.4,x+2.4-sw,fy-.6,.8),IP.core.b,IP.core.s,{lw:.6});
    vCore(x-4,fy-10.5+bob,p.face,mood);
    const kw=p.atk>0&&p.atk<=p.hitAt+3?7:3;vItemIcon('knife',x+p.face*(5+kw*.4),fy-6+bob,kw+2);return;
  }
  let mode=0;
  if(p.atk>0){if(p.kind==='melee')mode=p.atk<=p.hitAt+3?[1,2,3][p.combo]:5;else if(p.kind==='air'||p.kind==='throw'||p.kind==='lunge')mode=1;else if(p.kind==='sp')mode=p.atk>p.hitAt&&p.hitAt>=0?(['hammer','pound','giant','sword'].includes(p.sp)?3:5):1;}
  if(p.grab)mode=3;
  const st=p.atk>0?(mode===5?'wind':'atk'):'walk';
  const outer=L[L.length-1],r=vBody(outer.id,x,fy,p.face,p.walk,moving,mode,IP.me,st);
  let top=r.top,cx=x+r.lean;
  if(L.length>1){const inn=L[L.length-2],ir=vBody(inn.id,cx,top,p.face,0,false,0,IP.me,'walk');top=ir.top;cx+=ir.lean;}
  if(p.boot>0)top-=p.boot/16*20;
  vDomes(cx-4,top-7,IP.me);vCore(cx-4,top-7,p.face,mood);
}
function vSpecialsFX(cam){
  const p=bw.p;
  for(const s of bw.shots){vc.save();vc.translate(s.x-cam,s.z-s.h);vc.rotate(T*.6);vItemIcon('knife',0,0,7);vc.restore();}
  for(const r of bw.rockets){const x=r.x-cam;vc.globalAlpha=.8;vc.beginPath();vc.ellipse(x,r.z,6,2,0,0,6.28);vc.lineWidth=.9;vc.strokeStyle='#e8364f';vc.stroke();vc.globalAlpha=1;if(r.t<12){vc.save();vc.translate(x,r.z-r.t*9-4);vc.rotate(Math.PI*.75);vItemIcon('rocket',0,0,9);vc.restore();}}
  if(bw.beam){const B=bw.beam,x=B.x-cam,x2=B.f>0?W+4:-4,w=Math.max(1,5*B.t/16);vline([x,B.y,x2,B.y],w+1.6,INK);vline([x,B.y,x2,B.y],w,'#7fe6ff');vline([x,B.y,x2,B.y],w*.35,'#fff');}
  if(bw.chain){const Q=bw.chain,x0=Q.x0-cam,x1=Q.x1-cam;for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x+=3)ish(EL(x,Q.y,1.6,1),'#b9c0c8','#6f767e',{lw:.5});vItemIcon('hook',x1,Q.y+1,8);if(--Q.t<=0)bw.chain=null;}
  if(p.kind!=='sp')return;
  const x=p.x-cam,fy=p.z-p.h,f=p.face,t=p.atk,act=p.hitAt<0||t<=p.hitAt+2;
  switch(p.sp){
    case 'glove':if(t<=18){vItemIcon('glove',x+f*13,fy-14,11);for(let i=0;i<3;i++)vline([x-f*(4+i*4),fy-15+i*2,x-f*(8+i*4),fy-15+i*2],.8,'#ffd84a');}break;
    case 'hammer':case 'pound':if(t>p.hitAt){vc.save();vc.translate(x-f*2,fy-34);vc.scale(f,1);vItemIcon('hammer',0,0,16);vc.restore();}else{vc.save();vc.translate(x+f*(p.sp==='pound'?0:16),fy-7);vc.scale(f,1);vc.rotate(.8);vItemIcon('hammer',0,0,16);vc.restore();}break;
    case 'giant':if(t>p.hitAt){vc.save();vc.translate(x+f*6,fy-44);vc.rotate(-.75);vItemIcon('giant',0,0,30);vc.restore();}else if(act){const L2=72;vline([x+f*6,fy-14,x+f*(6+L2),fy-14],4.2,INK);vline([x+f*6,fy-14,x+f*(6+L2),fy-14],2.8,'#e8eef2');vline([x+f*8,fy-14.8,x+f*(4+L2),fy-14.8],.6,'#fff');}break;
    case 'sword':if(act){vline([x+f*6,fy-14,x+f*58,fy-14],2.6,INK);vline([x+f*6,fy-14,x+f*58,fy-14],1.6,'#e8eef2');}break;
    case 'spear':if(act){vline([x+f*6,fy-13,x+f*70,fy-13],1.8,INK);vline([x+f*6,fy-13,x+f*70,fy-13],.9,'#c9a070');ish(POLY([x+f*70,fy-15,x+f*75,fy-13,x+f*70,fy-11]),'#e8eef2','#9aa8b4',{lw:.6});}break;
    case 'spin':{vc.save();vc.translate(x,fy-12);vc.rotate(T*.6);vc.globalAlpha=.8;vc.beginPath();vc.ellipse(0,0,16,6,0,0,6.28);vc.lineWidth=1.6;vc.strokeStyle='#fff';vc.stroke();vc.restore();break;}
    case 'bash':vItemIcon('bash',x+f*12,fy-15,16);break;
  }
}
// ---------- HUD in the Isaac manner ----------
function vHUD(){
  const p=bw.p,L=p.layers,sp=curSpecial(),cost=spCost(sp),ok=p.pow>=cost;
  ish(RR(4,4,19,19,3.5),'#ebe6dd','#cbc3b6',{lw:1.1});vItemIcon(sp,13.5,13.5,13);
  ish(RR(24.5,4,4.6,19,1.8),'#2a2228','#140e12',{lw:.9});const fh=16.6*Math.min(1,p.pow/100);if(fh>0)vfill(RR(25.5,22.2-fh,2.6,fh,1),ok?((T>>3)&1?'#fff4c0':'#ffd84a'):'#b8902e');vline([24.4,22.2-16.6*cost/100,29.3,22.2-16.6*cost/100],.7,'#e8364f');
  vtext(SPNAME[sp],4,28.4,3.8,ok?'#ffd84a':'#9a9286','l');
  for(let i=0;i<Math.max(3,p.core);i++){const x=34+i*9;if(i<p.core){vc.save();vc.translate(x,5.4);vc.scale(.62,.62);vCore(0,0,1,'',true);vc.restore();}else ish(RR(x,6.6,5,4.4,1.4),'#3a3238','#241e22',{lw:.7});}
  if(L.length){const tp=L[L.length-1],f=Math.max(0,tp.shell/tp.max);vtext(bodyOf(tp.id).name,34,16.4,4.6,'#f0e8da','l');ish(RR(34,19.4,48,4,2),'#2a2228','#140e12',{lw:.8});if(f>0)vfill(RR(35,20.2,46*f,2.4,1.2),f<.3?'#e8364f':'#9fd36a');if(L.length>1)vtext('+ '+bodyOf(L[L.length-2].id).name,85,21.4,3.8,'#cbc3b6','l');}
  else vtext('KNIFE ONLY',34,16.4,4.6,'#cbc3b6','l');
  vtext(String(bw.score).padStart(6,'0'),252,7,6.5,'#f0e8da','r');
  const S=SECS[bw.sec]||SECS[SECS.length-1];vtext('LEVEL '+(S.stage+1)+'  '+((bw.sec%5)+1)+'/5',252,14.5,4,'#a89f92','r');
  if(p.hits>=2){const big=p.hits>=6;vtext(p.hits+' HITS',5,38,big?9:6.5,big?'#ffd84a':'#f0e8da','l');}
  // boss bar at the bottom, red on black with a skull; smaller robots get a slimmer bar
  const Lt=bw.boss&&bw.boss.st!=='dead'?bw.boss:bw.last&&bw.last.st!=='dead'?bw.last:null;
  if(Lt){const big=Lt===bw.boss,w=big?118:70,x0=128-w/2,y0=big?133:136,f=Math.max(0,Lt.hp/Lt.max);
    ish(RR(x0,y0,w,big?6:4,3),'#2a1418','#140a0c',{lw:1});if(f>0)vfill(RR(x0+1,y0+1,(w-2)*f,big?4:2,2),'#d42d36');
    if(big)vSkull(x0-5,y0+3,1);vtext(scaled(Lt.T,Lt.type,0).name,128,y0-4.4,big?5:4,'#f0e8da','c');}
  if(bw.clear&&SECS[bw.sec+1]&&(T>>4)&1){vtext('GO',226,62,10,'#ffd84a');ish(POLY([236,57,246,63,236,69]),'#ffd84a','#c9922a',{lw:1});}
  const nh=state==='brawl'?nearHusk():null;
  let hint=null;if(state==='brawl'){if(nh)hint='START: CLIMB IN';else if(!bw.spTip&&p.pow>=spCost(curSpecial())&&bw.sec>=1&&bw.t%300<150)hint='A+B TOGETHER: SPECIAL';else if(bw.boss&&bw.boss.type==='warden'&&(bw.bombs.length||bw.heads.length)&&bw.boss.st!=='down')hint='KICK BOMBS OR HEADS UP AT THE WARDEN';else if(bw.heads.some(h=>h.bomb&&h.fuse<240&&Math.abs(h.x-p.x)<60))hint='TICKING HEAD! KICK IT AWAY';else if(bw.strikes.some(s=>s.bolt&&!s.mine&&Math.abs(s.x-p.x)<20))hint='LIGHTNING! KEEP MOVING';else if(bw.boss&&bw.boss.st==='topple')hint='ITS HEAD IS DOWN: HIT IT';else if(!bw.headTip&&bw.heads.some(h=>h.st==='rest'))hint='HIT A HEAD TO KICK IT';else if(!L.length&&bw.sec===0)hint='BEAT A ROBOT, THEN CLIMB INTO ITS BODY';else if(L.length&&bw.t%600<120)hint='START: EJECT';}
  if(hint){const y=Lt?122:132;vc.font=vfont(4.6);const w=vc.measureText(tr(hint)).width+10;vc.globalAlpha=.75;vfill(RR(128-w/2,y-4.6,w,9.2,4.6),'#140e10');vc.globalAlpha=1;vtext(hint,128,y,4.6,'#f0e8da','c',null);}
  if(bw.card&&bw.card.t>0){const c=bw.card,k=Math.min(1,(150-c.t)/10,c.t/12);c.t--;vc.save();vc.globalAlpha=Math.max(0,k);vNote(128,40-(1-k)*8,128,26,-.025,c.name.length*31,(hw,hh)=>{vItemIcon(c.icon,-hw+14,1,16);vtext(c.name,8,-2.5,6.5,INK,'c',null);if(c.sub)vtext(c.sub,8,6,4,'#7a3030','c',null);});vc.restore();}
  if(bw.stageT>0){const S2=STAGES[bw.stage],a=bw.stageT<300||(T>>2)&1;if(a){const lines=bw.stage===0?STORY.slice(6):LEVELS[bw.stage].intro,li=Math.min(lines.length-1,Math.floor(bw.stageT/100));
    vNote(128,62,184,44,.018,bw.stage*91+5,()=>{vtext('LEVEL '+(bw.stage+1),0,-11,5,'#7a3030','c',null);vtext(S2.name,0,-1.5,10,INK,'c',null);vtext(lines[li],0,11,4.6,'#4a3a32','c',null);});}}
  if(banner&&bw.stageT===0){const big=banner.s.length<=6;vtext(banner.s,128,56,big?18:12,banner.s==='BOSS'||banner.s==='MINI BOSS'?'#e8364f':'#f0e8da','c',INK,big?5:3.6);}
}
// ---------- the street, put together ----------
function vBrawl(){
  const cam=bw.cam;
  vc.setTransform(1,0,0,1,0,0);
  for(let s=stageAt(cam);s<=stageAt(cam+W-1);s++)vc.drawImage(vStageCan(s),Math.round((s*SL-cam)*VS),0);
  vc.setTransform(VS,0,0,VS,0,0);vc.save();if(shake>.3)vc.translate(rnd(-shake,shake)*.45,rnd(-shake,shake)*.45);
  const list=[];for(const e of bw.ents)list.push({z:e.z,e});for(const it of bw.items)list.push({z:it.z-.1,it});list.push({z:bw.p.z,p:1});
  for(const o of list){const x=(o.p?bw.p.x:o.e?o.e.x:o.it.x)-cam,w=o.p?7:o.e&&o.e.boss?16:7.5;vc.globalAlpha=.3;vfill(EL(x,o.z,w,1.8),INK);vc.globalAlpha=1;}
  if(bw.boss&&bw.boss.type!=='warden'&&bw.boss.type!=='matry')vBig(bw.boss,cam);
  if(bw.boss&&bw.boss.type==='matry')list.push({z:bw.boss.z,boss:1});
  list.sort((a,c)=>a.z-c.z);
  const nh=state==='brawl'?nearHusk():null;
  for(const o of list){
    if(o.boss){vMatry(bw.boss,cam);continue;}
    if(o.p){vPlayer(bw.p,cam);continue;}
    if(o.it){const x=o.it.x-cam,y=o.it.z-6+Math.sin(T*.12)*1.5;vItemIcon(o.it.kind==='wpn'?o.it.w:o.it.kind,x,y,o.it.kind==='wpn'?11:9);continue;}
    const e=o.e,x=e.x-cam;
    if(e.husk){const r=vBody(e.id,x,e.z,e.face,0,false,0,IP.husk,'idle');const f=e.shell/e.max;ish(RR(x-8,e.z+2,16,2.6,1.3),'#2a2228','#140e12',{lw:.6});vfill(RR(x-7.4,e.z+2.5,14.8*f,1.6,.8),f<.35?'#e8364f':'#9fd36a');
      if(e===nh&&(T>>3)&1)ish(POLY([x-3,r.top-12,x+3,r.top-12,x,r.top-7]),'#ffd84a','#c9922a',{lw:.8});continue;}
    if(e.crate){vCrate(x,e.z,e.hurt>0&&(e.hurt&2));continue;}
    if(e.st==='dead'&&(T>>1)&1)continue;
    const pal=(e.hurt>0&&(e.hurt&2))?PAL.hit:e.st==='wind'&&(T>>2)&1?PAL.warn:e.type==='makercore'?PAL.maker:PAL.foe;
    vFoe(e,x,e.z-e.h,pal);
    if(e.boss&&e.st!=='dead')vSkull(x,e.z-eDim(e).ht-11-e.h,.8);
  }
  if(bw.boss&&bw.boss.type==='warden')vWarden(bw.boss,cam);
  for(const m of bw.bombs){const x=m.x-cam,y=m.z-m.h-4.5;vc.globalAlpha=.3;vfill(EL(x,m.z,4,1.2),INK);vc.globalAlpha=1;if(m.st==='walk'||m.st==='fuse'){const k=(m.f>>2)&1;vline([x-2,y+3,x-2.6,y+5-k],.8);vline([x+2,y+3,x+2.6,y+4+k],.8);}vBomb(x,y,4,null,m.st==='fuse'&&(m.t>>1)&1);}
  for(const s of bw.strikes){const x=s.x-cam;if(s.bolt){const r=4+((44-Math.min(44,s.t))>>3);vc.globalAlpha=.85;vc.beginPath();vc.ellipse(x,s.z,r,r*.4,0,0,6.28);vc.lineWidth=1;vc.strokeStyle=s.mine?'#7fe6ff':((T>>1)&1?'#fff':'#7fe6ff');vc.stroke();vc.globalAlpha=1;continue;}
    vc.beginPath();vc.ellipse(x,s.z,7,2.4,0,0,6.28);vc.lineWidth=1;vc.strokeStyle='#e8364f';vc.stroke();vline([x-9,s.z,x+9,s.z],.6,'#e8364f');if(s.t<12){vc.save();vc.translate(x,s.z-s.t*9-5);vc.rotate(Math.PI*.75);vItemIcon('rocket',0,0,10);vc.restore();}}
  for(const z2 of bw.zaps){vBolt(z2.x-cam,z2.z);if(--z2.t<=0)z2.dead=true;}bw.zaps=bw.zaps.filter(z2=>!z2.dead);
  for(const q of bw.plats)if((T>>3)&1)vline([q.x0-cam,q.z0+3-q.h,q.x1-cam,q.z0+3-q.h],.9,'#ffd84a');
  for(const hd of bw.heads){const x=hd.x-cam,y=hd.z-hd.h;vc.globalAlpha=.3;vfill(EL(x,hd.z,hd.w*.6,1.3),INK);vc.globalAlpha=1;
    vc.save();vc.translate(x,y-hd.hh/2);vc.rotate(hd.st==='fly'?hd.spin*.25:0);vHead(-hd.w/2,-hd.hh/2,hd.w,hd.hh,1,hd.hot&&(T>>1)&1?IP.warn:IP.foe,false,hd.type);
    if(hd.bomb){vline([0,-hd.hh/2-3,1.5,-hd.hh/2-5.5],.8,'#7a6a50');if((T>>1)&1)odot(1.6,-hd.hh/2-5.8,.9,'#ffd84a');if((hd.fuse>>(hd.fuse>80?3:1))&1){vc.globalAlpha=.45;vfill(RR(-hd.w/2,-hd.hh/2,hd.w,hd.hh,2),'#e8364f');vc.globalAlpha=1;}}
    vc.restore();if(hd.bomb&&hd.fuse<120&&(T>>2)&1)vtext(String(Math.ceil(hd.fuse/60)),x,y-hd.hh-9,5,'#ffd84a');}
  for(const d of bw.drops){const x=d.x-cam;vc.globalAlpha=.3;vfill(EL(x,d.z,3,1),INK);vc.globalAlpha=1;vBomb(x,d.z-d.h-3,3);}
  vSpecialsFX(cam);
  for(const q of bursts)vBurst(q.x,q.y,q.t);
  for(const q of parts){if(q.ring){vc.globalAlpha=.8;vc.beginPath();vc.ellipse(q.x-cam,q.y,q.r,q.r*.4,0,0,6.28);vc.lineWidth=1;vc.strokeStyle='#fff';vc.stroke();vc.globalAlpha=1;}else dot(q.x-cam+q.s/2,q.y+q.s/2,q.s*.55+.35,q.c);}
  for(const t of texts)if(t.t>6||(T&1))vtext(t.s,t.x-cam,t.y,5,t.c);
  vc.restore();
  vVignette();
  vHUD();
}
function vBOver(){
  vc.globalAlpha=.7;vfill(RR(0,0,W,H,0),'#0c0808');vc.globalAlpha=1;
  vNote(128,64,150,70,-.03,77,()=>{vtext('SIGNAL LOST',0,-18,12,INK,'c',null);vtext('SCORE '+bw.score,0,-2,7,'#7a3030','c',null);vc.save();vc.translate(-4,8);vc.scale(1.6,1.6);vCore(0,0,1,'hurt',true);vc.restore();if(bw.endT>60&&(T>>4)&1)vtext('A: TRY AGAIN   B: TITLE',0,28,4.6,INK,'c',null);});
}
// ---------- title, story, ending ----------
function vRoomBg(si){vc.setTransform(1,0,0,1,0,0);vc.drawImage(vStageCan(si),-((T*.15)%(SL-W-2))*VS,0);vc.setTransform(VS,0,0,VS,0,0);}
function vTitle(){
  vRoomBg(0);vc.globalAlpha=.45;vfill(RR(0,0,W,H,0),'#0c0808');vc.globalAlpha=1;
  vNote(128,64,196,108,-.025,7,()=>{
    vtext('HARDCORE',0,-40,19,INK,'c',null);vtext('LEGEND OF ONION HEAD',0,-28,5.6,'#7a3030','c',null);
    vc.save();vc.translate(-12.6,-4);vc.scale(3.2,3.2);vCore(0,0,1,'curious',true);vc.restore();
    ['PLAY','CLASSIC'].forEach((o,i)=>{const sel=titleSel===i,y=24+i*10;vtext((sel?'> ':'')+o+(sel?' <':''),0,y,sel?7:6,sel?((T>>4)&1?'#c9473a':INK):'#8a8276','c',null);});
  });
  vVignette();
  vtext(LANG==='he'?'L: ENGLISH':'L: עברית',5,138,4.4,'#cbc3b6','l');vtext('PROTOTYPE V'+VERSION,251,138,4.4,'#cbc3b6','r');
}
function vIntro(){
  vRoomBg(0);vc.globalAlpha=.55;vfill(RR(0,0,W,H,0),'#0c0808');vc.globalAlpha=1;
  const i=intro.i,line=tr(STORY[i]||''),shown=line.slice(0,Math.floor(intro.c));
  vNote(128,46,210,58,.015,i*13+3,()=>{const rows=vwrap(shown,184,7);rows.forEach((r,j)=>vtext(r,0,-14+j*10,7,i===3?'#c9473a':INK,'c',null));
    if(intro.c>=line.length&&(T>>4)&1)vtext('A',90,22,5,'#7a3030','c',null);});
  const buried=i<2?6:0;
  vfill(EL(128,126,60,10),'#5a4030');
  vc.save();vc.beginPath();vc.rect(0,0,W,126+buried*.2);vc.clip();vc.translate(112,92+buried);vc.scale(4,4);vCore(0,0,1,i>=4&&i<6?'idle':i>=6?'curious':'',i>=6||i<4);vc.restore();
  vVignette();
}
function vEnding(){
  vRoomBg(2);
  const rise=Math.min(1,endT/90);vc.save();vc.translate(0,(1-rise)*40);
  const r=vRig(128,GY,FR.king.s,1,0,false,0,IP.me,VFOPT.king);vDomes(124,r.topY-7,IP.me);vCore(124,r.topY-7,1,'curious');vc.restore();
  for(const q of parts)dot(q.x+q.s/2,q.y+q.s/2,q.s*.55+.35,q.c);
  if(endT%20===0)spark(rnd(40,216),rnd(20,80),6,['#ffd84a','#7fe6ff','#f0e8da'],1.5,.02);
  vVignette();
  if(endT>60)vNote(128,22,190,36,-.02,99,()=>{vtext('KING OF ROBOTS',0,-8,10,INK,'c',null);if(endT>150)vtext('THE MAKER IS SCRAP. ITS CORE IS STILL WARM.',0,3,4.2,'#4a3a32','c',null);if(endT>240&&(T>>3)&1)vtext('INSIDE IT, A SIGNAL: S.H.E.L.L.Y',0,10,4.2,'#7a3030','c',null);});
  if(endT>300&&(T>>4)&1)vtext('A: TITLE',128,136,5,'#f0e8da');
}
// ---------- hooking into the renderer ----------
function isVec(){return false;}
let vecMode=null;
function setViewMode(v){if(vecMode===v)return;vecMode=v;view.width=v?W*VS:W;view.height=v?H*VS:H;vx.imageSmoothingEnabled=!!v;document.body.classList.toggle('vec',!!v);}
function drawV(){
  vc.setTransform(1,0,0,1,0,0);vc.clearRect(0,0,vcan.width,vcan.height);vc.lineJoin='round';vc.lineCap='round';vc.setTransform(VS,0,0,VS,0,0);
  if(state==='title')vTitle();else if(state==='intro')vIntro();else if(state==='ending')vEnding();else{vBrawl();if(state==='bover')vBOver();}
}

function drawTitle(){
  g.drawImage(bg,0,0);
  const y0=14;
  txt('HARDC@RE',129,y0+1,C.mg,5,'c');txt('HARDC@RE',128,y0,C.cy,5,'c');
  txtS('LEGEND OF ONION HEAD',128,y0+29,C.yl,1,'c');
  g.save();g.translate(112,84);g.scale(4,4);drawCore(0,0,1,T);g.restore();
  px(104,112,48,2,C.cyx);
  ['PLAY','CLASSIC'].forEach((o,i)=>{const sel=titleSel===i,y=118+i*9;txtS((sel?'> ':'')+o+(sel?' <':''),128,y,sel?((T>>4)&1?C.yl:C.wh):C.gr,1,'c');});
  txt('PROTOTYPE V'+VERSION,252,137,C.grd,1,'r');
  txt(LANG==='he'?'L: ENGLISH':'L: HEBREW',4,137,(T>>6)&1?C.cyd:C.grd,1,'l');
}
function drawIntro(){
  if(intro.lines){drawLevelIntro();return;}
  px(0,0,W,H,C.void);
  for(let y=0;y<H;y+=4)px(0,y,W,1,'#10042a');
  const i=intro.i,line=tr(STORY[i]),shown=line.slice(0,Math.floor(intro.c));
  const col=i===3?C.mg:i===4||i===5?C.gr:i>=6?C.cy:C.wh;
  const words=shown.split(' ');let rows=[''];
  for(const w of words){if((rows[rows.length-1]+' '+w).trim().length>30)rows.push(w);else rows[rows.length-1]=(rows[rows.length-1]+' '+w).trim();}
  rows.forEach((r,j)=>txtS(r,128,40+j*12,col,2>1&&line.length<=30?1:1,'c'));
  if(intro.c>=line.length&&(T>>4)&1)px(LANG==='he'?128-textW(rows[rows.length-1])/2-6:128+textW(rows[rows.length-1])/2+3,40+(rows.length-1)*12,3,5,C.yl);
  // dirt and the head
  px(0,112,W,32,'#12061f');for(let x=0;x<W;x+=3)px(x,112+((x*7)%3),2,1,C.grid);
  const eye=i>=6,buried=i<2?4:0;
  g.save();g.translate(116,92+buried);g.scale(3,3);drawCore(0,0,1,i>=4&&i<6?0:T,eye);g.restore();
  px(104,112,48,buried*3,'#12061f');
  if(i===2){g.save();g.translate(150,86);g.scale(2,2);px(0,0,3,3,C.yl);px(0,3,3,6,C.yld);px(-1,9,1,4,C.yld);px(3,9,1,4,C.yld);px(-1,-2,5,2,C.yl);g.restore();}
  txt('A: NEXT',250,6,C.grd,1,'r');txt('START: SKIP',6,6,C.grd,1);
}
function drawHound(e,x,fy,t,pal){
  x=Math.round(x+(e.hurt>0?-e.face:0));fy=Math.round(fy);
  const f=e.face||-1,cr=e.st==='crouch'?2:0,dash=e.st==='dash',ph=(e.walk||0)*.45,mv=e.moving||dash;
  [-8,-4,3,7].forEach((o,i)=>{const lift=mv&&Math.sin(ph+i*1.6)>.3?2:0;box(x+o*f-1,fy-6+cr,2,6-lift-cr,pal);});
  box(x-11,fy-15+cr,22,9,pal);
  px(x-7,fy-13+cr,1,5,pal.line);px(x-3,fy-13+cr,1,5,pal.line);
  const hx=f>0?x+8:x-16,hy=fy-18+cr;
  if(e.noHead){px(f>0?x+9:x-11,fy-15+cr,2,3,pal.dark);}
  else{box(hx,hy-1,9,9,pal);
  for(let i=0;i<4;i++)px(hx+1+i*2,hy+5+(i%2),1,1,pal.mark);
  px(f>0?hx+5:hx+1,hy+1,3,3,pal.eye);if(e.st!=='stun')px(f>0?hx+6:hx+2,hy+2,1,1,C.void);}
  px(f>0?x-13:x+11,fy-17+cr,2,1,pal.line);px(f>0?x-13:x+12,fy-20+cr,1,3,pal.line);
  if(dash)for(let i=0;i<3;i++)px(f>0?x-20-i*5:x+14+i*5,fy-14+i*3,4,1,C.cyd);
  if(e.st==='crouch'){const j=(t>>2)&1;px(x-4,fy-27+j,1,1,C.yl);px(x-3,fy-26+j,1,1,C.yl);px(x,fy-28+j,1,3,C.yl);px(x+4,fy-27+j,1,1,C.yl);px(x+3,fy-26+j,1,1,C.yl);}
  if(e.st==='rec'&&(t>>4)&1)px(hx+(f>0?9:-3),hy+6,2,1,C.gr);
  if(e.st==='stun'||e.st==='down')stunStars(x,fy-20);
}
function drawWarden(e,t,pal){
  const x=Math.round(e.x),y=Math.round(e.y),down=e.st==='down'||e.st==='dead',lx=Math.round(e.lx);
  if(!down&&e.st!=='rise'){
    const col=e.st==='wind'||e.lock>20?C.yl:C.mg;
    g.globalAlpha=.17;for(let yy=y+10;yy<GY;yy+=2){const k=(yy-y)/(GY-y),cx=x+(lx-x)*k,w=3+14*k;px(cx-w,yy,w*2,1,col);}g.globalAlpha=1;
    px(lx-16,GY-1,32,1,col);
    if(e.st==='wind'&&(t>>1)&1)px(lx,y+12,1,GY-y-12,C.yl);
    if(e.st==='atk'){px(lx-5,y+10,11,GY-y-10,C.mg);px(lx-2,y+10,5,GY-y-10,C.wh);}
  }
  px(x-8,y-21,2,10,'#05010d');px(x+6,y-21,2,10,'#05010d');px(x-8,y-22,2,1,pal.line);px(x+6,y-22,2,1,pal.line);
  pixCircle(x,y,13,pal.line);pixCircle(x,y,12,pal.fill);px(x-8,y-9,4,1,pal.line);
  const ex=x+Math.round(clamp((pl.x-x)/40,-1,1)*4),ey=y+3;
  pixCircle(ex,ey,6,down?C.gr:C.wh);
  pixCircle(ex,ey,3,down?C.grd:(e.st==='wind'||e.st==='atk')?C.yl:C.mg);
  px(ex-1,ey-2,1,1,C.wh);
  if(!down){px(x-6,y+13,3,2+((t>>1)&1),C.yl);px(x+4,y+13,3,2+((t>>2)&1),C.yl);}
  if(e.st==='down')stunStars(x,y-15);
}
function drawMine(m){
  const x=Math.round(m.x),y=Math.round(m.y),bl=m.st==='fuse'&&(m.t>>1)&1;
  if(m.st==='walk'||m.st==='fuse'){const st=(m.f>>2)&1;px(x-3,y-2,1,2-st,C.mg);px(x+2,y-2,1,1+st,C.mg);}
  pixHex(x,y-6,4,1,bl?C.wh:C.mgd,true);pixHex(x,y-6,4,1,C.yl);
  px(x-1,y-7,2,2,bl?C.mg:C.void);
  px(x,y-12,1,2,C.gr);if((T>>1)&1)px(x,y-13,1,1,C.yl);
}
function drawSolid(r,x,y){
  if(r.kind==='ruin'){
    px(x,y-r.h,r.w,r.d,'#2a1450');px(x,y+r.d-r.h,r.w,r.h,'#150830');px(x,y-r.h,r.w,1,C.cyd);px(x,y+r.d-r.h,r.w,1,C.cyx);
    for(let i=0;i<r.w*r.h/50;i++)px(x+1+((i*37)%(r.w-2)),y+r.d-r.h+2+((i*13)%(Math.max(1,r.h-3))),1,1,i%3?C.yld:C.cyx);
  }else if(r.kind==='pine'){
    const cx=x+4;px(cx-1,y,3,4,C.grx);
    for(let i=0;i<r.h;i++){const w=Math.round(1+i*.3);px(cx-w,y-r.h+i+2,w*2+1,1,i%6===0?C.cyd:'#073040');}
    px(cx,y-r.h+1,1,1,C.cy);
  }else if(r.kind==='cabin'){
    const fy=y+r.d-r.h;
    px(x,y-4,r.w,r.d,C.mgx);
    px(x,fy,r.w,r.h,C.mgd);px(x,fy,r.w,1,C.mg);
    for(let i=0;i<12;i++){const w=Math.round((i+1)*(r.w+6)/24);px(x+r.w/2-w,fy-12+i,w*2,1,i===11?C.mg:i%3===0?C.mgd:C.mgx);}
    px(x+r.w-9,fy-14,4,8,C.mgx);
    px(x+5,fy+6,7,6,C.yl);px(x+8,fy+6,1,6,C.mgx);px(x+5,fy+8,7,1,C.mgx);
    px(x+r.w-13,fy+r.h-11,8,11,C.void);px(x+r.w-13,fy+r.h,8,3,C.yld);
  }else if(r.kind==='block'){
    const fy=y+r.d-r.h;
    px(x,y-r.h,r.w,r.d,'#2a0a18');px(x,fy,r.w,r.h,'#16040c');px(x,y-r.h,r.w,1,C.yld);
    for(let i=0;i<r.w;i+=4)px(x+i,fy,2,2,C.yl);
    for(let i=0;i<r.w*r.h/60;i++)px(x+2+((i*29)%(r.w-4)),fy+4+((i*11)%(Math.max(1,r.h-6))),2,1,i%2?C.yl:C.mgd);
  }else if(r.kind==='fence'){
    const F=FENCE[run.level],fy=y+r.d-r.h;px(x,y-r.h,r.w,r.d,F.top);px(x,fy,r.w,r.h,F.front);px(x,y-r.h,r.w,1,F.edge);
  }else if(r.kind==='vat'){
    const fy=y+r.d-r.h;
    px(x,fy,r.w,r.h,'#1e0610');px(x,fy+4,r.w,1,C.yld);px(x,fy+r.h-3,r.w,1,C.yld);
    px(x-1,fy-3,r.w+2,4,C.mgd);px(x+2,fy-2,r.w-4,2,(T>>4)&1?C.mg:'#ff6aa0');
    if((T+r.x)%40<6)px(x+4+((T>>3)%(r.w-8)),fy-4,1,1,C.mg);
  }
}
function drawMap(){
  px(0,0,W,H,LV.ground);
  const ox=-Math.round(cam.x),oy=-Math.round(cam.y);
  for(let x=(ox%32+32)%32;x<W;x+=32)px(x,0,1,H,LV.grid);
  for(let y=(oy%32+32)%32;y<H;y+=32)px(0,y,W,1,LV.grid);
  for(const t of LV.tufts){const sx=t.x+ox,sy=t.y+oy;if(sx<-2||sx>W||sy<-2||sy>H)continue;px(sx,sy,1,2,t.c);px(sx+2,sy+1,1,1,t.c);}
  if(run.level===0){pixHex(LV.start.x+ox,LV.start.y+oy+8,10,1,C.cyx);px(LV.start.x+ox-2,LV.start.y+oy+7,5,2,C.cyx);}
  px(ox,oy,WW,1,LV.edge);px(ox,oy+WH-1,WW,1,LV.edge);px(ox,oy,1,WH,LV.edge);px(ox+WW-1,oy,1,WH,LV.edge);
  const ds=[];
  for(const r of LV.solids){const sx=r.x+ox,sy=r.y+oy;if(sx<-60||sx>W+20||sy<-20||sy>H+50)continue;ds.push({y:r.y+r.d,f:()=>drawSolid(r,sx,sy)});}
  for(const gt of LV.gates){const sx=gt.x+ox,sy=gt.y+oy;if(sx<-30||sx>W+30||sy<-30||sy>H+30)continue;ds.push({y:gt.y+gt.d-.5,f:()=>drawGate(gt,sx,sy)});}
  for(const c of LV.caches){if(run.got[c.id])continue;ds.push({y:c.y,f:()=>drawCache(c,c.x+ox,c.y+oy)});}
  if(run.rig)ds.push({y:run.rig.y,f:()=>drawRig(run.rig,run.rig.x+ox,run.rig.y+oy)});
  for(const f of foes){if(run.beaten[f.id])continue;ds.push({y:f.y,f:()=>drawMapFoe(f,f.x+ox,f.y+oy)});}
  ds.push({y:run.py,f:()=>{const hop=inGate('chasm')?5:0,sx=Math.round(run.px+ox),sy=Math.round(run.py+oy)-hop;
    px(sx-4,sy+1+hop,8,2,C.cyx);
    const ph=(run.walk||0)*.5,mv=run.moving,sw=mv?Math.sin(ph):0,cw=mv?Math.cos(ph):0,bob=mv&&Math.abs(sw)>.7?1:0,la=cw>.3?1:0,lb=cw<-.3?1:0,l=Math.round(sw),fc=run.face||1;
    if(run.frame!=='core'){const big=run.frame!=='basic'?1:0;px(sx-3+l,sy,2,2-la,FP.me.shade);px(sx+1-l,sy,2,2-lb,FP.me.body);px(sx-3-big,sy-4+bob,6+big*2,4,FP.me.body);px(sx-4-big,sy-5+bob,8+big*2,1,FP.me.hi);px(sx-5-big,sy-3+bob,1,3,FP.me.shade);px(sx+4+big,sy-3+bob,1,3,FP.me.body);px(sx,sy-3+bob,1,1,C.wh);const nh=run.nest?3:0;if(nh){px(sx-2,sy-8+bob,4,3,FP.me.body);px(sx-3,sy-8+bob,6,1,FP.me.hi);}drawCore(sx-4,sy-12+bob-nh,fc,T,true,run.mood);}
    else{px(sx-3+l,sy-2,1,2-la,C.cy);px(sx+2-l,sy-2,1,2-lb,C.cy);drawCore(sx-4,sy-9+bob,fc,T,true,run.mood);}
  }});
  ds.sort((a,b)=>a.y-b.y).forEach(d=>d.f());
  for(const f of mapFx)px(f.x+ox,f.y+oy,1,1,f.c);
  if(run.rig){const sx=run.rig.x+ox,sy=run.rig.y+oy;if(sx<0||sx>=W||sy<12||sy>=H)px(clamp(sx,2,W-4),clamp(sy,14,H-4),2,2,C.cy);}
  for(const f of foes){if(run.beaten[f.id])continue;const sx=f.x+ox,sy=f.y+oy;if(sx>=0&&sx<W&&sy>=12&&sy<H)continue;const t=TYPES[f.type];px(clamp(sx,2,W-4),clamp(sy,14,H-4),2,2,t.boss||t.warden?C.yl:C.mg);}
  g.globalAlpha=.85;px(0,0,W,11,C.void);g.globalAlpha=1;px(0,11,W,1,C.cyx);
  txt('FRAME '+FR[run.frame].code+' '+FR[run.frame].name,4,3,C.cy);
  run.parts.forEach((p,i)=>px(84+i*5,4,3,3,run.equip.includes(p)?C.yl:C.yld));
  for(let i=0;i<(run.cells||0);i++)pixHex(144+i*7,5,2,1,C.yl,true);
  const left=foes.filter(f=>!run.beaten[f.id]).length;
  txt('HOSTILES '+left,252,3,C.mg,1,'r');
  const lm=LV.landmark,near=lm&&Math.hypot(run.px-lm.x,run.py-lm.y)<lm.r;
  let msg=null;
  if(run.hint&&run.hint.t>0)msg=run.hint.s;
  else if(near)msg=lm.msg;
  else if(mapT<420&&mapT>=150)msg=left===1?LV.bossHint:run.level===0?'WALK INTO A ROBOT TO FIGHT IT':'SALVAGE WHAT YOU CAN';
  else if(run.level===0&&mapT>=420&&mapT<780)msg='B: PARK THE RIG   START: RIG SCREEN';
  else if(mapT>=420&&left===1&&(T>>5)&1)msg=LV.bossHint;
  if(msg){g.globalAlpha=.85;px(128-textW(msg)/2-4,130,textW(msg)+8,11,C.void);g.globalAlpha=1;txt(msg,128,133,near||(run.hint&&run.hint.t>0)?C.cy:C.yl,1,'c');}
  if(mapT<150){
    const a=mapT<120||(T>>2)&1;
    if(a){g.globalAlpha=.8;px(0,44,W,34,C.void);g.globalAlpha=1;px(0,44,W,1,LV.edge);px(0,77,W,1,LV.edge);
      txt('LEVEL '+(run.level+1),128,49,C.mg,1,'c');txt(LV.name,129,58,C.mg,2,'c');txt(LV.name,128,57,C.yl,2,'c');}
  }
}

function drawLevelIntro(){
  g.drawImage(bgs[run.level],0,0);g.globalAlpha=.72;px(0,0,W,H,C.void);g.globalAlpha=1;
  txtS('LEVEL '+(run.level+1),128,12,C.mg,1,'c');txt(LV.name,129,21,C.mg,2,'c');txt(LV.name,128,20,C.yl,2,'c');
  const lines=intro.lines,line=tr(lines[intro.i]),shown=line.slice(0,Math.floor(intro.c));
  const words=shown.split(' ');let rows=[''];
  for(const w of words){if((rows[rows.length-1]+' '+w).trim().length>40)rows.push(w);else rows[rows.length-1]=(rows[rows.length-1]+' '+w).trim();}
  rows.forEach((r,j)=>txtS(r,128,54+j*11,C.wh,1,'c'));
  if(intro.c>=line.length&&(T>>4)&1)px(LANG==='he'?128-textW(rows[rows.length-1])/2-6:128+textW(rows[rows.length-1])/2+3,54+(rows.length-1)*11,3,5,C.yl);
  const wx=((T*.5)%(W+40))-20,ph=T*.3,s=Math.round(Math.sin(ph));
  px(wx+1+s,113,1,4,C.cy);px(wx+6-s,113,1,4,C.cy);px(wx,106,8,7,C.cy);drawCore(wx,106-(Math.abs(Math.sin(ph))>.7?0:1),1,T,true,'');
  txt('A: NEXT',250,136,C.grd,1,'r');txt('START: SKIP',6,136,C.grd,1);
}
function drawMapFoe(f,sx,sy,pv){
  const t=TYPES[f.type],r=t.r;sx=Math.round(sx);sy=Math.round(sy);
  const big=t.boss||t.warden,st=(T>>3)&1;
  px(sx-r,sy+1,r*2,2,C.mgx);
  if(big&&!pv){const pulse=(T>>4)&1;pixHex(sx,sy-10,r+6+pulse,1,pulse?C.yl:C.yld);}
  if(t.warden){
    const y=sy-22+Math.round(Math.sin(T*.05)*2);
    g.globalAlpha=.25;px(sx-5,y+8,10,sy-y-8,C.mg);g.globalAlpha=1;
    px(sx-6,y-14,1,6,'#05010d');px(sx+5,y-14,1,6,'#05010d');
    pixCircle(sx,y,8,C.mg);pixCircle(sx,y,7,C.mgd);pixCircle(sx,y+1,3,C.wh);px(sx-1,y,2,2,C.mg);
  }else if(t.boss){
    const P2=t.pal==='maker'?PAL.maker:PAL.foe;
    box(sx-14,sy-4,8,6,P2);box(sx+6,sy-4,8,6,P2);
    box(sx-16,sy-24,32,20,P2);box(sx-5,sy-30,10,7,P2);pent(sx,sy-16,C.wh);px(sx-2,sy-28,3,2,C.yl);
    if(t.pal==='maker'){px(sx-7,sy-35,2,6,C.yl);px(sx+5,sy-35,2,6,C.yl);}
  }else if(t.dash){
    const fx=f.dx<0?-1:1;
    px(sx-6,sy-2,1,2+st,C.mg);px(sx+5,sy-2,1,3-st,C.mg);px(sx-3,sy-2,1,3-st,C.mg);px(sx+2,sy-2,1,2+st,C.mg);
    box(sx-8,sy-8,16,6,PAL.foe);box(fx<0?sx-13:sx+7,sy-10,6,5,PAL.foe);px(fx<0?sx-12:sx+10,sy-9,2,1,C.yl);
  }else{
    px(sx-r+1,sy-2+st,2,3-st,C.mg);px(sx+r-3,sy-1-st+1,2,2+st,C.mg);
    box(sx-r,sy-r*2,r*2,r*2-1,PAL.foe);px(sx+(f.dx<0?-r+1:r-3),sy-r*2+2,2,2,C.yl);
    if(f.type==='lancer')px(sx+r,sy-r-2,1,8,C.wh);
    if(f.type==='walker')px(sx-r+2,sy-r*2+2,r*2-4,3,C.cyx);
    if(f.type==='shaman')for(let i=0;i<4;i++){px(sx-r-1-i,sy-r*2+3-i,1,3,C.mg);px(sx+r+i,sy-r*2+3-i,1,3,C.mg);}
    if(f.type==='guard'){const gx=f.dx<0?sx-r-3:sx+r+1;px(gx,sy-r*2-1,2,r*2,C.yl);px(gx,sy-r,2,1,C.mg);}
    if(f.type==='bomber'){px(sx-r+2,sy-r*2+2,r*2-4,r-1,C.cyx);px(sx-1,sy-r*2-3,1,3,C.mg);pixHex(sx,sy-r-1,2,1,C.mg,true);}
  }
  if(pv)return;
  const label=run.known[f.type]?scaled(t,f.type,run.level).name:'?';
  txt(label,sx,sy-(big?46:t.dash?20:r*2+8),run.known[f.type]?C.mg:C.yl,1,'c');
}
function drawPrep(){
  px(0,0,W,H,C.deep);
  for(let i=0;i<5;i++){const x=40+i*52;for(let y=0;y<H;y++)px(x+((y*.5)|0)-30,y,6,1,'#1d0a3d');}
  const hd=prep.rig?'THE RIG':'BATTLE PREP';txt(hd,129,5,C.mg,2,'c');txt(hd,128,4,C.yl,2,'c');
  // left panel
  const L=[4,18,124,122];px(L[0],L[1],L[2],L[3],C.cy);px(L[0]+1,L[1]+1,L[2]-2,L[3]-2,C.void);
  txt('YOU',8,22,C.cyd);
  const f=FR[run.frame];
  const psc=(run.frame==='core'||run.frame==='basic')&&!run.nest?2:1;g.save();g.translate(38,psc===1?78:70);g.scale(psc,psc);
  if(run.frame==='core'){px(-3,-3,1,3,C.cy);px(2,-3,1,3,C.cy);drawCore(-4,-10,1,T);}
  else{const r=drawFrame(0,0,run.frame,f.s,1,0,false,0,FP.me);let ct=r.topY;if(run.nest){const ns=FR[run.nest].s,ir=drawRider(r.topY,ns.lh,y=>drawFrame(0,y,run.nest,ns,1,0,false,0,FP.me));ct=ir.topY;}drawCore(-4,ct-7,1,T);drawDomes(-4,ct-7,FP.me);}
  g.restore();
  txt(f.code,76,24,C.cy,3);
  txt(f.name,76,42,C.wh);
  const shellMax=run.frame==='core'?0:f.shell+(run.equip.includes('plate')?30:0);
  txt('SHELL '+shellMax+(run.nest?'+'+FR[run.nest].shell:''),76,52,C.cyd);txt('PUNCH '+(f.dmg+(run.equip.includes('glove')&&run.frame!=='core'?3:0)),76,59,C.cyd);
  txt('SLOTS '+run.equip.length+'/'+f.slots,76,66,C.cyd);
  const sp=run.frame==='core'?null:run.equip.find(p=>PARTS[p].kind==='special');
  txt('UP: '+(sp?PARTS[sp].name.split(' ')[0]:'NONE'),76,73,sp?C.yl:C.grd);
  const rowCol=i=>prep.cur===i?C.yl:C.wh;
  if(prep.cur===0){px(6,81,120,9,C.cyx);}
  txt((prep.cur===0?'< ':'  ')+'FRAME '+f.code+' '+f.name+(prep.cur===0?' >':''),8,83,rowCol(0));
  if(prep.cur===1){px(6,89,120,9,C.cyx);}
  const canNest=run.frame!=='core'&&run.frames.filter(f=>f!=='core').length>1;
  const nn=run.nest?FR[run.nest].code+' '+FR[run.nest].name:canNest?'NONE':'NEEDS A 2ND FRAME';
  txt((prep.cur===1?'< ':'  ')+'NEST: '+nn+(prep.cur===1?' >':''),8,91,prep.cur===1?C.yl:run.nest?C.cy:C.grd);
  if(!run.parts.length)txt('NO UPGRADES YET',8,103,C.grd);
  const VIS=4,np=run.parts.length,st0=clamp(clamp(prep.cur-2,0,Math.max(0,np-1))-1,0,Math.max(0,np-VIS));
  if(st0>0){px(120,98,1,1,C.cy);px(119,99,3,1,C.cy);}
  if(st0+VIS<np){px(119,131,3,1,C.cy);px(120,132,1,1,C.cy);}
  run.parts.slice(st0,st0+VIS).forEach((p,j)=>{
    const i=j+st0,y=102+j*7,on=run.equip.includes(p),sel=prep.cur===i+2;
    if(sel)px(6,y-2,120,8,C.cyx);
    px(8,y,5,5,on?C.yl:C.grd);if(!on)px(9,y+1,3,3,C.void);
    txt(PARTS[p].name,16,y,sel?C.yl:on?C.cy:C.gr);
  });
  if(run.rig&&prep.msgT<=0&&!prep.rig)txt('YOUR RIG IS PARKED',8,132,C.cyd);
  if(prep.msgT>0)txt(prep.msg,8,132,C.mg);
  // right panel
  if(!prep.foe){drawRigPanel();return;}
  const R=[130,18,122,122],foe=prep.foe,t=TYPES[foe.type],known=run.known[foe.type];
  px(R[0],R[1],R[2],R[3],C.mg);px(R[0]+1,R[1]+1,R[2]-2,R[3]-2,C.void);
  px(R[0]+1,R[1]+1,R[2]-2,56,'#f4e9f7');
  txt('FRAME 0X'+t.code.slice(1),248,22,C.mgd,1,'r');
  const scd=scaled(t,foe.type,run.level);
  if(t.boss||t.warden){g.save();g.translate(191,t.warden?84:66);if(t.warden)g.scale(2,2);drawMapFoe(Object.assign({},foe,{dx:-1}),0,0,true);g.restore();px(R[0]+1,R[1]+1,R[2]-2,8,'#f4e9f7');txt('FRAME 0X'+t.code.slice(1),248,22,C.mgd,1,'r');}
  else{const sc=(t.lh+t.th+t.hh)<=30?2:1;g.save();g.translate(191,70);g.scale(sc,sc);drawFoe({type:foe.type,T:t,face:-1,st:'idle',moving:false},0,0,T,known?PAL.foe:PAL.sil);g.restore();}
  txt(known?scd.name:'UNKNOWN',191,80,C.mg,1,'c');
  bar(138,88,106,4,1,C.mg,C.mgx);
  txt('HP '+(known?scd.hp:'???'),138,95,C.mgd);
  const n=run.parts.length;
  const fSel=prep.cur===n+2,rSel=prep.cur===n+3;
  if(fSel)px(134,111,114,10,C.mgx);if(rSel)px(134,123,114,10,C.mgx);
  txt((fSel?'> ':'  ')+'FIGHT',138,114,fSel?C.yl:C.wh,1);
  txt((rSel?'> ':'  ')+'RETREAT',138,126,rSel?C.yl:C.gr,1);
}
function drawFight(){
  g.drawImage(bgs[run.level],0,0);
  g.save();if(shake)g.translate(Math.round(rnd(-shake,shake)),Math.round(rnd(-shake,shake)));
  if(en.T.boss){
    if(en.st==='slamwind'&&(T>>2)&1){px(en.tx-12,GY-1,24,2,C.yl);for(let y=30;y<GY;y+=6)px(en.tx,y,1,2,C.yld);}
    if(en.st==='swwind'&&(T>>2)&1)for(let x=en.x-128;x<en.x-44;x+=6)px(x,GY-1,3,2,C.yl);
  }
  drawDebris();
  drawHusk();
  if(!en.gone){
    const base=en.T.pal==='maker'?PAL.maker:PAL.foe;
    const pal=(en.hurt>0&&(en.hurt&2))||(en.st==='phase'&&(T>>2)&1)?PAL.hit:en.st==='wind'&&!en.T.warden&&(T>>2)&1?PAL.warn:base;
    const hide=(en.st==='dead'&&(T>>1)&1)||(en.st==='blink'&&(en.t>>1)&1);
    if(!hide){if(en.T.boss)drawBoss(en,T,pal);else if(en.T.warden)drawWarden(en,T,pal);else drawFoe(en,en.x,en.y,T,pal);}
  }
  for(const st of strikes){const bl=(T>>2)&1;px(st.x-6,GY-1,12,1,bl?C.yl:C.yld);px(st.x-6,GY-3,1,2,C.yl);px(st.x+5,GY-3,1,2,C.yl);if(st.t<12){const my=GY-st.t*9;px(st.x-1,my-7,3,7,C.mg);px(st.x,my-9,1,2,C.wh);px(st.x,my-12,1,3,C.yl);}}
  for(const m of mines)drawMine(m);
  for(const o of eprojs){px(o.x-2,o.y-2,4,4,C.mg);px(o.x-1,o.y-1,2,2,C.wh);}
  drawPlayer();
  for(const p of projs){
    if(p.kind==='rocket'){
      if(p.ph==='up'){px(p.x-1,p.y,3,6,C.cy);px(p.x-1,p.y-2,3,2,C.mg);px(p.x,p.y+6,1,2+((T>>1)&1),C.yl);}
      else if(p.ph==='lock'){
        const lx=Math.round(p.tx),ly=en.T.boss?GY-104+Math.round(en.k):en.T.warden?Math.round(en.y-20):Math.round(en.y-(en.T.lh+en.T.th+en.T.hh)-8);
        if((T>>2)&1){px(lx-6,ly,3,1,C.yl);px(lx+4,ly,3,1,C.yl);px(lx,ly-6,1,3,C.yl);px(lx,ly+4,1,3,C.yl);}
        px(lx-3,ly-3,1,1,C.mg);px(lx+3,ly-3,1,1,C.mg);px(lx-3,ly+3,1,1,C.mg);px(lx+3,ly+3,1,1,C.mg);
      }else{px(p.x-1,p.y-6,3,6,C.cy);px(p.x-1,p.y,3,2,C.mg);px(p.x,p.y-9,1,3,C.yl);}
    }else{px(p.x-4,p.y-1,8,2,p.col||C.mg);px(p.x-2,p.y,5,1,C.wh);}
  }
  drawBursts();
  for(const p of parts)px(p.x,p.y,p.s,p.s,p.c);
  for(const t of texts)if(t.t>6||(T&1))txtS(t.s,t.x,t.y,t.c,1,'c');
  g.restore();
  // hud: you
  px(4,4,9,9,C.cyd);px(6,6,14,14,'#f4e9f7');g.save();g.translate(9,12);drawCore(0,0,1,T,true,playerMood());g.restore();
  const shW=textW('SHELL')+4;px(23,5,shW,8,C.mgd);txt('SHELL',25,7,'#ffd3e0');
  bar(23,15,80,3,pl.shellMax?pl.shell/pl.shellMax:0,pl.shell<=pl.shellMax*.35?C.mg:C.cy,C.cyx);
  if(pl.inner){px(23,19,40,1,C.cyx);px(23,19,Math.round(40*pl.inner.shell/pl.inner.shellMax),1,C.cyd);txt(FR[pl.inner.fid].code,106,14,C.cyd);}
  const cx0=23+shW+4,cpx=cx0+textW('CORE')+3;txt('CORE',cx0,7,C.yl);for(let i=0;i<pl.coreMax;i++)px(cpx+i*6,6,4,5,i<pl.core?C.yl:C.grd);
  if(pl.special&&pl.mode==='frame'){txt('UP '+PARTS[pl.special].name.split(' ')[0],23,21,pl.cd<=0?C.yl:C.yld);bar(23+textW('UP '+PARTS[pl.special].name.split(' ')[0])+3,22,24,3,1-pl.cd/pl.cdMax,C.yl,C.yld);}
  if(pl.comboWin>0||(pl.atkKind==='melee'&&pl.atk>0)){for(let i=0;i<3;i++)px(92+i*4,21,3,3,i<=pl.combo&&(pl.atk>0||pl.comboWin>0)?C.cy:C.cyx);}
  if(pl.hits>=2){const big=pl.hits>=6;txtS(pl.hits+' HITS',6,30,big?C.yl:C.cy,big?2:1,'l');}
  // hud: enemy
  const known=run.known[en.type];
  txtS(known?en.name:'UNKNOWN',252,5,C.wh,1,'r');
  txt('FRAME 0X'+en.T.code.slice(1),252,12,C.mg,1,'r');
  bar(150,20,102,4,en.hp/en.max,C.mg,C.mgx);
  // prompts
  if(canEject()&&pl.shell<=pl.shellMax*.35&&(T>>3)&1)txtS('DOUBLE TAP DOWN: EJECT',128,32,C.yl,1,'c');
  if(en.T.boss&&en.st==='kneel'&&!pl.plat)txtS('HIT THE CORE, OR CLIMB THE ARM',128,126,C.yl,1,'c');
  if(en.T.boss&&pl.plat&&['shL','torso','shR'].includes(pl.plat)&&en.st!=='dead')txtS('HIT THE HEAD',128,126,C.mg,1,'c');
  if(en.T.warden&&mines.length&&en.st!=='down'&&en.st!=='dead'&&(T>>4)&1)txtS('KICK THE BOMBS UP AT THE WARDEN',128,126,C.yl,1,'c');
  if(en.T.shield&&fightT<400&&(run.fights||0)<9&&(T>>4)&1&&!run.known[en.type])txtS('HEAVY HITS BREAK SHIELDS. OR GET BEHIND IT',128,126,C.yl,1,'c');
  if((run.fights||0)<2&&fightT<600&&fightT>60)txtS('B B B: COMBO   A: JUMP   HOLD B: CHARGE   DOWN+B IN AIR: DIVE',128,136,C.grd,1,'c',C.void);
  if(banner){const sc=banner.s.length>6?2:3;txt(banner.s,129,56,C.mg,sc,'c');if((banner.t>>2)&1||banner.t>40)txt(banner.s,128,55,banner.s==='FIGHT'?C.yl:C.cy,sc,'c');}
}
function drawResult(){
  drawFight();g.globalAlpha=.88;px(0,0,W,H,C.void);g.globalAlpha=1;
  const hd=result.next!=null?'LEVEL CLEAR':'SALVAGE';txt(hd,129,21,C.mg,3,'c');txt(hd,128,20,C.yl,3,'c');
  txt(result.name+' DOWN',128,42,C.wh,1,'c');
  let y=56;
  if(!result.lines.length){txt('NOTHING NEW',128,y,C.gr,1,'c');y+=9;}
  for(const l of result.lines){txt('+ '+l,128,y,C.cy,1,'c');y+=9;}
  if(result.lost.length){y+=4;for(const l of result.lost){txt('LOST: '+l,128,y,C.mg,1,'c');y+=9;}}
  if((T>>4)&1)txt(result.next!=null?'A: ONWARD':'A: BACK TO THE MAP',128,128,C.wh,1,'c');
}
function drawDead(){
  px(0,0,W,H,'#08010f');for(let y=0;y<H;y+=3)px(0,y,W,1,'#12031f');
  if(Math.random()<.2)glitch=Math.max(glitch,.5);
  txt('SIGNAL LOST',129,31,C.cy,3,'c');txt('SIGNAL LOST',128,30,C.mg,3,'c');
  g.save();g.translate(128,78);g.scale(3,3);px(-9,4,18,1,C.grd);g.transform(0,1,-1,0,0,0);drawCore(-4,-4,1,0,false);g.restore();
  if(deadT>30)txt('THE ROBOT IS BROKEN ONCE MORE.',128,98,C.wh,1,'c');
  if(deadT>60)txt('TIME PASSES.',128,108,C.gr,1,'c');
  if(deadT>60&&(T>>4)&1)txt(run.level===0?'A: REBOOT AT THE BURIAL SITE':'A: REBOOT AT THE EDGE OF '+LV.name,128,126,C.yl,1,'c');
}
function drawEnding(){
  g.drawImage(bgs[2],0,0);
  const s=FR.king.s,rise=Math.min(1,endT/90);
  g.save();g.translate(0,Math.round((1-rise)*40));
  const r=drawFrame(128,GY,'king',s,1,0,false,0,FP.me);
  drawCore(124,r.topY-7,1,T);drawDomes(124,r.topY-7,FP.me);
  g.restore();
  if(endT%20===0)spark(rnd(40,216),rnd(20,80),6,[C.yl,C.cy,C.mg],1.5,.02);
  for(const p of parts)px(p.x,p.y,p.s,p.s,p.c);
  if(endT>60){txt('KING OF ROBOTS',129,9,C.mg,2,'c');txt('KING OF ROBOTS',128,8,C.yl,2,'c');}
  if(endT>150)txtS('THE MAKER IS SCRAP. ITS CORE IS STILL WARM.',128,26,C.wh,1,'c');
  if(endT>240&&(T>>3)&1)txtS('INSIDE IT, A SIGNAL: S.H.E.L.L.Y',128,34,C.cy,1,'c');
  if(endT>300&&(T>>4)&1)txtS('A: TITLE',128,136,C.wh,1,'c');
}
function render(){
  if(isVec()){setViewMode(true);drawV();vx.setTransform(1,0,0,1,0,0);vx.drawImage(vcan,0,0);glitch*=.9;if(glitch<.01)glitch=0;return;}
  setViewMode(false);
  switch(state){
    case 'title':drawTitle();break;case 'brawl':drawBrawl();break;case 'bover':drawBOver();break;case 'intro':drawIntro();break;case 'map':drawMap();break;
    case 'prep':drawPrep();break;case 'memory':drawMap();drawMemory();break;case 'fight':drawFight();break;case 'result':drawResult();break;
    case 'dead':drawDead();break;case 'ending':drawEnding();break;
  }
  present();
}
function present(){
  const gl=reduce?Math.min(glitch,.2):glitch;
  vx.globalCompositeOperation='source-over';
  if(gl>.06){
    rc.globalCompositeOperation='source-over';rc.drawImage(buf,0,0);rc.globalCompositeOperation='multiply';rc.fillStyle='#ff0000';rc.fillRect(0,0,W,H);
    cc.globalCompositeOperation='source-over';cc.drawImage(buf,0,0);cc.globalCompositeOperation='multiply';cc.fillStyle='#00ffff';cc.fillRect(0,0,W,H);
    const o=Math.max(1,Math.round(gl*3));
    vx.fillStyle='#000';vx.fillRect(0,0,W,H);
    vx.globalCompositeOperation='lighter';vx.drawImage(red,-o,0);vx.drawImage(cyn,o,0);
    vx.globalCompositeOperation='source-over';
    const n=Math.round(gl*7);
    for(let i=0;i<n;i++){const y=(Math.random()*H)|0,h=1+((Math.random()*7)|0),dx=Math.round((Math.random()-.5)*gl*30);vx.drawImage(buf,0,y,W,h,dx,y,W,h);}
    if(gl>.4){const cols=[C.mg,C.cy,C.yl];vx.globalAlpha=.75;for(let i=0;i<3;i++){vx.fillStyle=cols[i];vx.fillRect((Math.random()*W)|0,(Math.random()*H)|0,4+((Math.random()*30)|0),1+((Math.random()*3)|0));}vx.globalAlpha=1;}
  }else vx.drawImage(buf,0,0);
  glitch*=.9;if(glitch<.01)glitch=0;
}

// ---------- loop + layout ----------
const stage=document.getElementById('stage');
function fit(){
  const r=stage.getBoundingClientRect(),aw=r.width-16,ah=r.height-16;
  let s=Math.min(aw/W,ah/H);if(s>=2)s=Math.floor(s);s=Math.max(1,s);
  view.style.width=Math.round(W*s)+'px';view.style.height=Math.round(H*s)+'px';
}
addEventListener('resize',fit);fit();
let last=performance.now(),acc=0;
function loop(now){
  acc+=Math.min(100,now-last);last=now;
  // fixed steps; FEEL.game.speed stretches the step length, so everything slows evenly
  const dt=1000/(60*Math.max(.1,FEEL.game.speed||1));
  let n=0;while(acc>=dt&&n<4){step();acc-=dt;n++;}
  render();requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();
