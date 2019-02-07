import { Component, OnInit, Injectable, Output, EventEmitter } from '@angular/core';
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

  permissions: Permission[];
  @Output() permsChanged = new EventEmitter<string[]>();

  constructor(private permissionService: PermissionService) { 
    this.nestedTreeControl = new NestedTreeControl<Permission>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit() {
    this.permissionService.getAvailablePermissions()
      .subscribe(permissions => {
        this.permissions = permissions;
        this.nestedDataSource.data = permissions;
      });
  }

  permChanged(perm: Permission) {
    perm.active = !perm.active;
    this.permsChanged.emit(this.permissionService.collectPermissions(this.permissions));
  }

  private hasNestedChild(_: number, node: Permission) {
    return node.children != null && node.children.length > 0;
  }

  private _getChildren(node: Permission) {
    return node.children;
  } 
}
