import { ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-six',
  templateUrl: './six.component.html',
  styleUrls: ['./six.component.css']
})
export class SixComponent implements OnInit {

  constructor(private confirmationService:ConfirmationService) { }

  ngOnInit() {
    this.iniciar();
    let d = localStorage.getItem(this.flagSave);
    if(d){
      this.restore = true;
    }
  }

  game:any;
  falas:any = [];
  irra = new Audio('assets/irra.wav');
  gold = new Audio('assets/gold.mp3');
  money = new Audio('assets/here.mp3');
  explosao = new Audio('assets/expo.wav');
  balancear: boolean = true;

  nomeJogador:any;
  corSelecionada:any;
  senhaJogador: boolean = false;
  s1:any;
  jogadorSelecionado: any;

  jaUsada:boolean = false;
  mostrarPrincipal: boolean = false;
  placarAzul:any;
  placarVermelho:any;
  tempoAzul:any;
  tempoVermelho:any;

  tempoEmMinutos: number = 15;
  vidasPorJogador: number = 3;

  cogumelo = new Audio('assets/cogumelo.wav');

  aviso:any = null;
  textoAviso:any;
  iconeAviso:any;
  avisoTimer:any;
  avisar(i,t){
    this.apagarAviso();
    this.textoAviso = t;
    this.iconeAviso = i;
    this.aviso = true;
    this.avisoTimer = setTimeout(()=>{
      this.apagarAviso();
    },3000);
  }

  apagarAviso(){
    clearTimeout(this.avisoTimer);
    this.aviso = false;
    this.textoAviso = null;
    this.iconeAviso = null;
  }

  computarPlacar(){
    this.placarAzul = {vivos:0,vidas:0};
    this.placarVermelho = {vivos:0,vidas:0};
    if(this.game && this.game.jogadores.length){
      this.game.jogadores.forEach(j=>{
        if(j.time=='azul'){
          if(j.vivo)this.placarAzul.vivos++;
          this.placarAzul.vidas+=parseInt(j.vidas);
        }
        if(j.time=='vermelho'){
          if(j.vivo)this.placarVermelho.vivos++;
          this.placarVermelho.vidas+=parseInt(j.vidas);
        }
      });
    }
    this.tempoAzul =  this.getTempoLabelg(this.game.tempoAzul);
    this.tempoVermelho = this.getTempoLabelg(this.game.tempoVermelho);

  }

  setarSenhaJ(sen){
    if(this.game.mapaSenha[sen]){
      this.jaUsada = true;
      this.s1 = null;
      return;
    }

    this.jaUsada = false;

    if(this.senhaJogador){
      if(this.s1 && this.s1==sen){
        this.jogadorSelecionado.senha = sen;
        this.senhaJogador = false;
        this.s1 = null;
        this.jogadorSelecionado = null;
        console.log(this.game);
        this.mapear();
        this.salvarOffline();
      }else{
        if(!this.s1){
          this.s1 = sen;
        }else{
          this.s1 = null;
        }
        
      }
      
      
    }
  }
  configurando = false;
  pontape:any;

  processarBalanceamento(){ // adiciona vidas adicionais para o time de forma aleatória
    if(this.balancear){
      let ta = this.game.azuis.length;
      let tv = this.game.vermelhos.length;
      if(ta!=tv){
        if(ta<tv){
          let d = tv-ta;
          d = d*this.vidasPorJogador;
          while(d>0){
            let o = this.obterItemRandom(this.game.azuis);
            o.vidas++;
            d--;
          }
        }else{
          let d = ta-tv;
          d = d*this.vidasPorJogador;
          while(d>0){
            let o = this.obterItemRandom(this.game.vermelhos);
            o.vidas++;
            d--;
          }
        }
      }
    }
  }

  senhasValidas(){
    let r = true;
    this.game.jogadores.forEach(j=>{
      if(!j.senha)r = false;
    });
    if(!r)this.game.estado = 'configure as senhas';
    return r;
  }

  jogadoresValidos(){
    if(!this.game.jogadores){
      this.game.estado = 'sem jogadores';
      return false;
    }
    return true;
  }

  iniciarPartida(){
    
    if(!this.jogadoresValidos())return;
    if(!this.senhasValidas())return;
    this.mapear();
    this.configurando = true;
    this.falas = [];
    this.game.tempoAzul = this.tempoEmMinutos*60*1000;
    this.game.tempoVermelho = this.tempoEmMinutos*60*1000;
    this.game.dominante = 'neutro';
    this.game.jogadores.forEach(j=>{
      j.vidas = this.vidasPorJogador;
      j.vivo = true;
    });
    this.processarBalanceamento();//depois de setar as vidas de cada um
    this.game.estado = 'iniciado';
    this.salvarOffline();
    clearTimeout(this.pontape);
    clearTimeout(this.game.g);
    this.dizer(`O jogo iniciará em 15 segundos`);
    this.pontape = setTimeout(()=>{
      this.dizer('Jogo Iniciado');
      this.loop()
    },this.game.tempoLoop);
  }

