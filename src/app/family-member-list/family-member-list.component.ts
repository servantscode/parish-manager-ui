import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../person';

@Component({
  selector: 'app-family-member-list',
  templateUrl: './family-member-list.component.html',
  styleUrls: ['./family-member-list.component.scss']
})
export class FamilyMemberListComponent implements OnInit {

  @Input() members: Person[];
  @Input() familyId: number;
  private highlightedPerson: Person;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  highlightPerson(person: Person) {
    this.highlightedPerson = person;
  }

  updatePerson(id: number): void {
    if(id > 0) {
      this.router.navigate(['person', 'detail', id]);
    } else {
      this.router.navigate(['person', 'detail'], {queryParams: {familyId: this.familyId}});
    }
  }
}
