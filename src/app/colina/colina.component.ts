import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colina',
  templateUrl: './colina.component.html',
  styleUrls: ['./colina.component.css']
})
export class ColinaComponent implements OnInit {

  constructor() { }

  cores = ['azul','verde','vermelho','preto','amarelo','branco','cinza','laranja'];
  
  restore:any;
  game: any = {
    frase:'A colina se encontra em estado neutro',
    acionado:null,//time dominante
    osTimes:[],
    fator:1,
    times:4,
    azul:0,
    amarelo:0,
    cinza:0,
    laranja:0,
    vermelho:0,
    preto:0,
    branco:0,
    verde:0,
    tarefa:null,
    iniciado:false,//jogo rolando
    tempoLoop:15000,//tempo do loop
    meta:2,
    fim : false,
    geral:[]
  }

  armarNovo(){
    this.game.fim = false;
    this.game.frase = 'A colina se encontra em estado neutro';
    this.zerarPlacar();
    this.game.acionado = null;
    this.setarClasse();
    let b = setTimeout(()=>{this.loop();},3000);
    this.clock.play();
  }

  zerarPlacar(){
    this.game.azul = 0;
    this.game.amarelo = 0;
    this.game.cinza = 0;
    this.game.laranja = 0;
    this.game.vermelho = 0;
    this.game.verde = 0;
    this.game.preto = 0;
    this.game.branco = 0;
  }

  resetar(){
    this.game = {
      frase:'A colina se encontra em estado neutro',
      acionado:null,//time dominante
      fator:1,
      times:4,
      azul:0,
      amarelo:0,
      cinza:0,
      laranja:0,
      vermelho:0,
      preto:0,
      branco:0,
      verde:0,
      tarefa:null,
      iniciado:false,//jogo rolando
      tempoLoop:15000,//tempo do loop
      meta:2,
      fim : false
    };
  }

  dialogo: boolean = false;

  sirene = new Audio('assets/sirene.mp3');
  clock = new Audio('assets/clock.mp3');
  explosao = new Audio('assets/expo.wav');

  async acionar(cor){
    this.game.acionado = cor;
    this.setarClasse();
    await this.playAudio(this.sirene);
    this.dizer("Time "+cor+" tomou o controle da colina");
    console.log("Acionando "+cor);
    
    this.salvarOffline();
    
  }

  setarClasse(){
    let el = document.getElementById('tabuleiro');
    el.classList.remove('vermelho');
    el.classList.remove('verde');
    el.classList.remove('azul');
    el.classList.remove('preto');
    el.classList.remove('branco');
    el.classList.remove('cinza');
    el.classList.remove('amarelo');
    el.classList.remove('laranja');
    if(this.game.acionado)el.classList.add(this.game.acionado);
  }

  ngOnInit() {
    let d = localStorage.getItem('saveColina');
    if(d){
      this.restore = true;
    }
  }

  async restaurar(){
    let d = localStorage.getItem('saveColina');
    if(d){
      this.game = JSON.parse(d);
    }
    this.restore = false;
    let t = setTimeout(()=>{this.configurar2()},2000);
    
  }

  cancelar(){
    this.restore = false;
  }

  limpar(){
    localStorage.removeItem('saveColina');
    this.restore = false;
  }

  setarT(){
    this.game.osTimes = [];
    for(let i = 0; i<this.game.times;i++){
      this.game.osTimes.push(this.cores[i]);
    }
  }

  configurar(){
    this.setarT();
    this.clock.loop = true;
    this.clock.play();
    this.dizer("Jogo iniciado");
    this.game.iniciado = true;
    this.game.tarefa = setTimeout(()=>{this.loop();},this.game.tempoLoop);
    this.dialogo = false;

  }

  async configurar2(){
    this.dialogo = false;
    this.setarT();
    this.clock.loop = true;
    if(!this.game.fim)this.clock.play();
    if(!this.game.fim)this.dizer("Jogo iniciado");
    this.setarClasse();
    if(!this.game.fim)this.game.tarefa = setTimeout(()=>{this.loop();},this.game.tempoLoop);
    

  }

  iniciar(){
    this.dialogo = true;
    
  }

  async loop(){

    

    console.log("loopando")
    if(this.game.acionado!=null && this.game[this.game.acionado]<=this.game.meta)this.game[this.game.acionado]+=this.game.fator;
    this.salvarOffline();
    // if(this.game.acionado=='azul')this.game.azul+=this.game.fator;
    // if(this.game.acionado=='vermelho')this.game.vermelho+=this.game.fator;
    // if(this.game.acionado=='verde')this.game.verde+=this.game.fator;
    // if(this.game.acionado=='preto')this.game.preto+=this.game.fator;
    // if(this.game.acionado=='branco')this.game.branco+=this.game.fator;
    // if(this.game.acionado=='cinza')this.game.cinza+=this.game.fator;
    // if(this.game.acionado=='amarelo')this.game.amarelo+=this.game.fator;
    // if(this.game.acionado=='laranja')this.game.laranja+=this.game.fator;

    this.narrar();

    if(this.game[this.game.acionado]>=this.game.meta){
      this.clock.pause();
      this.game.fim = true;
      this.game.geral.push(this.game.acionado);
      this.salvarOffline();
      await this.playAudio(this.explosao);
      this.dizer("O TIME VENCEDOR, FOI O TIME "+this.game.acionado);
      this.dizer("O DISPOSITIVO ESTÁ PRONTO PARA SER TRANSPORTADO PARA O PRÓXIMO PONTO")
      
      return;
    }

    if(this.game.iniciado)this.game.tarefa = setTimeout(()=>{this.loop()},this.game.tempoLoop);
  }

  

  salvarOffline(){
    // salva offline todos os dados
    localStorage.setItem('saveColina',JSON.stringify(this.game));
  }

  narrar(){
    if(this.game.acionado!=null){
      this.dizer("O time "+this.game.acionado+" está dominando a colina, com "+this.game[this.game.acionado]+" pontos");
      
    }
  }


  dizer(texto:any){
    
    let speech = new SpeechSynthesisUtterance();
    // speech.lang = this.gameConfig.voz.lang;
    speech.text = texto+'';
    speech.pitch = 0.6;
    speech.rate = 1.4;
    speech.volume = 1;
    // speech.voice = this.gameConfig.voz;
    window.speechSynthesis.speak(speech);
    
  }

  playAudio(audio){
    return new Promise(res=>{
      audio.play()
      audio.onended = res
    })
  }

  gameConfig: any ={
    
    
    
    pitch:0.6,
    rate:1.2,
    voz:null,
    
  };

}
