import {describe,it,expect} from 'vitest';
import {PongEngine,FIELD} from '../src/engine';
describe('Pong engine',()=>{
 it('starts, pauses, resumes',()=>{const g=new PongEngine(()=>.5);expect(g.phase).toBe('ready');g.start();expect(g.phase).toBe('playing');g.pause();expect(g.phase).toBe('paused');g.start();expect(g.phase).toBe('playing');});
 it('clamps player',()=>{const g=new PongEngine();g.setPlayer(999);expect(g.playerY).toBe(g.maxPaddleY);g.setPlayer(-999);expect(g.playerY).toBe(-g.maxPaddleY);});
 it('does not move while paused',()=>{const g=new PongEngine();const x=g.ballX;g.tick(.03);expect(g.ballX).toBe(x);});
 it('reflects at top',()=>{const g=new PongEngine();g.start();g.ballY=(FIELD.height-FIELD.ball)/2-1;g.vy=300;g.tick(.03);expect(g.vy).toBeLessThan(0);});
 it('reflects off the player paddle',()=>{const g=new PongEngine();g.start();g.ballX=-FIELD.width/2+FIELD.inset+FIELD.paddleW+FIELD.ball/2+2;g.ballY=0;g.playerY=0;g.vx=-300;g.vy=0;g.tick(.025);expect(g.vx).toBeGreaterThan(0);});
 it('ends at 11',()=>{const g=new PongEngine();g.start();g.playerScore=10;g.ballX=FIELD.width/2+FIELD.ball+1;g.tick(.01);expect(g.playerScore).toBe(11);expect(g.phase).toBe('ended');});
});
