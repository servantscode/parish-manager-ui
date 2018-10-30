import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';

import { Person } from '../person';
import { Family } from '../family';
import { FamilyService } from '../services/family.service';
import { FamilyMemberListComponent } from '../family-member-list/family-member-list.component';

@Component({
  selector: 'app-family-detail',
  templateUrl: './family-detail.component.html',
  styleUrls: ['./family-detail.component.scss']
})
export class FamilyDetailComponent implements OnInit {

  family: Family;

  familyForm = this.fb.group({
      id: '',
      surname: ['', Validators.required],
      address: this.fb.group({
        street1: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)])],
        zip: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)])]
      }),
      members: this.fb.array([
        // this.fb.group({
        //   name: ''
        // })
      ])
    });

  membersControl = this.familyForm.get('members') as FormArray;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private familyService: FamilyService,
              private fb: FormBuilder) { }

  ngOnInit() {
        this.getFamily();
  }

  getFamily(): void {
    this.family = new Family();
    const id = +this.route.snapshot.paramMap.get('id');

    if(id > 0) {
      this.familyService.getFamily(id).
        subscribe(family => {
          this.family = family;
          family.members.forEach((person) => {
              this.membersControl.push(this.memberItem(person));
            });
          this.familyForm.patchValue(family);
        });
    }
  }

  memberItem(person: Person): AbstractControl {
    return this.fb.group({
        id: person.id,
        name: person.name
      })
  }

  goBack(): void {
    this.router.navigate(['person']);
  }

  save(): void {
    if(this.family.id > 0) {
      this.familyService.updateFamily(this.familyForm.value).
        subscribe(family => {
          this.family = family;
          // this.goBack();
        });
    } else {
      this.familyService.createFamily(this.familyForm.value).
        subscribe(family => {
          this.family = family;
          // this.goBack();
        });
    }
  }

}
