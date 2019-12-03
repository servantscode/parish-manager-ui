import { Component, OnInit, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators'
import { setHours, setMinutes, setSeconds, format } from 'date-fns';

import { SCValidation } from '../validation';

@Component({
  selector: 'sc-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true
    }
  ]
})
export class TimeComponent implements OnInit {

  @Input() label = 'Some';
  @Input('value') _value: Date;
  @Input() required = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      time: ['', Validators.pattern(SCValidation.TIME)]
    });
  
  @Input() autoFocus = false;
  @ViewChild('timeInput', {static: false}) input:ElementRef;

  get value() {
    return this._value;
  }

  set value(val: Date) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if(this.autoFocus)
      this.input.nativeElement.focus();

    this.form.get('time').valueChanges
      .pipe(distinctUntilChanged())
      .subscribe( value => {
        if(!this.form.get('time').valid) {
          this.value = this.calculateTime(this.form.get('time').value);
          return;
        }
      }); 
  }

  public formatTime(): void {
    var field = this.form.get('time');
    const timeOnly: Date = this.calculateTime(field.value);
    if(!timeOnly)
      return;

    field.setValue(this.formatTimeString(timeOnly));
  }

  // ----- Private -----
  private calculateTime(time: string): Date {
    const parser = /^(\d+)(:(\d+))?(:(\d+))?\s*(\w+)?$/;
    var match = parser.exec(time);
    if(match == null) 
      return null;

    var hours = match[1]? +match[1]: 0;
    const minutes = match[3]? +match[3]: 0;
    const seconds = match[5]? +match[5]: 0;
    var dayHalf = match[6]? match[6]: "";

    if(dayHalf.toUpperCase().startsWith("A"))
      dayHalf = "AM"
    else if(dayHalf.toUpperCase().startsWith("P"))
      dayHalf = "PM"
    else
      dayHalf = hours > 8 && hours !== 12? "AM": "PM"

    if(dayHalf === "AM" && hours >= 12)
      hours -= 12;
    if(dayHalf === "PM" && hours < 12)
      hours += 12;

    return new Date(0, 0, 0, hours, minutes, seconds);
  }

  private formatTimeString(date: Date): string {
    return format(date, date.getSeconds() > 0? 'h:mm:ss A': 'h:mm A');
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: Date) {
    this.form.get('time').setValue(this.formatTimeString(value), {emitEvent: false});
    this.value = value;
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}