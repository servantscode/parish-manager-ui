import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { WeekDay } from '@angular/common';
import { FormBuilder, Validators, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { endOfYear, differenceInMinutes, addMinutes } from 'date-fns';
import { debounceTime } from 'rxjs/operators';

import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';

import { SCValidation } from '../../sccommon/validation';
import { deepEqual, doLater } from '../../sccommon/utils';

import { Event, Recurrence } from '../event';

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
      weeklyDays: [],
      exceptionDates: []
    });

  cycleOptions: any[] = [];

  @Input() event: Event;
  @Output() futureConflictsChange = new EventEmitter();
  
  value: Recurrence;
  disabled: boolean = false;

  custom: boolean = false;
  selectedDates: any[] = [];

  _customEvents: Event[] = [];
  @Input('customEvents') 
  set customEvents(events: Event[]) {
    this._customEvents = events;
    this.customEventsChange.emit(events);
  }

  get customEvents(): Event[] {
    return this._customEvents;
  }

  @Output() customEventsChange = new EventEmitter();

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder,
              private cleaningService: DataCleanupService) { }

  ngOnInit() {
    this.updateRecurrenceOptions();

    this.form.get('frequency').valueChanges
        .subscribe( () => this.updateRecurrenceOptions());

    this.form.get('cycle').valueChanges
        .subscribe( value => {
          if(value === 'CUSTOM')
            this.enableCustomSchedule();
        });

    this.form.valueChanges.pipe(debounceTime(0)).subscribe(value => this.detectChanges(this.form.value));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateRecurrenceOptions();
    this.detectChanges(this.form.value);
    doLater(function() {this.verifyDayIsSelected()}.bind(this));
  }

  enableCustomSchedule(): void {
    if(this.custom)
      return;

    this.custom = true;
    const primeEvent = this.event;
    const customRecur = {"id": this.event.recurrence.id, "cycle":"CUSTOM", "frequency":0, "endDate":null, "weeklyDays":[], "exceptionDates":[]};
    this.customEvents = this.selectedDates.map(startTime => {
        const diff = differenceInMinutes(startTime, primeEvent.startTime);
        const e = Object.assign({}, primeEvent);
        e.id = 0
        e.startTime = addMinutes(e.startTime, diff);
        e.endTime = addMinutes(e.endTime, diff);
        e.reservations = primeEvent.reservations.map(r => {
          const res = Object.assign({}, r);
          res.id=0;
          res.startTime = addMinutes(res.startTime, diff);
          res.endTime = addMinutes(res.endTime, diff);
          return res;
        });
        e.recurrence = customRecur;
        return e;
      });
    this.customEvents[0].id = primeEvent.id;
    this.form.patchValue(customRecur);
  }

  updateSelectedDates(selectedDates: any[]): void {
    this.selectedDates = selectedDates;
  }

  verifyDayIsSelected() {
    if(!this.event.startTime)
      return;

    const dayOfWeek = WeekDay[this.event.startTime.getDay()].toUpperCase();
    const weeklyDaysField = this.form.get('weeklyDays');
    if(!weeklyDaysField.value.includes(dayOfWeek) && weeklyDaysField.value.length == 1)
      weeklyDaysField.setValue([dayOfWeek]);
  }
  
  getCycle(): string {
    return this.form.get('cycle').value;
  }

  updateFutureConflictCount(count: number): void {
    this.futureConflictsChange.emit(count);
  }

  private detectChanges(val: Recurrence) {
    if(deepEqual(val, this.value))
      return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  private updateRecurrenceOptions() {
    if(!this.event.startTime)
      return;
    
    const freq = this.form.get('frequency').value;

    this.cycleOptions.length = 0;
    this.cycleOptions.push({value: "DAILY", text: (freq === 1? "day": "days")});
    this.cycleOptions.push({value: "WEEKLY", text: (freq === 1? "week": "weeks")});
    const monthly = ((freq === 1? "month": "months") + ` on the ${this.positionize(this.event.startTime.getDate())}`);
    this.cycleOptions.push({value: "DAY_OF_MONTH", text: monthly});
    const day = WeekDay[this.event.startTime.getDay()];
    const monthlyDayOfWeek = ((freq === 1? "month": "months") + 
      ` on the ${this.positionize(Math.floor((this.event.startTime.getDate()-1)/7) + 1)} ${day}`);
    this.cycleOptions.push({value: "WEEKDAY_OF_MONTH", text: monthlyDayOfWeek});
    this.cycleOptions.push({value: "YEARLY", text: (freq === 1? "year": "years")});
    this.cycleOptions.push({value: "CUSTOM", text: "Custom Schedule"});
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
    
    this.custom = value.cycle == 'CUSTOM';

    this.value = value;
    this.form.patchValue(value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
