export class Permission {
  children: Permission[];
  name: string;
	canonicalName: string;
  _active: boolean;

  get active() { return this._active; }
  set active(value:boolean) {
    this._active = value;
    if(this.children != null)
      this.children.forEach(child => child.active = value);
  }
}
