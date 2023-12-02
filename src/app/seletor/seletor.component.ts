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

  ];

}
