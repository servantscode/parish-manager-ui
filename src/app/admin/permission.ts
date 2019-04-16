export class Permission {
  children: Permission[];
  name: string;
	canonicalName: string;
  _active: boolean;

  get active(): boolean { 
    return this.children? this.children.filter(child => !child.active).length == 0: this._active; 
  }

  set active(value:boolean) {
    if(this.children)
      this.children.forEach(child => child.active = value);
    else
      this._active = value;
  }

  get partial(): boolean {
    if(!this.children)
      return false;

    const activeChildren = this.children.filter(child => child.active).length;
    const partialChildren = this.children.filter(child => child.partial).length;
    return partialChildren > 0 || (activeChildren > 0 && activeChildren < this.children.length); //Need the active check as this is checked first  
  }
}
