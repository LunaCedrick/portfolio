/* Cedrick Luna portfolio. Plain JavaScript, no build step.
   Content lives in these constants: P (projects), SKILLS, TL (about timeline),
   CERTS (certifications), CT (contact cards), SC (terminal text per scene).
   Set RESUME and W3F_KEY below when needed. */
(()=>{
const $=s=>document.querySelector(s),out=$('#out'),inp=$('#in'),root=document.documentElement,wrap=$('#wrap'),sin=$('#sin'),pr=$('#ps'),chipsEl=$('#chips');
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches,mq=matchMedia('(max-width:820px)');
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,RM?0:ms));
let glow='217,119,87',dust='237,233,221';
function tokens(){const s=getComputedStyle(root);glow=s.getPropertyValue('--glow').trim();dust=s.getPropertyValue('--dust').trim()}
function setTheme(t){root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}tokens()}
let saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
setTheme(saved||'dark');

/* living background; spT slows it during scene changes so navigation feels like a breath */
const cv=$('#bg'),cx=cv.getContext('2d'),CH='{}[]()<>/;=+*#01$_~'.split('');
let W,H,P_=[],mx=innerWidth/2,my=innerHeight*.4,sx=mx,sy=my,last=-1e9,sp=1,spT=1;
function size(){const D=Math.min(devicePixelRatio||1,mq.matches?1:2);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;cx.setTransform(D,0,0,D,0,0);
 P_=Array.from({length:Math.round(Math.min(mq.matches?45:90,W*H/15000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.15,vy:-.05-Math.random()*.2,c:CH[Math.random()*CH.length|0],s:11+Math.random()*10,a:.07+Math.random()*.14,p:Math.random()*6.28,k:0}))}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;last=performance.now()});
function frame(now){const t=now/1000;
 if(!RM&&now-last>4000){mx=W*(.5+.3*Math.sin(t*.23));my=H*(.42+.22*Math.cos(t*.31))}
 sx+=(mx-sx)*.06;sy+=(my-sy)*.06;sp+=(spT-sp)*.04;
 root.style.setProperty('--mx',sx.toFixed(1)+'px');root.style.setProperty('--my',sy.toFixed(1)+'px');root.style.setProperty('--r',(560+220*(1-sp)).toFixed(0)+'px');
 cx.clearRect(0,0,W,H);
 for(const p of P_){
  if(!RM){p.x+=(p.vx+Math.sin(t*.4+p.p)*.12)*sp;p.y+=p.vy*sp;
   const dx=p.x-sx,dy=p.y-sy,d=Math.hypot(dx,dy)||1;
   if(d<170){const f=1-d/170;p.x+=dx/d*f*1.4*sp;p.y+=dy/d*f*1.4*sp;p.k=f}else p.k=0;
   if(p.y<-20)p.y=H+20;if(p.y>H+20)p.y=-20;if(p.x<-20)p.x=W+20;if(p.x>W+20)p.x=-20}
  cx.fillStyle=`rgba(${p.k>.05?glow:dust},${p.a*(.8+.2*Math.sin(t+p.p))+p.k*.4})`;cx.font=p.s+'px monospace';cx.fillText(p.c,p.x,p.y)}
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);

