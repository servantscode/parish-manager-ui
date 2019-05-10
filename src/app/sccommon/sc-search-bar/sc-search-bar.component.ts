import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'

import { SCValidation } from '../validation';

@Component({
  selector: 'app-sc-search-bar',
  templateUrl: './sc-search-bar.component.html',
  styleUrls: ['./sc-search-bar.component.scss']
})
export class ScSearchBarComponent implements OnInit {
  @Output() search = new EventEmitter<string>();

  form = this.fb.group({
      input: ['', SCValidation.validSearch()]
    });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form.get('input').valueChanges
      .pipe(debounceTime(200))
      .subscribe(search => {
        if(this.form.valid)
          this.search.emit(search);
      });
  }
}
