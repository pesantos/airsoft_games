import { AudioService } from './../audio.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cabo',
  templateUrl: './cabo.component.html',
  styleUrls: ['./cabo.component.css']
})
export class CaboComponent implements OnInit {

  constructor(public aser:AudioService) { }

  ngOnInit() {
    this.game = this.novoJogo();
    let d = localStorage.getItem(this.flagSave);
    if(d){
      this.restore = true;
    }
  }

  async restaurar(){
    let d = localStorage.getItem(this.flagSave);
    if(d){
      
      this.game = JSON.parse(d);
      if(this.game.acionado)this.aser.tocarMusica();
      this.loop();
    }
    this.restore = false;
    
    
  }

  cancelar(){
    this.restore = false;
  }

  limpar(){
    localStorage.removeItem(this.flagSave);
    this.restore = false;
  }

  mostrarCodigo: boolean = false;
  async acao(){
    if(this.game.fim)return;
    // this.campoSenha = new Date();
    this.mostrarCodigo = true;
  }

  recebeuResposta(ev){
    
    console.log("A resposta ", ev);
  }

  recebeuModificador(sen){
    let t = setTimeout(()=>{this.mostrarCodigo = false},500);
    let senhas = this.game.pontos[this.game.pontoAtual].senhas;
    console.log("Senhas ", sen, senhas);
    if(sen==senhas[0]){
      this.acaoCor('Vermelho');
      return;
    }
    if(sen==senhas[1]){
      this.acaoCor('Azul');
      return;
    }
    this.aser.dizer("Senha incorreta");
  }

  getPonto(){
    return this.game.pontos[this.game.pontoAtual];
  }

  async acaoCor(cor){
    if(this.game.acionado==cor){
      this.aser.dizer('Operação inválida');
      return;
    }
    
    this.getPonto().proprietario = cor;
    if(this.getPonto().explodido.includes(cor)){
      this.getPonto().tempoRestante = this.game.tempoReduzido;
    }else{
      this.getPonto().tempoRestante = this.getPonto().tempoPadrao;
    }
    this.game.acionado = cor;
    this.aser.tocarMusica(0.22);
    this.ganharPontos(cor,30);
    this.salvarOffline();
    await this.aser.playAudio(this.aser.buzina);
    this.aser.dizer(`Time ${cor} implantou explosivo no ${this.getPonto().descricao}`);
    
    console.log(this.game);
  }

  ganharPontos(cor,pontos){
    this.game['placar'+cor]+=pontos;
  }

  salvarOffline(){
    // salva offline todos os dados
    localStorage.setItem(this.flagSave,JSON.stringify(this.game));
  }

  explodirPonto(){
    if(this.getPonto().explodido.includes(this.game.acionado))this.ganharPontos(this.game.acionado,40);
    if(!this.getPonto().explodido.includes(this.game.acionado))this.ganharPontos(this.game.acionado,150);
    this.getPonto().explodido.push(this.game.acionado);
    this.getPonto().proprietario = null;
    
    if(this.game.acionado=='Vermelho'){ //vermelho anda pra frente, para o final do array
      
      if(!this.game.pontos[this.game.pontoAtual+1])this.vitoria('Vermelho');
      if(this.game.pontos[this.game.pontoAtual+1])this.game.pontoAtual+=1;
    }else{ // azul vai pra trás, para o principio do array
      
      if(!this.game.pontos[this.game.pontoAtual-1])this.vitoria('Azul');
      if(this.game.pontos[this.game.pontoAtual-1])this.game.pontoAtual-=1;
    }
    this.game.acionado = null;
    this.aser.pararMusica();
    this.aser.playAudio(this.aser.explosao);
    this.salvarOffline();
    
  }

  async vitoria(cor){
    this.aser.pararMusica();
    this.ganharPontos(cor,500);
    this.game.mensagem = `Vitoria do time ${cor}`;
    this.game.fim = true;
    console.log("Vitoria "+cor);
    this.salvarOffline();
    await this.aser.dizer(this.game.mensagem);
    await this.aser.dizer('FIM de JOgo');
    await this.aser.dizer(`Time Azul fez ${this.game.placarAzul} pontos`);
    await this.aser.dizer(`Time Vermelho fez ${this.game.placarVermelho} pontos`);
    await this.aser.dizer('FIM de JOgo');
  }
  

