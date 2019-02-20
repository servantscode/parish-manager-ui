import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ColorService } from '../../sccommon/services/color.service'
import { LoginService } from '../../sccommon/services/login.service';

import { MetricsService } from '../services/metrics.service';
import { ChartData } from '../chart-data';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  constructor(private metricsService: MetricsService,
              public loginService: LoginService,
              private colorService: ColorService) { }

  ngOnInit() {
    if(this.loginService.userCan("person.metrics")) {
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
    }

    if(this.loginService.userCan("family.metrics")) {
      this.metricsService.getFamilySizes().
        subscribe(results => {
          this.familySizes = new ChartData(results.data, this.colorService.generateColors(results.data.length));
        });
    }
  }

  yearlyRegistrations = new ChartData(null, ['#9999ff', '#2222bb']);
  memberDemographics = new ChartData(null, ['#9999ff', '#2222bb']);
  longevity = new ChartData(null, ['#9999ff', '#2222bb']);
  familySizes = new ChartData(null, ['#9999ff', '#2222bb']);
}
