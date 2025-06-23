import { AudioService } from './../audio.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../util.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-sebastiao',
  templateUrl: './sebastiao.component.html',
  styleUrls: ['./sebastiao.component.css']
})
export class SebastiaoComponent implements OnInit {

  
    constructor(public aser:AudioService, public util:UtilService, private promp:ConfirmationService) { }

  ngOnInit() {
    this.iniciar();
    this.carregarJogos();
    this.jogo = this.novoJogo();
    let d = localStorage.getItem(this.flagSave);
    console.log("REstaurar ", d);
    if(d){
      this.restore = true;
    }
  }

  criarJogo(){
    this.jogo = this.novoJogo();
    this.status = 'novo';

  }

  cancelarConfig(){
    this.status = 'inicio';
  }

  rodarJogo(){
    this.status = 'jogando';
  }

  iniciar(){
    window.speechSynthesis.onvoiceschanged = () => {
      this.vozes = window.speechSynthesis.getVoices();
      console.log(this.vozes); // Mostra todas as vozes disponíveis no dispositivo
    };
  }
  vozes = [];
  jogo:any;
  status:string = 'inicio';
  loopando:any;
  flagSave: string = 'sebastiao_game';
  restore: boolean = false;

  novoJogo(){
    const j = Object.create(null);
    j.status = 'novo';
    j.id = 1;
    j.pontosTortura = [];
    j.pontosProtecao = [];
    j.frasesTortura = [];
    j.frasesProtecao = [];
    j.frasesNeutras = [];
    j.frasesQuebrado = [];
    j.senhasAgua = [];
    j.frasesSeco = [];
    j.config = Object.create(null);
    //configurar
    return j;
  }

  mfrases = {
    'frasesp':'frasesProtecao',
    'frasest':'frasesTortura',
    'frasesn':'frasesNeutras',
    'frasesq':'frasesQuebrado',
    'frasess':'frasesSeco',
    'senhasa':'senhasAgua'
  }

  salvarOffline(){
    // salva offline todos os dados
    localStorage.setItem(this.flagSave,JSON.stringify(this.jogo));
  }

