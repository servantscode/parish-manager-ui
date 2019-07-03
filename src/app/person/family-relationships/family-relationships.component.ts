import { Component, OnInit, OnChanges, SimpleChanges, Input, forwardRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { SCValidation } from '../../sccommon/validation';

import { Person } from '../../sccommon/person';
import { deepEqual } from '../../sccommon/utils';

import { RelationshipService } from '../services/relationship.service';

import { Relationship } from '../relationship';

@Component({
  selector: 'app-family-relationships',
  templateUrl: './family-relationships.component.html',
  styleUrls: ['./family-relationships.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FamilyRelationshipsComponent),
      multi: true
    }
  ]
})
export class FamilyRelationshipsComponent implements OnInit, OnChanges {

  @Input() person: Person;
  @Input() familyMembers: Person[];

  form = this.fb.group({
      relationships: this.fb.array([])
    });

  public relationshipTypes = this.relationshipService.getRelationshipTypes.bind(this.relationshipService);

  value: Relationship[];

  disabled = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder,
               public relationshipService: RelationshipService) { }

  ngOnInit() {
    this.form.valueChanges.subscribe(relationships => this.detectChanges(relationships.relationships));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateForm();
  }

  relationshipControls(): FormArray {
    return <FormArray>this.form.controls['relationships'];
  }

  private updateForm() {
    const relationships = this.relationshipControls();
    relationships.clear();

    if(this.familyMembers) {
      for(let member of this.familyMembers) {
        var group = this.fb.group({
            personId: this.person.id,
            otherId: member.id,
            relationship: "",
            guardian: false,
            contactPreference: 0,
            doNotContact: false
          });

        relationships.push(group);
      }
    }
  }

  private detectChanges(val: Relationship[]) {
    if(deepEqual(val, this.value))
      return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: Relationship[]) {
    if(!value)
      return;
    
    this.value = value;
    this.form.patchValue(value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
