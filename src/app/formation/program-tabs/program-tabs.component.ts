import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService, SectionService } from 'sc-common';
import { Section } from 'sc-common';

@Component({
  selector: 'app-program-tabs',
  templateUrl: './program-tabs.component.html',
  styleUrls: ['./program-tabs.component.scss']
})
export class ProgramTabsComponent implements OnInit {
  public selectedTab: string;

  activeProgramId:number;
  activeSection: Section;
  sections: Section[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService,
              public sectionService: SectionService) { }

  ngOnInit() {
    this.activeProgramId = +this.route.snapshot.paramMap.get('id');
    var tab = this.route.snapshot.paramMap.get('tab');
    this.selectedTab = tab? tab.toLowerCase(): 'classes';

    this.loadSections();
  }

  loadSections() {
    this.sectionService.getPage(0, -1, '', {"programId": this.activeProgramId})
        .subscribe(resp => {
            this.sections = resp.results;
            if(this.sections.length > 0)
              this.selectSection(this.sections[0]);
          });
  } 

  selectSection(section: Section) {
    this.activeSection = section;
  }

  public selectTab(tab: any): void {
    this.selectedTab = tab;
    this.router.navigate(['formation', this.getId(), tab]);
  }

  public getId(): number {
    return +this.route.snapshot.paramMap.get('id');    
  }
}
