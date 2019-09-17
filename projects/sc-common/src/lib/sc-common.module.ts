import { NgModule } from '@angular/core';

import { DisplayCamelCasePipe } from './pipes/display-camel-case.pipe';
import { TimesPipe } from './pipes/times.pipe';
import { ScEnumPipe } from './pipes/sc-enum.pipe';

import { ApiLocatorService } from './services/api-locator.service';
import { LoginService } from './services/login.service';
import { PersonService } from './services/person.service';
import { PreferencesService } from './services/preferences.service';

@NgModule({
  declarations: [
    DisplayCamelCasePipe,
    TimesPipe,
    ScEnumPipe,

  ],
  imports: [
  ],
  exports: [
    DisplayCamelCasePipe,
    TimesPipe,
    ScEnumPipe,
  ],
  providers: [ 
    ApiLocatorService,
    LoginService,
    PersonService,
    PreferencesService,
  ]
})
export class ScCommonModule { }
