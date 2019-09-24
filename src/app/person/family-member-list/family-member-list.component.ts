import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { differenceInYears } from 'date-fns';

import { LoginService } from 'sc-common';

import { Person } from 'sc-common';
import { doLater } from '../../sccommon/utils';

import { RelationshipDialogComponent } from '../relationship-dialog/relationship-dialog.component';

import { RelationshipService } from 'sc-common';

import { Relationship } from 'sc-common';

@Component({
  selector: 'app-family-member-list',
  templateUrl: './family-member-list.component.html',
  styleUrls: ['./family-member-list.component.scss']
})
export class FamilyMemberListComponent implements OnInit, OnChanges {

  @Input() person: Person;
  @Input() members: Person[];
  @Input() familyId: number;

  relationships: any[];
  private highlightedPerson: Person;

  constructor(private router: Router,
              private dialog: MatDialog,
              public loginService: LoginService,
              public relationshipService: RelationshipService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.members)
      return;

    this.relationships = this.members;
    this.relationships.forEach(r => r.relationship = "");

    // if(!this.person)
    //   return;
    
    //For family view take perspective of head of household for family roles
    if(this.person && this.person.id) {
      this.relationshipService.getRelationships(this.person.id).subscribe( results => {
          results.forEach(relation => {
            const person = this.relationships.find(r => relation.otherId == r.id);
            if(person)
              person.relationship = relation;
          })
        });
    } else {
      const head = this.relationships.find(m => m.headOfHousehold);
      if(head) {
        head.relationship = {'relationship': 'HEAD'};
        this.relationshipService.getRelationships(head.id).subscribe( results => {
          results.forEach(relation => {
            const person = this.relationships.find(r => relation.otherId == r.id);
            if(person)
              person.relationship = relation;
          })
        });
      }
    }
  }

  editRelationship(familyMember: any) {
    var relationship;
    if(familyMember.relationship) {
      relationship = familyMember.relationship;
      relationship.personName = this.person.name;
      relationship.otherName = familyMember.name;
    } else {
      relationship = new Relationship();
      relationship.personId = this.person.id;
      relationship.personName = this.person.name;
      relationship.otherId = familyMember.id;
      relationship.otherName = familyMember.name;
    }

    const openDialogRef = this.dialog.open(RelationshipDialogComponent, {
        width: '400px',
        data: { "item": relationship,
                "createReciprocal": true
              }
      });

    openDialogRef.afterClosed().subscribe(result => familyMember.relationship = result? result: familyMember.relationship);
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
