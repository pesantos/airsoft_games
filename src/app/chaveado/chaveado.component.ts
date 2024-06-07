import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-chaveado',
  templateUrl: './chaveado.component.html',
  styleUrls: ['./chaveado.component.css']
})
export class ChaveadoComponent implements OnInit {

  constructor(private audio:AudioService) { }

  @Output() acao = new EventEmitter();
  @Input()pai:any;
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
      this.audio.playAudio(this.audio.beep_erro);
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
      this.audio.playAudio(this.audio.beep_erro);
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
      this.audio.playAudio(this.audio.beep_sucesso);
    }else{
      console.log("ERROU ")
      this.reset();
      if(this.jogo['punicao']){
        if(this.jogo && this.jogo.bomba){
          this.jogo.bomba.tempoRestante-= parseInt(this.jogo.punicaoSegundos);
          this.jogo.bomba.perdido = this.jogo.punicaoSegundos;
          
          const timer = setTimeout(()=>{
            if(this.jogo.bomba) delete this.jogo.bomba.perdido;
          },2000);
        }
        
        console.log("houve punicao ", this.jogo, this.jogo.punicaoSegundos);
      }
      if(this.jogo.explodir){
        this.telaChave = Object.create(null);
        this.acao.emit('explodir');
      }
      this.audio.playAudio(this.audio.beep_erro);
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
    this.bomba.grid = Object.create(null);
    this.bomba.segredo.forEach(s=>this.bomba.grid[s.valor]=s);
    this.telaChave = Object.create(null);
    const t = setTimeout(()=>{
      this.telaChave.visivel = true;
    },400);
  }

  sumirView(){
    this.telaChave = Object.create(null);
    this.reset();
  }

  obterItemRandom(li){
    return li[Math.floor(Math.random() * li.length)];
  }

  colocarBomba(b){
    this.bomba = b;
  }

  revelar(){
    if(this.bomba){
      const tempo = this.bomba.tempo*60;
      const tempoRestante = this.bomba.tempoRestante;
      const percentual = parseInt(((tempoRestante/tempo)*100)+'');
      // console.log(`${this.bomba.segredo.length} ${percentual}%`);
      const quantas = parseInt(((this.bomba.segredo.length*((100-percentual)/100)))+'');
      const reveladas = Object.values(this.bomba.grid).filter((i:any)=>i.revelar).length;
      // console.log(`Quantas: ${quantas}`,`Reveladas:${reveladas}`);
      const paraRevelar = quantas-reveladas;
      // console.log("Para revelar ", paraRevelar);
      if(paraRevelar>0){
        for(let i = 0; i<paraRevelar;i++){
          this.goRevelar();
        }
      }
      if(percentual<20){
        Object.values(this.bomba.grid).forEach((i:any)=>i.revelar = true);
      }
    }
    // console.log("Tentando revelar", this.bomba);
    
  }

  goRevelar(){
    const li = Object.values(this.bomba.grid).filter((i:any)=>!i.revelar);
    const i = this.obterItemRandom(li);
    if(i)i.revelar = true;
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
