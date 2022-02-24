import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Output()finalizar = new EventEmitter();

  dialogo: boolean = false;
  minutos: number = 0;
  timer = null;
  label: string = '00:00';
  acionado: boolean = false;
  irra = new Audio('assets/irra.wav');
  setar(){
    this.dialogo = true;
  }

  async iniciarTimer(){
    this.finalizar.emit('inicio');
    this.dialogo = false;
    this.acionado = true;
    this.timer = this.minutos*1000*60;
    this.label = this.getTempoLabelg(this.timer);
    await this.dizer(`Táimer armado, 00:${this.label} para começar o jogo`,true);
    this.loop();
  }

  async loop(){
    this.timer-=1000;
    if(this.timer<11000){
      let seg = this.timer/1000;
      this.dizer(seg);
    }
    this.label = this.getTempoLabelg(this.timer);
    if(this.timer<=0)this.label= '00:00';
    if(this.timer>0)setTimeout(()=>{this.loop()},1000);
    if(this.timer<=0){
      await this.dizer("Inicio de Jogo");
      await this.playAudio(this.irra);
      this.finalizar.emit('fim');
    }
  }

  playAudio(audio){
    return new Promise(res=>{
      audio.play()
      audio.onended = res
    })
  }

  getTempoLabelg(t){
    
    if(t==0) return '00:00';
    
    let v = t/1000;
    let minutos = Math.floor((v/60)).toFixed(0);
    if(minutos.length==1)minutos = '0'+minutos;
    let segundos = (v%60).toFixed(0);
    if(segundos.length==1)segundos = '0'+segundos;
    return minutos+':'+segundos;
  }

  async dizer(texto:any,lento=false){
    let speech = new SpeechSynthesisUtterance();
    // speech.lang = this.gameConfig.voz.lang;
    speech.text = texto+'';
    speech.pitch = 0.6;
    if(!lento)speech.rate = 1.9;
    if(lento)speech.rate = 1.0;
    speech.volume = 1;
    // speech.voice = this.gameConfig.voz;
    window.speechSynthesis.speak(speech);

    return new Promise(resolve=>{
      speech.onend = resolve;
    });
    
  }

}