  async restaurar(){
    let d = localStorage.getItem(this.flagSave);
    if(d){
      this.jogo = JSON.parse(d);
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

  perfis:any = [];
  carregarJogos(){
    this.perfis = null;
    let ids = 1;
    let ob = localStorage.getItem('jogos');
    if(ob){
      ob = JSON.parse(ob);
      let lista = [];
      Object.keys(ob).forEach(k=>{
        lista.push({
          id:ids,
          nome:ob[k]['nome'],
          valor:ob[k]
        });
        ids++;
      });
      this.perfis = lista;
      console.log("Os perfils ", this.perfis);
    }

  }

  editarPerfil(per:any){
    this.status = 'novo';
    console.log("O PERFIL ", per);
    this.jogo = per.valor;
  }

  excluirPerfil(per:any){
   
    this.promp.confirm({
      message: `DESEJA EXCLUIR O PERFIL #${per.id}?`,
      header: "Manuseio de Perfil",
      key:'principal',
      acceptLabel:'EXCLUIR',
      rejectLabel:'cancelar',
      accept: () => {
        const ob = localStorage.getItem('jogos');
        const nv = JSON.parse(ob);
        delete nv[this.util.TEXTO(per.nome)];
        localStorage.setItem('jogos',JSON.stringify(nv)); 
        this.carregarJogos();
      },
      reject: ()=>{
        
      }
    });
  }


  salvarConfiguracao(){
    if(!this.jogo['nome']){
      this.util.toast('e','Informe o nome da configuração');
      return;
    }
    const ob = localStorage.getItem('jogos');
    if(!ob)localStorage.setItem('jogos',JSON.stringify(Object.create(null)));
    if(ob){
      const nv = JSON.parse(ob);
      nv[this.util.TEXTO(this.jogo.nome)] = this.jogo;
      localStorage.setItem('jogos',JSON.stringify(nv));
    }
    this.carregarJogos();
    this.status = 'inicio';
  }

  tela:any = Object.create(null);
  pontos(tipo='Tortura'){
    this.tela = Object.create(null);
    this.tela.tipo = tipo;
    this.tela.estilo = {height:'90%'};
    if(tipo=='Tortura')this.tela.tipo ='pontost';
    if(tipo=='Protecao')this.tela.tipo ='pontosp';
    this.tela.titulo = `Pontos ${tipo}`;
    this.tela.elemento = Object.create(null);
    this.tela.visivel = true;
  }
  frases(tipo='Tortura'){
    this.tela = Object.create(null);
    this.tela.tipo = tipo;
    this.tela.estilo = {height:'90%'};
    if(tipo=='Tortura')this.tela.tipo ='frasest';
    if(tipo=='Protecao')this.tela.tipo ='frasesp';
    if(tipo=='Neutras')this.tela.tipo ='frasesn';
    if(tipo=='Quebrado')this.tela.tipo ='frasesq';
    if(tipo=='Seco')this.tela.tipo ='frasess';
    if(tipo=='Senha')this.tela.tipo ='senhasa';
    this.tela.titulo = `Frases ${tipo}`;
    this.tela.elemento = Object.create(null);
    this.tela.visivel = true;
  }

  removerPonto(ponto:any){
    this.promp.confirm({
      message: `Tem certeza que deseja remover este ponto #${ponto.id}?`,
      header: "Exclusão de Ponto",
      key:'principal',
      acceptLabel:'EXCLUIR',
      rejectLabel:'cancelar',
      accept: () => {
        if(this.tela.tipo=='pontost'){
          this.jogo.pontosTortura = this.jogo.pontosTortura.filter((i:any)=>i.id!=ponto.id);
          this.jogo.pontosTortura = this.util.clone(this.jogo.pontosTortura);
          return;
        }
        if(this.tela.tipo=='pontosp'){
          this.jogo.pontosProtecao = this.jogo.pontosProtecao.filter((i:any)=>i.id!=ponto.id);
          this.jogo.pontosProtecao = this.util.clone(this.jogo.pontosProtecao);
          return;
        }
        if(this.tela.tipo=='frasesp'){
          this.jogo.frasesProtecao = this.jogo.frasesProtecao.filter((i:any)=>i.id!=ponto.id);
          this.jogo.frasesProtecao = this.util.clone(this.jogo.frasesProtecao);
          return;
        }
        if(this.tela.tipo=='frasest'){
          this.jogo.frasesTortura = this.jogo.frasesTortura.filter((i:any)=>i.id!=ponto.id);
          this.jogo.frasesTortura = this.util.clone(this.jogo.frasesTortura);
          return;
        }
        if(this.tela.tipo=='frasesn'){
          this.jogo.frasesNeutras = this.jogo.frasesNeutras.filter((i:any)=>i.id!=ponto.id);
          this.jogo.frasesNeutras = this.util.clone(this.jogo.frasesNeutras);
          return;
        }
        if(this.tela.tipo=='frasesq'){
          this.jogo.frasesQuebrado = this.jogo.frasesQuebrado.filter((i:any)=>i.id!=ponto.id);
          this.jogo.frasesQuebrado = this.util.clone(this.jogo.frasesQuebrado);
          return;
        }
        if(this.tela.tipo=='frasess'){
          this.jogo.frasesSeco = this.jogo.frasesSeco.filter((i:any)=>i.id!=ponto.id);
          this.jogo.frasesSeco = this.util.clone(this.jogo.frasesSeco);
          return;
        }
        if(this.tela.tipo=='senhasa'){
          this.jogo.senhasAgua = this.jogo.senhasAgua.filter((i:any)=>i.id!=ponto.id);
          this.jogo.senhasAgua = this.util.clone(this.jogo.senhasAgua);
          return;
        }
      }
    });
  }

  gerarId(){
    this.jogo.id = parseInt(this.jogo.id);
    const v = this.jogo.id;
    this.jogo.id++;
    return v;
  }

  adicionarPonto(){
    console.log("Adicionando ponto ", this.tela);
    const el = this.tela.elemento;
    if(!this.util.VALIDAR_OBJETO(el,['descricao','tempo']))return;
    const novo = {
      id:this.gerarId(),
      tempo:parseInt(el.tempo),
      descricao:this.util.TEXTO(el.descricao)
    }
    if(this.tela.tipo=='pontost'){
      this.jogo.pontosTortura.push(novo);
      this.tela.elemento = Object.create(null);
      this.jogo.pontosTortura = this.util.clone(this.jogo.pontosTortura);
      return;
    }
    if(this.tela.tipo=='pontosp'){
      this.jogo.pontosProtecao.push(novo);
      this.tela.elemento = Object.create(null);
      this.jogo.pontosProtecao = this.util.clone(this.jogo.pontosProtecao);
      return;
    }
    console.log("JOGO ", this.jogo);
    //valida e adiciona
  }

  falar(frase:any){
    this.aser.dizer(frase.descricao,2.1,0.1);
  }

  adicionarFrase(){
    console.log("Adicionando frase ", this.tela);
    const el = this.tela.elemento;
    if(!this.util.VALIDAR_OBJETO(el,['descricao']))return;
    const novo = {
      id:this.gerarId(),
      descricao:el.descricao,
      mini:this.util.abreviar(this.util.TEXTO(el.descricao))
    }
    if(this.tela.tipo=='frasest'){
      this.jogo.frasesTortura.push(novo);
      this.tela.elemento = Object.create(null);
      this.jogo.frasesTortura = this.util.clone(this.jogo.frasesTortura);
      return;
    }
    if(this.tela.tipo=='frasesp'){
      this.jogo.frasesProtecao.push(novo);
      this.tela.elemento = Object.create(null);
      this.jogo.frasesProtecao = this.util.clone(this.jogo.frasesProtecao);
      return;
    }
    if(this.tela.tipo=='frasesn'){
      this.jogo.frasesNeutras.push(novo);
      this.tela.elemento = Object.create(null);
      this.jogo.frasesNeutras = this.util.clone(this.jogo.frasesNeutras);
      return;
    }
    if(this.tela.tipo=='frasesq'){
      this.jogo.frasesQuebrado.push(novo);
      this.tela.elemento = Object.create(null);
      this.jogo.frasesQuebrado = this.util.clone(this.jogo.frasesQuebrado);
      return;
    }
    if(this.tela.tipo=='frasess'){
      this.jogo.frasesSeco.push(novo);
      this.tela.elemento = Object.create(null);
      this.jogo.frasesSeco = this.util.clone(this.jogo.frasesSeco);
      return;
    }
    if(this.tela.tipo=='senhasa'){
      this.jogo.senhasAgua.push(novo);
      this.tela.elemento = Object.create(null);
      this.jogo.senhasAgua = this.util.clone(this.jogo.senhasAgua);
      return;
    }
    console.log("JOGO ", this.jogo);
  }

}
