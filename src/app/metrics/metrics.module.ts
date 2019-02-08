import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SCCommonModule } from '../sccommon/sccommon.module';

import { MetricsRoutingModule } from './metrics-routing.module';

import { MetricsComponent } from './metrics/metrics.component';

import { MetricsService } from './services/metrics.service';

@NgModule({
  declarations: [
    MetricsComponent
  ],
  imports: [
    MetricsRoutingModule,

    SCCommonModule,

    //Angular basics
    CommonModule,

    //Charts
    NgxChartsModule
  ],
  providers: [
    MetricsService
  ]
})
export class MetricsModule { }
