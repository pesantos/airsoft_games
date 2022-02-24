import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-painel-de-senha',
  templateUrl: './painel-de-senha.component.html',
  styleUrls: ['./painel-de-senha.component.css']
})
export class PainelDeSenhaComponent implements OnInit {

  constructor() { }
  @Input() visivel = null;
  @Output() emissor = new EventEmitter();
  dialogo: boolean = false;
  valor: any = '0';
  ngOnInit() {
  }
  tip(v){
    if(this.valor.length<7){
      if(this.valor=='0')this.valor = '';
      this.valor = this.valor+v;
    }
    
  }

  enviar(){
    this.emissor.emit(this.valor);
    this.valor = '0';
    this.dialogo = false;
  }

  ngOnChanges(){
    if(this.visivel!=null){
      this.valor = '0';
      this.dialogo = true;
    }
  }

}
