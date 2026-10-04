// Bundles src/ into one self-contained HTML file.
//   node build.js         -> dist/hardcore.html        (the file you publish)
//   node build.js --test  -> dist/hardcore.test.html   (same game + test hooks from tests/hooks.js)
const fs=require('fs'),path=require('path');
const test=process.argv.includes('--test');
const shell=fs.readFileSync('src/index.html','utf8');
const css=fs.readFileSync('src/style.css','utf8');
// the feel file (tuning numbers) goes first so the game code can read FEEL
let js=fs.readFileSync('src/feel.js','utf8')+'\n'+fs.readFileSync('src/game.js','utf8');
if(test){
  const anchor='let last=performance.now()';
  if(!js.includes(anchor))throw new Error('test hook anchor not found in src/game.js: '+anchor);
  js=js.replace(anchor,fs.readFileSync('tests/hooks.js','utf8')+'\n'+anchor);
}
const out=shell.replace('/*@@STYLE@@*/',()=>css).replace('/*@@SCRIPT@@*/',()=>js);
fs.mkdirSync('dist',{recursive:true});
const file=path.join('dist',test?'hardcore.test.html':'hardcore.html');
fs.writeFileSync(file,out);
console.log('built',file,(out.length/1024).toFixed(0)+' KB');
