import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../person';
import { LoginService } from '../sccommon/services/login.service';

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
              private loginService: LoginService) { }

  ngOnInit() {
  }

  highlightPerson(person: Person) {
    this.highlightedPerson = person;
  }

  updatePerson(id: number): void {
    if(id > 0) {
      if(!this.loginService.userCan('person.read'))
        return;
      this.router.navigate(['person', 'detail', id]);
    } else {
      if(!this.loginService.userCan('person.create'))
        return;
      this.router.navigate(['person', 'detail'], {queryParams: {familyId: this.familyId}});
    }
  }

  getAge(member: Person): number {    
    if(member.birthdate == null)
      return null;
    
    const now = new Date();
    var age = now.getFullYear() - member.birthdate.getFullYear();
    if(now.getMonth() > member.birthdate.getMonth()) {
      return age;
    } else if(now.getMonth() == member.birthdate.getMonth() &&
      now.getDate() >= member.birthdate.getDate()) {
      return age;
    }
    return age - 1;
  }
}
