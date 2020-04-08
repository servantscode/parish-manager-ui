import { Component, OnInit, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators'
import { setHours, setMinutes, setSeconds, format } from 'date-fns';

import { SCValidation } from '../validation';
import { deepEqual } from '../utils';

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
  @Input() value: string;
  @Input() required = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      time: ['', Validators.pattern(SCValidation.TIME)]
    });
  
  @Input() autoFocus = false;
  @ViewChild('timeInput', {static: false}) input:ElementRef;

  notifyObservers(val: string) {

    if(deepEqual(val, this.value))
      return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if(this.autoFocus)
      this.input.nativeElement.focus();
  }

  public formatTime(): void {
    this.updateTimeString(this.form.get('time').value);
  }

  // ----- Private -----  
  private updateTimeString(time: string) {
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
      dayHalf = hours > 8 && hours < 12? "AM": "PM"

    if(dayHalf === "AM" && hours >= 12)
      hours -= 12;
    if(dayHalf === "PM" && hours < 12)
      hours += 12;

    const displayHours = hours > 12? hours - 12: hours < 1? hours + 12: hours;
    const displayString= seconds > 0? `${displayHours}:${this.pad(minutes)}:${this.pad(seconds)} ${dayHalf}`: `${displayHours}:${this.pad(minutes)} ${dayHalf}`;
    this.form.get('time').setValue(displayString, {"notifyObservers": false});

    const valueString= seconds > 0? `${hours}:${this.pad(minutes)}:${this.pad(seconds)}`: `${hours}:${this.pad(minutes)}`;
    this.notifyObservers(valueString);
  }

  private pad(val: number): string {
    return val < 10? '0'+val: ''+ val;
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: string) {
    this.value = this.updateTimeString(value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}