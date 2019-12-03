import { Component, OnInit, Inject } from '@angular/core';
import { WeekDay } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators';
import { addDays, startOfDay } from 'date-fns';

import { AutomationService } from '../services/automation.service';

@Component({
  selector: 'app-automation-dialog',
  templateUrl: './automation-dialog.component.html',
  styleUrls: ['./automation-dialog.component.scss']
})
export class AutomationDialogComponent implements OnInit {


  form = this.fb.group({
      id: [0],
      integrationId: ['', Validators.required],
      cycle: ['DAILY', Validators.required],
      frequency: [1, Validators.required],
      weeklyDays: [[]],
      scheduleStart: [startOfDay(addDays(new Date(), 1))]
    });

  cycleOptions: any[] = [];

  constructor(public dialogRef: MatDialogRef<AutomationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private automationService: AutomationService) { }

  ngOnInit() {
    if(this.data.item)
      this.form.patchValue(this.data.item);

    this.updateRecurrenceOptions();

    this.form.get('frequency').valueChanges
        .subscribe( () => this.updateRecurrenceOptions());

    this.form.get('scheduleStart').valueChanges
        .subscribe( () => this.updateRecurrenceOptions());
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    if(this.form.get("id").value > 0) {
      this.automationService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.automationService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } 
  }


  delete() {
    const id = this.form.get("id").value;
    if(id > 0) {
      this.automationService.delete(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

  private updateRecurrenceOptions() {    
    const start = this.form.get('scheduleStart').value;

    if(!start)
      return;

    const freq = this.form.get('frequency').value;

    this.cycleOptions.length = 0;
    this.cycleOptions.push({value: "HOURLY", text: (freq === 1? "hour": "hours")});
    this.cycleOptions.push({value: "DAILY", text: (freq === 1? "day": "days")});
    this.cycleOptions.push({value: "WEEKLY", text: (freq === 1? "week": "weeks")});
    const monthly = ((freq === 1? "month": "months") + ` on the ${this.positionize(start.getDate())}`);
    this.cycleOptions.push({value: "DAY_OF_MONTH", text: monthly});
    const day = WeekDay[start.getDay()];
    const monthlyDayOfWeek = ((freq === 1? "month": "months") + 
      ` on the ${this.positionize(Math.floor((start.getDate()-1)/7) + 1)} ${day}`);
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
}
