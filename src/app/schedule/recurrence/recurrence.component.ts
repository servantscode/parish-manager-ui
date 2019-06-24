import { Component, OnInit, OnChanges, SimpleChanges, Input, forwardRef } from '@angular/core';
import { WeekDay } from '@angular/common';
import { FormBuilder, Validators, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { endOfYear } from 'date-fns';
import { debounceTime } from 'rxjs/operators';

import { SCValidation } from '../../sccommon/validation';
import { deepEqual, doLater } from '../../sccommon/utils';

import { Recurrence } from '../event';

@Component({
  selector: 'app-recurrence',
  templateUrl: './recurrence.component.html',
  styleUrls: ['./recurrence.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecurrenceComponent),
      multi: true
    }
  ]
})
export class RecurrenceComponent implements ControlValueAccessor, OnInit {

  form = this.fb.group({
      id: [''],
      cycle: ['WEEKLY'],
      frequency: [1, [Validators.pattern(SCValidation.NUMBER), Validators.min(1)]],
      endDate: [endOfYear(new Date())],
      weeklyDays: []
    });

  cycleOptions: any[] = [];


  @Input() startDate: Date;
  value: Recurrence;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.updateRecurrenceOptions();

    this.form.get('frequency').valueChanges
        .subscribe( () => this.updateRecurrenceOptions());

    this.form.valueChanges.pipe(debounceTime(0)).subscribe(value => this.detectChanges(this.form.value));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateRecurrenceOptions();
    this.detectChanges(this.form.value);
    doLater(function() {this.verifyDayIsSelected()}.bind(this));
  }

  verifyDayIsSelected() {
    const dayOfWeek = WeekDay[this.startDate.getDay()].toUpperCase();
    const weeklyDaysField = this.form.get('weeklyDays');
    if(!weeklyDaysField.value.includes(dayOfWeek) && weeklyDaysField.value.length == 1)
      weeklyDaysField.setValue([dayOfWeek]);
  }

  detectChanges(val: Recurrence) {
    if(deepEqual(val, this.value))
      return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }


  updateRecurrenceOptions() {
    const freq = this.form.get('frequency').value;

    this.cycleOptions.length = 0;
    this.cycleOptions.push({value: "DAILY", text: (freq === 1? "day": "days")});
    this.cycleOptions.push({value: "WEEKLY", text: (freq === 1? "week": "weeks")});
    const monthly = ((freq === 1? "month": "months") + ` on the ${this.positionize(this.startDate.getDate())}`);
    this.cycleOptions.push({value: "DAY_OF_MONTH", text: monthly});
    const day = WeekDay[this.startDate.getDay()];
    const monthlyDayOfWeek = ((freq === 1? "month": "months") + 
      ` on the ${this.positionize(Math.floor((this.startDate.getDate()-1)/7) + 1)} ${day}`);
    this.cycleOptions.push({value: "WEEKDAY_OF_MONTH", text: monthlyDayOfWeek});
    this.cycleOptions.push({value: "YEARLY", text: (freq === 1? "year": "years")});
    this.cycleOptions.push({value: "CUSTOM", text: "Custom Schedule"});
  }

  getCycle(): string {
    return this.form.get('cycle').value;
  }

  private positionize(input: number): string {
    var lastPosition = input % 10;
    switch (lastPosition) {
      case 1:
        return input == 11? "llth": input + "st";
      case 2:
        return input + "nd";
      case 3:
        return input + "rd";
      default:
        return input + 'th';
    }
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: Recurrence) {
    if(!value)
      return;
    
    this.value = value;
    this.form.patchValue(value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
