import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Enrollment } from '../enrollment';

@Component({
  selector: 'app-ministry-member-list',
  templateUrl: './ministry-member-list.component.html',
  styleUrls: ['./ministry-member-list.component.scss']
})
export class MinistryMemberListComponent implements OnInit {

  @Input() enrollments: Enrollment[];
  @Input() ministryId: number;
  private highlightedEnrollment: Enrollment;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  highlightPerson(enrollment: Enrollment) {
    this.highlightedEnrollment = enrollment;
  }

  viewPerson(id: number): void {
    if(id > 0) {
      this.router.navigate(['person', 'detail', id]);
    }
  }

  findPerson(): void {
    alert("Clicked!");
  }
}
