export class ChartData {
  data: any[];
  colorScheme = {
    domain: []
  };

  constructor(data: any, colors: string[]) {
    this.data = data;
    this.colorScheme.domain = colors;
  }
}
