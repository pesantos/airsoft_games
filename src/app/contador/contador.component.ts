import { Component, OnInit } from '@angular/core';
import NoSleep from 'nosleep.js';
@Component({
  selector: 'app-contador',
  templateUrl: './contador.component.html',
  styleUrls: ['./contador.component.css']
})
export class ContadorComponent implements OnInit {

  constructor() { }
require:any;

  ngOnInit() {
    //teste
  }

  
  tempoLoop: number = 10000;
  jogoIniciado: boolean = false;
  fim: boolean = false;
  movAzul :boolean = false;
  movVermelho: boolean = false;
  explosao = new Audio('assets/expo.wav');
  beep = new Audio('assets/beep.wav');
  musica = new Audio('assets/valquiria.mp3');
  clock = new Audio('assets/clock.mp3');
  sirene = new Audio('assets/sirene.mp3');
  status:any;
  atual: string = '';

  azul = "Piratas";
  vermelho = "Colonizadores";

  azulCarga: number = 0;
  azulCargaMax: number = 3;
  azulReady: boolean = false;
  azulBombaMinutos = 1;
  azulBombaSegundos = 40;
  azulSegundosTotal = 0;
  azulEstaArmado: boolean = false;

  vermelhoCarga: number = 0;
  vermelhoCargaMax: number = 3;
  vermelhoReady: boolean = false;
  vermelhoBombaMinutos = 1;
  vermelhoBombaSegundos = 40;
  vermelhoSegundosTotal = 0;
  vermelhoEstaArmado: boolean = false;
  locked: boolean = false;

  lock(){
    this.locked = !this.locked;
    if(this.locked){
      this.dizer("Dispositivo Travado");
      return;
    }

    this.dizer("Dispositivo Destravado");
  }

  playAudio(audio){
    return new Promise(res=>{
      audio.play()
      audio.onended = res
    })
  }

  timerAzul: number = 0;
  timerVermelho: number = 0;

  calcTimerAzul(){
    this.timerAzul = (100-((this.azulBombaSegundos/this.azulSegundosTotal)*100));
    console.log(this.timerAzul);
  }

  calcTimerVermelho(){
    this.timerVermelho = (100-((this.vermelhoBombaSegundos/this.vermelhoSegundosTotal)*100));
    console.log(this.timerVermelho);
  }

  configurar(){

    this.tempoLoop = this.gameConfig.loop*1000;

    this.azul = this.gameConfig.nomeAzul;
    this.vermelho = this.gameConfig.nomeVermelho;

    this.vermelhoCarga = 0;
    this.vermelhoCargaMax = this.gameConfig.cargas;
    this.azulCarga = 0;
    this.azulCargaMax = this.gameConfig.cargas;

    this.vermelhoReady = false;
    this.azulReady = false;

    this.azulEstaArmado = false;
    this.vermelhoEstaArmado = false;

    this.vermelhoBombaMinutos = this.gameConfig.bomba;
    this.vermelhoBombaSegundos = this.gameConfig.bomba*60;
    this.azulBombaMinutos = this.gameConfig.bomba;
    this.azulBombaSegundos = this.gameConfig.bomba*60;

    this.azulSegundosTotal = (this.azulBombaSegundos+0);
    this.vermelhoSegundosTotal = (this.vermelhoBombaSegundos+0);
    this.dialogo = false;
    this.fireIniciar();
  }

  gameConfig: any ={
    nomeAzul:'Piratas',
    nomeVermelho:'Colonizadores',
    cargas:10,
    loop:15,
    pitch:0.6,
    rate:1.5,
    voz:null,
    bomba:30
  };


  enriquecerAzul = {inicio:`Os ${this.azul} acionaram o enriquecimento da ogiva`,texto:`${this.azul} Enriquecendo OGIVA nível de carga ${this.azulCarga}`};
  enriquecerVermelha = {inicio:`Os ${this.vermelho} acionaram o enriquecimento da ogiva`,texto:`${this.vermelho} Enriquecendo OGIVA nível de carga ${this.vermelhoCarga}`};
  estadoNeutro = {inicio:"A Ogiva está em estado neutro",texto:"Ogiva em estado neutro"};
  azulMovimento = {inicio:`Os ${this.azul} capturaram a ogiva`, texto: `Os ${this.azul} estão transportando a Ogiva` };
  vermelhoMovimento = {inicio:`Os ${this.vermelho} capturaram a ogiva`, texto: `Os ${this.vermelho} estão transportando a Ogiva` };
  azulArmado = {inicio:`${this.azul} ativaram a OGIVA`, texto: `Os ${this.vermelho} estão transportando a Ogiva` };


