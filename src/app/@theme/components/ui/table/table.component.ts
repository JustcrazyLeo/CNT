import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UserService } from 'src/app/domains/users/models/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {
  @Input() columnHeaders: string[] = [];
  @Input() data: any[] = [];
  @Input() selectedRowId: number | null = null;
  @Output() rowClick = new EventEmitter<any>();
  dataKeys: string[] = [];
  roles: {[key: string]: string[]} = {};

  constructor(private userService: UserService) {}

  ngOnChanges() {
    if (this.data.length > 0) {
      this.dataKeys = Object.keys(this.data[0]);
      this.loadRoles();
    }
  }

  loadRoles() {
    this.data.forEach(user => {
      this.userService.getUserRoles(user.userId).subscribe(roles => {
        this.roles[user.userId] = roles;
      });
    });
  }

  onRowClick(user: any) {
    this.rowClick.emit(user);
  }

  isRowSelected(row: any): boolean {
    return this.selectedRowId !== null && row.userId === this.selectedRowId;
  }

  getRowColor(row: any): string {
    const roles = this.roles[row.userId] || [];
    const isAdmin = roles.includes('admin');
    const isStudent = roles.includes('student');

    if (isAdmin && isStudent) return 'yellow';
    if (isAdmin) return 'red';
    if (isStudent) return 'blue';
    return '';
  }
}