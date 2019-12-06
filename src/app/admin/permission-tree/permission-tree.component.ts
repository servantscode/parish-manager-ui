import { Component, OnInit, Injectable, Input } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

import { PermissionService } from '../services/permission.service';
import { Permission } from '../permission';

@Component({
  selector: 'app-permission-tree',
  templateUrl: './permission-tree.component.html',
  styleUrls: ['./permission-tree.component.scss']
})
export class PermissionTreeComponent implements OnInit {
  
  nestedTreeControl: NestedTreeControl<Permission>;
  nestedDataSource: MatTreeNestedDataSource<Permission>;

  permissionTree: Permission[];
  @Input() permissions: string[];

  constructor(private permissionService: PermissionService) { 
    this.nestedTreeControl = new NestedTreeControl<Permission>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit() {
    this.permissionService.getAvailablePermissions()
      .subscribe(resp => {
        this.markPermissions(resp);
      });
  }

  selectAll() {
    this.permissionTree.forEach(perm => perm.active = true);
    this.updateSelectedPermissions();
  }

  selectNotAdmin() {
    this.permissionTree.forEach(perm => perm.active = perm.name !== "admin");
    this.updateSelectedPermissions();
  }

  selectNone() {
    this.permissionTree.forEach(perm => perm.active = false);
    this.updateSelectedPermissions();
  }

  selectAction(action:string, checked:boolean) {
    this.permissionTree.forEach(perm => this.markPerm(perm, action, checked));

    if(action == "read") {
      this.permissionTree.forEach(perm => this.markPerm(perm, 'list', checked));
      this.permissionTree.forEach(perm => this.markPerm(perm, 'metrics', checked));
    }
    this.updateSelectedPermissions();
  }

  markPerm(perm: Permission, action:string, checked:boolean) {
    if(perm.name == action) 
      perm.active = checked;
    else if(perm.children)
      perm.children.forEach(perm => this.markPerm(perm, action, checked));
  }

  permChanged(perm: Permission) {
    perm.active = !perm.active;
    this.updateSelectedPermissions();
  }

  private updateSelectedPermissions() {
    //Be careful not to replace the array shared with the parent
    const newPerms = this.permissionService.collectPermissions(this.permissionTree);
    this.permissions.length=0;
    newPerms.forEach(permmission => this.permissions.push(permmission));
  }

  hasNestedChild(_: number, node: Permission) {
    return node.children;
  }

  private markPermissions(perms: Permission[]) {
    this.permissions.forEach(perm => { 
        this.activatePermission(perm.split(/\./), perms);
      });
    this.sortPermissions(perms);
    this.permissionTree = perms;
    this.nestedDataSource.data = perms;
  }

  private activatePermission(permBits: string[], perms: Permission[]) {
    const permission = perms.find(permission => permission.name === permBits[0]);
    if(permission == null)
      return;

    if(permBits.length == 1 || permBits[1] == "*") {
      permission.active = true;
    } else if (permission.children != null) {
      this.activatePermission(permBits.slice(1), permission.children);
    }
  }

  private sortPermissions(perms: Permission[]): void {
    perms.sort((a,b) => a.name.localeCompare(b.name));
    perms.forEach(item => {
        if(item.children && item.children.length > 0)
          this.sortPermissions(item.children);
      });
  }

  private _getChildren(node: Permission) {
    return node.children;
  } 
}
