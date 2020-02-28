import { Component, OnInit, OnChanges, SimpleChanges, Input, forwardRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: 'sc-multi-text',
  templateUrl: './multi-text.component.html',
  styleUrls: ['./multi-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiTextComponent),
      multi: true
    }
  ]
})
export class MultiTextComponent implements OnInit {
  form = this.fb.group({
      item: [""]
    });

  value: string[] = [];

  @Input() disabled = false;
  @Input() label = "Item";
  changeListener: Subscription;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder) { }

  ngOnInit() { }

  public addItem() {
    var newValue = this.form.get("item").value;
    if(newValue) 
      newValue = newValue.trim();
    
    if(newValue) {
      this.value.push(newValue);
      this.form.get("item").reset();
      this.notifyChanges();
    }
  }

  public removeItem(i: number) {
    this.value.splice(i,1);
    this.notifyChanges();
  }

  private notifyChanges() {
    this.onTouched();
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: string[]) {    
    this.value = value;
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
