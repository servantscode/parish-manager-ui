import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import { DownloadService } from 'sc-common';

import { SectionDialogComponent } from '../section-dialog/section-dialog.component';

import { SectionService } from '../services/section.service';
import { ProgramService } from '../services/program.service';

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
              public downloadService: DownloadService,
              public programService: ProgramService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.activeProgram = +this.route.snapshot.paramMap.get('id');
  }

  sectionSelected(section: Section) {
    this.selectedSection = section;
  }

  downloadAttendanceSheets() {
    const filename = "attendanceSheets-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".pdf";
    this.downloadService.downloadReport(this.programService.getAttendanceSheets(this.activeProgram), filename);

  }
}
