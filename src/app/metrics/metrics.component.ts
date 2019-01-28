import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MetricsService } from '../services/metrics.service';
import { ColorService } from '../services/color.service'
import { ChartData } from '../chartData';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  constructor(private metricsService: MetricsService,
              private colorService: ColorService) { }

  ngOnInit() {
    this.metricsService.getYearlyRegistrations().
      subscribe(results => {
        var data = [{"name": "registration",
                    "series": results.data}];
        this.yearlyRegistrations = new ChartData(data,  ['#2222bb']);
      });

    this.metricsService.getAgeDemographics().
      subscribe(results => {
        this.memberDemographics = new ChartData(results.data, this.colorService.generateColors(results.data.length));
      });

    this.metricsService.getRegistrationDemographics().
      subscribe(results => {
        this.longevity = new ChartData(results.data, this.colorService.generateColors(results.data.length));
      });

    this.metricsService.getFamilySizes().
      subscribe(results => {
        this.familySizes = new ChartData(results.data, this.colorService.generateColors(results.data.length));
      });

  }

  yearlyRegistrations = new ChartData(null, ['#9999ff', '#2222bb']);
  memberDemographics = new ChartData(null, ['#9999ff', '#2222bb']);
  longevity = new ChartData(null, ['#9999ff', '#2222bb']);
  familySizes = new ChartData(null, ['#9999ff', '#2222bb']);
}