/* content */
const P={
 empower:{t:'Empower Bank',s:'Batch validation in SQL and shell',
  d:'A menu-driven mini project, built during a training, that runs in a Bash terminal and connects to an SQL database. It reads an input CSV to create bank accounts or validate transactions, and checks every record.',
  meta:{Status:'Built and runnable in a Bash terminal',Role:'Solo project'},
  parts:[{n:'Menu',sub:'shell',what:'A shell script presents a menu: create accounts or validate transactions.',in:'The choice of the user.',out:'Starts the matching process.'},
   {n:'Load',sub:'SQL*Loader',what:'SQL*Loader reads the input CSV into the database.',in:'The input CSV file.',out:'Rows ready for checking.'},
   {n:'Stage',sub:'accounts',what:'For account creation, each record goes into a staging table before it is validated.',in:'Loaded account rows.',out:'Staged records.'},
   {n:'Validate',sub:'PL/SQL',what:'PL/SQL checks every record. Transactions are validated directly, without staging.',in:'Staged accounts or transaction rows.',out:'Valid and invalid records.'},
   {n:'Insert',sub:'valid',what:'Valid records are inserted into the database.',in:'Valid records.',out:'New accounts or accepted transactions.'},
   {n:'Report',sub:'log',what:'Every run writes a timestamped log with the number of valid and invalid records, plus report files for the valid and the invalid output.',in:'The results of the run.',out:'A log file and report files.'}],
  feats:[['Menu-driven','Choose account creation or transaction validation from one menu.'],['Automated validation','Every record is checked by PL/SQL, with no manual review.'],['Staging before validation','Account records pass through a staging table first.'],['Logs and reports','A timestamped log with valid and invalid counts, plus report files.']],
  stack:[['Oracle SQL','Tables and queries'],['PL/SQL','Validation logic'],['Bash','Menu and automation'],['SQL*Loader','Loading CSV data into the database']],links:[]},
 taskly:{t:'Taskly',s:'Real-time task manager',img:'assets/images/taskly.webp',imgSize:[680,392],
  d:'A multi-project task manager where users sign in with Google and manage tasks across all their projects in real time. A dashboard-first design shows overdue, today, and upcoming tasks in one view, and tasks stay available offline.',
  meta:{Status:'In development',Role:'Full-stack developer, personal project',Created:'Jun 2026'},
  parts:[{n:'Sign in',sub:'Google',what:'Firebase Auth identifies the user through Google sign-in.',in:'A Google account.',out:'A signed-in user id.'},
   {n:'Firestore',sub:'userId docs',what:'Stores projects and tasks as documents. Every document carries a user ID, and security rules keep each user’s data separate.',in:'Writes from the signed-in app.',out:'Live changes to every listener.',why:'A user ID on each document lets queries span all of that user’s projects.'},
   {n:'Listeners',sub:'real-time',what:'Real-time listeners push changes to every signed-in device as they happen.',in:'Changes in Firestore.',out:'Updates to the interface on each device.'},
   {n:'Dashboard',sub:'by urgency',what:'Queries across all projects and groups tasks as overdue, today, and upcoming.',in:'Tasks from every project.',out:'One view ordered by urgency.'},
   {n:'Notify',sub:'offline, FCM',h:'Offline and notifications',what:'Offline persistence keeps tasks usable without a connection and syncs on reconnect. Cloud Messaging sends browser notifications for overdue tasks.',in:'Tasks and the state of the connection.',out:'Cached tasks and overdue notifications.'}],
  feats:[['Real-time cross-device sync','A change on one device appears on the others.'],['Dashboard by urgency','All projects gathered into overdue, today, and upcoming.'],['Offline support','Tasks stay available and sync automatically on reconnect.'],['Push notifications','Browser notifications for overdue tasks.']],
  stack:[['HTML, CSS','Structure and styling'],['Vanilla JavaScript','No framework or bundler'],['Firebase Auth','Google sign-in'],['Firebase Firestore','Real-time data with per-user security rules'],['Firebase Cloud Messaging','Overdue task notifications'],['Vercel','Hosting']],
  links:[['Code on GitHub','https://github.com/LunaCedrick/Taskly']]},
 weather:{t:'Weather Dashboard',s:'Live weather, sky-themed',img:'assets/images/weather-dashboard.webp',imgSize:[680,453],
  d:'A living weather interface. Search any city for live conditions and a 5-day forecast, switch between Celsius and Fahrenheit, and browse city suggestions as you type. The background shifts with the weather and the time of day.',
  meta:{Status:'Live',Role:'Personal project',Created:'June 2026'},
  parts:[{n:'Search',sub:'autocomplete',what:'A search box suggests cities as you type.',in:'Text typed by the visitor.',out:'A chosen city.'},
   {n:'API',sub:'OpenWeatherMap',what:'The app requests current conditions and the 5-day forecast for the city from the OpenWeatherMap API.',in:'The chosen city.',out:'Live weather data.'},
   {n:'Convert',sub:'C or F',what:'Temperatures switch between Celsius and Fahrenheit instantly.',in:'Weather data and the unit toggle.',out:'Values in the chosen unit.'},
   {n:'Render',sub:'sky theme',what:'The background changes with the weather and time of day, and frosted glass cards keep the results readable.',in:'Conditions and time of day.',out:'The themed interface.'}],
  feats:[['Live weather search','Real-time conditions for any city.'],['City autocomplete','Suggestions appear as you type.'],['Dynamic background','Changes with the weather and the time of day.'],['5-day forecast','Frosted glass cards with a temperature unit toggle.']],
  stack:[['HTML, CSS','Structure and styling'],['Vanilla JavaScript','Search, conversion, and rendering'],['OpenWeatherMap API','Live weather data'],['Vercel','Hosting']],
  links:[['Live site','https://weather-dashboard-cl-builds.vercel.app/'],['Code on GitHub','https://github.com/LunaCedrick/WeatherDashboard']]},
 kiosk:{t:'Solar-Powered Smart Vending and Charging Station',s:'Solar kiosk with RFID membership',
  d:'An IoT campus kiosk that combines secure phone charging and automated mineral-water vending in one solar-powered system. Registered students use RFID, non-members use coins, and an admin dashboard syncs through Firebase.',
  meta:{Problem:'Limited safe phone charging on campus, and water facilities that did not match the preference of students for mineral water.',Status:'Completed functional prototype. Formal user testing and power-interruption recovery testing remain.',Role:'Project Manager and Full-Stack Developer, team of five',Dates:'2025 to 2026'},
  parts:[{n:'Power',sub:'solar, battery',what:'Solar panels charge the battery that powers the kiosk, with an AC source as backup. The Raspberry Pi is the main controller.',in:'Sunlight, or AC when needed.',out:'Power for the controller and hardware.'},
   {n:'Identify',sub:'RFID, coins',what:'A registered student taps an RFID ID. The Pi reads the UID and checks Firebase for the membership type, charging allowance, and water balance. Non-members use coins instead.',in:'An RFID UID, or coins of 1, 5, and 10 pesos.',out:'The balances and access of the user.'},
   {n:'Choose',sub:'touchscreen',what:'The touchscreen shows the user information and balances, then lets them choose phone charging or water.',in:'The identified user.',out:'A selected service.'},
   {n:'Run',sub:'charge, water',what:'Charging: one of four compartments unlocks, current sensors detect the device, a timer runs, and used time is deducted. Water: sensors verify the cup and the flow while the Arduino drives the pump and valve.',in:'The selected service.',out:'A completed session and updated balances.'},
   {n:'Sync',sub:'Firebase',what:'Usage, balances, RFID records, and status sync to Firebase Realtime Database, and administrators monitor the kiosk through the web dashboard.',in:'Session and system data.',out:'Live data for the admin dashboard.',why:'The free Spark plan keeps cost low and avoids running a backend server. The trade-off is needing a stable internet connection.'}],
  feats:[['RFID membership','Identifies registered users and manages member allowances.'],['Secure smart charging','Four independent compartments with locks, timers, and current detection.'],['Automated water vending','Sensor-controlled dispensing with RFID access or coins.'],['Real-time tracking','Balances, sessions, and kiosk state sync through Firebase.'],['Touchscreen interface','Shows services, instructions, charging time, and balances.'],['Remote admin dashboard','Monitors users, charging slots, water levels, and coin credits.']],
  stack:[['HTML, CSS, JavaScript','Web dashboard'],['Python','Controller logic'],['Firebase Realtime Database','Real-time sync on the free Spark plan'],['Raspberry Pi','Main controller'],['Arduino','Pump, valve, and sensors'],['RFID','Member identification'],['Sensors','Current, cup, and water flow'],['GitHub Copilot','AI-assisted development']],links:[]}
};
let sel=0;
const detailHTML=(p,i)=>{const x=p.parts[i],row=(k,v)=>v?'<div style="display:flex;gap:14px;font-size:13px"><span class="mute" style="width:96px;flex:none">'+k+'</span><span>'+v+'</span></div>':'';
 return '<div class="detail"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div class="acc" style="font-size:16px">'+(i+1)+'  '+(x.h||x.n)+'</div><div style="display:flex;gap:6px"><button class="chip" type="button" data-p="'+(i-1)+'"'+(i?'':' disabled')+'>Previous</button><button class="chip" type="button" data-p="'+(i+1)+'"'+(i<p.parts.length-1?'':' disabled')+'>Next</button></div></div>'+row('What it does',x.what)+row('Receives',x.in)+row('Sends',x.out)+row('Why it is here',x.why)+'</div>'};
