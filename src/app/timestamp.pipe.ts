import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(!value)return null;
    let data = value;
    if (typeof data === 'string') {
      // Converte a string para um objeto Date
      data = new Date(data);
    }
  
    // Obtém os componentes da data
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const ano = data.getFullYear();
    const   
   horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2,   
   '0');
  
    // Formata a data no formato DD/MM/YYYY hh:mm:ss
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }

}
