import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SectionDialogComponent } from '../section-dialog/section-dialog.component';

import { SectionService } from '../services/section.service';

import { Section } from '../formation';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  SectionDialogComponent = SectionDialogComponent;

  activeProgram: number;

  selectedSection: Section;

  constructor(public sectionService: SectionService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.activeProgram = +this.route.snapshot.paramMap.get('id');
  }

  sectionSelected(section: Section) {
    this.selectedSection = section;
  }
}
