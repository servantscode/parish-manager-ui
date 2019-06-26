import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { differenceInYears } from 'date-fns';

import { LoginService } from '../../sccommon/services/login.service';

import { Person } from '../../sccommon/person';

@Component({
  selector: 'app-family-member-list',
  templateUrl: './family-member-list.component.html',
  styleUrls: ['./family-member-list.component.scss']
})
export class FamilyMemberListComponent implements OnInit {

  @Input() members: Person[];
  @Input() familyId: number;
  private highlightedPerson: Person;

  constructor(private router: Router,
              public loginService: LoginService) { }

  ngOnInit() {
  }

  highlightPerson(person: Person) {
    this.highlightedPerson = person;
  }

  updatePerson(id: number): void {
    if(id > 0) {
      if(!this.loginService.userCan('person.read'))
        return;
      this.router.navigate(['person', id, 'detail']);
    } else {
      if(!this.loginService.userCan('person.create'))
        return;
      this.router.navigate(['person', 'detail'], {queryParams: {familyId: this.familyId}});
    }
  }

  getAge(member: Person): number {    
    return (member.birthdate == null)? null: differenceInYears(new Date(),  member.birthdate);
  }
}
