import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { differenceInYears } from 'date-fns';

import { LoginService } from '../../sccommon/services/login.service';

import { Person } from '../../sccommon/person';
import { doLater } from '../../sccommon/utils';

import { RelationshipService } from '../services/relationship.service';

import { Relationship } from '../relationship';

@Component({
  selector: 'app-family-member-list',
  templateUrl: './family-member-list.component.html',
  styleUrls: ['./family-member-list.component.scss']
})
export class FamilyMemberListComponent implements OnInit, OnChanges {

  @Input() personId: number;
  @Input() members: Person[];
  @Input() familyId: number;

  relationships: any[];
  private highlightedPerson: Person;

  constructor(private router: Router,
              public loginService: LoginService,
              public relationshipService: RelationshipService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.members)
      return;

    this.relationships = this.members;
    this.relationships.forEach(r => r.relationship = "");
    if(!this.personId) {
      const head = this.relationships.find(m => m.headOfHousehold);
      if(head) {
        head.relationship = 'HEAD';
        this.personId = head.id;
      }
    }

    this.relationshipService.getRelationships(this.personId).subscribe( results => {
        results.forEach(relation => {
          const person = this.relationships.find(r => relation.otherId == r.id);
          if(person)
            person.relationship = relation.relationship;
        })
      });
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