const ovHTML=p=>'<div class="ov-layout'+(p.img?'':' no-image')+'">'+(p.img?'<img class="ov-image" src="'+p.img+'" width="'+p.imgSize[0]+'" height="'+p.imgSize[1]+'" alt="'+esc(p.t)+' screenshot">':'')+'<div class="ov-copy"><div class="ov-summary">'+p.d+'</div><div class="ov-meta">'+Object.entries(p.meta).map(([k,v])=>'<div><div class="mute" style="font-size:12px">'+k+'</div><div>'+v+'</div></div>').join('')+'</div></div>'+(p.links.length?'<div class="ov-links">'+p.links.map(([l,u],i)=>'<a class="chip ch" '+(i?'':'style="color:var(--acc);border-color:var(--acc)" ')+'href="'+u+'" target="_blank" rel="noopener">'+l+'</a>').join('')+'</div>':'');
const howHTML=p=>{const k=Math.min(sel,p.parts.length-1),acd=mq.matches||p.diagram===false,det='<div id="det">'+detailHTML(p,k)+'</div>';
 if(acd)return '<div class="stl">'+p.parts.map((x,i)=>'<button class="st pn'+(i===k?' on':'')+(i===p.parts.length-1?' last':'')+'" type="button" data-p="'+i+'"><span class="acc" style="width:16px">'+(i+1)+'</span><span>'+x.n+' <span class="mute">'+x.sub+'</span></span></button>'+(mq.matches&&i===k?det:'')).join('')+(mq.matches?'':det)+'</div>';
 return flow(p,k)+'<div class="mute" style="font-size:12px">Select a part to see what it does.</div>'+det};
