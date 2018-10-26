import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'state-selector',
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.scss']
})
export class StateSelectorComponent implements OnInit {

  private static STATES: string[] = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS",
                                     "KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP",
                                     "OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY"];

  @Input() state: string;
  @Output() selectState: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  filteredOptions: Observable<string[]>;

  ngOnInit() {
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return StateSelectorComponent.STATES.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  stateSelected() {
    this.selectState.emit(this.state);
  }
}
