import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-botao',
  templateUrl: './botao.component.html',
  styleUrls: ['./botao.component.css']
})
export class BotaoComponent implements OnInit {

  constructor() { }
  @Input()icone:any;
  @Input()texto:any = '';
  @Output()acao = new EventEmitter();
  ngOnInit() {
  }

  executar(){
    this.acao.emit(true);
  }

}
