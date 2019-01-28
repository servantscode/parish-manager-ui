import { Injectable } from '@angular/core';
import { Alert } from '../alert';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  static CALENDAR_COLORS: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#176CBF',
      secondary: '#E6F2FF'
    },
    yellow: { 
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    },
    darkBlue: {
      primary: '#0061BF',
      secondary: '#B3D7FF'
    }
  };

  trafficLight(): string[] {
    return ['#00cc00', '#dddd00', '#ff0000', '#666666']
  }

  generateColors(count: number): string[] {
    const startColor: number[] = [0x99, 0x99, 0xff];
    const endColor: number[] = [0x22, 0x22, 0xbb];
    const colorStep: number[] = [(endColor[0] - startColor[0])/count,
                                 (endColor[1] - startColor[1])/count,
                                 (endColor[2] - startColor[2])/count];


    var colors: string[] = [];
    for(var i=0; i<count-1; i++) {
      var nextColor: number[] = [startColor[0] + colorStep[0]*i,
                                 startColor[1] + colorStep[1]*i,
                                 startColor[2] + colorStep[2]*i];
      colors.push(this.convertToHex(nextColor));
    }
    colors.push(this.convertToHex(endColor));

    return colors;
  }


  convertToHex(color: number[]) {
    return '#' + this.getHex(color[0]) + this.getHex(color[1]) + this.getHex(color[2]);
  }

  getHex(num: number) {
    return ('0' + Math.round(num).toString(16)).slice(-2);
  }
}