  setarTextos(){
    this.enriquecerAzul = {inicio:`Os ${this.azul} acionaram o enriquecimento da ogiva`,texto:`${this.azul} Enriquecendo OGIVA nível de carga ${this.azulCarga}`};
    this.enriquecerVermelha = {inicio:`Os ${this.vermelho} acionaram o enriquecimento da ogiva`,texto:`${this.vermelho} Enriquecendo OGIVA nível de carga ${this.vermelhoCarga}`};
    this.estadoNeutro = {inicio:"A Ogiva está em estado neutro",texto:"Ogiva em estado neutro"};
    this.azulMovimento = {inicio:`Os ${this.azul} capturaram a ogiva`, texto: `Os ${this.azul} estão transportando a Ogiva` };
    this.vermelhoMovimento = {inicio:`Os ${this.vermelho} capturaram a ogiva`, texto: `Os ${this.vermelho} estão transportando a Ogiva` };
    this.azulArmado = {inicio:`${this.azul} ativaram a OGIVA`, texto: `Os ${this.vermelho} estão transportando a Ogiva` };
  }

  atualizarTexto(){
    
    this.enriquecerVermelha.texto = `${this.vermelho} Enriquecendo OGIVA nível de carga ${((this.vermelhoCarga/this.vermelhoCargaMax)*100).toFixed(1)} porcento`;
    this.enriquecerAzul.texto = `${this.azul} Enriquecendo OGIVA nível de carga ${((this.azulCarga/this.azulCargaMax)*100).toFixed(1)} porcento`;
    if(this.vermelhoCarga>=this.vermelhoCargaMax){
      this.enriquecerVermelha.texto = "Carga completa, bomba pronta para armar";
      this.vermelhoReady = true;
    }

    if(this.azulCarga>=this.azulCargaMax){
      this.enriquecerAzul.texto = "Carga completa, bomba pronta para armar";
      this.azulReady = true;
    }
  }

  falarNovo(){
    speechSynthesis.speak(new SpeechSynthesisUtterance("hello world"));
  }

  calcularTempo(t){

    if(t<1)return 'zero';

    let minutos = parseInt(Math.floor((t/60)).toFixed(0));
    let segundos = parseInt((t%60).toFixed(0));
    let produto = '';
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

    produto = t+' segundos';

    return produto;

  }

  dialogo: boolean = false;

async fireIniciar(){
  this.clock.loop = true;
  this.clock.play();
  this.setarTextos();
  this.fim = false;


  this.atual = 'neutro';
    
    this.musica.currentTime = 0;

      this.jogoIniciado = true;
      this.noSleep.enable();
      this.dizer("Dispositivo iniciado, bomba iniciada em estado neutro");
      this.status = this.estadoNeutro;
      
      this.tarefa = setTimeout(()=>{this.loop();},3000);
}



vozes:any;

testarVoz(){
  console.log("Testando Voz",this.gameConfig.voz);
  this.dizer("Teste de Fala");
}



  async iniciarJogo(){

    // let t = 1000;
    // for(let i = 0; i<t; i++){
    //   console.log(i,this.calcularTempo(i));
    // }

    this.locked = false;
    this.vozes = [];
    this.dialogo = true;
    
    // let voices = await window.speechSynthesis.getVoices();

    let voizes:any = await new Promise(function(resolve, reject) {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", function() {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        });
      }
    });
    console.log(voizes);
    
    let contador = 1;
    this.vozes.push({label:'Selecione a voz',value:null});
    for(let y =0; y<voizes.length;y++){
      let vo = voizes[y];
      console.log(vo.lang);
      if((vo.lang.toLowerCase()).includes('pt')){
        this.vozes.push({label:'Nº '+contador+' '+vo.lang,value:vo});
        this.gameConfig.voz = vo;
      } 
      contador++;
    };

