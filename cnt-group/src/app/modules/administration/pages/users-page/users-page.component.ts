import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserRegister } from 'src/app/domains/users/models/user.model';
import { UserService } from 'src/app/domains/users/services/user.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit, OnDestroy {
  asideIndex: number = 1;
  users: UserRegister[] = [];
  selectedUser: UserRegister | null = null;
  selectedTableRow: any = null;

  userRoles: { [key: string]: string[] } = {};
  tableData: any[] = [];

  private rolesUpdateSubscription: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.subscribeToRoleUpdates();
  }

  ngOnDestroy(): void {
    if (this.rolesUpdateSubscription) {
      this.rolesUpdateSubscription.unsubscribe();
    }
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.loadUserRoles();
    });
  }

  subscribeToRoleUpdates(): void {
    this.rolesUpdateSubscription = this.userService.rolesUpdated$.subscribe(update => {
      if (update) {
        this.userRoles[update.userId] = update.roles;
        this.updateTableData();

        if (this.selectedUser && this.selectedUser.userId === update.userId) {
          this.selectedUser = { ...this.selectedUser };
        }
      }
    });
  }

  loadUserRoles(): void {
    this.userRoles = {};
    this.users.forEach(user => {
      this.userService.getUserRoles(user.userId).subscribe(roles => {
        this.userRoles[user.userId] = roles;
        this.updateTableData();
      });
    });
  }

  updateTableData(): void {
    this.tableData = this.users.map(user => {
      const roles = this.userRoles[user.userId] || [];
      return {
        ...user,
        displayRoles: this.getRolesDisplay(roles),
        rowClass: this.getRowClass(roles),
        isAdmin: roles.includes('admin'),
        isStudent: roles.includes('student'),
        hasBothRoles: roles.includes('admin') && roles.includes('student'),
        hasNoRoles: roles.length === 0
      };
    });
  }

  getRolesDisplay(roles: string[]): string {
    if (!roles || roles.length === 0) return 'Нет ролей';

    const roleNames: { [key: string]: string } = {
      'admin': 'Админ',
      'student': 'Студент'
    };

    return roles.map(role => roleNames[role] || role).join(', ');
  }

  getRowClass(roles: string[]): string {
    if (!roles || roles.length === 0) {
      return 'row-no-role';
    }

    if (roles.includes('admin') && roles.includes('student')) {
      return 'row-both-roles';
    } else if (roles.includes('admin')) {
      return 'row-admin';
    } else if (roles.includes('student')) {
      return 'row-student';
    }

    return '';
  }

  onAddUserBtn() {
    this.asideIndex = 1;
    this.selectedUser = null;
    this.selectedTableRow = null;
  }

  onUserSelect(user: any) {
    this.asideIndex = 2;
    this.selectedUser = user;
    this.selectedTableRow = user;
  }

  updateUser(updatedUser: UserRegister) {
    this.userService.updateUser(updatedUser).subscribe(() => {
      this.loadUsers();
    });
  }
}
