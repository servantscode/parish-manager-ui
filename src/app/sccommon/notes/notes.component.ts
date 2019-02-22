import { Component, OnChanges, Input } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { LoginService } from '../services/login.service';
import { NoteService } from '../services/note.service';
import { Note } from '../note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnChanges {

  @Input() resourceType: string;
  @Input() resourceId: number;

  notes: Note[];
  formOpen = false;

  form = this.fb.group({
      creatorId: [this.loginService.getUserId(), Validators.required],
      private: [false, Validators.required],
      resourceType: [this.resourceType, Validators.required],
      resourceId: [this.resourceId, Validators.required],
      note: ['', Validators.required]
    });
  

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private noteService: NoteService) { }

  ngOnChanges() {
    if(this.resourceType && this.resourceId)
      this.getNotes();

    this.form.get('resourceType').setValue(this.resourceType);
    this.form.get('resourceId').setValue(this.resourceId);
  }

  openForm(): void {
    this.formOpen = true;
  }

  save(): void {
    // if(this.ministry.id > 0) {
    //   if(!this.loginService.userCan('ministry.update'))
    //     this.goBack();
    //   this.ministryService.update(this.ministryForm.value).
    //     subscribe(ministry => {
    //       this.ministry = ministry;
    //       this.editMode = false;
    //       this.router.navigate(['ministry', 'detail', ministry.id]);
    //     });
    // } else {
    if(!this.loginService.userCan('note.create'))
      return;
    else if(this.form.get('private').value && !this.loginService.userCan('private.note.create'))
      return;

    this.noteService.create(this.form.value).
      subscribe(note => {
        this.notes.unshift(note);
        this.form.get("note").setValue("");
        this.form.get("private").setValue(false);
        this.formOpen = false;
      });      
    // }
  }

  // ----- Private -----

  private getNotes() {
    this.noteService.getPage(0, 10, this.resourceType + ":" + +this.resourceId).subscribe(resp => this.notes=resp.results);
  }
}
