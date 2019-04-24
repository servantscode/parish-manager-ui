import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from '../../sccommon/services/login.service';

import { MarriageService } from '../services/marriage.service';

import { Marriage } from '../sacrament';

@Component({
  selector: 'app-marriage',
  templateUrl: './marriage.component.html',
  styleUrls: ['./marriage.component.scss']
})
export class MarriageComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              public loginService: LoginService,
              public marriageService: MarriageService) { }

  marriage: Marriage;
  showForm = false;

  ngOnInit() {
    const personId = +this.route.snapshot.paramMap.get('id');

    if(personId && personId > 0 && this.loginService.userCan("sacrament.marriage.read"))
      this.marriageService.getByPerson(personId).subscribe(resp => this.marriage=resp);
  }

  openForm() {
    this.showForm = true;
  }

  closeForm(storedMarriage: Marriage) {
    this.showForm = false;

    if(storedMarriage)
      this.marriage = storedMarriage;
  }
}
