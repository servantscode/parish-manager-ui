import { ValidatorFn, AbstractControl } from '@angular/forms';

export class SCValidation {

  static STATES: string[] = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS",
                                     "KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP",
                                     "OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY"];

  static formatPhone (tel): string {
    if (!tel) { return ''; }

    var value = tel.toString().trim().replace(/^\+/, '');
    value = value.replace(/[\D]/g, '');
    console.log('value: ' + value);

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    var country, city, number;

    switch (value.length) {
      case 4:
      case 5:
      case 6:
      case 7:
        return value.slice(0, 3) + '-' + value.slice(3);
        break;

      case 8: 
      case 9:
      case 10: // +1PPP####### -> C (PPP) ###-####
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11: // +CPPP####### -> CCC (PP) ###-####
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12: // +CCCPP####### -> CCC (PP) ###-####
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return value;
    }

    if (country == 1) {
      country = "";
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + " (" + city + ") " + number).trim();
  };

  static validatePhone(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {

      const validNumber = /(\([\d]{3}\) )?[\d]{3}-[\d]{4}/.test(control.value);
      return validNumber? null: {'Not a valid phone number': {value: control.value}};
    };
  }

  static actualState(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const validState = SCValidation.STATES.some(option => option == control.value);
      return validState? null: {'Not a valid state': {value: control.value}};
    }
  }

  static numeric(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isNumeric = !isNaN(Number(control.value));
      return isNumeric? null: {'Not a number': {value: control.value}};
    }
  }
}