const featHTML=p=>'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">'+p.feats.map(([t,d])=>'<div class="card2" style="flex-direction:column;align-items:flex-start;gap:6px"><i style="width:8px;height:8px;border-radius:2px;background:var(--acc)"></i><div style="font-size:15px">'+t+'</div><div class="mute" style="font-size:13px">'+d+'</div></div>').join('')+'</div>';
const stackHTML=p=>'<div>'+p.stack.map(([t,d])=>'<div style="display:flex;justify-content:space-between;gap:16px;padding:11px 4px;border-bottom:1px solid var(--line)"><span>'+t+'</span><span class="mute" style="text-align:right">'+d+'</span></div>').join('')+'</div>';
function selPart(i){const m=/^\/projects\/([a-z]+)/.exec(cur||'');if(!m)return;const p=P[m[1]];if(i<0||i>=p.parts.length)return;sel=i;
 sin.querySelectorAll('.pn').forEach(g=>g.classList.toggle('on',+g.dataset.p===i));
 const d=$('#det'),on=sin.querySelector('.pn.on');
 if(d){d.innerHTML=detailHTML(p,i);if(mq.matches&&on)on.after(d)}
 if(on&&on.focus)on.focus({preventScroll:true});
 if(d&&mq.matches)d.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'})}
function pick(q){const m=/^\/projects\/([a-z]+)/.exec(cur||'');if(!m)return;const i=P[m[1]].parts.findIndex(x=>x.n.toLowerCase().startsWith(q.toLowerCase().trim()));if(i>=0)selPart(i)}
document.addEventListener('keydown',e=>{const g=e.target.closest&&e.target.closest('g[data-p]');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selPart(+g.dataset.p)}});
const mute=t=>`<span class="mute">${t}</span>`,acc=t=>`<span class="acc">${t}</span>`,cm_=(a,b)=>`<span class="cmd">${a}</span>${mute(b)}`,gap='<div class="gap"></div>';
const SC={
 '/':()=>['<div class="name">Cedrick Luna.</div>',acc('Engineer by Instinct. Powered by Curiosity.'),gap,'Associate Software Engineer, Philippines',mute('Curiosity gets me started. Building makes it real.'),gap,mute('Type ')+acc('help')+mute(', or tap a command below.')],
 '/about':()=>["I'm Cedrick, a software engineer with a<br>Computer Engineering background.",gap,'I enjoy building systems where different<br>pieces have to work together — interfaces,<br>backend logic, databases, APIs, and even<br>hardware.',gap,'My work has taken me from Arduino and<br>Raspberry Pi projects to real-time web apps<br>and cloud-connected systems.',gap,'I learn best by building, testing ideas,<br>and figuring out how things work beneath<br>the surface.',gap,'Curious by nature. Practical by habit.<br>Always building something better.'],
 '/projects':()=>[mute('four projects. Pick one on the stage, or type ')+acc('open taskly'),gap,...Object.entries(P).map(([k,p])=>cm_(k,p.s))],
 '/contact':()=>[mute('opening contact...'),acc('Get in touch'),mute('Questions, collaborations, or just hello.'),gap,mute('try: ')+acc('send')+mute(', ')+acc('copy email')+mute(', ')+acc('back')],
 '/contact/write':()=>[mute('opening message...'),acc('Write to me'),mute('Fill in the form on the stage and press send.'),gap,mute('try: ')+acc('back')],
 '/certs':()=>[mute('opening certifications...'),acc('Certifications'),mute('Oracle credentials: PL/SQL, SQL, and AI Agent Studio.'),gap,mute('try: ')+acc('skills')+mute(', ')+acc('back')],
 '/skills':()=>[mute('opening skills...'),acc('What I work with'),mute('Bars show proficiency level. Select a skill to see where I used it.'),gap,mute('try: ')+acc('projects')+mute(', ')+acc('back')],
 '/resume':()=>[mute('opening resume...'),acc('Resume'),mute('A one-page summary of my education, projects, and skills.'),gap,mute('try: ')+acc('back')]
};
const projScene=path=>{const [,,id,tab]=path.split('/'),p=P[id],t=tab||'overview',nm={overview:'overview',how:'how it works',features:'features',stack:'stack'};
 return [mute('opening '+nm[t]+'...'),acc(p.t),mute(p.s),gap,...(t==='how'?[mute('Select a part, or type ')+acc('how '+p.parts[Math.min(1,p.parts.length-1)].n.toLowerCase()),gap]:[]),mute('try: ')+['overview','how','features','stack'].filter(x=>x!==t).map(x=>acc(x)).join(mute(', '))+mute(', ')+acc('back')]};
function flow(p,sel){const n=p.parts.length,v=mq.matches,g=28,w=(600-g*(n-1))/n;let s='';
 const nd=(i,b)=>'<g class="nd pn'+(i===sel?' on':'')+'" data-p="'+i+'" role="button" tabindex="0" aria-label="'+esc(p.parts[i].n)+'">'+b+'</g>';
 if(v){s='<svg viewBox="0 0 340 '+(n*48-14)+'" role="group" aria-label="'+esc(p.t)+' system flow">';
  p.parts.forEach((x,i)=>{const y=i*48;
   if(i<n-1)s+='<line class="ln2" x1="170" y1="'+(y+34)+'" x2="170" y2="'+(y+48)+'"/>'+(RM?'':'<circle class="dt" cx="170" r="3"><animate attributeName="cy" from="'+(y+34)+'" to="'+(y+48)+'" dur="1.8s" begin="'+(i*.4)+'s" repeatCount="indefinite"/></circle>');
   s+=nd(i,'<rect class="nb" x="0" y="'+y+'" width="340" height="34" rx="8"/><text class="nl" x="14" y="'+(y+22)+'">'+x.n+'</text><text class="ns" x="326" y="'+(y+22)+'" text-anchor="end">'+x.sub+'</text>')})
 }else{s='<svg viewBox="0 0 600 120" role="group" aria-label="'+esc(p.t)+' system flow">';
  p.parts.forEach((x,i)=>{const X=i*(w+g);
   if(i<n-1)s+='<line class="ln2" x1="'+(X+w)+'" y1="60" x2="'+(X+w+g)+'" y2="60"/>'+(RM?'':'<circle class="dt" cy="60" r="3.5"><animate attributeName="cx" from="'+(X+w)+'" to="'+(X+w+g)+'" dur="1.8s" begin="'+(i*.4)+'s" repeatCount="indefinite"/></circle>');
   s+=nd(i,'<rect class="nb" x="'+X+'" y="30" width="'+w+'" height="60" rx="10"/><text class="nl" x="'+(X+w/2)+'" y="57" text-anchor="middle">'+x.n+'</text><text class="ns" x="'+(X+w/2)+'" y="76" text-anchor="middle">'+x.sub+'</text>')})}
 return s+'</svg>'}
