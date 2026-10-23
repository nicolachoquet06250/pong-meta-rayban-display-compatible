import * as THREE from 'three';
import {PongEngine,FIELD,clamp,type Difficulty} from './engine';
import {WristInput} from './wrist';
import {directionForKey} from './keyboard';
import './style.css';
const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const engine=new PongEngine();const wrist=new WristInput();
const arena=$<HTMLDivElement>('scene');const overlay=$<HTMLDivElement>('overlay');const title=$<HTMLHeadingElement>('overlay-title');const sub=$<HTMLParagraphElement>('overlay-subtitle');const startButton=$<HTMLButtonElement>('start');const difficultyButton=$<HTMLButtonElement>('difficulty');const modeButton=$<HTMLButtonElement>('mode');const calibrateButton=$<HTMLButtonElement>('calibrate');const status=$<HTMLSpanElement>('status');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0,0);arena.append(renderer.domElement);
const camera=new THREE.OrthographicCamera(-FIELD.width/2,FIELD.width/2,FIELD.height/2,-FIELD.height/2,0.1,10);camera.position.z=5;
const scene=new THREE.Scene();const geometry=new THREE.PlaneGeometry(1,1);
function rect(width:number,height:number,color:number,opacity=1){const mat=new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:false});const mesh=new THREE.Mesh(geometry,mat);mesh.scale.set(width,height,1);scene.add(mesh);return mesh;}
const mid=Array.from({length:14},(_,i)=>{const line=rect(2,14,0x64ffe0,.65);line.position.set(0,-FIELD.height/2+18+i*27,0);return line;});void mid;
const left=rect(FIELD.paddleW,FIELD.paddleH,0xffc565),right=rect(FIELD.paddleW,FIELD.paddleH,0xffc565),ball=rect(FIELD.ball,FIELD.ball,0xfff8e7);ball.position.z=.2;
const trail=Array.from({length:3},(_,i)=>rect(12-i*3,FIELD.ball-i*3,0x65ffe0,.17-i*.04));
const leftX=-FIELD.width/2+FIELD.inset+FIELD.paddleW/2,rightX=-leftX;
left.position.x=leftX;right.position.x=rightX;
function resize(){const w=arena.clientWidth,h=arena.clientHeight;renderer.setSize(w,h,false);const aspect=w/Math.max(1,h);const world=FIELD.width/FIELD.height;if(aspect>world){camera.left=-FIELD.height*aspect/2;camera.right=-camera.left;camera.top=FIELD.height/2;camera.bottom=-camera.top;}else{camera.left=-FIELD.width/2;camera.right=FIELD.width/2;camera.top=FIELD.width/(2*aspect);camera.bottom=-camera.top;}camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(arena);resize();
let mode:'WRIST'|'DIRECTIONAL'='WRIST';let keyboard=0;let best=0;
try{best=Number(localStorage.getItem('neon-pong-best')||0)||0;}catch{};
function score(){ $('player-score').textContent=String(engine.playerScore).padStart(2,'0');$('cpu-score').textContent=String(engine.cpuScore).padStart(2,'0');$('best').textContent='RECORD '+String(best).padStart(2,'0'); }
function menu(){overlay.classList.remove('hidden');const ended=engine.phase==='ended';title.textContent=ended?(engine.playerScore>engine.cpuScore?'VICTOIRE !':'GAME OVER'):engine.phase==='paused'?'PAUSE':'NEON PONG';sub.textContent=ended?`${engine.playerScore} - ${engine.cpuScore}`:engine.phase==='paused'?'PARTIE EN PAUSE':'ARCADE / 1 PLAYER';startButton.textContent=ended?'REJOUER':engine.phase==='paused'?'REPRENDRE':'JOUER';modeButton.textContent='CONTRÔLE : '+(mode==='WRIST'?'POIGNET':'DIRECTIONNEL');difficultyButton.textContent='DIFFICULTÉ : '+({EASY:'FACILE',NORMAL:'NORMAL',HARD:'DIFFICILE'}[engine.difficulty]);startButton.focus();}
function play(){engine.start();overlay.classList.add('hidden');status.textContent='EN JEU';}
startButton.onclick=play;
difficultyButton.onclick=()=>{const values:Difficulty[]=['EASY','NORMAL','HARD'];engine.difficulty=values[(values.indexOf(engine.difficulty)+1)%values.length];menu();difficultyButton.focus();};
modeButton.onclick=()=>{mode=mode==='WRIST'?'DIRECTIONAL':'WRIST';menu();modeButton.focus();};
calibrateButton.onclick=()=>{wrist.calibrate();calibrateButton.focus();};
wrist.onStatus=s=>{status.textContent=s;};wrist.start();
window.addEventListener('keydown',e=>{
 if(engine.phase==='playing'){
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter','Escape'].includes(e.key)){e.preventDefault();e.stopPropagation();}
  const direction=directionForKey(e.key);if(direction!==null)keyboard=direction;
  if(e.key==='Enter'||e.key===' '||e.key==='Escape'){engine.pause();keyboard=0;menu();}
 }else if(e.key==='Escape'&&engine.phase==='paused'){e.preventDefault();play();}
});
window.addEventListener('keyup',e=>{const direction=directionForKey(e.key);if(direction!==null&&keyboard===direction)keyboard=0;});
window.addEventListener('blur',()=>{if(engine.phase==='playing'){engine.pause();menu();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){engine.pause();menu();wrist.stop();}else wrist.start();});
let previous=performance.now();function frame(now:number){const dt=Math.min(.04,(now-previous)/1000);previous=now;
 if(engine.phase==='playing'){
  const value=mode==='WRIST'?wrist.movement:null;
  if(value!==null&&keyboard===0)engine.setPlayer(value*engine.maxPaddleY);else engine.setPlayer(engine.playerY+keyboard*420*dt);
  engine.tick(dt);
  if(engine.playerScore>best){best=engine.playerScore;try{localStorage.setItem('neon-pong-best',String(best));}catch{}}
  if(engine.phase==='ended'){status.textContent='FIN DE PARTIE';menu();}
 }
 left.position.y=engine.playerY;right.position.y=engine.cpuY;ball.position.set(engine.ballX,engine.ballY,.2);
 trail.forEach((t,i)=>{t.position.set(engine.ballX-engine.vx*.016*(i+1),engine.ballY-engine.vy*.016*(i+1),.1);t.visible=engine.phase==='playing';});score();renderer.render(scene,camera);requestAnimationFrame(frame);
}menu();requestAnimationFrame(frame);
