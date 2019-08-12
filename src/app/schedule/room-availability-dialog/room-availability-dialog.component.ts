import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'


import { AvailabilityService } from '../services/availability.service';
import { Room } from '../room';
import { Event } from '../event';

@Component({
  selector: 'app-room-availability-dialog',
  templateUrl: './room-availability-dialog.component.html',
  styleUrls: ['./room-availability-dialog.component.scss']
})
export class RoomAvailabilityDialogComponent implements OnInit {
  form = this.fb.group({
      search: [''],
    });

  availableRooms: Room[];
  filteredRooms: Room[];

  highlighted: Room = null;

  constructor(public dialogRef: MatDialogRef<RoomAvailabilityDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                startTime: Date,
                endTime: Date,
                capacity: number
              },
              private fb: FormBuilder,
              private availabilityService: AvailabilityService) { 
  }
  
  ngOnInit() {
    this.availabilityService.getAvailableRooms(this.data.startTime, this.data.endTime).subscribe(resp => {
      this.availableRooms = resp.filter(room => room.capacity >= this.data.capacity).concat(resp.filter(room => room.capacity < this.data.capacity));
      this.filteredRooms = this.availableRooms;
    });

    this.form.get('search').valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => { 
        this.filteredRooms = this.availableRooms.filter(room => room.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      });
  }

  highlight(item: any) {
    this.highlighted = item;
  }

  select(room: Room) {
    this.dialogRef.close(room);
  }

  cancel() {
    this.dialogRef.close();    
  }
}