  novoJogo(){
    this.game = {
      //propriedades aqui
      vitorias:[],
      pontosGeral:{vermelho:0,azul:0},
      estado:'parado',
      jogadores:null,
      vermelhos:null,
      azuis:null,
      tempoAzul:15*1000*60,
      tempoVermelho:15*1000*60,
      dominante:'neutro',
      mapaJogadores:null,
      mapaSenha:null,
      modo:null,
      ultimoId:0,
      vidas:2,
      tempoLoop:15000,
      g:null
    };
  }

  processarPerdaDeVida(j){
    this.mostrarPrincipal = false;
    if(!j.vivo){
      this.falas.push(`${j.nome} você já está eliminado, aguarde a próxima rodada`);
      this.avisar('💀','eliminado');
      this.falar();
      return;
    }
      if(j.vidas>0){
        j.vidas--;
        this.falas.push(`Operador ${j.nome} morreu, dirija-se para area de nascimento`);
        this.avisar('💀',`${j.nome} vá para o respawn`);
      }else if(j.vidas==0){
        this.falas.push(`Operador ${j.nome} eliminado, aguarde a próxima rodada`);
        j.vivo = false;//morre o cara
        this.avisar('💀',`${j.nome} eliminado`);
        this.checarVidas('azul');
        this.checarVidas('vermelho');
      }
      this.computarPlacar();
      this.falar();
    
  }

  processarBomba(j){
    if(!this.game || !(this.game.estado=='iniciado'))return;
    if(!j.vivo){
      this.mostrarPrincipal = false;
      return;
    }
    this.game.dominante = j.time;
    this.falas.push(`${j.nome} do Time ${j.time} ativou o explosivo`);
    this.mostrarPrincipal = false;
    this.avisar('💣',`Bomba Ativada (${j.time})`);
    this.computarPlacar();
    this.falar();
  }

  processar(senha){
    console.log(`Senha ${senha}`);
    if(!this.game || this.game.estado!='iniciado')return;
    
    let j = this.game.mapaSenha[senha];
    if(j){
      if(this.game.modo=='vida'){
        this.processarPerdaDeVida(j);
      }else{
        this.processarBomba(j);
      }
      this.salvarOffline();
    }
    console.log(this.falas,this.game);
  }

  mapear(){
    if(this.game && this.game.jogadores && this.game.jogadores.length){
      this.game.mapaJogadores = {};
      this.game.azuis = [];
      this.game.vermelhos = [];
      this.game.mapaSenha = {};
      this.game.jogadores.forEach(j=>{
        if(j.time=='azul'){
          this.game.azuis.push(j);
        }else{
          this.game.vermelhos.push(j);
        }
        this.game.mapaJogadores[j.id]=j;
        if(j.senha)this.game.mapaSenha[j.senha]=j;
        
      });
      this.computarPlacar();
    }
  }

  adicionarJogador(){
    if(!this.game['jogadores'])this.game['jogadores']=[];
    if(!this.nomeJogador || !this.corSelecionada)return;

    let novo = {
      id:this.game.ultimoId+1,
      nome:this.nomeJogador,
      time:this.corSelecionada,
      senha:null,
      vidas:this.game.vidas,
      vivo:true

    }

    this.game.jogadores.push(novo);
    this.mapear();
    this.game.ultimoId = novo.id;

    this.nomeJogador = null;
    this.corSelecionada = null;
    console.log(this.game);
    this.salvarOffline();
  }


  iniciar(){
   this.novoJogo();
    
  }

  definirSenha(j){
    console.log("definir senha de ", j);
    this.jogadorSelecionado = j;
    this.senhaJogador = true;
    this.jaUsada = false;
  }

 

  modoVida(){
    this.apagarAviso();
    if(!this.game)return;
    this.game.modo = 'vida';
    this.mostrarPrincipal = true;
    this.acionarApagar();
  }
  modoBomba(){
    this.apagarAviso();
    if(!this.game)return;
    this.game.modo = 'bomba';
    this.mostrarPrincipal = true;
    this.acionarApagar();
  }

  acionarApagar(){
    clearTimeout(this.apagarPrincipal);
    this.apagarPrincipal = setTimeout(()=>{
      this.mostrarPrincipal = false;
      console.log("SLEEP");
      this.game.modo = null;
    },10000);
  }

  obterItemRandom(li){
    return li[Math.floor(Math.random() * li.length)];
  }

  apagarPrincipal:any;

  playAudio(audio){
    return new Promise(res=>{
      audio.play()
      audio.onended = res
    })
  }

