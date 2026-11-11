export type PlaybackState = {status:'idle'|'playing'|'paused'|'finished'|'error';index:number;error?:string};
// One utterance per turn keeps long conversations manageable on mobile browsers.
export function createConversationSpeech(synth: SpeechSynthesis, makeUtterance: (text:string)=>SpeechSynthesisUtterance, lines:string[][], notify:(state:PlaybackState)=>void){
 let version=0,index=0,rate=1,disposed=false;
 let current:SpeechSynthesisUtterance|null=null;
 let status:PlaybackState['status']='idle';
 function emit(next:PlaybackState['status'],error?:string){status=next;if(!disposed)notify({status,index,error});}
 function cancel(){version++;current=null;synth.cancel();}
 function speak(){
  if(disposed)return;
  if(index>=lines.length){emit('finished');return;}
  const token=version;
  const utterance=makeUtterance(`${lines[index][0]}. ${lines[index][1]}`);current=utterance;
  utterance.lang='en-US';utterance.rate=rate;
  const voices=synth.getVoices();const voice=voices.find(v=>v.lang.startsWith('en')&&v.default)||voices.find(v=>v.lang==='en-US')||voices.find(v=>v.lang.startsWith('en'));
  if(voice)utterance.voice=voice;
  utterance.onend=()=>{if(disposed||token!==version||status!=='playing')return;current=null;index++;speak();};
  utterance.onerror=()=>{if(disposed||token!==version)return;current=null;emit('error','Read-aloud is unavailable right now. Try again, or use the written conversation below.');};
  emit('playing');
  try{synth.speak(utterance);}catch{emit('error','This browser could not start read-aloud. You can still read the conversation below.');}
 }
 return {
  play(speed=1){cancel();rate=speed;index=0;speak();},
  // Restart the current turn on resume rather than relying on inconsistent mobile pause support.
  pause(){if(status!=='playing')return;cancel();emit('paused');},
  resume(){if(status!=='paused')return;cancel();speak();},
  stop(){cancel();index=0;emit('idle');},
  dispose(){disposed=true;cancel();},
 };
}
