import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';


import { LoginService } from '../../sccommon/services/login.service';

import { ProgramService } from '../services/program.service';
import { ProgramGroupService } from '../services/program-group.service';

import { ProgramDialogComponent } from '../program-dialog/program-dialog.component';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {

  ProgramDialogComponent = ProgramDialogComponent;
  
  public refreshNeeded = new Subject<string>();

  groupForm = this.fb.group({
      groupId: ''
    });

  constructor(public programService: ProgramService,
              public programGroupService: ProgramGroupService,
              public loginService: LoginService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.groupForm.get('groupId').valueChanges.subscribe(id => this.refreshNeeded.next(id));
  }

  programSelected(program: any) {
      this.router.navigate(['formation', program.id]);
  }
}
