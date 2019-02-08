export class Permission {
  children: Permission[];
  name: string;
	canonicalName: string;
  _active: boolean;
  _partial: boolean;

  get active() { return this._active; }
  set active(value:boolean) {
    this._active = value;
    if(this.children != null)
      this.children.forEach(child => child.active = value);
  }

  get partial() {
    const selectedChildren = this.children.filter(child => child.active).length;
    return selectedChildren > 0 && !this._active; //Need the active check as this is checked first  
  }
}