    this.testarVoz();
    
    // console.log(this.vozes);
  }

  textoFinal: string = "";
  tarefa:any;

  loop(){
    if(this.fim)return;
    if(this.azulEstaArmado || this.vermelhoEstaArmado){
      if(this.azulEstaArmado){
        this.clock.pause();
        this.azulBombaSegundos-=this.gameConfig.loop;
        this.calcTimerAzul();
        if(this.azulBombaSegundos<=0){
          
          this.musica.pause();
          this.musica.currentTime = 0;
          this.explosao.play();
          this.tarefa = setTimeout(()=>{this.dizer("OS "+this.azul+" venceram a partida!");
            this.fim = true;
            this.textoFinal = this.azul+' venceu!';
          },5000);
        }
        this.dizer(this.calcularTempo(this.azulBombaSegundos)+" para detonação!");

      }

      if(this.vermelhoEstaArmado){
        this.clock.pause();
        this.vermelhoBombaSegundos-=this.gameConfig.loop;
        this.calcTimerVermelho();
        if(this.vermelhoBombaSegundos<=0){
          
          this.musica.pause();
          this.musica.currentTime = 0;
          this.explosao.play();
          this.tarefa = setTimeout(()=>{this.dizer("OS "+this.vermelho+" venceram a partida!");
            this.fim = true;
            this.textoFinal = this.vermelho+' venceu!';
          },5000);
        }
        this.dizer(this.calcularTempo(this.vermelhoBombaSegundos)+" para detonação!");

      }
    }else{
      this.clock.play();
      if(this.atual=='vermelhoEnriquecendo' && !this.vermelhoReady){
        this.vermelhoCarga++;
      }
      if(this.atual=='azulEnriquecendo' && !this.azulReady){
        this.azulCarga++;
      }
  
  
      this.atualizarTexto();
      this.dizer(this.status.texto);
    }
    
    if(this.jogoIniciado)this.tarefa = setTimeout(()=>{this.loop()},this.tempoLoop);
  }

  eVermelho(){// enriquecimento da ogiva
    this.dizer(this.enriquecerVermelha.inicio);
    this.status = this.enriquecerVermelha;
    this.atual='vermelhoEnriquecendo';
  }

  eAzul(){// enriquecimento da ogiva
    this.dizer(this.enriquecerAzul.inicio);
    this.status = this.enriquecerAzul;
    this.atual='azulEnriquecendo';
  }

  async armarAzul(){
    this.azulEstaArmado = true;
    await this.playAudio(this.sirene);
    this.dizer('Os '+this.azul+" armaram a bomba");
    this.musica.play();
    
  }

  async armarVermelho(){
    this.vermelhoEstaArmado = true;
    await this.playAudio(this.sirene);
    this.dizer('Os '+this.vermelho+" armaram a bomba");
    this.musica.play();
    
  }

  async azulAcionado(){
    
    this.musica.pause();
    this.musica.currentTime = 0;
    this.vermelhoEstaArmado = false;
    this.atual='azulTransportando';
    
    this.status = this.azulMovimento;
    await this.playAudio(this.beep);
    this.dizer(this.azulMovimento.inicio);
  }

  async vermelhoAcionado(){
    
    this.musica.pause();
    this.musica.currentTime = 0;
    this.atual = 'vermelhoTransportando';
    this.azulEstaArmado = false;

    
    this.status = this.vermelhoMovimento;

    await this.playAudio(this.beep);
    this.dizer(this.vermelhoMovimento.inicio);
  }


  
  noSleep = new NoSleep();
  contador = 10;

  

  

  dizer(texto:any){
    
    let speech = new SpeechSynthesisUtterance();
    speech.lang = this.gameConfig.voz.lang;
    speech.text = texto+'';
    speech.pitch = this.gameConfig.pitch;
    speech.rate = this.gameConfig.rate;
    speech.volume = 1;
    speech.voice = this.gameConfig.voz;
    window.speechSynthesis.speak(speech);
    
  }

}