  async loop(){
    if(this.game.fim)return;
    if(this.game.acionado){
      if(this.getPonto().tempoRestante>0){
        this.getPonto().tempoRestante-=this.game.tempoLoop;
        if(this.getPonto().tempoRestante<0)this.getPonto().tempoRestante = 0;
        await this.aser.dizer(`Bomba do time ${this.game.acionado} implantada em ${this.getPonto().descricao} `);
        await this.aser.dizer(`${this.aser.tempoTextoFalado(this.getPonto().tempoRestante)} para detonação`);
      }

      if(this.getPonto().tempoRestante==0){
        this.explodirPonto();
      }
      
    }

    if(!this.game.acionado){
      this.aser.tocarRelogioLoop();
      this.aser.dizer(`Armar bomba em ${this.getPonto().descricao}`);
    }

    this.salvarOffline();

    if(this.game.iniciado)setTimeout(()=>{this.loop();},this.game.tempoLoop);
  }
  

  startar(ev){

    if(ev!='fim')return;
      this.game = this.novoJogo();
      this.inicializarLafage();
      console.log(this.game);
      this.game.mostrarTimer = false;
      this.game.iniciado = true;
      this.loop();
    
    
  }

  game: any ;
  flagSave: string = 'saveGameCabo';
  restore: boolean = false;
  siren = new Audio('assets/siren.wav');
  campoSenha;// usar date para abri-lo
 

  novoJogo(){
    let g = {
      logs:[],
      pontoAtual:2,//primeiro ponto
      idLog:1,
      idJogador:1,
      mensagem:'',
      placarAzul:0,
      placarVermelho:0,
      proprietario:null,
      acionado:null,//time dominante
      pontos:[],
      jogadores:['Vermelho','Azul'],
      minutosFuga:1,
      timer:0,//tempo para detonação do ponto atual
      timerString:null,// representação do relógio da bomba
      iniciado:false,//jogo rolando
      tempoLoop:15000,//tempo do loop
      fim : false,//jogo terminou
      tempoPadrao:(1000*60*15),//quinze minutos
      tempoReduzido:(1000*60*3),
      mostrarTimer:true,
    }
    return g;
  }

  TEMPOPADRAO: number = 18;
  SENHA_VERMELHA = 'MTYzODExODY5';
  SENHA_AZUL = 'LTMyODU2NjY1OQ==';

  inicializarLafage(){
    this.game.pontos.push({
      descricao:'Cemitério',
      proprietario:null,
      tempoPadrao: (1000*60*(this.TEMPOPADRAO+5)),
      tempoRestante:(1000*60*(this.TEMPOPADRAO+5)),
      senhas:[this.SENHA_VERMELHA,this.SENHA_AZUL],
      explodido:[]
    });
  
    this.game.pontos.push({
      descricao:'Prisão',
      proprietario:null,
      tempoPadrao: (1000*60*this.TEMPOPADRAO),
      tempoRestante:(1000*60*this.TEMPOPADRAO),
      senhas:[this.SENHA_VERMELHA,this.SENHA_AZUL],
      explodido:[]
    });
    this.game.pontos.push({
      descricao:'Poste',
      proprietario:null,
      tempoPadrao: (1000*60*this.TEMPOPADRAO),
      tempoRestante:(1000*60*this.TEMPOPADRAO),
      senhas:[this.SENHA_VERMELHA,this.SENHA_AZUL],
      explodido:[]
    });

   

    this.game.pontos.push({
      descricao:'Bambuzal',
      proprietario:null,
      tempoPadrao: (1000*60*this.TEMPOPADRAO),
      tempoRestante:(1000*60*this.TEMPOPADRAO),
      senhas:[this.SENHA_VERMELHA,this.SENHA_AZUL],
      explodido:[]
    });

    this.game.pontos.push({
      descricao:'Porteira',
      proprietario:null,
      tempoPadrao: (1000*60*(this.TEMPOPADRAO+5)),
      tempoRestante:(1000*60*(this.TEMPOPADRAO+5)),
      senhas:[this.SENHA_VERMELHA,this.SENHA_AZUL],
      explodido:[]
    });
  }



 

}



