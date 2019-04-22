import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { LoginService } from '../../sccommon/services/login.service';
import { BaseSacramentService } from '../services/base-sacrament.service';

import { Sacrament } from '../sacrament';

@Component({
  selector: 'app-notations',
  templateUrl: './notations.component.html',
  styleUrls: ['./notations.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotationsComponent),
      multi: true
    }
  ]
})
export class NotationsComponent<T extends Sacrament> implements ControlValueAccessor, OnInit {

  @Input('value') notations:string[] = [];
  @Input() dataService: BaseSacramentService<T>;
  @Input() sacramentId: number;

  onChange: any = () => { };
  onTouched: any = () => { };

  notationsForm = this.fb.group({
      input: ''
    });

  constructor(private fb: FormBuilder, 
              public loginService: LoginService) {
  }

  ngOnInit() {
  }

  userCanAnnotate() {
    return this.loginService.userCan(this.dataService.getPermissionType() + ".create");
  }
  
  addNotation() {
    var notation = this.notationsForm.get('input').value;
    if(notation) {
      notation = notation.trim();
      if(notation != '') {
        this.dataService.addNotation(this.sacramentId, notation).subscribe(resp => {
          this.notations.push(notation);
          this.notationsForm.get('input').reset();
          this.onChange(this.notations);
          this.onTouched();
        });
      }
    }
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    if(value)
      this.notations = value;
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.notationsForm.controls) {
      var field = this.notationsForm.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
