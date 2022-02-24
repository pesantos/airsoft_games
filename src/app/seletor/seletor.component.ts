import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seletor',
  templateUrl: './seletor.component.html',
  styleUrls: ['./seletor.component.css']
})
export class SeletorComponent implements OnInit {

  constructor(router:RouterModule) { }

  ngOnInit() {
  }

  jogos:any = [
    {titulo:'O Rei da Colina'},
    {titulo:'Arrombamentos Aleatórios'},
    {titulo:'Energizar e Explodir'}

  ];

}
