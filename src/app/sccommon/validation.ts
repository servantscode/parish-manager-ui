import { ValidatorFn, AbstractControl } from '@angular/forms';

export class SCValidation {

  static STATES: string[] = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS",
                             "KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP",
                             "OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY"];

  static PHONE = /^(\([\d]{3}\) )?[\d]{3}-[\d]{4}( x[\d]+)?$/;
  static NUMBER = /^\d+$/;
  static USD = /^\d*(\.\d{0,2})?$/;
  static TIME = /^\d{1,2}\:\d{2}(\:\d{2})? ([aA]|[pP])[mM]$/;

  static EMAIL = /^(\".*\"\s*)?<?(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))>?$/;
  static MULTI_EMAIL = /^(\s*(\".*\"\s*)?<?(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))>?[,;\s]?)*$/

  static verifySearchString(search: string): boolean {
    if(!search)
      return true;

    var quoted = false;
    var braced = false;
    for (var x = 0; x < search.length; x++) {
      switch (search.charAt(x)) {
        case "\"":
          quoted = !quoted;
          break;
        case "[":
          if(quoted || braced)
            return false;
          braced = true;
          break;
        case "]":
          if(quoted || !braced)
            return false;
          braced=false;
          break;
      }
    }
    return !quoted && !braced;
  }

  static validSearch(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const validSearch = SCValidation.verifySearchString(control.value);
      return validSearch? null: {'Invalid search string': {value: control.value}};      
    }
  }

  static actualState(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const validState = SCValidation.STATES.some(option => option == control.value);
      return validState? null: {'Not a valid state': {value: control.value}};
    }
  }
}