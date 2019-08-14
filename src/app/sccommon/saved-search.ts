import { Identifiable } from './identifiable';

export class SavedSearch extends Identifiable {

  name: string;
  search: string;
  searchType: string;
  searcherId: number;
  saved: Date;
  lastUsed: Date;
  
  constructor() {
    super();
  }

  public identify(): string { 
    return this.name;
  }

  public asTemplate(): SavedSearch {
    this.id=0;
    this.name="";
    this.search="";
    this.searchType="";
    this.searcherId=0;
    this.saved=null;
    this.lastUsed=null;
    return this;
  } 
}