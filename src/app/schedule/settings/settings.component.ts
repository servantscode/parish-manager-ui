import { Component, OnInit } from '@angular/core';

import { RoomService } from '../../sccommon/services/room.service';
import { EquipmentService } from '../../sccommon/services/equipment.service';
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

  constructor(public roomService: RoomService,
              public equipmentService: EquipmentService) { }

  ngOnInit() {
  }
}
