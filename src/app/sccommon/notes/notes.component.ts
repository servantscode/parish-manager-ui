import { Component, OnChanges, Input, HostListener } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { LoginService } from 'sc-common';
import { NoteService } from '../services/note.service';
import { Note } from '../note';

export enum KEY_CODE {
  ENTER = 13,
  ESCAPE = 27
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnChanges {

  @Input() resourceType: string;
  @Input() resourceId: number;

  notes: Note[] = [];
  highlighted: Note;
  moreNotes = false;

  form = this.fb.group({
      id: [''],
      creatorId: [this.loginService.getUserId(), Validators.required],
      private: [false, Validators.required],
      resourceType: [this.resourceType, Validators.required],
      resourceId: [this.resourceId, Validators.required],
      note: ['', Validators.required]
    });

  constructor(private fb: FormBuilder,
              public loginService: LoginService,
              private noteService: NoteService) { }

  ngOnChanges() {
    if(this.resourceType && this.resourceId)
      this.getNotes();

    this.form.get('resourceType').setValue(this.resourceType);
    this.form.get('resourceId').setValue(this.resourceId);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    // if (event.keyCode === KEY_CODE.ENTER) {
    //   this.save();
    // }

    if (event.keyCode === KEY_CODE.ESCAPE) {
      this.resetForm();
    }
  }

  loadMore(): void {
    this.getNotes();
  }

  canEdit(note: Note): boolean {
    return this.loginService.userCan('admin.note.update') || 
           (note.creatorId === this.loginService.getUserId() && this.loginService.userCan('note.update'));
  }

  edit(note: Note): void {
    this.form.get("note").setValue(note.note);
    this.form.get("private").setValue(note.private);
    this.form.get("id").setValue(note.id);
  }

  canDelete(note: Note): boolean {
    return this.loginService.userCan('admin.note.delete') || 
           (note.creatorId === this.loginService.getUserId() && this.loginService.userCan('note.delete'));
  }

  delete(note: Note) {
    this.noteService.delete(note).subscribe(() => {
        var replacePoint = this.notes.findIndex(n => n.id == note.id);
        this.notes.splice(replacePoint, 1);
      });
  }

  save(): void {
    if(this.form.get("id").value > 0) {
      if(!this.loginService.userCan('note.update'))
        return;
      else if(this.form.get('private').value && !this.loginService.userCan('private.note.update'))
        return;

      var note = this.form.value;
      note.note = note.note.trim();
      this.noteService.update(note).
        subscribe(note => {
          var replacePoint = this.notes.findIndex(n => n.id == note.id);
          this.notes.splice(replacePoint, 1, note);
          this.resetForm();
        });
    } else {
      if(!this.loginService.userCan('note.create'))
        return;
      else if(this.form.get('private').value && !this.loginService.userCan('private.note.create'))
        return;

      var note = this.form.value;
      note.note = note.note.trim();
      this.noteService.create(note).
        subscribe(note => {
          this.notes.unshift(note);
          this.resetForm();
        });      
    }
  }

  highlight(note: Note): void {
    this.highlighted = note;
  }

  // ----- Private -----

  private getNotes() {
    this.noteService.getPage(this.notes.length, 10, this.resourceType + ":" + +this.resourceId).subscribe(resp => {
        resp.results.forEach(note => this.notes.push(note));
        this.moreNotes = resp.totalResults > this.notes.length;
      });
  }

  private resetForm() {
    this.form.get("note").reset();
    this.form.get("private").setValue(false);
    this.form.get("note").markAsPristine();
  }
}
