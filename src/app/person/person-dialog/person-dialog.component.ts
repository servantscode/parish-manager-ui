import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { PersonService } from 'sc-common';
import { Person } from 'sc-common';
import { Family } from 'sc-common';
import { SCValidation } from '../../sccommon/validation';

import { extractSurname } from '../utils';

@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class PersonDialogComponent implements OnInit {

  form = this.fb.group({
      name: ['', Validators.required],
      male: true,
      email: ['', Validators.email],
      phoneNumber: ['', Validators.pattern(SCValidation.PHONE)]
    });

  constructor(public dialogRef: MatDialogRef<PersonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public personService: PersonService) { }
  
  ngOnInit() {
    // if(this.data.item)
    //   this.form.patchValue(this.data.item)
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    const person = this.form.value;
    person.family = new Family();
    person.family.surname = extractSurname(person.name);

    this.personService.create(person).
      subscribe(result => {
        this.dialogRef.close(result);
      });
  }

  cancel() {
    this.dialogRef.close();    
  }
}
