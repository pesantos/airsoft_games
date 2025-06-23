import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dinheiro'
})
export class DinheiroPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'BRL', symbolDisplay: string = 'symbol', digits?: string): any {
     if (!value) {
      return 'R$ 0,00';
    }

    let currencyPipe: CurrencyPipe = new CurrencyPipe('pt-BR');
    let newValue: any = currencyPipe.transform(value, currencyCode, symbolDisplay, digits);

    return newValue;
  }

}
