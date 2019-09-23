import { Component, OnInit, OnChanges, SimpleChanges, Input, forwardRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { SCValidation } from 'sc-common';

import { Person } from 'sc-common';
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
  changeListener: Subscription;
  relationshipListeners: Subscription[] = [];
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder,
               public relationshipService: RelationshipService) { }

  ngOnInit() {
    this.enableUpdates();
  }

  enableUpdates() {
    if(this.changeListener)
      return;

    this.changeListener = this.form.valueChanges.subscribe(relationships => this.detectChanges(relationships.relationships));
  }

  diableUpdates() {
    if(this.changeListener) {
      this.changeListener.unsubscribe();
      this.changeListener = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateForm();
  }

  relationshipControls(): FormArray {
    return <FormArray>this.form.controls['relationships'];
  }

  private updateForm() {
    this.diableUpdates();
    this.relationshipListeners.forEach(listener => listener.unsubscribe());
    this.relationshipListeners = [];
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

    if(this.value)
      this.form.patchValue({"relationships": this.value});

    var i;
    for( i=0; i< relationships.controls.length; i++)  {
      const index = i; //Need a const to compare against later
      const r = relationships.controls[index];
      this.relationshipListeners.push(r.get('relationship').valueChanges.subscribe(relationship => {
        if((!this.value || relationship != this.value[index].relationship)) { 
          if(relationship == "MOTHER" || relationship == "FATHER") {
            r.get('guardian').setValue(true);
            r.get('contactPreference').setValue(1);
          } else if(relationship == "SPOUSE") {
            r.get('contactPreference').setValue(1);            
          }
        }
      }));
    }

    this.enableUpdates();
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
    this.updateForm();
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