const pips=n=>'<span class="pips" role="img" aria-label="level '+n+' of 5">'+[1,2,3,4,5].map(i=>'<i class="'+(i<=n?'f':'')+'"></i>').join('')+'</span>';
const AI='Planning, design, and code across my projects.';
const SKILLS=[['Languages',[['JavaScript',4,'Taskly, Weather Dashboard, and the kiosk dashboard.'],['Python',4,'The kiosk.'],['HTML and CSS',4,'Taskly, Weather Dashboard, and this site.'],['Java and C++',2,'Studied during my Computer Engineering degree.']]],['Cloud and data',[['Firebase',4,'Taskly and the kiosk dashboard.'],['Oracle SQL',4,'Empower Bank, and my Oracle Database SQL Certified Associate.'],['PL/SQL',4,'Empower Bank, and my Oracle Database PL/SQL Developer Certified Professional.'],['Unix shell',3,'Empower Bank.']]],['IoT and embedded',[['Arduino',4,'The kiosk.'],['Raspberry Pi',4,'The kiosk.'],['RFID and sensors',4,'The kiosk.'],['Wiring and circuits',4,'The kiosk.']]],['AI tools',[['Codex',4,AI],['Claude',4,AI],['Gemini',3,AI],['GitHub Copilot',3,'Used during development of the solar-powered smart vending and charging kiosk.'],['AI-assisted workflows',4,'How I plan, design, and build my projects.']]]];
let sg=0;
const SAMPLE='<span class="tg" style="border-style:dashed;white-space:nowrap">sample levels, to confirm</span>';
function skillsHTML(){const g=i=>'<div><div class="gh">'+SKILLS[i][0]+'</div>'+SKILLS[i][1].map(([n,l])=>'<button class="sk" type="button" data-sk="'+esc(n)+'"><span>'+n+'</span>'+pips(l)+'</button>').join('')+'</div>';
 return '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><h2>Skills</h2><span class="mute" style="font-size:12px">Bars show proficiency level</span></div>'
 +(mq.matches?'<div style="display:flex;gap:8px;flex-wrap:wrap">'+SKILLS.map((x,i)=>'<button class="chip'+(i==sg?' on':'')+'" data-g="'+i+'">'+x[0].split(' ')[0]+'</button>').join('')+'</div>'+g(sg):'<div class="grp">'+SKILLS.map((_,i)=>g(i)).join('')+'</div>')
 +'<div style="margin-top:auto;border-top:1px solid var(--line);padding-top:14px;display:flex;justify-content:space-between;gap:12px;align-items:center"><span id="evt" class="mute">Select a skill to see where I used it.</span></div>'}
