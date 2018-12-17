import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MetricsService } from '../services/metrics.service';
import { ChartData } from '../chartData';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  constructor(private metricsService: MetricsService) { }

  ngOnInit() {
    this.metricsService.getYearlyRegistrations().
      subscribe(results => {
        var data = [{"name": "registration",
                    "series": results.data}];
        this.yearlyRegistrations = new ChartData(data,  ['#2222ff']);
      });

    this.metricsService.getAgeDemographics().
      subscribe(results => {
        this.memberDemographics = new ChartData(results.data, this.generateColors(results.data.length));
      });

    this.metricsService.getRegistrationDemographics().
      subscribe(results => {
        this.longevity = new ChartData(results.data, this.generateColors(results.data.length));
      });

    this.metricsService.getFamilySizes().
      subscribe(results => {
        this.familySizes = new ChartData(results.data, this.generateColors(results.data.length));
      });

  }

  yearlyRegistrations = new ChartData(null, ['#aaaaff', '#2222ff']);
  memberDemographics = new ChartData(null, ['#aaaaff', '#2222ff']);
  longevity = new ChartData(null, ['#aaaaff', '#2222ff']);
  familySizes = new ChartData(null, ['#aaaaff', '#2222ff']);

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
