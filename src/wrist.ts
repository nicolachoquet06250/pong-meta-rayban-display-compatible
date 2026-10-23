type WristSensor = { quaternion:Float32Array|number[]|null; onreading:(()=>void)|null; onerror:((event:{error?:Error})=>void)|null; start:()=>void; stop:()=>void };
type SensorCtor = new (options:{sensorId:string})=>WristSensor;
declare global {interface Window {RelativeOrientationSensor?:SensorCtor}}
export class WristInput {
  private sensor:WristSensor|null=null;private reference:number|null=null;private warmup=0;private latest:number|null=null;private lastReading=0;
  onStatus:(status:string)=>void=()=>{};
  get available(){return this.latest!==null&&Date.now()-this.lastReading<6000;}
  get movement(){if(this.latest===null||this.reference===null||!this.available)return null;const delta=Math.atan2(Math.sin(this.latest-this.reference),Math.cos(this.latest-this.reference));return Math.max(-1,Math.min(1,delta/.65));}
  calibrate(){if(this.latest!==null){this.reference=this.latest;this.onStatus('POIGNET CALIBRÉ');}else this.onStatus('CAPTEUR NON DISPONIBLE');}
  start(){
    const Sensor=window.RelativeOrientationSensor;
    if(!Sensor){this.onStatus('MODE DIRECTIONNEL DISPONIBLE');return;}
    try{
      const wrist=new Sensor({sensorId:'emg-wrist'});this.sensor=wrist;this.warmup=0;
      wrist.onreading=()=>{const q=wrist.quaternion;if(!q||q.length<4)return;this.lastReading=Date.now();this.latest=Math.atan2(2*(q[3]*q[0]+q[1]*q[2]),1-2*(q[0]*q[0]+q[1]*q[1]));if(this.warmup++===25){this.reference=this.latest;this.onStatus('POIGNET CALIBRÉ');}};
      wrist.onerror=(event)=>this.onStatus(`CAPTEUR : ${event.error?.name??'INDISPONIBLE'}`);
      wrist.start();this.onStatus('CAPTEUR EN COURS');
    }catch{this.onStatus('MODE DIRECTIONNEL DISPONIBLE');}
  }
  stop(){if(this.sensor){this.sensor.stop();this.sensor=null;}this.latest=null;this.reference=null;}
}
