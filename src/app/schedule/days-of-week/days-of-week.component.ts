import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, Validators, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { endOfYear } from 'date-fns';

@Component({
  selector: 'app-days-of-week',
  templateUrl: './days-of-week.component.html',
  styleUrls: ['./days-of-week.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaysOfWeekComponent),
      multi: true
    }
  ]
})
export class DaysOfWeekComponent implements OnInit {

  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      sunday: [false],
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false]
    });

  value: string[];

  private daysOfTheWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      const newValue = this.collectValues();
      this.notifyObservers(newValue);
    });
  }

  notifyObservers(val: string[]) {
    if(this.deepEqual(val, this.value))
      return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  //Taken from https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517
  private deepEqual(x, y) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
        ok(x).every(key => this.deepEqual(x[key], y[key]))
    ) : (x === y);
  }

  collectValues(): string[] {
    var days = [];
    for(let day of this.daysOfTheWeek)
      if(this.form.get(day.toLowerCase()).value)
        days.push(day);
    return days;
  }

  setValues(values: string[]): void {
    for(let day of this.daysOfTheWeek)
      this.form.get(day.toLowerCase()).setValue(values.includes(day));
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: string[]) {
    if(!value)
      return;
    
    this.value = value.map(v => v.toUpperCase());
    this.setValues(this.value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