const TL=[['Now','Associate Software Engineer','Philippines'],['Jan to May 2026','Project Management Intern','Manufacturing environment'],['2022 to 2026','BSCpE, Computer Engineering','Manuel S. Enverga University Foundation. Dean\'s Lister, Academic Scholar, Excellence in Practicum, Outstanding Achievement.'],['Nov 2021 to Feb 2022','TESDA CSS NCII training','Computer systems servicing: hardware, LAN, and server setup. 320 hours.'],['2020 to 2022','Senior High School, ICT','Sta. Catalina National High School, with honors.']];
const aboutHTML=()=>'<h2>Path</h2><div class="tl">'+TL.map(([a,b,c])=>'<div class="ti"><div class="mute" style="font-size:12px">'+a+'</div><div style="font-size:15px">'+b+'</div><div class="mute" style="font-size:13px">'+c+'</div></div>').join('')+'</div>';
const IC={mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',git:'<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5v7M18 11.5c0 4-12 1-12 4"/>',per:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3.5-6 7-6s7 2 7 6"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>'};
const CT=[['mail','Email','cedrick.luna.work@gmail.com',null,1],['git','GitHub','github.com/LunaCedrick','https://github.com/LunaCedrick'],['per','LinkedIn','linkedin.com/in/cedluna','https://linkedin.com/in/cedluna'],['chat','Facebook','facebook.com/cedrick.luna.50','https://www.facebook.com/cedrick.luna.50']];
const contactHTML=()=>'<h2>Get in touch</h2>'+CT.map(([i,l,h,u,p])=>'<div class="card2'+(p?' p':'')+'"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[i]+'</svg></div><div style="flex:1;min-width:0"><div class="mute" style="font-size:12px">'+l+'</div><div style="overflow-wrap:anywhere">'+h+'</div></div>'+(u?'<a class="chip ch" href="'+u+'" target="_blank" rel="noopener">open</a>':'<span style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><button class="chip ch" type="button" data-c="send" style="color:var(--acc);border-color:var(--acc)">write</button><button class="chip ch" type="button" data-c="copy email">copy</button></span>')+'</div>').join('');
const RESUME='assets/Cedrick_Luna_Resume.pdf';
const resumeHTML=()=>'<h2>Resume</h2><p class="mute">A one-page summary of my education, projects, and skills.</p><div class="card2" style="flex-direction:column;align-items:flex-start;gap:4px"><div>Cedrick Masalunga Luna</div><div class="mute" style="font-size:13px">Associate Software Engineer, Philippines</div><div class="mute" style="font-size:13px">Computer Engineering (BSCpE), 2026</div></div>'+(RESUME?'<a class="chip ch" style="align-self:flex-start;padding:5px 22px" href="'+RESUME+'" download>Download PDF</a>':'<span class="tg" style="align-self:flex-start;border-style:dashed">PDF is added when the site is handed off</span>');
const CERTS=[['assets/images/badge-plsql-professional.webp','Oracle Database PL/SQL Developer Certified Professional','Oracle Certified Professional','September 30, 2026'],['assets/images/badge-sql-associate.webp','Oracle Database SQL Certified Associate','Oracle Certified Associate','September 28, 2026'],['assets/images/badge-fusion-ai-foundations.webp','Oracle Fusion AI Agent Studio, Foundations Associate (Rel 1)','Oracle Certified Foundations Associate','']];
const certsHTML=()=>'<h2>Certifications</h2><div class="mute" style="font-size:13px">Issued by Oracle University.</div>'+CERTS.map(([i,t,s,d])=>'<div class="card2 bd"><img src="'+i+'" width="188" height="200" alt="'+esc(s)+' badge"><div style="flex:1;min-width:0"><div style="font-size:15px">'+t+'</div><div class="mute" style="font-size:13px">'+s+(d?' · '+d:'')+'</div></div></div>').join('');
const W3F_KEY='f5dde465-b85e-448f-9295-f5d545abf2a5'; // paste your Web3Forms access key here (see README)
const composerHTML=()=>'<h2>Write to me</h2><div style="display:flex;flex-direction:column;gap:12px"><div class="bub">Hi, I am Cedrick. What would you like to talk about?</div><div id="cf-wrap" class="bub v" style="width:100%;max-width:100%"><form id="cf" class="cf" novalidate><label for="cn">Your name</label><input id="cn" name="cn" autocomplete="name" maxlength="80" required><label for="ce">Your email, so I can reply</label><input id="ce" name="ce" type="email" autocomplete="email" maxlength="120" required><label for="cm">Message</label><textarea id="cm" name="cm" rows="5" maxlength="2000" required></textarea><input name="hp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px"><div style="display:flex;align-items:center;gap:12px;margin-top:14px"><button class="chip ch" type="submit" style="color:var(--acc);border-color:var(--acc);padding:5px 26px">Send</button><span id="cs" class="mute" role="status" style="font-size:12px"></span></div></form></div></div>';
function done(d,how){const w=$('#cf-wrap');w.innerHTML='<div style="white-space:pre-wrap;overflow-wrap:anywhere">'+esc(d.message)+'</div>';const r=document.createElement('div');r.className='bub';r.textContent='Thanks for reaching out. I’ll be in touch soon.';w.parentNode.appendChild(r)}
async function sendMsg(f){const x=f.elements,d={name:x.cn.value.trim(),email:x.ce.value.trim(),message:x.cm.value.trim(),website:x.hp.value},st=$('#cs');
 if(d.website)return;
 if(!d.name||!d.message||!/^\S+@\S+\.\S+$/.test(d.email)){st.textContent='Please add your name, a valid email, and a message.';return}
 st.textContent='Sending...';
 if(W3F_KEY){try{const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:W3F_KEY,subject:'Message from '+d.name+' (portfolio)',from_name:'Portfolio site',name:d.name,email:d.email,replyto:d.email,message:d.message,botcheck:false})});const j=await r.json();if(!j.success)throw new Error('send');done(d,'sent')}catch(e){st.textContent='That did not go through. You can also write to cedrick.luna.work@gmail.com.'}}
 else{const a=document.createElement('a');a.href='mailto:cedrick.luna.work@gmail.com?subject='+encodeURIComponent('Message from '+d.name)+'&body='+encodeURIComponent(d.message+'\n\n'+d.name+' ('+d.email+')');a.click();done(d,'mail')}}
