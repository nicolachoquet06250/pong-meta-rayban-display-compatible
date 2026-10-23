export type Difficulty = 'EASY'|'NORMAL'|'HARD';
export type Phase = 'ready'|'playing'|'paused'|'ended';
export const FIELD = { width: 560, height: 388, paddleH: 83, paddleW: 9, ball: 12, inset: 29, win: 11 } as const;
export const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
export class PongEngine {
  phase:Phase='ready'; playerY=0; cpuY=0; ballX=0; ballY=0; vx=0; vy=0; playerScore=0; cpuScore=0;
  difficulty:Difficulty='NORMAL'; private serveDirection=1;
  constructor(private random:()=>number=Math.random){this.resetBall();}
  get maxPaddleY(){return (FIELD.height-FIELD.paddleH)/2;}
  setPlayer(value:number){this.playerY=clamp(value,-this.maxPaddleY,this.maxPaddleY);}
  reset(){this.playerScore=0;this.cpuScore=0;this.playerY=0;this.cpuY=0;this.serveDirection=this.random()<.5?-1:1;this.resetBall();this.phase='ready';}
  start(){if(this.phase==='ended')this.reset();if(this.phase==='ready'||this.phase==='paused')this.phase='playing';}
  pause(){if(this.phase==='playing')this.phase='paused';}
  resetBall(){this.ballX=0;this.ballY=0;const speed=240;this.vx=this.serveDirection*speed;this.vy=(this.random()-.5)*160;}
  tick(dt:number){
    if(this.phase!=='playing')return;
    const step=clamp(dt,0,1/30);
    const ai={EASY:155,NORMAL:240,HARD:365}[this.difficulty];
    const expectedY=this.vx>0 ? clamp(this.ballY+this.vy*Math.max(0,(FIELD.width/2-this.ballX)/Math.max(60,this.vx)), -FIELD.height/2,FIELD.height/2) : 0;
    const target=clamp(expectedY,-this.maxPaddleY,this.maxPaddleY);
    this.cpuY+=clamp(target-this.cpuY,-ai*step,ai*step);
    const previousX=this.ballX;
    this.ballX+=this.vx*step;this.ballY+=this.vy*step;
    const limit=(FIELD.height-FIELD.ball)/2;
    if(this.ballY>limit){this.ballY=limit-(this.ballY-limit);this.vy=-Math.abs(this.vy);}else if(this.ballY< -limit){this.ballY=-limit+(-limit-this.ballY);this.vy=Math.abs(this.vy);}
    const left=-FIELD.width/2+FIELD.inset+FIELD.paddleW/2, right=FIELD.width/2-FIELD.inset-FIELD.paddleW/2;
    const collide=(paddleY:number,side:1|-1)=>{
      const offset=clamp((this.ballY-paddleY)/(FIELD.paddleH/2),-1,1);
      const speed=Math.min(565,Math.hypot(this.vx,this.vy)*1.06+5);
      const angle=offset*.95;
      this.vx=side*speed*Math.cos(angle);this.vy=speed*Math.sin(angle);
    };
    if(this.vx<0&&previousX-FIELD.ball/2>=left+FIELD.paddleW/2 && this.ballX-FIELD.ball/2<=left+FIELD.paddleW/2 && Math.abs(this.ballY-this.playerY)<=(FIELD.paddleH+FIELD.ball)/2){this.ballX=left+FIELD.paddleW/2+FIELD.ball/2;collide(this.playerY,1);}
    if(this.vx>0&&previousX+FIELD.ball/2<=right-FIELD.paddleW/2 && this.ballX+FIELD.ball/2>=right-FIELD.paddleW/2 && Math.abs(this.ballY-this.cpuY)<=(FIELD.paddleH+FIELD.ball)/2){this.ballX=right-FIELD.paddleW/2-FIELD.ball/2;collide(this.cpuY,-1);}
    if(this.ballX< -FIELD.width/2-FIELD.ball){this.cpuScore++;this.score(-1);}else if(this.ballX>FIELD.width/2+FIELD.ball){this.playerScore++;this.score(1);}
  }
  private score(direction:1|-1){if(Math.max(this.playerScore,this.cpuScore)>=FIELD.win){this.phase='ended';return;}this.serveDirection=direction;this.resetBall();}
}
