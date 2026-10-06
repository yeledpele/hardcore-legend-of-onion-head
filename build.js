// Bundles src/ into one self-contained HTML file.
//   node build.js         -> dist/hardcore.html        (the file you publish)
//   node build.js --test  -> dist/hardcore.test.html   (same game + test hooks from tests/hooks.js)
// The dev server (npm run dev) calls assemble() directly to serve src/ without writing dist/.
const fs=require('fs'),path=require('path');
const ANCHOR='let last=performance.now()';
function assemble(root,{test=false,dev=false}={}){
  const rd=f=>fs.readFileSync(path.join(root,f),'utf8');
  let shell=rd('src/index.html');const css=rd('src/style.css');
  // the feel file (tuning numbers) goes first so the game code can read FEEL
  let js=rd('src/feel.js')+'\n'+rd('src/game.js');
  if(!js.includes(ANCHOR))throw new Error('anchor not found in src/game.js: '+ANCHOR);
  // dev mode (src/dev.js) sits inside the game's scope, just before the main loop; test hooks after it.
  // The dev panel also gets the feel file's text (for comments, and to write values back in place);
  // "<" is escaped so the text can't close the <script> tag.
  let inject='const FEEL_SRC='+JSON.stringify(rd('src/feel.js')).split('<').join('\\x3c')+';\n'+rd('src/dev.js');
  if(test)inject+='\n'+rd('tests/hooks.js');
  js=js.replace(ANCHOR,()=>inject+'\n'+ANCHOR);
  // served by the dev server: tell the page so it turns dev mode on and watches for changes
  if(dev)shell=shell.replace('<style>','<script>window.HC_DEVSERVER=1</script>\n<style>');
  return shell.replace('/*@@STYLE@@*/',()=>css).replace('/*@@SCRIPT@@*/',()=>js);
}
module.exports={assemble};
if(require.main===module){
  const test=process.argv.includes('--test');
  const out=assemble(__dirname,{test});
  fs.mkdirSync('dist',{recursive:true});
  const file=path.join('dist',test?'hardcore.test.html':'hardcore.html');
  fs.writeFileSync(file,out);
  console.log('built',file,(out.length/1024).toFixed(0)+' KB');
}
