import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maleta',
  templateUrl: './maleta.component.html',
  styleUrls: ['./maleta.component.css']
})
export class MaletaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.game = this.novoJogo();
    let d = localStorage.getItem(this.flagSave);
    if(d){
      this.restore = true;
    }
  }

  game: any ;
  dialogo: boolean = false;
  musicaAtual = null;
  volumeDaMusica: number = 0.28;
  musicas = ['assets/007.mp3','assets/beebop.mp3','assets/impossible.mp3','assets/Beethoven9Synphony.mp3','assets/All-Along-The-WatchTower.mp3','assets/overture.mp3','assets/Bob-Dylan-The-Times-They-Are-A-Changin.mp3','assets/valquiria.mp3','assets/whiplash.mp3','assets/evangelion.mp3','assets/sold.mp3','assets/creedance.mp3'];
  adesivos:any = ['🐵','🐶','🦁','🐱','🦊','🐺','👽','🤖','👻','👺','😈','🐭','🐗','🐲','🐼','🐨','🐸','🐟','🦞','🦆','🦅','🦉','🦀','🐧','🐤','🐝','🪰'];
  nomeJogador: string = '';
  flagSave: string = 'saveGameMaleta';
  restore: boolean = false;
  temporizador:any;
  cogumelo = new Audio('assets/cogumelo.wav');
  morte = new Audio('assets/morte.wav');
  irra = new Audio('assets/irra.wav');
  drum = new Audio('assets/drum.wav');
  ff7 = new Audio('assets/ff7.wav');
  siren = new Audio('assets/siren.wav');
  frasesDesaparecido:any =[
    '? sumiu no cerrado com a maleta',
    'o safado do ? está com a maleta',
    'a maleta está com o ordinário do ?',
    'peguem o ? ele roubou a maleta',
    'o espertinho do ? desapareceu junto com a maleta',
    'temporada de caça ao ? está aberta, atírem para matar'
  ];
  frasesFuga:any = [
    'O ? está fugindo para area segura',
    'Cuidado, o ? está evadindo com a maleta',
    '? está indo para area segura',
    'Fiquem atentos na area segura, o ? está a caminho',
    'Cérquem a area segura, o ? está correndo pra lá',
    'Péguem o ? , ele está fugindo para área segura'
  ];
  listaNeutra:any = [
    'Maleta em estado neutro',
    'Maleta Neutra, Cada um por sí',
    'Malêta neutra, ninguém é amigo de ninguém',
    'Malêta neutra, agora vale tudo',
    'Malêta neutra, cuidado com o coleguinha'
  ];

  iniciar(){
    this.dialogo = true;
  }

  historicoVisivel = false;
  abrirHistorico(){
    this.historicoVisivel = true;
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


  oloop:any;

  async placar(){
    let d = localStorage.getItem(this.flagSave);
    if(d){
      let n = this.novoJogo();
      let antigo = JSON.parse(d);
      n.jogadores = antigo.jogadores;
      n.minutosFuga = antigo.minutosFuga;
      n.iniciado = antigo.iniciado;
      n.jogadores.forEach(jog=>{
        jog.timer = (n.minutosFuga*1000*60);
        jog.timerString = this.calcularTempo(jog.timer);
        jog.timerLabel = this.getTempoLabelg(jog.timer);
        jog.adesivo = this.obterAdesivo();
        jog.fuga = false;
      });
      this.game = n;
      
      this.loop();
      // this.oloop = setInterval(,this.game.)
    }
    this.restore = false;
  }

 

  async restaurar(){
    let d = localStorage.getItem(this.flagSave);
    if(d){
      
      this.game = JSON.parse(d);
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

  salvarOffline(){
    // salva offline todos os dados
    localStorage.setItem(this.flagSave,JSON.stringify(this.game));
  }

  obterItemRandom(li){
    return li[Math.floor(Math.random() * li.length)];
  }
  obterAdesivo(){
    let ad = this.adesivos[Math.floor(Math.random() * this.adesivos.length)];
      const index = this.adesivos.indexOf(ad);
      if (index > -1) {
        this.adesivos.splice(index, 1);
      }
      return ad;
  }

  async morri(){
    if(this.musicaAtual)this.musicaAtual.pause();
    const jog = this.game.proprietario;
    this.salvarLog('vermelho',`<span class="adesivo">${jog.adesivo}</span>${jog.nome} MORREU (${jog.timerLabel})`,false);
    for(let i = 0; i<this.game.jogadores.length;i++){
      let at = this.game.jogadores[i];
      if(at.id==jog.id){
        this.game.jogadores[i]=jog;//guardo o atual
      }
    }
    this.game.proprietario = null;
    this.salvarOffline();
    await this.playAudio(this.morte);
    this.tocarMusica();
  }

  async acao(jogador){
    if(!this.temporizador)this.loop();

    if(this.musicaAtual)this.musicaAtual.pause();
    this.game.proprietario = jogador;
    this.salvarLog('azul',`<span class="adesivo">${this.game.proprietario.adesivo}</span> ${this.game.proprietario.nome} PEGOU A MALETA (${this.game.proprietario.timerLabel})`,false);
    if(this.game.proprietario.timer<1)await this.playAudio(this.ff7);
    if(this.game.proprietario.timer>0)await this.playAudio(this.irra);
    this.salvarOffline();
    this.tocarMusica();
  }

  doisDigitos(v){
    let res = v+'';
    if(res.length==1)res='0'+v;
    return res;
  }

  processarReducao(op){
    op.timer-=(this.game.tempoLoop);
    op.timerString = this.calcularTempo(op.timer);
    op.timerLabel = this.getTempoLabelg(op.timer);
    return op;
  }
  shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  setarClasse(jog){
    if(jog.fuga)return 'vermelho';
    return 'azul';
  }

  tocarMusica(){
    if(this.musicaAtual)this.musicaAtual.pause();
    if(this.game.proprietario)this.musicaAtual = new Audio(this.obterItemRandom(this.musicas));
    if(!this.game.proprietario)this.musicaAtual = this.siren;
    this.musicaAtual.loop = true;
    this.musicaAtual.volume = this.volumeDaMusica;
    this.musicaAtual.play();
  }

  sumirTimer = false;

  async loop(){
    if(this.game.fim)return;
    this.sumirTimer = true;
    if(!this.musicaAtual){
      this.tocarMusica();
    }
    console.log("loop")
    if(!this.game.proprietario){
        await this.dizer(this.obterItemRandom(this.listaNeutra));
    }
    if(this.game.proprietario && this.game.proprietario.timer>0){
      this.game.proprietario = this.processarReducao(this.game.proprietario);
      await this.dizer(this.obterItemRandom(this.frasesDesaparecido).replace('?',this.game.proprietario.nome)+' '+this.game.proprietario.timerString+' restantes');
      
    }
    if(this.game.proprietario && this.game.proprietario.timer<1){
      if(!this.game.proprietario.fuga){
        this.playAudio(this.ff7);
        this.game.proprietario.fuga = true;
        this.salvarLog('azul',`<span class="adesivo">${this.game.proprietario.adesivo}</span>${this.game.proprietario.nome} ENTROU EM MODO DE FUGA! `,false);
      }
      await this.dizer(this.obterItemRandom(this.frasesFuga).replace('?',this.game.proprietario.nome));
    }


    if(this.game.iniciado){
      this.salvarOffline();
      if(!this.temporizador){
        clearInterval(this.temporizador);
        this.temporizador = setInterval(()=>{this.loop();},this.game.tempoLoop);
      }
      this.loopando = !this.loopando;
    }
    
  }

  loopando:boolean = false;

  nomeTimes = ['Alpha','Bravo','Charlie','Delta','Echo','FoxTrot','Golf','Hotel','India','Juliett','Kilo','Lima'];
  campoSenha = null;

  abrirSenha(){
    this.campoSenha = new Date();
  }

  async dizerPessoas(){
    if(this.game.proprietario.membros && this.game.proprietario.membros.length){
        await this.dizer('Parabéns ');
      for(let i = 0; i<this.game.proprietario.membros.length;i++){
        await this.dizer(this.game.proprietario.membros[i]);
      }
    }

    return;
  }

  async recebeuModificador(ev){
    if(ev=='43381'){
      clearInterval(this.temporizador);
      if(this.musicaAtual)this.musicaAtual.pause();
      this.game.fim = true;
     
      this.salvarLog('white',`O time ${this.game.proprietario.nome} VENCEU!`,false);
      this.salvarOffline();
      await this.dizer("Fim de Jogo");
      await this.dizer(`O time vencedor foi o time ${this.game.proprietario.nome}`);
      await this.dizerPessoas();
      await this.dizer(`O time vencedor foi o time ${this.game.proprietario.nome}`);
      await this.dizerPessoas();
      await this.dizer(`O time vencedor foi o time ${this.game.proprietario.nome}`);
      await this.dizerPessoas();
      await this.dizer(`O time vencedor foi o time ${this.game.proprietario.nome}`);
      await this.dizerPessoas();
    }
  }

  sortearTimes(){
    let jog = this.game.jogadores;
    jog = this.shuffle(jog);
    console.log("os jogadores",jog);
    let cont = 0;
    let separados = {};
    let nomeT = null;
    while(jog.length!=0){
      
      let n = JSON.parse(JSON.stringify(jog.shift()));
      console.log("Rodou",n);
      if(cont==0){
        nomeT = this.nomeTimes.shift();
        n.membros = [n.nome];
        n.nome = nomeT+'';
        separados[nomeT]=n;
      }else{
        separados[nomeT].membros.push(n.nome);
      }
      cont++;
      if(cont==this.game.jogadorPorTime)cont=0;
    }

    console.log(separados);
    Object.keys(separados).forEach(t=>{this.game.jogadores.push(separados[t])});
    console.log(this.game);

  }

  configurar(){
    this.game.jogadores.forEach(jog=>{
      jog.timer = (this.game.minutosFuga*1000*60);
      jog.timerString = this.calcularTempo(jog.timer);
      jog.timerLabel = this.getTempoLabelg(jog.timer);
      jog.adesivo = this.obterAdesivo();
    });
    this.game.iniciado = true;
    this.dialogo = false;
    console.log("Configurado",this.game)
    this.dizer("Jogo configurado");
    this.salvarOffline();
    this.salvarLog('white','Inicio de Jogo',false);
  }

  adicionarJogador(){
    if(this.nomeJogador.trim()=='')return;
    console.log("Adicionando jogador");
    let novoJogador = {
      id:this.game.idJogador,// identificador unico do jogador
      nome:(this.nomeJogador.trim().toUpperCase()),// nome
      timer:0,//variavel do tempo em milisegundos
      timerString:'',//texto para falar
      timerLabel:'',// tempo para exibir
      fuga:false
    }

    this.game.idJogador++;
    this.game.jogadores.push(novoJogador);
    this.nomeJogador = '';
  }

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

  mudo = false;
  finalizouTimer(ev){
    if(ev=='fim'){
      console.log("Acabou");
      this.mudo = false;
      if(this.game.iniciado)this.loop();
    }

    if(ev=='inicio'){
      console.log("Começou");
      this.mudo = true;
    }
    
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

}
