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

  form = this.fb.group({});

  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                title: string,
                fields: any},
              private fb: FormBuilder) { }

  ngOnInit() {
    const formGroup = this.form;
    this.data.fields.forEach(field => {
        const fieldName = this.fieldName(field);
        if(field.type == "date") {
          formGroup.addControl(fieldName + "Start", this.fb.control(''));
          formGroup.addControl(fieldName + "End", this.fb.control(''));
        } else if(field.type == "numberRange") {
          formGroup.addControl(fieldName + "Start", this.fb.control(''));
          formGroup.addControl(fieldName + "End", this.fb.control(''));
        } else {  
          formGroup.addControl(fieldName, this.fb.control(''));
        }
      });
  }

  search() {
    var searchString = "";

    this.data.fields.forEach(field => {
        const fieldName = this.fieldName(field);
        if(field.type == "date") {
          var start = this.form.get(fieldName + "Start").value;
          var end = this.form.get(fieldName + "End").value;
          if(start || end)
            searchString += field.name + ":[" + this.formatDate(start) + " TO " + this.formatDate(end) + "] ";
        } else if(field.type == "numberRange") {
          var start = this.form.get(fieldName + "Start").value;
          var end = this.form.get(fieldName + "End").value;
          if(start || end)
            searchString += field.name + ":[" + this.formatNumber(start) + " TO " + this.formatNumber(end) + "] ";
        } else {
          var value = this.form.get(fieldName).value;
          if(value) {
            searchString += field.name + ":" + (field.type == 'text' && value.includes(" ")? `"${value}"`: value)+ " ";
          }
        }
    });    

    this.close(searchString);
  }

  private fieldName(field: any): string {
    return field.name.replace(".", "_");
  }

  private formatNumber(number: number) {
    return number? number: "*";
  }

  private formatDate(date: Date): string {
    return date? formatDate(date, "yyyy-MM-dd", "en_US"): "*";
  }

  cancel() {
    this.close(null);
  }

  close(search:string) {
    this.dialogRef.close(search);  
  }
}
