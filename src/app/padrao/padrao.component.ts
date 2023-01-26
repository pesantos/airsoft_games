import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import PatternLock from '@phenax/pattern-lock-js';
@Component({
  selector: 'app-padrao',
  templateUrl: './padrao.component.html',
  styleUrls: ['./padrao.component.css']
})
export class PadraoComponent implements OnInit {

  constructor() { }

  @Input()nodos:any = 4;
  @Input()alvo:any = 'padrao';
  @Output()resposta = new EventEmitter();

  ngOnInit() {
    // let te = setTimeout(()=>{
      
    // },1000);
    
  }
  objeto:any;
  ngAfterViewInit(){
    let t = setTimeout(()=>{
      this.objeto = PatternLock({
        $canvas: document.getElementById(this.alvo),
        width: 300,
        height: 430,
        grid: [ 4, 4 ],
      });
      this.objeto.setTheme('light');
      this.objeto.onComplete(hash=>{this.retornarSenha(hash)});

    },500);
    console.log('foi')
    
  }

  retornarSenha(senha){
    // console.log(senha);
    if(senha.nodes.length>=this.nodos){
      this.objeto.setThemeState('success');
      this.resposta.emit(senha.hash);
    }else{
      this.objeto.setThemeState('failure');
    }

    let t = setTimeout(()=>{
      senha.nodes = [];
      
    },500);
    
  }

}
