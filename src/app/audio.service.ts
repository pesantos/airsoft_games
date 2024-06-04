import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  musicaAtual = null;
  cogumelo = new Audio('assets/cogumelo.wav');
  beep_sucesso = new Audio('assets/beep_sucesso.mp3');
  beep_erro = new Audio('assets/beep_erro.mp3');
  clock = new Audio('assets/clock.mp3');
  morte = new Audio('assets/morte.wav');
  irra = new Audio('assets/irra.wav');
  drum = new Audio('assets/drum.wav');
  planted = new Audio('assets/planted.mp3');
  dying = new Audio('assets/dying.mp3');
  explosao = new Audio('assets/expo.wav');
  buzina = new Audio('assets/sirene.mp3');
  ff7 = new Audio('assets/ff7.wav');
  siren = new Audio('assets/siren.wav');
  musicas = ['assets/007.mp3','assets/beebop.mp3','assets/impossible.mp3','assets/Beethoven9Synphony.mp3','assets/All-Along-The-WatchTower.mp3','assets/overture.mp3','assets/Bob-Dylan-The-Times-They-Are-A-Changin.mp3','assets/valquiria.mp3','assets/whiplash.mp3','assets/evangelion.mp3','assets/sold.mp3','assets/creedance.mp3'];
  adesivos:any = ['🐵','🐶','🦁','🐱','🦊','🐺','👽','🤖','👻','👺','😈','🐭','🐗','🐲','🐼','🐨','🐸','🐟','🦞','🦆','🦅','🦉','🦀','🐧','🐤','🐝','🪰'];
  nomeTimes = ['Alpha','Bravo','Charlie','Delta','Echo','FoxTrot','Golf','Hotel','India','Juliett','Kilo','Lima','Mike','November','Oscar','Papa','Quebec','Romeu','Sierra','Tango','Uniform','Victor','Whiskey','X-Ray','Yankee','Zulu'];


  tocarMorte(){
    return this.playAudio(this.morte);
  }

  tocarBerroMorte(){
    return this.playAudio(this.dying);
  }

  tocarPlanted(){
    return this.playAudio(this.planted);
  }

  async dizer(texto:any){
    let speech = new SpeechSynthesisUtterance();
    // speech.lang = this.gameConfig.voz.lang;
    speech.text = texto+'';
    speech.pitch = 0.6;
    speech.rate = 1.4;
    speech.volume = 1;
    // speech.voice = this.gameConfig.voz;
    window.speechSynthesis.speak(speech);
  
    return new Promise(resolve=>{
      speech.onend = resolve;
    });
    
  }

  playAudio(audio){
    return new Promise(res=>{
      audio.play()
      audio.onended = res
    })
  }

  tocarMusica(vol=0.28){
    this.pararMusica();
    this.musicaAtual = new Audio(this.obterItemRandom(this.musicas));    
    this.musicaAtual.loop = true;
    this.musicaAtual.volume = vol;
    this.musicaAtual.play();
  }

  tocarRelogioLoop(vol = 0.28){
    this.pararMusica();
    this.musicaAtual = this.clock;   
    this.musicaAtual.loop = true;
    this.musicaAtual.volume = vol;
    this.musicaAtual.play();
  }

  pararMusica(){
    if(this.musicaAtual)this.musicaAtual.pause();
  }

  obterItemRandom(li){
    return li[Math.floor(Math.random() * li.length)];
  }

  tempoString(t){
    
    if(t==0) return '00:00';
    
    let v = t/1000;
    let minutos = Math.floor((v/60)).toFixed(0);
    if(minutos.length==1)minutos = '0'+minutos;
    let segundos = (v%60).toFixed(0);
    if(segundos.length==1)segundos = '0'+segundos;
    return minutos+':'+segundos;
  }

  tempoTextoFalado(t){

    if(t<1)return 'zero';

    let minutos = parseInt(Math.floor((t/60/1000)).toFixed(0));
    let segundos = parseInt(((t/1000)%60).toFixed(0));
    let produto = '';
    if(segundos==0){
      console.log("Segundos é zero");
      if(minutos==1) return minutos+' minuto';
      produto = minutos+' minutos';
      return produto;
    }
    if(minutos==1){
      produto+= minutos+' minuto';
      if(segundos==1){
        produto+=' e um segundo';
      }
  
      if(segundos>1){
        produto+=' e '+segundos+' segundos';
      }

      return produto;
    }
    if(minutos>1){
      produto+=minutos+' minutos';
      if(segundos==1){
        produto+=' e um segundo';
      }
  
      if(segundos>1){
        produto+=' e '+segundos+' segundos';
      }

      return produto;
    }

    produto = t/1000+' segundos';

    return produto;

  }
}
