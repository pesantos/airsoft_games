import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-pontos',
  templateUrl: './pontos.component.html',
  styleUrls: ['./pontos.component.css']
})
export class PontosComponent implements OnInit {

  constructor() { }
  cores = ['azul','vermelho','verde','preto','branco','cinza','amarelo','laranja'];
  musicas = ['assets/007.mp3','assets/beebop.mp3','assets/impossible.mp3','assets/Beethoven9Synphony.mp3','assets/All-Along-The-WatchTower.mp3','assets/overture.mp3','assets/Bob-Dylan-The-Times-They-Are-A-Changin.mp3','assets/valquiria.mp3','assets/whiplash.mp3','assets/evangelion.mp3','assets/sold.mp3','assets/creedance.mp3'];
  musicas2 = [];
  flagSave: string = 'saveGamePontos';
  sirene = new Audio('assets/sirene.mp3');
  clock = new Audio('assets/clock.mp3');
  explosao = new Audio('assets/expo.wav');
  registradora = new Audio('assets/registradora.wav');
  volumeDaMusica: number = 0.28;
  game: any ;
  dialogo: boolean = false; // dialogo de configuraçõa de jogo
  restore: boolean = false;
  campoSenha:any;
  historicoVisivel: boolean = false;
  irra = new Audio('assets/irra.wav');

  acaoDesativada: boolean = false;

  abrirHistorico(){
    this.historicoVisivel = true;
  }

  

  novoJogo(){
    let g = {
      logs:[],
      idLog:1,
      frase:'O explosivo se encontra em estado neutro, acione o modo de transporte',
      estadoBomba:'neutro',
      acionado:null,//time dominante
      pontoAcionado:null,//local em que a bomba está acionada
      estado:'',// estado do kit  'transporte', 'acionado', 'neutro'
      // localidades : ['Porteira','Bambuzal','Bunker'],
      // localidades : ['Porteira','Bambuzal','Bunker','Vila','Poste','Prisão','Cemitério','Casa do Moinho','Octógono','Quina da Vala','Casa do Octógono'],
      // localidades : ['Fornalha','Vestiário','Escritório','Refeitório','Enfermaria','Fundição'],
      localidades : ['Matagal','Oficina','Laboratorio','Garagem','Refinaria','Prisão','Cemitério'],
      osTimes:[],
      termino:null,
      numeroTimes:2,
      minutosBomba:15,
      timer:0,//tempo para detonação do ponto atual
      timerString:null,// representação do relógio da bomba
      iniciado:false,//jogo rolando
      tempoLoop:15000,//tempo do loop
      fim : false,//jogo terminou
      pontosExplodidos:[],//pontos explodidos {ponto:'vila',cor:'azul'}
      tempoPadrao:(1000*60*15),//quinze minutos
      tempoPadraoFinal:(1000*60*20),//vinte minutos
      modificadoresUsados:[],
      modificadores: [
        {
          titulo:'Celeridade1',
          texto:'Foi acionado o modificador de celeridade nível 1',
          codigo:'2374481',
          minutos:5
        },
        {
          titulo:'Celeridade1',
          texto:'Foi acionado o modificador de celeridade nível 1',
          codigo:'6574881',
          minutos:5
        },
        {
          titulo:'Celeridade2',
          texto:'Foi acionado o modificador de celeridade nível 2',
          codigo:'7755883',
          minutos:8
        },
        {
          titulo:'Celeridade2',
          texto:'Foi acionado o modificador de celeridade nível 2',
          codigo:'6574882',
          minutos:8
        },
        {
          titulo:'Celeridade3',
          texto:'Foi acionado o modificador de celeridade nível 3',
          codigo:'1237652',
          minutos:10
        },
        {
          titulo:'Ajudinha',
          texto:'Foi acionado o modificador Ajudinha',
          codigo:'3322781',
          minutos:4
        },
        {
          titulo:'Pela Metade',
          texto:'Foi acionado o modificador pela metade, tempo para detonação dividido por 2',
          codigo:'3337771',
          minutos:0
        },
        {
          titulo:'Ponto Secreto Adicional',
          texto:'Foi acionado o modificador Ponto Aleatório',
          codigo:'2128231',
          minutos:0
        },
        {
          titulo:'Detonação Imediata',
          texto:'Foi acionado o modificador Detonação Imediata',
          codigo:'9928483',
          minutos:0
        },
        {
          titulo:'O Vigarista',
          texto:'Foi acionado o modificador O Vigarista',
          codigo:'9474111',
          minutos:0
        },
      ]
    }

    return g;
  }

