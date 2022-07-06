import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-regressivo',
  templateUrl: './regressivo.component.html',
  styleUrls: ['./regressivo.component.css']
})
export class RegressivoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let d = localStorage.getItem(this.flagSave);
    if(d){
      this.restore = true;
    }
  }
  cores = ['azul','vermelho'];
  game:any;
  tempo:any = 1;
  irra = new Audio('assets/irra.wav');
  gold = new Audio('assets/gold.mp3');
  money = new Audio('assets/here.mp3');
  

  iniciar(){
    this.novoJogo();
    this.game.jogadores = {Azul:this.tempo*1000*60,Vermelho:this.tempo*1000*60};
    this.game.iniciado = true;
    console.log(this.game);
    this.loop();//aciona-se o loop 
  }

  novoJogo(){
    this.game = {
      frase:'Posse em estado neutro',
      acionado:null,//time dominante
      iniciado:false,//jogo rolando
      tempoLoop:15000,//tempo do loop
      tempoString:'0:00',
      status:'normal',
      fim : false// jogo termina
    };
  }

  async acionar(cor){
    
    this.game.acionado = cor;
    this.game.tempoString = this.getTempoLabelg(this.game.jogadores[this.game.acionado]);
    this.colorir();
    await this.playAudio(this.gold);
    this.tocarMusica();
    this.dizer(`Timer acionado pelo time ${cor}`);
    this.voltarVolumeMusica();
    
    
    
    this.salvarOffline();
    
  }

  colorir(){
    let el = document.getElementById('painel');
    if(el){
      el.classList.remove('Azul');
      el.classList.remove('Vermelho');
      if(this.game.acionado)el.classList.add(this.game.acionado);
    }
    
  }

  async finalizarJogo(cor){// finalizar o jogo
    if(this.musicaAtual)this.musicaAtual.pause();
    
    this.game.fim = true;
    await this.playAudio(this.irra);
    this.salvarOffline();
    await this.playAudio(this.gold);
    await this.dizer(`O time ${cor} é o vencedor`);
    await this.dizer(`O time ${cor} é o vencedor`);
    await this.dizer(`O time ${cor} é o vencedor`);

  }

  async loop(){

    if(this.game){
      console.log("Rodando loop");
      this.colorir();
      if(this.game.acionado){
        if(this.game.jogadores[this.game.acionado]<=0){
          this.finalizarJogo(this.game.acionado);
          return;
        }
        if(this.game.jogadores[this.game.acionado]>0){
          this.game.jogadores[this.game.acionado]-=this.game.tempoLoop;
          this.game.tempoString = this.getTempoLabelg(this.game.jogadores[this.game.acionado]);
          this.salvarOffline();
          await this.playAudio(this.gold);
          let msg = this.calcularTempo(this.game.jogadores[this.game.acionado]);
          await this.dizer(`${msg} para o time ${this.game.acionado} vencer`);
          this.voltarVolumeMusica();
          
        }
      }

      this.game.g = setTimeout(()=>{this.loop()},this.game.tempoLoop);
    }
  }

  voltarVolumeMusica(){
    if(this.musicaAtual)this.musicaAtual.volume = 0.28;
  }

  async pausar(){
    
    if(this.musicaAtual)this.musicaAtual.pause();
    this.game.status = 'desarmando';
    this.game.acionado = null;
    
    this.colorir();
    
    await this.playAudio(this.money);
    this.game.status = 'normal';
    this.salvarOffline();

  }

  async dizer(texto:any){
    if(this.musicaAtual)this.musicaAtual.volume = 0.1;
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

  flagSave:string ="regressivo_save";
  restore:boolean = false;
  async restaurar(){
    let d = localStorage.getItem(this.flagSave);
    if(d){
      
      this.game = JSON.parse(d);
      this.loop();
      if(this.game && this.game.acionado){
        this.tocarMusica();
      }
    }
    this.restore = false;
    
    
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

  musicaAtual:any;
  volumeDaMusica: number = 0.28;
  tocarMusica(){
    if(this.musicaAtual)this.musicaAtual.pause();
    if(this.game && this.game.acionado)this.musicaAtual = new Audio(this.obterItemRandom(this.musicas));
    
    this.musicaAtual.loop = true;
    this.musicaAtual.volume = this.volumeDaMusica;
    this.musicaAtual.play();
  }

  obterItemRandom(li){
    return li[Math.floor(Math.random() * li.length)];
  }

  musicas = ['assets/007.mp3','assets/beebop.mp3','assets/impossible.mp3','assets/Beethoven9Synphony.mp3','assets/All-Along-The-WatchTower.mp3','assets/overture.mp3','assets/Bob-Dylan-The-Times-They-Are-A-Changin.mp3','assets/valquiria.mp3','assets/whiplash.mp3','assets/evangelion.mp3','assets/sold.mp3','assets/creedance.mp3'];

}
