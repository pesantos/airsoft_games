import { Component, OnInit, ViewChild } from '@angular/core';
import { ChaveadoComponent } from '../chaveado/chaveado.component';

@Component({
  selector: 'app-bomb',
  templateUrl: './bomb.component.html',
  styleUrls: ['./bomb.component.css']
})
export class BombComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.jogo = this.novoJogo();
    let d = localStorage.getItem(this.flagSave);
    console.log("REstaurar ", d);
    if(d){
      this.restore = true;
    }
  }
  mapaCor = {
    'red':'VERMELHO',
    'green':'VERDE',
    'black':'PRETO',
    'blue':'AZUL'
  }
  jogo:any;
  loopando:any;
  flagSave: string = 'bomb_game';
  restore: boolean = false;

  desarmar(){
    this.chaveado.desarmar(this.jogo.bomba, this.jogo);
  }

  novoJogo(){
    const j = Object.create(null);
    j.configurando = true;
    j.tempoPadrao = 1;
    j.revelar = false;
    j.explodir = false;
    j.status = '';
    j.tamanho = 4;
    j.fala = 0;
    j.historico = [];
    return j;
  }

  salvarOffline(){
    // salva offline todos os dados
    localStorage.setItem(this.flagSave,JSON.stringify(this.jogo));
  }

  pronto(){
    console.log("Ponto ", this.jogo);
    this.jogo.configurando = false;
    this.salvarOffline();
  }



  @ViewChild('chaveado',{static: true}) chaveado:ChaveadoComponent;
  armar(cor){
    this.jogo.bomba = {
      tempo:this.jogo.tempoPadrao,
      minutosRestante:0,
      segundosRestante:0,
      stringTempo:'--:--',
      cor:cor,
      nomeCor:this.mapaCor[cor],
      segredo:null,
      acionada:false
    }
    this.chaveado.programar(this.jogo.tamanho,cor,this.jogo.bomba);
  }

  acionarLoop(){
    if(this.loopando){
      clearInterval(this.loopando);
      this.loopando = null;
    }
    this.loopando = setInterval(()=>{
      this.loop();
    },1000);
  }

  limparLoop(){
    if(this.loopando){
      clearInterval(this.loopando);
      this.loopando = null;
    }
  }

  async restaurar(){
    let d = localStorage.getItem(this.flagSave);
    if(d){
      
      this.jogo = JSON.parse(d);
      if(this.jogo.status=='armada')this.acionarLoop();
    }
    this.restore = false;
    
    
  }

  armou(ev){
    if(ev=='armada'){
      this.jogo.status = 'armada';
      this.salvarOffline();
      this.acionarLoop();
    }
    if(ev=='desarmar'){
      this.limparLoop();
      console.log("Desarmando ", this.jogo.bomba);
      this.jogo.bomba.acionada = false;
      this.jogo.bomba.desarmada = true;
      this.jogo.bomba.explodida = false;
      this.jogo.historico.push(this.jogo.bomba);
      this.jogo.bomba = null;
      this.jogo.status = 'intermission';
      this.jogo.img = 'sucesso';
      this.removerStatus();
      
    }

    if(ev=='explodir'){
      this.explodir();
      
    }

    console.log("FEEDBACK ", ev, this.jogo);
  }

  explodir(){
      this.limparLoop();
      this.chaveado.sumirView();
      console.log("Explodindo ", this.jogo.bomba);
      this.jogo.bomba.acionada = false;
      this.jogo.bomba.explodida = true;
      this.jogo.bomba.desarmada = false;
      this.jogo.historico.push(this.jogo.bomba);
      this.jogo.bomba = null;
      this.jogo.status = 'intermission';
      this.jogo.img ='explosao';
      this.removerStatus();
  }

  removerStatus(){
    const t = setTimeout(()=>{
      this.jogo.status = '';
      this.jogo.img = null;
    },3000);
  }

  visaoHistorico = Object.create(null);
  historico(){
    this.visaoHistorico = Object.create(null);
    if(this.jogo['historico'] && this.jogo.historico.length){
      this.visaoHistorico.visivel = true;
    }
  }

  cancelar(){
    this.restore = false;
  }

  limpar(){
    localStorage.removeItem(this.flagSave);
    this.restore = false;
  }

 
  completaZero(v){
    v = v+'';
    if(v.length==1)return '0'+v;
    return v;
  }

  loop(){
    if(this.jogo.status = 'armada'){
      this.jogo.bomba.tempoRestante-= 1;
      this.jogo.bomba.minutosRestante = parseInt((this.jogo.bomba.tempoRestante/60)+'');
      this.jogo.bomba.segundosRestante = parseInt((this.jogo.bomba.tempoRestante%60)+'');
      this.jogo.bomba.stringTempo = this.completaZero(this.jogo.bomba.minutosRestante)+':'+this.completaZero(this.jogo.bomba.segundosRestante);
      this.jogo.fala++;
      if(this.jogo.bomba.tempoRestante<1){
        this.explodir();
      }
      if(this.jogo.fala>=15){
        //falar alguma coisa
        this.jogo.fala = 0;
      }
    }
  }

}