  abrirModificador(){
    this.campoSenha = new Date();
  }

  async recebeuModificador(ev){
    console.log("Modificador",ev);
    if(this.game.estadoBomba=='neutro'){
      this.dizer('Não é possível acionar modificadores com a Bomba Neutra');
      return;
    }
    let modific = null;
    this.game.modificadores.forEach(mod=>{
      if(mod.codigo==ev)modific = mod;
    });

    if(!modific){
      let usado = false;
      this.game.modificadoresUsados.forEach(mod=>{
        if(mod.codigo==ev)usado = true;
      });

      if(usado){
        this.dizer('Este modificador já foi utilizado');
        this.salvarLog(this.game.acionado,'Tentou reutilizar modificador usado');
        return;
      }

      this.dizer("Codigo de modificador incorreto");
      this.salvarLog(this.game.acionado,'Errou codigo do modificador');
      return;
    }

    if(modific.titulo=='Celeridade1'){
      if(this.game.estadoBomba=='armado'){
       this.game.timer-=(1000*60*5);
       this.setarTempoString();
       this.dizer(modific.texto);
       this.usarModificador(modific);
        return;
      }
      this.dizer("Este modificador só pode ser usado com a bomba armada");
      return;
    }

    if(modific.titulo=='Celeridade2'){
      if(this.game.estadoBomba=='armado'){
       this.game.timer-=(1000*60*8);
       this.setarTempoString();
       this.dizer(modific.texto);
       this.usarModificador(modific);
        return;
      }
      this.dizer("Este modificador só pode ser usado com a bomba armada");
      return;
    }

    if(modific.titulo=='Celeridade3'){
      if(this.game.estadoBomba=='armado'){
       this.game.timer-=(1000*60*10);
       this.setarTempoString();
       this.dizer(modific.texto);
       this.usarModificador(modific);
        return;
      }
      this.dizer("Este modificador só pode ser usado com a bomba armada");
      return;
    }

    if(modific.titulo=='Ajudinha'){
      if(this.game.estadoBomba=='armado'){
       this.game.timer-=(1000*60*4);
       this.setarTempoString();
       this.dizer(modific.texto);
       this.usarModificador(modific);
        return;
      }
      this.dizer("Este modificador só pode ser usado com a bomba armada");
      return;
    }

    if(modific.titulo=='Pela Metade'){
      if(this.game.estadoBomba=='armado'){
      let fator = parseInt((this.game.timer/2).toFixed(0));
       this.game.timer-=fator;
       this.setarTempoString();
       this.dizer(modific.texto);
       this.usarModificador(modific);
        return;
      }
      this.dizer("Este modificador só pode ser usado com a bomba armada");
      return;
    }

    if(modific.titulo=='Detonação Imediata'){
      if(this.game.estadoBomba=='armado'){
      
       this.game.timer-=(1000*60*100);
       this.setarTempoString();
       this.dizer(modific.texto);
       this.usarModificador(modific);
        return;
      }
      this.dizer("Este modificador só pode ser usado com a bomba armada");
      return;
    }

    if(modific.titulo=='O Vigarista'){

      if(this.game.estadoBomba!='neutro'){
        if(this.game.pontosExplodidos.length<1){
          this.dizer("Ainda não há pontos inimigos explodidos para usar esse modificador");
          return;
        }
        let corAtual = this.game.acionado;
        let pont = null;
        this.game.pontosExplodidos = this.game.pontosExplodidos.filter(pt=>{
          if(pt.cor!=corAtual && pont==null){
            pont = pt;
          }else{
            return pt;
          }
        });

        if(!pont){
          this.dizer("Ainda não há pontos inimigos explodidos para usar esse modificador");
          return;
        }

        this.game.localidades.push(pont.ponto);

        this.dizer(modific.texto);
        this.usarModificador(modific);
        return;
      }
       
      this.dizer("Este modificador não pode ser acionado em estado neutro");
      return;
    }

    if(modific.titulo=='Ponto Secreto Adicional'){
      if(this.game.estadoBomba=='transporte'){
        this.game.estadoBomba = 'armado';
        this.game.localidades.push(this.game.pontoAcionado);
        this.game.pontoAcionado = 'Ponto Aleatório';
        this.setarTempo();
        this.setarClasse();
        this.tocando = '../...';
        if(this.musicaAtual)this.musicaAtual.pause();
        this.clock.pause();
        await this.playAudio(this.sirene);
        if(this.game.estadoBomba=='armado'){
          this.clock.loop = true;
          this.clock.play();
        }

       this.dizer(modific.texto);
       this.usarModificador(modific);
        return;
      }
      this.dizer("Este modificador só pode ser usado com a bomba em transporte");
      return;
    }
    // processar modificador

  }

