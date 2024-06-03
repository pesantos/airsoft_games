import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chaveado',
  templateUrl: './chaveado.component.html',
  styleUrls: ['./chaveado.component.css']
})
export class ChaveadoComponent implements OnInit {

  constructor() { }

  @Output() acao = new EventEmitter();
  ngOnInit() {
  }

  bomba:any;
  jogo:any;
  telaChave = Object.create(null);
  memoria:any = Object.create(null);
  itens:any = [];
  ordem: number = 1;
  sequencia:any = [];
  mapaGrid:any = Object.create(null);
  tipo: string = 'normal';
  cor:any;
  header: string = '';

  gerarHeader(){
    if(this.cor=='red')this.header ='SEGREDO VERMELHO';
    if(this.cor=='blue')this.header ='SEGREDO AZUL';
    if(this.cor=='green')this.header ='SEGREDO VERDE';
    if(this.cor=='black')this.header ='SEGREDO PRETO';
  }

  mudou(ev,i){
    if(this.tipo=='desarmando'){
      this.mudouDesarmar(ev,i);
      return;
    }
    console.log("Mudou ", ev.checked, i);
    if(!ev.checked){
      this.reset();
      return;
    }

    this.sequencia.push({valor:i,ordem:this.ordem,revelar:true});
    this.mapaGrid[i] = {valor:i,ordem:this.ordem,revelar:true};
    this.ordem++;
    
  }

  desarmou(){
    let ok = true;
    this.bomba.segredo.forEach((it,i)=>{
      if(!this.sequencia[i] || this.sequencia[i].valor != it.valor)ok = false;
    });
    return ok;
  }

  mudouDesarmar(ev,i){
    console.log("Mudando desarmar ", ev, i, this.jogo);
    console.log("Avaliando ", i, this.bomba.segredo[this.ordem-1], `Ordem: ${this.ordem}`)
    if(!ev.checked){
      console.log("DESARME ")
      this.reset();
      if(this.jogo.explodir){
        this.acao.emit('explodir');
      }
    }
    if(this.bomba.segredo[this.ordem-1] && i==this.bomba.segredo[this.ordem-1].valor){
      console.log("Acertou ")
      this.sequencia.push({valor:i,ordem:this.ordem,revelar:true});
      this.mapaGrid[i] = {valor:i,ordem:this.ordem,revelar:true};
      this.ordem++;
      if(this.desarmou()){
        console.log("DESARMADA :)");
        this.acao.emit('desarmar');
        this.telaChave = Object.create(null);
      }
    }else{
      console.log("ERROU ")
      this.reset();
      if(this.jogo.explodir){
        this.telaChave = Object.create(null);
        this.acao.emit('explodir');
      }
    }
    
  }



  reset(){
    const t = setTimeout(()=>{
      this.memoria = Object.create(null);
      this.mapaGrid = Object.create(null);
      this.sequencia = [];
      this.ordem = 1;
    },330);
  }

  erro:any;
  terminado(){
    this.erro = '';
    if(this.sequencia.length<1){
        this.erro = 'Informe a sequencia antes de terminar';
        return;
    }
    this.bomba.segredo = this.sequencia.map(s=>{
      s.revelar = false;
      return s;
    });
    this.bomba.tempoRestante = this.bomba.tempo*60;
    this.bomba.acionada = true;
    console.log("A Bomba ", this.bomba);
    this.telaChave = Object.create(null);
    this.acao.emit('armada');

  }

  desarmar(bomba, jogo){
    this.reset();
    this.tipo = 'desarmando';
    this.bomba = bomba;
    this.jogo = jogo;
    this.itens = [];
    for(let i = 1; i<=this.jogo.tamanho;i++){
      this.itens.push(i);
    }
    this.bomba.segredo.forEach(s=>this.mapaGrid[s.valor]=s);
    this.telaChave = Object.create(null);
    const t = setTimeout(()=>{
      this.telaChave.visivel = true;
    },400);
  }

  sumirView(){
    this.telaChave = Object.create(null);
    this.reset();
  }

  programar(numero,cor,bomba){
    this.reset();
    this.bomba = bomba;
    this.itens = [];
    this.tipo = 'programar';
    this.sequencia = [];
    this.cor = cor;
    this.gerarHeader();
    for(let i = 1; i<=numero;i++){
      this.itens.push(i);
    }
    this.telaChave = Object.create(null);
    this.telaChave.tipo = 'programar';
    this.telaChave.visivel = true;
  }

}
