// HARDCORE feel file: the numbers that decide how the PLAY campaign feels. Change them here (or live with the dev panel, ?dev=1).
// One value per line, "name: number," so the dev tools can rewrite values in place. Times are in frames (60 per second).
const FEEL={
  game:{
    speed: 0.85,          // master game speed: 1 = 60 steps a second; lower slows everything evenly (both modes)
    glitch: 1             // strength of the screen glitch, shown only when you take damage and on the fail screen (0 = off)
  },
  player:{
    jumpCore: 3.9,        // jump speed of the bare core
    jumpBody: 3.4,        // jump speed in a body
    jumpSizeLoss: 0.08,   // each body size step jumps this much lower
    gravityUp: 0.19,      // gravity while rising
    gravityDown: 0.3,     // gravity while falling
    jumpCut: 0.6,         // releasing A early multiplies upward speed by this (short hop)
    jumpCutSpeed: 1.2,    // ...only while rising faster than this
    airFriction: 0.94,    // horizontal slowdown in the air (per frame)
    depthSpeed: 0.7,      // up/down (depth) speed compared to left/right
    grabSlow: 0.6,        // speed while holding a robot
    abWindow: 6,          // frames between A and B that still count as A+B together
    diveSpeed: 5,         // downward speed of the Down+B dive
    diveGravity: 0.5      // gravity during the dive
  },
  // acceleration (a) and ground friction (f) per body: low a + high f = heavy and slidey
  weight:{
    core:{a: 0.7, f: 0.5},
    basic:{a: 0.4, f: 0.74},
    brute:{a: 0.24, f: 0.86},
    walker:{a: 0.28, f: 0.83},
    titan:{a: 0.18, f: 0.9},
    king:{a: 0.18, f: 0.9},
    flyer:{a: 0.18, f: 0.95}
  },
  jetpack:{
    fuel: 70,             // frames of thrust
    refill: 1.5,          // fuel back per frame on the ground
    thrust: 0.5,          // upward push per frame
    vmax: 2.4,            // fastest climb
    cap: 42               // highest it can climb
  },
  combat:{
    jabTime: 12,          // combo hit 1: length, and the frame it lands on
    jabHitAt: 8,
    slashTime: 12,        // combo hit 2
    slashHitAt: 8,
    finisherTime: 20,     // combo hit 3 (launches)
    finisherHitAt: 11,
    finisherLunge: 1.4,   // forward push on hit 3
    comboWindow: 12,      // frames after a hit to keep the combo going
    airTime: 12,          // jump attack
    airHitAt: 7,
    throwSpeed: 4.2,      // how fast a thrown robot flies
    hurtInvuln: 50,       // invulnerable frames after you get hit
    hurtKnockback: 2.4,   // how far a hit pushes you
    hurtHitstop: 4,       // freeze frames when you get hit
    hitstopLight: 3,      // freeze frames when you land a hit
    hitstopHeavy: 6,
    powerPerHit: 5,       // POWER gained per hit landed
    powerPerKill: 12,     // POWER gained per robot beaten
    specialCost: 50,      // POWER cost of a body's special
    knifeCost: 25,        // POWER cost of the core's knife throw
    guardMax: 100,        // guard meter (block): full
    guardPerDamage: 5,    // guard lost per point of damage blocked
    guardRegen: 0.5,      // guard back per frame when you're not blocking
    guardDelay: 40,       // frames after a blocked hit before the guard starts coming back
    guardBreakStun: 70    // frames stunned when the guard breaks
  },
  robots:{
    maxAttackers: 2,      // robots allowed to attack at once
    roleEvery: 40,        // frames between picking who attacks
    waitDistance: 60,     // how far waiting robots hang back
    speed: 1.15,          // robot speed multiplier
    bossSpeed: 0.8,       // mini-boss speed multiplier
    hp: 0.7,              // robot health multiplier
    miniBossHp: 1.7,      // mini-boss health multiplier
    finalHp: 1.2,         // health multiplier for the Maker's last robots
    damage: 0.8,          // robot damage multiplier
    hpPerTier: 0.3,       // extra health per difficulty tier (tier 0 at level 1, 2 at the last level)
    damagePerTier: 0.15,  // extra damage per difficulty tier
    bodyShellLeft: 0.7,   // a beaten robot's body keeps this share of its shell
    headBombChance: 0.34, // chance a popped head is a ticking bomb
    scrapDrop: 0.25,      // chance a beaten robot drops scrap
    wreckScrap: 0.3       // chance a robot that leaves no body leaves scrap in its wreck
  },
  // chance a beaten robot leaves an empty body you can climb into (mini-bosses and bosses always do)
  bodyDrop:{
    scrap: 0.6,
    lancer: 0.5,
    hound: 0.5,
    guard: 0.45,
    brute: 0.4,
    walker: 0.35,
    bomber: 0.4,
    shaman: 0.4
  },
  bosses:{
    wardenHp: 200,
    makerHp: 300,
    knightHp: 240,
    knightKeyDrain: 0.035, // key unwinds by itself per frame (key is 100)
    knightKeyHit: 11,      // key lost per hit from behind
    crabHp: 200,
    crabShell: 60,         // its first shell
    craneHp: 230,
    craneStuck: 110,       // frames the magnet stays down after a slam
    craneReach: 80,        // how far the magnet pulls
    cranePull: 1.6,        // pull speed per frame
    craneHold: 110,        // frames you stay frozen to the magnet before it slams you down
    craneMash: 8,          // A/B presses to break free
    craneSlam: 14,         // damage when it slams you down
    toadHp: 230,
    toadOutside: 0.1,      // outside hits do this share of damage (it's jelly)
    toadEngulfSpeed: 0.9,  // slide speed when it comes to engulf you
    toadDigestEvery: 150,  // frames inside before it digests your outermost body
    toadInsideMult: 1.5,   // inside, B hits on the nucleus do your body's damage times this
    toadInsideRate: 10,    // frames between hits from inside
    cookHp: 280,
    cookPanTime: 170       // frames the pan stays down as a platform
  },
  civilians:{
    perSection: 2,        // at least this many per section (up to one more)
    maxOnScreen: 4,
    crossEvery: 420,      // frames between civilians running across
    panicRadius: 70,      // how close danger gets before they panic
    runSpeed: 1,          // slowest run (each one is up to 0.4 faster)
    flatTime: 110,        // frames lying flat after a squish
    squishScore: 25,
    squishPower: 3
  },
  props:{
    barrelRadius: 26,     // barrel blast reach
    barrelRobotDamage: 14,
    barrelPropDamage: 9,
    barrelPlayerDamage: 8
  },
  hazards:{
    mudSlow: 0.45,        // share of your speed lost in mud
    mudRobotSpeed: 0.55,  // robot speed in mud
    beltPush: 0.45        // conveyor push per frame
  },
  controller:{
    deadzone: 0.5,        // how far the stick must tilt before it counts
    rumble: 0.6,          // rumble strength (0 = off)
    rumbleFrom: 3         // only screen shakes at least this big rumble
  },
  magnet:{
    pushRadius: 80,       // MAGNET PUSH (special): reach
    pushDamage: 4,        // extra damage on top of the body's damage
    pushForce: 3,         // how hard robots are thrown away
    pullRange: 120        // every 3rd combo hit pulls the nearest robot, body or head from this far
  }
};
