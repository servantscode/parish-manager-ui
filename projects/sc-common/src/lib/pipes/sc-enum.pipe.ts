import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'scEnum'})
export class ScEnumPipe implements PipeTransform {
  transform(value: string): string {
    if(!value)
      return null;

    var bits = value.toLowerCase().split('_');
    for (var i = 0; i < bits.length; i++) {
      bits[i] = bits[i].charAt(0).toUpperCase() + bits[i].slice(1);
    }
    return bits.join(' ');
  }
}