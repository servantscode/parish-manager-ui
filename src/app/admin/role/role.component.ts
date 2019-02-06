import { Component, OnInit } from '@angular/core';

import { RoleDialogComponent } from '../role-dialog/role-dialog.component';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  RoleDialogComponent = RoleDialogComponent;

  constructor(private roleService: RoleService) { }

  ngOnInit() {
  }

}
