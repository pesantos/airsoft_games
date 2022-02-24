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

  novoJogo(){
    let g = {
      logs:[],
      idLog:1,
      idJogador:1,
      proprietario:null,
      acionado:null,//time dominante
      jogadores:[],
      jogadorPorTime:3,
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

}