document.addEventListener('submit',e=>{if(e.target.id==='cf'){e.preventDefault();sendMsg(e.target)}});
function stageHTML(path){
 const mm={'/certs':certsHTML,'/contact/write':composerHTML,'/about':aboutHTML,'/skills':skillsHTML,'/contact':contactHTML,'/resume':resumeHTML};if(mm[path])return mm[path]();
 if(path==='/projects')return '<h2>Projects</h2>'+Object.entries(P).map(([k,p])=>'<button class="card" data-c="open '+k+'"><b>'+p.t+'</b><span>'+p.d.split('. ')[0]+'.</span></button>').join('');
 const [,,id,tab]=path.split('/'),p=P[id],t=tab||'overview';
 return '<div style="display:flex;gap:8px;flex-wrap:wrap">'+[['overview','Overview'],['how','How it works'],['features','Features'],['stack','Stack']].map(([k,l])=>'<button class="chip'+(k===t?' on':'')+'" data-c="'+k+'">'+l+'</button>').join('')+'</div><h2>'+p.t+'</h2>'+({overview:ovHTML,how:howHTML,features:featHTML,stack:stackHTML})[t](p)}

/* terminal + scenes */
let cur=null;
const ph=c=>`<span class="ps">ced<span class="h">@portfolio</span> ${c&&c!=='/'?'~'+c:'~'} $</span>`;
function line(h){const d=document.createElement('div');d.className='ln';d.innerHTML=h;out.appendChild(d);out.scrollTop=out.scrollHeight}
async function emit(ls){for(const l of ls){line(l);await sleep(90)}}
const mk=(l,c=l)=>`<button class="chip" type="button" data-c="${c}">${l}</button>`;
function chips(){const ids=Object.keys(P);
 chipsEl.innerHTML=(cur==='/'?[mk('about'),mk('skills'),mk('certs'),mk('projects'),mk('resume'),mk('contact'),mk('theme')]:cur==='/projects'?[...ids.map(k=>mk(k,'open '+k)),mk('back')]:cur.startsWith('/projects/')?[...['overview','how','features','stack'].filter(t=>t!==(cur.split('/')[3]||'overview')).map(t=>mk(t)),mk('back')]:cur==='/contact'?[mk('send'),mk('copy email'),mk('back'),mk('theme')]:cur==='/contact/write'?[mk('back'),mk('copy email'),mk('theme')]:[mk('back'),mk('projects'),mk('theme')]).join('')}
async function enter(path,cm){
 const old=ph(cur);
 if(!/^\/projects(\/|$)/.test(path)||!cur){}
 try{if(hp()!==path)history.pushState(null,'','#'+path)}catch(e){}
 cur=path;sel=0;spT=.2;
 out.style.opacity=0;sin.style.opacity=0;await sleep(out.childElementCount?500:0);
 out.innerHTML='';
 const split=path!=='/';wrap.classList.toggle('split',split);
 if(split)sin.innerHTML=stageHTML(path);
 pr.innerHTML=ph(cur);chips();
 out.style.opacity=1;sin.style.opacity=1;
 line(old+' '+esc(cm));
 await emit(path.startsWith('/projects/')?projScene(path):SC[path]());
 spT=1}
