import { Component, OnInit } from '@angular/core';
import PatternLock from '@phenax/pattern-lock-js';
@Component({
  selector: 'app-six',
  templateUrl: './six.component.html',
  styleUrls: ['./six.component.css']
})
export class SixComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.iniciar();
    let d = localStorage.getItem(this.flagSave);
    if(d){
      this.restore = true;
    }
  }

  game:any;
  irra = new Audio('assets/irra.wav');
  gold = new Audio('assets/gold.mp3');
  money = new Audio('assets/here.mp3');


  nomeJogador:any;
  corSelecionada:any;
  senhaJogador: boolean = false;
  s1:any;
  jogadorSelecionado: any;

  jaUsada:boolean = false;
  mostrarPrincipal: boolean = false;
  placarAzul:any;
  placarVermelho:any;

  computarPlacar(){
    this.placarAzul = {vivos:0,vidas:0};
    this.placarVermelho = {vivos:0,vidas:0};
    if(this.game && this.game.jogadores.length){
      this.game.jogadores.forEach(j=>{
        if(j.time=='azul'){
          if(j.vivo)this.placarAzul.vivos++;
          this.placarAzul.vidas+=parseInt(j.vidas);
        }
        if(j.time=='vermelho'){
          if(j.vivo)this.placarVermelho.vivos++;
          this.placarVermelho.vidas+=parseInt(j.vidas);
        }
      });
    }
  }

  setarSenhaJ(sen){
    if(this.game.mapaSenha[sen]){
      this.jaUsada = true;
      this.s1 = null;
      return;
    }

    this.jaUsada = false;

    if(this.senhaJogador){
      if(this.s1 && this.s1==sen){
        this.jogadorSelecionado.senha = sen;
        this.senhaJogador = false;
        this.s1 = null;
        this.jogadorSelecionado = null;
        console.log(this.game);
        this.mapear();
        this.salvarOffline();
      }else{
        if(!this.s1){
          this.s1 = sen;
        }else{
          this.s1 = null;
        }
        
      }
      
      
    }
  }

  novoJogo(){
    this.game = {
      //propriedades aqui
      jogadores:null,
      vermelhos:null,
      azuis:null,
      mapaJogadores:null,
      mapaSenha:null,
      modo:null,
      ultimoId:0,
      vidas:2
    };
  }

  processar(senha){
    console.log(`Senha ${senha}`);
  }

  mapear(){
    if(this.game && this.game.jogadores && this.game.jogadores.length){
      this.game.mapaJogadores = {};
      this.game.azuis = [];
      this.game.vermelhos = [];
      this.game.mapaSenha = {};
      this.game.jogadores.forEach(j=>{
        if(j.time=='azul'){
          this.game.azuis.push(j);
        }else{
          this.game.vermelhos.push(j);
        }
        this.game.mapaJogadores[j.id]=j;
        if(j.senha)this.game.mapaSenha[j.senha]=j;
        
      });
      this.computarPlacar();
    }
  }

  adicionarJogador(){
    if(!this.game['jogadores'])this.game['jogadores']=[];
    if(!this.nomeJogador || !this.corSelecionada)return;

    let novo = {
      id:this.game.ultimoId+1,
      nome:this.nomeJogador,
      time:this.corSelecionada,
      senha:null,
      vidas:this.game.vidas,
      vivo:true

    }

    this.game.jogadores.push(novo);
    this.mapear();
    this.game.ultimoId = novo.id;

    this.nomeJogador = null;
    this.corSelecionada = null;
    console.log(this.game);
    this.salvarOffline();
  }


  iniciar(){
   this.novoJogo();
    
  }

  definirSenha(j){
    console.log("definir senha de ", j);
    this.jogadorSelecionado = j;
    this.senhaJogador = true;
    this.jaUsada = false;
  }

 

  modoVida(){
    if(!this.game)return;
    this.game.modo = 'vida';
    this.mostrarPrincipal = true;
    this.acionarApagar();
  }
  modoBomba(){
    if(!this.game)return;
    this.game.modo = 'bomba';
    this.mostrarPrincipal = true;
    this.acionarApagar();
  }

  acionarApagar(){
    clearTimeout(this.apagarPrincipal);
    this.apagarPrincipal = setTimeout(()=>{
      this.mostrarPrincipal = false;
      console.log("SLEEP");
      this.game.modo = null;
    },10000);
  }

  apagarPrincipal:any;

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

  calcularTempo(t){

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

  flagSave:string ="six_game";
  restore:boolean = false;
  async restaurar(){
    let d = localStorage.getItem(this.flagSave);
    if(d){
      
      this.game = JSON.parse(d);
      this.mapear();
      this.loop();
      
    }
    this.restore = false;
    
    
  }

  async loop(){

    if(this.game){
      console.log("Rodando loop");
      

      this.game.g = setTimeout(()=>{this.loop()},this.game.tempoLoop);
    }
  }


  async dizer(texto:any){
    // if(this.musicaAtual)this.musicaAtual.volume = 0.1;
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

  limpar(){
    localStorage.removeItem(this.flagSave);
    this.restore = false;
  }

  cancelar(){
    this.restore = false;
  }

  salvarOffline(){
    // salva offline todos os dados
    localStorage.setItem(this.flagSave,JSON.stringify(this.game));
  }

}
