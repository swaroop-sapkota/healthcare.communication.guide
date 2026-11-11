'use client';
import {useEffect,useRef,useState} from 'react';
import {Play,Pause,Square,Volume2} from 'lucide-react';
import {createConversationSpeech,type PlaybackState} from '../lib/conversation-speech';
export default function Conversation({lines}:{lines:string[][]}){
 const [supported,setSupported]=useState<boolean|null>(null);
 const [playback,setPlayback]=useState<PlaybackState>({status:'idle',index:0});
 const [rate,setRate]=useState(1);
 const player=useRef<ReturnType<typeof createConversationSpeech>|null>(null);
 useEffect(()=>{
  const available='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;setSupported(available);
  if(!available)return;
  const engine=createConversationSpeech(window.speechSynthesis,text=>new SpeechSynthesisUtterance(text),lines,setPlayback);player.current=engine;
  const stop=()=>engine.stop();
  // Do not keep speaking after the reader leaves this page or switches apps.
  const hide=()=>{if(document.hidden)engine.pause();};
  window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',hide);
  return()=>{window.removeEventListener('pagehide',stop);document.removeEventListener('visibilitychange',hide);engine.dispose();player.current=null;};
 },[lines]);
 const active=playback.status==='playing'||playback.status==='paused';
 return <><section className="audio-player" aria-label="Listen to the example conversation"><div className="audio-heading"><Volume2 size={21} aria-hidden="true"/><strong>Listen to the conversation</strong></div><p className="audio-note">Read aloud with your device’s voice. Follow the highlighted line below.</p>{supported!==false&&<div className="audio-controls"><button className="button audio-primary" disabled={!supported} onClick={()=>playback.status==='playing'?player.current?.pause():playback.status==='paused'?player.current?.resume():player.current?.play(rate)}>{playback.status==='playing'?<Pause size={18}/>:<Play size={18}/>} {playback.status==='playing'?'Pause':playback.status==='paused'?'Resume':playback.status==='finished'?'Play again':'Play conversation'}</button><button className="audio-stop" disabled={!active} onClick={()=>player.current?.stop()}><Square size={16}/> Stop</button><label className="audio-speed">Speed<select value={rate} disabled={active} onChange={e=>setRate(Number(e.target.value))}><option value="0.8">Slower · 0.8×</option><option value="1">Normal · 1×</option><option value="1.2">Faster · 1.2×</option></select></label></div>}<p className="audio-status" role="status">{supported===false?'Read-aloud is not supported in this browser. The full conversation is available below.':playback.status==='error'?playback.error:playback.status==='playing'?`Reading line ${playback.index+1} of ${lines.length}`:playback.status==='paused'?'Paused. Resume repeats the current line.':playback.status==='finished'?'Conversation finished.':supported===null?'Preparing read-aloud…':'Press play when you are ready.'}</p></section><div className="conversation">{lines.map(([speaker,line],i)=><div className={'dialogue '+(speaker==='Nurse'?'nurse':'patient')+(active&&playback.index===i?' speaking':'')} key={i} aria-current={active&&playback.index===i?'true':undefined}><strong>{speaker}{active&&playback.index===i&&<span className="reading-marker">{playback.status==='paused'?'Paused here':'Reading now'}</span>}</strong><p>{line}</p></div>)}</div></>;
}