  usarModificador(m){
    this.salvarLog(this.game.acionado,'Usou ('+m.titulo+')');
    this.game.modificadores = this.game.modificadores.filter(mod=>{
      if(mod.titulo!=m.titulo && mod.codigo!=m.codigo)return mod;
    });
    this.game.modificadoresUsados.push(m);
  }

  async vencerPonto(){
    if(this.musicaAtual)this.musicaAtual.pause();
    this.acaoDesativada = true;
    this.setarTempoString();
    this.clock.pause();
    this.game.pontosExplodidos.push({ponto:this.game.pontoAcionado,cor:this.game.acionado});
    this.salvarLog(this.game.acionado,'Explodiu o ponto '+this.game.pontoAcionado,true);
    let temp = this.game.pontoAcionado;
    let tempTime = this.game.acionado;
    this.game.pontoAcionado = null;
    this.game.acionado = null;
    this.game.estadoBomba = 'neutro';
    this.setarClasse();
    this.salvarOffline();
    await this.playAudio(this.explosao);
    await this.playAudio(this.registradora);
    this.dizer('O ponto localizado em '+temp+' foi explodido pelo time '+tempTime);
    this.dizer('Explosivos em estado neutro');
    

    this.clock.loop = true;
    this.clock.play();

    this.loop();
    

    this.acaoDesativada = false;

  }


  musicaAtual:any;
  tocando: string = '';

  async acao(cor){
    if(this.acaoDesativada)return;
    this.tocando = '../...';
    if(this.musicaAtual)this.musicaAtual.pause();
    this.clock.pause();
    // console.log("ação",cor);
    this.checaEstado(cor);
    this.game.acionado = cor;
    this.setarClasse();
    
    
    if(this.game.estadoBomba=='transporte'){
      this.tocarNovaMusica();
      await this.playAudio(this.irra);
    }

    if(this.game.estadoBomba=='armado'){
      await this.playAudio(this.sirene);
      this.tocarNovaMusica();
    }
    
    
      
    
    this.salvarOffline();
  }

  tocarNovaMusica(){
    this.musicas = this.shuffle(this.musicas);
      let m = null;
      if(this.musicas.length){
        m = this.musicas.pop();
      }else{
        this.musicas =this.musicas.concat(this.musicas2);
        this.musicas2 = [];
        m = this.musicas.pop();
      }
      this.musicas2.push(m);
      this.tocando = m;
      this.musicaAtual = new Audio(m);
      this.musicaAtual.loop = true;
      this.musicaAtual.volume = this.volumeDaMusica;
      this.musicaAtual.play();
  }
  
