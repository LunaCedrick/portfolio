/* Simulated-browser smoke test (jsdom). Run: cd dev && npm i jsdom --no-save && node smoke-test.js
   Checks every scene, command, project tab, diagram part, the composer, and the theme toggle on
   desktop, phone, and a deep link. It cannot judge visual layout; use a real browser for that. */
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');
const root=require('path').join(__dirname,'..');
const html=fs.readFileSync(root+'/index.html','utf8').replace('<link rel="stylesheet" href="css/styles.css">',()=>'<style>'+fs.readFileSync(root+'/css/styles.css','utf8')+'</style>').replace('<script src="js/app.js" defer></script>',()=>'<script>'+fs.readFileSync(root+'/js/app.js','utf8')+'</script>');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function suite(mobile,hash){
  const errs=[],res=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Not implemented/.test(e.message))errs.push('jsdomError: '+e.message)});
  const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.test/'+(hash||''),virtualConsole:vc,beforeParse(w){
    w.matchMedia=q=>({matches:/reduced-motion/.test(q)?true:/max-width:820px/.test(q)?mobile:/pointer:fine/.test(q)?!mobile:false,addEventListener(){},removeEventListener(){}});
    w.fetch=async(url,options)=>{w.__replyto=JSON.parse(options.body).replyto;return {json:async()=>({success:true})}};
    w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>()=>{},set:()=>true});
    w.Element.prototype.scrollIntoView=function(){};
    w.addEventListener('error',e=>errs.push('ERR '+e.message));
    Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async()=>{}}});
  }});
  const w=dom.window,d=w.document,$=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)];
  const T=s=>(s?s.textContent:'');
  const ok=(n,c)=>res.push((c?'PASS ':'FAIL ')+n);
  const cmd=async c=>{const i=$('#in');i.readOnly=false;i.value=c;i.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await sleep(300)};
  await sleep(200);
  if(!hash){$('#go').click();await sleep(800);ok('launch shows whoami',T($('#out')).includes('Cedrick Luna.'));ok('intro hidden',$('#intro').style.display==='none')}
  else {await sleep(500);ok('deep link opens how tab',!!$('#det'))}
  await cmd('about');ok('about',T($('#sin')).includes('Path')&&T($('#out')).includes('Cedrick'));
  await cmd('skills');ok('skills groups',T($('#sin')).includes('AI tools')||mobile);
  const sk=$('.sk');if(sk){sk.click();await sleep(50);ok('skill evidence',T($('#evt')).length>12&&!T($('#evt')).includes('Select a skill'))}
  await cmd('certs');ok('certs',T($('#sin')).includes('PL/SQL Developer')&&$$('#sin img').length===4&&$$('#sin a.cert-card').length===4&&$$('#sin a.course-card').length===1);
  await cmd('projects');ok('projects list',T($('#sin')).includes('Weather Dashboard'));
  for(const [id,part,needle] of [['taskly','firestore','security rules'],['weather','api','OpenWeatherMap'],['empower','validate','PL/SQL checks'],['kiosk','sync','Spark']]){
    await cmd('open '+id);ok(id+' overview',T($('#sin')).includes('Overview')&&(id==='kiosk'||id==='empower'||$$('#sin img').length===1));
    await cmd('how');ok(id+' how renders',!!$('#det')&&(mobile?$$('#sin .st').length>3:$$('#sin g[data-p]').length>=4));
    await cmd('how '+part);ok(id+' how '+part,T($('#det')).includes(needle));
    const n=$$('#sin .pn');n[0].dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await sleep(30);ok(id+' click part 1',T($('#det')).startsWith('1'));
    if(mobile){ok(id+' mobile detail sits after selected row',$('#det').previousElementSibling&&$('#det').previousElementSibling.classList.contains('on'))}
    await cmd('features');ok(id+' features',$$('#sin .card2').length>=4);
    await cmd('stack');ok(id+' stack',T($('#sin')).length>60);
    await cmd('back');ok(id+' back to list',T($('#sin')).includes('Projects')&&!$('#det'));
  }
  await cmd('contact');ok('contact cards',$$('#sin .card2').length===4);
  await cmd('send');ok('composer',!!$('#cf'));
  $('#cn').value='Test';$('#ce').value='t@example.com';$('#cm').value='Hello there';$('#cf').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await sleep(100);
  ok('composer submit shows bubbles',T($('#cf-wrap')).includes('Hello there')&&!$('#cf'));
  ok('composer reply-to',w.__replyto==='t@example.com');
  await cmd('copy email');ok('copy email',T($('#out')).includes('copied'));
  await cmd('resume');ok('resume',T($('#sin')).includes('Resume'));
  const before=d.documentElement.dataset.theme;await cmd('theme');ok('theme toggles',d.documentElement.dataset.theme!==before);
  await cmd('ls');await cmd('help');ok('help lists send',T($('#out')).includes('write me a message'));
  await cmd('nonsense');ok('unknown command',T($('#out')).includes('command not found'));
  return {res,errs}
}
(async()=>{for(const [label,m,h] of [['DESKTOP',false],['MOBILE',true],['DEEPLINK desktop',false,'#/projects/kiosk/how']]){const {res,errs}=await suite(m,h);console.log('== '+label);const bad=res.filter(r=>r.startsWith('FAIL'));if(bad.length||errs.length)process.exitCode=1;console.log(bad.join('\n')||'all '+res.length+' checks passed');if(errs.length)console.log([...new Set(errs)].join('\n'))}process.exit(process.exitCode||0)})();
