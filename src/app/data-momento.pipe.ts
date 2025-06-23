import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataMomento'
})
export class DataMomentoPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(!value)return null;
      let date:any;
      // Verifica se o input é uma string no formato yyyy-mm-dd
      if (typeof value === 'string') {
        const parts:any = value.split('-');
        // Cria um objeto Date a partir da string
        date = new Date(parts[0], parts[1] - 1, parts[2]);
      } else if (value instanceof Date) {
        // Se o input já for um objeto Date, use-o diretamente
        date = value;
      } else {
        return null;
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
    
      return `${day}/${month}/${year}`;
    
  }

}
