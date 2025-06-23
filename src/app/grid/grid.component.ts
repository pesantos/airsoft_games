import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {

   constructor(public util:UtilService) { }
  @Input()pai:any;
  @Input()naoClonarListaInterna = false;
  @Input()id:any = 'x';
  @Input()totalizar: boolean = false;
  @Input()lista:any;
  @Input()campos:any;//titulo - chave - tipo --tamanho
  @Input()acoes:any;
  @Input()mostrarPaginador = true;
  @Input()paginacao:any = 10;
  @Input()titulo:any = '';
  @Output()onAcao = new EventEmitter();
  @Output()onAlteracaoLinha = new EventEmitter();
  mostrar: boolean = false;
  listaInterna:any;
  proxy:any;
  camposI:any;
  larg:any = Object.create(null);
  botoes:any;
 
  ngOnChanges(changes: SimpleChanges): void {
    console.log("ON CHAGENS")
    this.larg = Object.create(null);
    this.botoes = null;
    this.mostrar = false;
    if(this.naoClonarListaInterna){
      this.listaInterna = this.lista;
    }else{
      this.listaInterna = this.util.clone(this.lista);
    }
    this.camposI = this.util.clone(this.campos);
    //icone, texto, acao
    if(this.acoes && this.acoes.length){
      this.botoes = this.acoes.filter(x=>x[3]!='n').map(i=>{
        return {
          icone:i[0],
          texto:i[1],
          acao:i[2],
          mostrar:!i[3]
        }
      });

      this.camposI.push(['Ações','','botoes',50*this.botoes.length]);
    }
    if(this.camposI && this.camposI.length)this.camposI.forEach(i=>{
      if(i[3]){
        this.larg[i[1]]={width:(i[3]+'px')}
      }else{
        this.larg[i[1]] = {};
      }
    });
    this.proxy = this.listaInterna;
    if(this.lista && this.lista.length)this.mostrar = true;
  }

  alterouLinha(linha:any){
    this.onAlteracaoLinha.emit(linha);
  }

  documento(doc:any){
    if(!doc)return;
    // window.open(this.est.URL_SITE+'controller/fotos/'+doc, '_blank').focus();
  }

  acao(dados:any,ac:any){
    this.onAcao.emit({alvo:dados,acao:ac});
    this.pai[ac](dados);
  }
 



}
