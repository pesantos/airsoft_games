import { Component, OnInit, ViewChild } from '@angular/core';
import { ChaveadoComponent } from '../chaveado/chaveado.component';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-bomb',
  templateUrl: './bomb.component.html',
  styleUrls: ['./bomb.component.css']
})
export class BombComponent implements OnInit {

  constructor(public aser:AudioService) { }

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
    j.tamanho = 3;
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


  telaArmar = Object.create(null);
  @ViewChild('chaveado',{static: true}) chaveado:ChaveadoComponent;
  armar(cor){
    this.jogo.bomba = {
      tempo:this.jogo.tempoPadrao,
      minutosRestante:0,
      segundosRestante:0,
      stringTempo:'--:--',
      cor:cor,
      grid:Object.create(null),
      nomeCor:this.mapaCor[cor],
      segredo:null,
      acionada:false
    }
    if(this.jogo.aoarmar){
      this.telaArmar = Object.create(null);
      this.telaArmar.tempo = 5;
      this.telaArmar.cor = cor;
      this.telaArmar.visivel = true;
    }else{
      this.chaveado.programar(this.jogo.tamanho,cor,this.jogo.bomba);
    }
    
  }

  alterar(v){
    if((this.telaArmar.tempo+v)<5)return;
    this.telaArmar.tempo+=v;
  }

  armarT(){
    this.jogo.bomba.tempo = this.telaArmar.tempo;
    this.telaArmar.visivel = false;
    this.chaveado.programar(this.jogo.tamanho,this.telaArmar.cor,this.jogo.bomba);
    this.telaArmar = Object.create(null);
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
      if(this.jogo.status=='armada'){
        this.aser.tocarMusica();
        this.chaveado.colocarBomba(this.jogo.bomba);
        this.acionarLoop();
      }
    }
    this.restore = false;
    
    
  }

  async armou(ev){
    if(ev=='armada'){
      this.jogo.status = 'armada';
      
      this.salvarOffline();
      this.acionarLoop();
      this.aser.tocarMusica();
      await this.aser.dizer(`Bomba ${this.jogo.bomba.nomeCor} armada`);
      this.dizerBomba();
    }
    if(ev=='desarmar'){
      this.aser.pararMusica();
      this.limparLoop();
      console.log("Desarmando ", this.jogo.bomba);
      this.jogo.bomba.acionada = false;
      this.jogo.bomba.desarmada = true;
      this.jogo.bomba.explodida = false;
      this.jogo.historico.push(this.jogo.bomba);
      let tempb = this.jogo.bomba;
      this.jogo.bomba = null;
      this.jogo.status = 'intermission';
      this.jogo.img = 'sucesso';
      this.removerStatus();
      await this.aser.playAudio(this.aser.ff7);
      await this.aser.dizer(`Bomba ${tempb.nomeCor} Desarmada`);
      
    }

    if(ev=='explodir'){
      this.explodir();
      
    }

    console.log("FEEDBACK ", ev, this.jogo);
  }

  async explodir(){
      this.aser.pararMusica();
      this.limparLoop();
      this.chaveado.sumirView();
      console.log("Explodindo ", this.jogo.bomba);
      this.jogo.bomba.acionada = false;
      this.jogo.bomba.explodida = true;
      this.jogo.bomba.desarmada = false;
      this.jogo.historico.push(this.jogo.bomba);
      let tempb = this.jogo.bomba;
      this.jogo.bomba = null;
      this.jogo.status = 'intermission';
      this.jogo.img ='explosao';
      this.removerStatus();
      await this.aser.playAudio(this.aser.explosao);
      await this.aser.dizer(`Bomba ${tempb.nomeCor} Explodiu`);
  }

  removerStatus(){
    const t = setTimeout(()=>{
      this.jogo.status = '';
      this.jogo.img = null;
      this.salvarOffline();
    },3000);
  }

  visaoHistorico = Object.create(null);
  historico(){
    this.visaoHistorico = Object.create(null);

    if(this.jogo['historico'] && this.jogo.historico.length){
      this.visaoHistorico.azul = 0;
      this.visaoHistorico.verde = 0;
      this.visaoHistorico.preto = 0;
      this.visaoHistorico.vermelho = 0;
      this.jogo.historico.forEach(i=>{
        if(i.cor=='red' && i.explodida)this.visaoHistorico.vermelho++;
        if(i.cor=='black' && i.explodida)this.visaoHistorico.preto++;
        if(i.cor=='green' && i.explodida)this.visaoHistorico.verde++;
        if(i.cor=='blue' && i.explodida)this.visaoHistorico.azul++;
      });
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
  async dizerBomba(){
    
    let r = ``;
    if(this.jogo.bomba.minutosRestante) r+=`${this.jogo.bomba.minutosRestante} minutos `;
    if(this.jogo.bomba.segundosRestante && this.jogo.bomba.minutosRestante) r+=' e ';
    if(this.jogo.bomba.segundosRestante) r+=` ${this.jogo.bomba.segundosRestante} segundos `;
    r+=`para explodir a bomba ${this.jogo.bomba.nomeCor}`;
    this.aser.dizer(r);
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
      if(this.jogo.revelar){
        this.chaveado.revelar();
      }
      if(this.jogo.fala>=15){
        //falar alguma coisa
        this.dizerBomba();
        this.jogo.fala = 0;
        this.salvarOffline();
      }
    }
  }

}