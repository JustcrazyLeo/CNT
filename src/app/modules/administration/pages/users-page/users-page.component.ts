import { Component } from '@angular/core';
import { UserRegister } from 'src/app/domains/users/models/user.model';
import { UserService } from 'src/app/domains/users/models/services/user.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent {
  asideIndex: number = 1;
  users: UserRegister[] = this.userService.users;
  selectedUser: UserRegister | null = null;
  selectedRowId: number | null = null; // Добавляем переменную для хранения ID выделенной строки

  constructor(private userService: UserService) {}

  onAddUserBtn() {
    this.asideIndex = 1;
    this.selectedUser = null;
    this.selectedRowId = null; // Сбрасываем выделение при нажатии на кнопку добавления
  }

  onUserSelect(user: any) {
    this.asideIndex = 2;
    this.selectedUser = user;
    this.selectedRowId = user.userId; // Устанавливаем ID выделенной строки
  }

  updateUser(updatedUser: UserRegister) {
    const index = this.users.findIndex(user => user.userId === updatedUser.userId);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }
}