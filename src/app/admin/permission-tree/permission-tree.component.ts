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

  permChanged(perm: Permission) {
    perm.active = !perm.active;

    //Be careful not to replace the array shared with the parent
    const newPerms = this.permissionService.collectPermissions(this.permissionTree);
    this.permissions.length=0;
    newPerms.forEach(permmission => this.permissions.push(permmission));
  }

  private markPermissions(perms: Permission[]) {
    this.permissions.forEach(perm => { 
        this.activatePermission(perm.split(/\./), perms);
      });
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

  private hasNestedChild(_: number, node: Permission) {
    return node.children != null && node.children.length > 0;
  }

  private _getChildren(node: Permission) {
    return node.children;
  } 
}
