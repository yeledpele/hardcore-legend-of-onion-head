// HARDCORE street: every level of the PLAY campaign, section by section. Written by the level editor (dev panel); fine to edit by hand.
// Each section is a list of spawns. x is from the section's left edge (0-256; negative = comes in from behind), z is depth (110-138):
//   [robot, x, z]          a robot: scrap, lancer, hound, guard, brute, walker; [robot, x, z, 1] makes it a mini-boss
//   ["C", x, z]            a crate
//   ["P", kind, x, z]      a prop: car, bin, barrel, pine, fence, lamp, tank, pot, blocks, cube, can, sugar (any "P" turns off the random props)
//   ["H", x, z]            a civilian (any "H" turns off the random civilians)
//   ["BOSS", type]         the level's boss (section 5)
// mud: [[section, x0, x1]] and belt: [[section, x0, x1, direction]], sections counted from 0. intro: the level banner's story lines.
const STREET=[
  {theme:0,name:"THE BURIAL WASTE",
   secs:[
    [["scrap",200,120],["scrap",236,134]],
    [["scrap",210,116],["lancer",240,132],["C",150,128]],
    [["brute",220,124,1],["scrap",-30,132]],
    [["scrap",200,124],["lancer",-30,116],["C",120,118]],
    [["BOSS","matry"]]
   ]},
  {theme:1,name:"THE PINE FOREST",intro:["THE COLOSSUS FALLS.","ITS ARM POINTS NORTH, TO THE PINES.","SHELLY LIVED IN THE PINES.","ONION HEAD WALKS NORTH."],
   secs:[
    [["guard",220,122],["scrap",240,134]],
    [["hound",230,114],["hound",-30,134],["C",140,128]],
    [["walker",220,122,1],["hound",-30,132]],
    [["scrap",230,116],["guard",240,132],["C",120,124]],
    [["BOSS","warden"]]
   ]},
  {theme:3,name:"THE TOY WORKS",intro:["THE WARDEN GOES QUIET.","ITS LAST SIGNAL CAME FROM THE FOUNDRY.","THE ROAD RUNS THROUGH A TOY FACTORY.","SOMETHING INSIDE IS STILL WOUND UP."],belt:[[1,0,256,-1],[2,0,256,-1],[3,0,256,-1]],
   secs:[
    [["scrap",200,120],["scrap",236,134],["lancer",240,116]],
    [["hound",230,114],["hound",-30,134],["C",140,128]],
    [["guard",220,124,1],["lancer",-30,132]],
    [["brute",210,118],["walker",240,132],["scrap",-30,124],["C",120,124]],
    [["BOSS","knight"]]
   ]},
  {theme:4,name:"HERMIT HARBOUR",intro:["THE KNIGHT RUNS DOWN.","THE ROAD ENDS AT A NIGHT HARBOUR.","EMPTY BODIES WASH UP ON THE PIER.","SOMETHING IS COLLECTING THEM."],
   secs:[
    [["scrap",200,120],["scrap",236,134],["lancer",240,116]],
    [["hound",230,114],["hound",-30,134],["C",150,128]],
    [["guard",220,124,1],["scrap",-30,132]],
    [["brute",210,118],["walker",240,132],["lancer",-30,124],["C",120,124]],
    [["BOSS","crab"]]
   ]},
  {theme:5,name:"THE MAGNET YARD",intro:["THE CRAB LETS GO OF ITS DREAM SHELL.","PAST THE PIER, A SCRAPYARD HUMS.","A MAGNET PULLS AT EVERY BODY.","ONLY A CORE IS TOO LIGHT TO LIFT."],
   secs:[
    [["scrap",200,118],["scrap",230,132],["scrap",-30,124]],
    [["lancer",220,118],["walker",240,132],["C",140,126]],
    [["brute",220,124,1],["hound",-30,132]],
    [["walker",220,118],["guard",240,132],["scrap",-30,124],["C",120,124]],
    [["BOSS","crane"]]
   ]},
  {theme:6,name:"THE GULLET BOG",intro:["THE CRANE FALLS SILENT.","THE ROAD SINKS INTO A SWAMP","OF DROWNED MACHINES.","SOMETHING BIG IS CROAKING."],mud:[[0,80,150],[1,60,140],[2,120,200],[3,40,110],[4,30,90]],
   secs:[
    [["scrap",200,118],["scrap",230,132],["scrap",-30,124]],
    [["hound",230,114],["hound",-30,134],["C",170,128]],
    [["brute",220,124,1],["lancer",-30,132]],
    [["guard",220,118],["walker",240,132],["hound",-30,124],["C",150,124]],
    [["BOSS","toad"]]
   ]},
  {theme:7,name:"THE GIANT'S KITCHEN",intro:["THE TOAD KING BURPS ITS LAST.","A DOOR IN THE BOG OPENS ONTO A KITCHEN.","ONION HEAD IS TINY HERE.","THE COOK IS HUNGRY."],
   secs:[
    [["scrap",200,120],["scrap",236,134],["lancer",240,116]],
    [["hound",230,114],["hound",-30,134],["C",140,128]],
    [["walker",220,124,1],["scrap",-30,132]],
    [["brute",210,118],["brute",240,132],["lancer",-30,124],["C",120,124]],
    [["BOSS","cook"]]
   ]},
  {theme:2,name:"THE FOUNDRY",intro:["THE COOK DROPS ITS PAN.","BEHIND THE STOVE LIES THE FOUNDRY,","WHERE THE GIANTS ARE MADE.","THE ONE THAT TOOK SHELLY IS THERE."],
   secs:[
    [["hound",220,114],["brute",240,130]],
    [["guard",220,118],["guard",240,134],["lancer",-30,124],["C",150,126]],
    [["brute",220,116,1],["brute",240,134,1]],
    [["walker",230,122],["hound",240,134],["C",130,122]],
    [["BOSS","maker"]]
   ]}
];
