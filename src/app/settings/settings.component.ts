import { Component, OnInit } from '@angular/core';

import { RoomService } from '../services/room.service';
import { EquipmentService } from '../services/equipment.service';
import { RoomDialogComponent } from '../room-dialog/room-dialog.component';
import { EquipmentDialogComponent } from '../equipment-dialog/equipment-dialog.component';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  RoomDialogComponent = RoomDialogComponent;
  EquipmentDialogComponent = EquipmentDialogComponent;

  constructor(private roomService: RoomService,
              private equipmentService: EquipmentService) { }

  ngOnInit() {
  }
}