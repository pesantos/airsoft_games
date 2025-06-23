import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seletor',
  templateUrl: './seletor.component.html',
  styleUrls: ['./seletor.component.css']
})
export class SeletorComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  clicar(caminho){
    this.router.navigate(['/'+caminho]);
  }

  jogos:any = [
    {titulo:'O Rei da Colina',link:'rei-da-colina',icone:'pi-star-o',explicacao:'N times podem competir para dominação de pontos, é possível setar qual a pontuação para explodir cada ponto, os pontos devem ser definidos em campo.'},
    {titulo:'Cabo de Guerra',link:'cabo', icone:'pi-sliders-h', explicacao:'Existe duas senhas em cada ponto, o time deve entrar com a senha(correspondete a cor do time) do ponto no dispositivo para acionalo, apos explodir, um novo ponto será o alvo, os pontos são lineares e rumam para base inimiga, o time que explodir o QG rival primeiro, vence.'},
    {titulo:'Rainbow Six',link:'six',icone:'pi-times', explicacao:'Configura-se dois times, cadastrando cada jogador. Cada jogador tem um padrão de acesso, a bomba (dispositivo) é posicionada no local de interesse, o time que explodir ela primeiro vence. Ao morrer o jogador deve usar o dispositivo para retornar a vida. Eliminação completa também vence o jogo. Ao acabar as vidas, o jogador deve aguardar o início da próxima partida.'},
    {titulo:'O Homem da Maleta',link:'maleta', icone:'pi-briefcase',explicacao:'Os jogadores devem lutar pela posse de uma maleta, sozinhos ou em time, de posse eles devem resistir com ela até o timer se esgotar, após o tempo determinado, devem a levar para realizar a extração.'},
    {titulo:'BOMBA',link:'bomb', icone:'fa fa-bomb',explicacao:'Uma série de utilitários revolvendo em torno de explosivos, com cores, segredos mortais, segredos simples, reveladores e etc.'},
    {titulo:'Pontos Aleatórios',link:'pontos', icone:'fa fa-question-circle',explicacao:'Um jogo que consistem em dois times tentando armar e explodir diversos pontos em campo. Os pontos são aleatórios indicados pelo dispositivo assim que acionado o transporte do mesmo.'},
    {titulo:'Ilustre Sebastião',link:'seba', icone:'fa fa-meh-o',explicacao:'Pode não parecer, mas Sebastião é um respeitável chefe do tráfico. Nessa aventura dois times vão ter que lutar, ou pra proteger ou para fazer com que o salafrário do Sebastião confesse onde esconde seus malfeitos. Cuidado com ele, pois o camarada é traiçoeiro. (Para jogar, basta seguir as informações do Sebastião, ele é uma máquina de Estado ambulante)'},

  ];

}
