import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'displaycamelcase'})
export class DisplayCamelCasePipe implements PipeTransform {
  transform(value: string): string {
    if(!value)
      return null;

    //Pilfered from: https://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
    //Thanks Matt Wiebe!
    return value
        // insert a space between lower & upper
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // space before last upper in a sequence followed by lower
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
        // uppercase the first character
        .replace(/^./,  function(str){ return str.toUpperCase(); });
  }
}