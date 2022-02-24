import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

   playAudio(audio){
    return new Promise(res=>{
      audio.play()
      audio.onended = res
    })
  }

  beep = new Audio('assets/beep.wav');

  async apertou(){
    await this.playAudio(this.beep);
    console.log("primeiro");
    await this.playAudio(this.beep);
    console.log("segundo");

  }

}
