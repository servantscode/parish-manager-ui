import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProgramService } from '../services/program.service';

import { ProgramDialogComponent } from '../program-dialog/program-dialog.component';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {

  ProgramDialogComponent = ProgramDialogComponent;

  constructor(public programService: ProgramService,
              private router: Router) { }

  ngOnInit() {
  }

  programSelected(program: any) {
      this.router.navigate(['formation', program.id]);
  }
}