  excluir(j){
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o ${j.nome}?`,
      accept: () => {
          this.game.jogadores = this.game.jogadores.filter(jj=>jj.id!=j.id);
          this.mapear();
          this.salvarOffline();
      }
  });
  }

  getTempoLabelg(t){
    
    if(t==0) return '00:00';
    
    let v = t/1000;
    let minutos = Math.floor((v/60)).toFixed(0);
    if(minutos.length==1)minutos = '0'+minutos;
    let segundos = (v%60).toFixed(0);
    if(segundos.length==1)segundos = '0'+segundos;
    return minutos+':'+segundos;
  }

  calcularTempo(t){

    if(t<1)return 'zero';

    let minutos = parseInt(Math.floor((t/60/1000)).toFixed(0));
    let segundos = parseInt(((t/1000)%60).toFixed(0));
    let produto = '';
    if(segundos==0){
      console.log("Segundos é zero");
      if(minutos==1) return minutos+' minuto';
      produto = minutos+' minutos';
      return produto;
    }
    if(minutos==1){
      produto+= minutos+' minuto';
      if(segundos==1){
        produto+=' e um segundo';
      }
  
      if(segundos>1){
        produto+=' e '+segundos+' segundos';
      }

      return produto;
    }
    if(minutos>1){
      produto+=minutos+' minutos';
      if(segundos==1){
        produto+=' e um segundo';
      }
  
      if(segundos>1){
        produto+=' e '+segundos+' segundos';
      }

      return produto;
    }

    produto = t/1000+' segundos';

    return produto;

  }

  flagSave:string ="six_game";
  restore:boolean = false;
  async restaurar(){
    let d = localStorage.getItem(this.flagSave);
    if(d){
      
      this.game = JSON.parse(d);
      this.mapear();
      if(this.game.estado=='iniciado'){
        this.game.g = setTimeout(()=>{
          this.dizer('Jogo restaurado');
          this.loop()},this.game.tempoLoop);
      }
      
      
    }
    this.restore = false;
    
    
  }

  async vencer(cor,tipo){
    this.game.estado = 'terminado';
    this.game.vitorias.push({cor,tipo});
    if(tipo=='matar')this.game.pontosGeral[cor]+=2;
    if(tipo=='tempo')this.game.pontosGeral[cor]+=1;
    this.salvarOffline();
    if(tipo=='tempo')await this.playAudio(this.explosao);
    this.falas.push(`Vitória do time ${cor}`);
    this.falas.push(`Vitória do time ${cor}`);

    while(this.falas.length){
      await this.falar();
    }
  }

  checarVidas(time){
    let mortos = true;
    let r = time=='azul'?this.game.vermelhos:this.game.azuis;
    r.forEach(j=>{
      if(j.vivo)mortos = false;
    });

    if(mortos){
      this.falas.push(`Vitória do time ${time} por eliminação completa do time inimigo`);
      this.vencer(time,'matar');
    }

  }

  rodarLogica(){
    console.log("lógica ",this.game);
    if(this.game.dominante){
      if(this.game.dominante=='vermelho'){
        this.game.tempoVermelho-=15000;
      }
      if(this.game.dominante=='azul'){
        this.game.tempoAzul-=15000;
      }
    }

    this.computarPlacar();

    if(this.game.tempoVermelho<=0){
      this.game.tempoVermelho = 0;
      //time vermelho ganha
      this.falas.push('*');
      this.falas.push(`Vitória do time vermelho por detonação do explosivo`);
      
      this.vencer('vermelho','tempo');
      
    }

    if(this.game.tempoAzul<=0){
      this.game.tempoAzul = 0;
      //time azul ganha
      this.falas.push('*');
      this.falas.push(`Vitória do time azul por detonação do explosivo`);
      this.vencer('azul','tempo');
    }

    



    this.checarVidas('azul');
    this.checarVidas('vermelho');
    
  }

  async falar(vezes=1){
    while(vezes){
      let f = this.falas.shift();
      if(f=='*')await this.playAudio(this.explosao);
      if(f!='*' && f) await this.dizer(f);
      vezes--;
    }
    
  }

  gerarFalaPlacar(){
    if(this.game.estado!='iniciado')return;
    let r = ``;
    r+=`${this.placarAzul.vivos}  azul contra ${this.placarVermelho.vivos} vermelho`;
    this.falas.push(r);
  }

  gerarFalaTempo(){
    if(this.game.estado!='iniciado')return;
    if(this.game.dominante!='neutro'){
      
      if(this.game.dominante=='azul') this.falas.push(`${this.calcularTempo(this.game.tempoAzul)} para o time azul detonar o explosivo`);
      if(this.game.dominante=='vermelho') this.falas.push(`${this.calcularTempo(this.game.tempoVermelho)} para o time vermelho detonar o explosivo`);
    }
  }

  async loop(){
    this.configurando = false;
    if(this.game){
      console.log("Rodando loop");
      if(this.game && this.game.estado=='iniciado'){
        this.rodarLogica();
        this.computarPlacar();
        this.gerarFalaPlacar();
        this.gerarFalaTempo();
        this.falar(3);
      }
      clearTimeout(this.game.g);
      this.game.g = setTimeout(()=>{this.loop()},this.game.tempoLoop);
    }
  }


  async dizer(texto:any){
    // if(this.musicaAtual)this.musicaAtual.volume = 0.1;
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

  limpar(){
    localStorage.removeItem(this.flagSave);
    this.restore = false;
  }

  cancelar(){
    this.restore = false;
  }

  salvarOffline(){
    // salva offline todos os dados
    localStorage.setItem(this.flagSave,JSON.stringify(this.game));
  }

}
