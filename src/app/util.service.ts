import { Injectable } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(public messageService: MessageService) { }

  clone(ob:any){
    return JSON.parse(JSON.stringify(ob));
  }

  TEXTO = (v)=>{
    if(!v || v=='null')return '';
    return this.REMOVER_CORINGA(this.removerAcentos((v+'').toUpperCase()).trim(),[';',':','\\','n']);
  }

  REMOVER_CORINGA = (v,vet)=>{
    return (v+'').replace(/\n/g,'').split('').filter(i=>!vet.includes[i]).join('');
  }

  removerAcentos(s) {
    if (!s) return '';
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  VALIDAR_OBJETO(ob:any, campos:any,nomeAmigavel:any = null){
    for (let i = 0; i<campos.length; i++){
      const cp = campos[i];
      if(!ob[cp] && ob[cp]!=0){
        let amig = null;
        if(nomeAmigavel && nomeAmigavel[i])amig = nomeAmigavel[i];
        const nome = amig || cp;
        this.toast('e', `Favor informar o valor de ${this.TEXTO(nome)}`);
        return false;
      }

      if(ob[cp] && cp=='cpf'){
        const resposta = this.validaCpf(ob[cp]);
        if(!resposta){
          this.toast('e','Número de CPF inválido');
          return false;
        }
      }

      if(ob[cp] && cp=='email'){
        const resposta = this.validaEmail(ob[cp]);
        if(!resposta){
          this.toast('e','Endereço de EMAIL informado é inválido.');
          return false;
        }
      }

    }
    return true;
  }

  toast(cor, texto) {
    console.log("Acessou o toast")
    if (cor == 's') cor = 'success';
    if (cor == 'e') cor = 'error';
    if (cor == 'i') cor = 'info';
   
    this.messageService.add({ key: 'main', severity: cor, summary: '', detail: texto });
  }

  validaEmail(email:any){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  }

  public validaCpf(cpf:any){
    cpf = cpf.replace(/\D/g, '');
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let result = true;
    [9,10].forEach(function(j){
        var soma = 0, r;
        cpf.split(/(?=)/).splice(0,j).forEach(function(e:any, i:any){
            soma += parseInt(e) * ((j+2)-(i+1));
        });
        r = soma % 11;
        r = (r <2)?0:11-r;
        if(r != cpf.substring(j, j+1)) result = false;
    });
    return result;
  }


  abreviar(texto) {
    if (typeof texto !== 'string') return '';
    return texto.substring(0, 11)+'...';
  }


  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.multiSortMeta[0].field];
      let value2 = data2[event.multiSortMeta[0].field];
      let result = null;
      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (!this.is_numeric(value1) && !this.is_numeric(value2)) {
        result = value1.localeCompare(value2);
      } else {
        result = (parseInt(value1) < parseInt(value2)) ? -1 : (parseInt(value1) > parseInt(value2)) ? 1 : 0;
      }
      return (event.multiSortMeta[0].order * result);
    });
  }

   is_numeric = function (obj) {
    return !Array.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
  }


}
