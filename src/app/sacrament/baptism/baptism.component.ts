import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from '../../sccommon/services/login.service';

import { BaptismService } from '../services/baptism.service';

import { Baptism } from '../sacrament';

@Component({
  selector: 'app-baptism',
  templateUrl: './baptism.component.html',
  styleUrls: ['./baptism.component.scss']
})
export class BaptismComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              public loginService: LoginService,
              public baptismService: BaptismService) { }

  baptism: Baptism;
  showForm= false;

  ngOnInit() {
    const personId = +this.route.snapshot.paramMap.get('id');

    if(personId && personId > 0 && this.loginService.userCan("sacrament.baptism.read"))
      this.baptismService.getByPerson(personId).subscribe(resp => this.baptism=resp);
  }

  openForm() {
    this.showForm = true;
  }

  closeForm(storedBaptism:Baptism) {
    this.showForm = false;

    if(storedBaptism)
      this.baptism = storedBaptism;
  }
}