  async loop(){
    if(this.game.estadoBomba=='neutro'){
      this.dizer(this.game.frase);
    }

    if(this.game.estadoBomba=='transporte'){
      this.dizer(this.game.acionado+' está transportando os explosivos para '+this.game.pontoAcionado);
    }

    if(this.game.estadoBomba=='armado'){
      this.game.timer-=this.game.tempoLoop;
      if(this.game.timer<0)this.game.timer = 0;
      if(this.game.timer==0){
        this.vencerPonto();
        return;
      }else{
        this.setarTempoString();
        this.dizer(this.calcularTempo((this.game.timer/1000))+' para o time '+this.game.acionado+' explodir  '+this.game.pontoAcionado);
      }
      
    }

    if(this.game.estadoBomba=='neutro' && this.game.localidades.length==0 || this.acabouTempo()){
      this.processarFimDeJogo();
      return;
    }

    this.fluxo = setTimeout(()=>{
      this.loop();
    },this.game.tempoLoop);
  }

  async iniciar(){
    this.dialogo = true;
  }

  processarFimDeJogo(){
    this.salvarLog(null,"Fim de Jogo");
    this.game.localidades = []; 
    this.game.iniciado = false;
    this.game.fim = true;
    if(this.musicaAtual)this.musicaAtual.pause();
    this.clock.pause();
    this.dizer("FIM DE JOGO");
    
     if(this.game.pontosExplodidos.length){
        let geral:any = {};
        for(let jog of this.game.pontosExplodidos){
          if(geral[jog['cor']]){
            geral[jog['cor']]++;
          }else{
            geral[jog['cor']]=1;
          }
        }

        let maior = {cor:null,quantidade:0};
        let menor = {cor:null,quantidade:0};
        for(let key in geral){
            if(geral[key]>maior.quantidade){
              maior = {cor:key,quantidade:geral[key]};
            }else{
              if(geral[key]>menor.quantidade){
                menor = {cor:key,quantidade:geral[key]};
              }
            }
            
        }


        if(maior.quantidade==menor.quantidade){
          this.dizer("Os times empataram, ambos tendo dominado "+maior.quantidade+" pontos" );
          return;
        }

        this.dizer("O time vencedor foi o time "+maior.cor+", tendo dominado "+maior.quantidade+" pontos");

        this.dizer("O time vencedor foi o time "+maior.cor+", tendo dominado "+maior.quantidade+" pontos");


     }else{
       this.dizer("Nenhuma equipe arrombou cofres");
       this.dizer("JOgo empatado");

     }
  }
  

  setarTempoString(){
    this.game.timerString = null;
    if(this.game.timer==0){
      this.game.timerString = '00:00';
      return;
    }
    let v = this.game.timer/1000;
    let minutos = Math.floor((v/60)).toFixed(0);
    if(minutos.length==1)minutos = '0'+minutos;
    let segundos = (v%60).toFixed(0);
    if(segundos.length==1)segundos = '0'+segundos;
    this.game.timerString = minutos+':'+segundos;
  }

  setarTempo(){
   

    this.game.timer = parseInt(this.game.tempoPadrao+'');
    if(this.game.localidades.length==0)this.game.timer=parseInt(this.game.timer.tempoPadraoFinal+'');
    this.setarTempoString();
  }

  checaEstado(cor){
    
    if(this.game.estadoBomba=='neutro'){
      
      this.game.estadoBomba='transporte';
      this.setarTempo();
      this.trocaPonto();
      this.salvarLog(cor,'Capturou a bomba, levando para '+this.game.pontoAcionado);
      return;
    }

    if(this.game.estadoBomba=='transporte'){
      if(this.game.acionado==cor){
        
        this.game.estadoBomba='armado';
        this.salvarLog(cor,'Armou a bomba em '+this.game.pontoAcionado);
        this.setarTempo();
      }
      
      if(this.game.acionado!=cor){
        this.trocaPonto();
        this.salvarLog(cor,'Capturou a bomba, levando para '+this.game.pontoAcionado);
      }
      
      return;
    }

    if(this.game.estadoBomba=='armado'){
      if(this.game.acionado!=cor){
        this.game.estadoBomba='transporte';
        this.salvarLog(cor,'Capturou a bomba, levando para '+this.game.pontoAcionado);
        this.trocaPonto();
      }
    }
    
    
  }

