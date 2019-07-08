import { Component, OnInit, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {

  form = this.fb.group({
      name: [],
      male: [],
      birthdateStart: [],
      birthdateEnd: [],
      parishioner: [],
      memberSinceStart: [],
      memberSinceEnd: []
    });

  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                title: string,
                fields: any},
              private fb: FormBuilder) { }

  ngOnInit() {
  }

  search() {
    const name = this.form.get('name').value;
    const male = this.form.get('male').value;
    const birthdateStart = this.form.get('birthdateStart').value;
    const birthdateEnd = this.form.get('birthdateEnd').value;
    const parishioner = this.form.get('parishioner').value;
    const memberSinceStart = this.form.get('memberSinceStart').value;
    const memberSinceEnd = this.form.get('memberSinceEnd').value;

    var searchString = "";
    if(name) searchString += "name:" + name + " ";
    if(male) searchString += "male:" + male + " ";
    if(birthdateStart && birthdateEnd) searchString += "birthdate:[" + formatDate(birthdateStart, "yyyy-MM-dd", "en_US") + 
                                                             " TO " + formatDate(birthdateEnd, "yyyy-MM-dd", "en_US") + "]";
    if(parishioner) searchString += "parishioner:" + parishioner + " ";
    if(memberSinceStart && memberSinceEnd) searchString += "memberSince:[" + formatDate(memberSinceStart, "yyyy-MM-dd", "en_US") + 
                                                             " TO " + formatDate(memberSinceEnd, "yyyy-MM-dd", "en_US") + "]";

    this.close(searchString);
  }

  cancel() {
    this.close(null);
  }

  close(search:string) {
    this.dialogRef.close(search);  
  }
}
