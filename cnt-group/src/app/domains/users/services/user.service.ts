import { Injectable } from '@angular/core';
import { UserRegister } from '../models/user.model';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: UserRegister[] = [
    {userId: '1', userLogin: 'user1', userPassword: 'root', userEnabled: '1', userFirstName: 'Иван', userLastName: 'Иванов', userPatronymic: 'Иванович', userCreateDate: '2024-06-05 12:00:00', userBirthday: '2000-06-09'},
    {userId: '2', userLogin: 'user2', userPassword: 'root', userEnabled: '2', userFirstName: 'Иван', userLastName: 'Иванов', userPatronymic: 'Иванович', userCreateDate: '2024-06-05 12:00:00', userBirthday: '2000-06-09'},
    {userId: '3', userLogin: 'user3', userPassword: 'root', userEnabled: '3', userFirstName: 'Иван', userLastName: 'Иванов', userPatronymic: 'Иванович', userCreateDate: '2024-06-05 12:00:00', userBirthday: '2000-06-09'}
  ];

  roles: { [key: string]: string[] } = {
    '1': ['admin', 'student'],
    '2': ['student'],
    '3': ['admin']
  };

  private rolesUpdatedSource = new BehaviorSubject<{userId: string, roles: string[]} | null>(null);
  rolesUpdated$ = this.rolesUpdatedSource.asObservable();

  constructor() {}

  getUserRoles(userId: string | number): Observable<string[]> {
    return of(this.roles[userId] || []);
  }

  updateUserRoles(userId: string | number, roles: string[]): Observable<any> {
    this.roles[userId] = roles;

    this.rolesUpdatedSource.next({
      userId: userId.toString(),
      roles: roles
    });

    return of({ roles: this.roles });
  }

  getUsers(): Observable<UserRegister[]> {
    return of(this.users);
  }

  updateUser(user: UserRegister): Observable<any> {
    const index = this.users.findIndex(u => u.userId === user.userId);
    if (index !== -1) {
      this.users[index] = user;
    }
    return of({ success: true });
  }

  deleteUser(userId: string): Observable<any> {
    const index = this.users.findIndex(u => u.userId === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return of({ success: true });
  }
}