  fluxo:any;
  async rodar(){
    this.fluxo = setTimeout(()=>{
      this.clock.loop=true;
      this.clock.play();
      this.loop();
    },2000);
  }

  

  

  setarClasse(){
    let el = document.getElementById('btStatus');
    if(!el)return;
    el.classList.remove('vermelho');
    el.classList.remove('verde');
    el.classList.remove('azul');
    el.classList.remove('preto');
    el.classList.remove('branco');
    el.classList.remove('cinza');
    el.classList.remove('amarelo');
    el.classList.remove('laranja');
    if(this.game.acionado)el.classList.add(this.game.acionado);
    
  }

  trocaPonto(){
    
    if(this.game.pontoAcionado){ // devolvo o ponto acionado
      this.game.localidades.push(this.game.pontoAcionado);
      this.game.pontoAcionado = null;
    }
    
    this.game.localidades = this.shuffle(this.game.localidades);
    this.game.pontoAcionado = this.game.localidades.shift();
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  acabouTempo(){
    if(!this.game.termino)return false;
    let vt = this.game.termino.split(":");
    let termino = new Date();
    
    termino.setHours(vt[0]);
    termino.setMinutes(vt[1]);

    let agora = new Date();

    if(agora.getTime()>termino.getTime()){
      console.log("É mais tarde");
      this.dizer("Horário de fim de jogo atingido");
      return true;
    }

    
  }

  doisDigitos(v){
    let res = '';
    
    res = v+'';
    if(res.length==1)res='0'+v;
    return res;
  }

  salvarLog(cor,mensagem,explodiu=false){
    let t = new Date();
    let log = {
      id:this.game.idLog,
      hora:t.getHours(),
      minutos:t.getMinutes(),
      texto:mensagem,
      cor:cor,
      explosao:explodiu,
      ponto:this.game.pontoAcionado?this.game.pontoAcionado:null
    } 

    this.game.logs.push(log);
    this.game.idLog++;
  }

  configurar(){

    this.salvarLog(null,"Jogo iniciado");
    
    this.game.tempoPadrao = this.game.minutosBomba*(1000*60);
    this.game.tempoPadraoFinal = this.game.tempoPadrao+(1000*60*5);
    for(let i = 0; i<this.game.numeroTimes;i++){
      let temp = this.cores.shift();
      this.game.osTimes.push(temp);
    }

    this.setarTempo();
    this.game.iniciado = true;
    this.dialogo = false;
    this.limpar();
    this.rodar();
  }



  


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
    }
    this.restore = false;
    setTimeout(()=>{this.setarClasse();},600);
    
    if(this.game.estadoBomba=='transporte'){
      this.tocarNovaMusica();
    }

    if(this.game.estadoBomba=='armado'){
      this.tocarNovaMusica();
    }
    this.loop();
    
  }

  cancelar(){
    this.restore = false;
  }

  limpar(){
    localStorage.removeItem(this.flagSave);
    this.restore = false;
  }

  salvarOffline(){
    // salva offline todos os dados
    localStorage.setItem(this.flagSave,JSON.stringify(this.game));
  }

  shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
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

  playAudio(audio){
    return new Promise(res=>{
      audio.play()
      audio.onended = res
    })
  }

  calcularTempo(t){

    if(t<1)return 'zero';

    let minutos = parseInt(Math.floor((t/60)).toFixed(0));
    let segundos = parseInt((t%60).toFixed(0));
    let produto = '';
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

    produto = t+' segundos';

    return produto;

  }

}