const kid=s=>Object.keys(P).find(k=>s&&(k===s||s.startsWith(k)||k.startsWith(s)));
function dest(a){const s=(a[0]||'').toLowerCase().replace(/\/$/,'');
 if(s==='..')return /^\/projects\/[^/]+/.test(cur)?'/projects':cur.split('/').slice(0,-1).join('/')||'/';
 if(!s||s==='~'||s==='home')return '/';
 if(['about','skills','certs','projects','contact','resume'].includes(s))return '/'+s;
 if(s==='send'||s==='write')return'/contact/write';
 const tb=['overview','how','features','stack'];if(tb.includes(s)){const m=/^\/projects\/([a-z]+)/.exec(cur||'');return m?(s==='overview'?'/projects/'+m[1]:'/projects/'+m[1]+'/'+s):null}
 const k=kid(s.replace(/^projects\//,''));return k?'/projects/'+k:null}
const nav=async(a,cm,fix)=>{const d=dest(fix||a);
 if(d===null||d===cur){line(ph(cur)+' '+esc(cm));return emit([d===null?mute('no such place: ')+esc(a[0]||'')+mute('. try ')+acc('ls'):mute('you are already here')])}
 return enter(d,cm)};
const CMD={
 whoami:(a,c)=>nav(a,c,['~']),home:(a,c)=>nav(a,c,['~']),about:(a,c)=>nav(a,c,['about']),projects:(a,c)=>nav(a,c,['projects']),contact:(a,c)=>nav(a,c,['contact']),
 open:nav,cd:nav,back:(a,c)=>nav(a,c,['..']),
 ls:()=>emit([cur==='/'?acc('about  skills  certs  projects  resume  contact'):cur==='/projects'?acc(Object.keys(P).join('  ')):mute('nothing more here. try ')+acc('back')]),
 overview:(a,c)=>nav(a,c,['overview']),how:async(a,c)=>{await nav(a,c,['how']);if(a[0])pick(a.join(' '))},features:(a,c)=>nav(a,c,['features']),stack:(a,c)=>nav(a,c,['stack']),
 help:()=>emit([mute('available commands'),...[['about','background'],['projects','what I have built'],['open <name>','show a project'],['ls','list this place'],['back','go up one level'],['skills','what I work with'],['certs','my certifications'],['resume','my resume'],['send','write me a message'],['contact','say hello'],['copy email','copy my email address'],['theme','switch dark and light'],['clear','clean the screen']].map(([a,b])=>cm_(a,b))]),
 skills:(a,c)=>nav(a,c,['skills']),certs:(a,c)=>nav(a,c,['certs']),certifications:(a,c)=>nav(a,c,['certs']),send:(a,c)=>nav(a,c,['send']),write:(a,c)=>nav(a,c,['send']),resume:(a,c)=>nav(a,c,['resume']),
 copy:async a=>{if((a[0]||'').toLowerCase()!=='email')return emit([mute('try ')+acc('copy email')]);let ok=false;try{await navigator.clipboard.writeText('cedrick.luna.work@gmail.com');ok=true}catch(e){}await emit([ok?acc('copied ')+mute('cedrick.luna.work@gmail.com'):mute('copy failed. The address is cedrick.luna.work@gmail.com')])},
 theme:async()=>{const n=root.dataset.theme==='dark'?'light':'dark';setTheme(n);await emit([mute('theme set to ')+n])},
 clear:async()=>{out.innerHTML=''},
 sudo:a=>emit(a.join(' ').toLowerCase()==='hire ced'?[acc('permission granted.')+' scheduling an interview...',mute('(see contact to make it real)')]:[mute('nice try. only ')+'sudo hire ced'+mute(' is allowed here.')])
};
const NAVS=new Set(['overview','how','features','stack','certs','certifications','send','write','whoami','home','about','skills','resume','projects','contact','open','cd','back','clear']);
let busy=false;const hist=[];let hi=0;
async function run(cm,typed){
 if(busy)return;busy=true;inp.readOnly=true;inp.value='';
 if(typed){for(const c of cm){inp.value+=c;await sleep(40)}await sleep(200)}
 inp.value='';
 const [n,...a]=cm.trim().split(/\s+/),k=(n||'').toLowerCase();
 if(cm.trim()){
  if(!NAVS.has(k)||!Object.prototype.hasOwnProperty.call(CMD,k))line(ph(cur)+' '+esc(cm));
  if(Object.prototype.hasOwnProperty.call(CMD,k))await CMD[k](a,cm);
  else await emit([mute('command not found: '+esc(n)+'. Try ')+acc('help')])}
 busy=false;inp.readOnly=false;if(fine)inp.focus()}
inp.addEventListener('keydown',e=>{
 if(e.key==='Enter'){const v=inp.value;if(v.trim()){hist.push(v);hi=hist.length}run(v,false)}
 else if(e.key==='ArrowUp'&&hist.length){e.preventDefault();hi=Math.max(0,hi-1);inp.value=hist[hi]}
 else if(e.key==='ArrowDown'){e.preventDefault();hi=Math.min(hist.length,hi+1);inp.value=hist[hi]||''}
 else if(e.key==='Tab'){e.preventDefault();const v=inp.value.toLowerCase(),m=Object.keys(CMD).find(c=>v&&c.startsWith(v));if(m)inp.value=m}});
document.addEventListener('click',e=>{
 const pn=e.target.closest('[data-p]');if(pn&&!pn.disabled){selPart(+pn.dataset.p);return}
 const sk=e.target.closest('[data-sk]');
 if(sk){document.querySelectorAll('.sk.on').forEach(x=>x.classList.remove('on'));sk.classList.add('on');const r=SKILLS.flatMap(g=>g[1]).find(x=>x[0]===sk.dataset.sk);$('#evt').innerHTML='<span class="acc">'+esc(r[0])+'</span> '+esc(r[2]);return}
 const t=e.target.closest('[data-g]');if(t){sg=+t.dataset.g;sin.innerHTML=skillsHTML();return}
 const b=e.target.closest('[data-c]');if(b)run(b.dataset.c,true);else if(fine&&e.target.closest('.term')&&!getSelection().toString())inp.focus()});
const hp=()=>{const h=location.hash.slice(1);return /^\/(about|skills|certs|resume|projects|contact\/write|contact|projects\/(kiosk|taskly|empower|weather)(\/(how|features|stack))?)$/.test(h)?h:'/'};
addEventListener('hashchange',()=>{const p=hp();if(p!==cur&&!busy){busy=true;enter(p,'cd '+(p==='/'?'~':p.slice(1))).finally(()=>{busy=false})}});
mq.addEventListener('change',()=>{if(cur&&cur!=='/')sin.innerHTML=stageHTML(cur)});

const first=hp();let seen=false;try{seen=sessionStorage.getItem('launched')==='1'}catch(e){}
const go=$('#go'),intro=$('#intro');
function reveal(){intro.style.display='none';wrap.inert=false;wrap.classList.remove('pre')}
async function launch(){go.disabled=true;busy=true;try{sessionStorage.setItem('launched','1')}catch(e){}
 spT=.2;intro.classList.add('out');await sleep(900);intro.style.display='none';wrap.inert=false;wrap.classList.remove('pre');await sleep(600);busy=false;await run('whoami',true)}
if(first==='/'&&!seen){go.addEventListener('click',launch);go.focus()}
else{reveal();if(first.split('/').length>3)enter(first,'cd '+first.slice(1));else run(first==='/'?'whoami':first.startsWith('/projects/')?'open '+first.split('/')[2]:first.slice(1),true)}
})();
