import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cabo',
  templateUrl: './cabo.component.html',
  styleUrls: ['./cabo.component.css']
})
export class CaboComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.game = this.novoJogo();
    let d = localStorage.getItem(this.flagSave);
    if(d){
      this.restore = true;
    }
  }

  game: any ;
  flagSave: string = 'saveGameCabo';
  restore: boolean = false;
  siren = new Audio('assets/siren.wav');
  campoSenha;// usar date para abri-lo

  novoJogo(){
    let g = {
      logs:[],
      pontoAtual:3,//primeiro ponto
      idLog:1,
      idJogador:1,
      proprietario:null,
      acionado:null,//time dominante
      pontos:[],
      jogadores:['Vermelho','Azul'],
      minutosFuga:15,
      timer:0,//tempo para detonação do ponto atual
      timerString:null,// representação do relógio da bomba
      iniciado:false,//jogo rolando
      tempoLoop:15000,//tempo do loop
      fim : false,//jogo terminou
      tempoPadrao:(1000*60*15),//quinze minutos
    }
    return g;
  }

  inicializarLafage(){
    this.game.pontos.push({
      descricao:'Matagal',
      proprietario:null,
      tempoPadrao: (1000*60*15),
      tempoRestante:(1000*60*15),
      senhas:['998875','902322'],
      explodido:[]
    });
    this.game.pontos.push({
      descricao:'Garagem',
      proprietario:null,
      tempoPadrao: (1000*60*15),
      tempoRestante:(1000*60*15),
      senhas:['212123','343435'],
      explodido:[]
    });
    this.game.pontos.push({
      descricao:'Oficina',
      proprietario:null,
      tempoPadrao: (1000*60*15),
      tempoRestante:(1000*60*15),
      senhas:['557389','876334'],
      explodido:[]
    });
    this.game.pontos.push({
      descricao:'Laboratório',
      proprietario:null,
      tempoPadrao: (1000*60*15),
      tempoRestante:(1000*60*15),
      senhas:['335566','985612'],
      explodido:[]
    });

    this.game.pontos.push({
      descricao:'Refinaria',
      proprietario:null,
      tempoPadrao: (1000*60*15),
      tempoRestante:(1000*60*15),
      senhas:['777444','334568'],
      explodido:[]
    });

    this.game.pontos.push({
      descricao:'Prisão',
      proprietario:null,
      tempoPadrao: (1000*60*15),
      tempoRestante:(1000*60*15),
      senhas:['239999','128845'],
      explodido:[]
    });

    this.game.pontos.push({
      descricao:'Cemitério',
      proprietario:null,
      tempoPadrao: (1000*60*15),
      tempoRestante:(1000*60*15),
      senhas:['999881','888334'],
      explodido:[]
    });
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

}



