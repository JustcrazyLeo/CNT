import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRegister } from 'src/app/domains/users/models/user.model';
import { UserService } from 'src/app/domains/users/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, OnChanges {
  @Input() selectedUser: UserRegister | null = null; // при клике на юзера в таблице получаем его
  @Output() userUpdate = new EventEmitter<UserRegister>(); // нужно для отправки обновленных данных пользователя

  editUserForm: FormGroup;

  isAdmin = false;
  isStudent = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.editUserForm = this.fb.group({
      userLogin: ['', [Validators.required, Validators.minLength(2)]],
      userPassword: ['', [Validators.required]],
      userFirstName: ['', [Validators.required]],
      userLastName: ['', [Validators.required]],
      userPatronymic: [''],
      userCreateDate: ['', [Validators.required]],
      userBirthday: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser'] && changes['selectedUser'].currentValue) {
      this.updateForm();
    }
  }

  // обновление формы при изменении выбранного юзера
  updateForm() {
    if (this.selectedUser) {
      this.editUserForm.patchValue({
        userLogin: this.selectedUser.userLogin,
        userPassword: this.selectedUser.userPassword,
        userFirstName: this.selectedUser.userFirstName,
        userLastName: this.selectedUser.userLastName,
        userPatronymic: this.selectedUser.userPatronymic,
        userCreateDate: this.selectedUser.userCreateDate,
        userBirthday: this.formatDate(this.selectedUser.userBirthday)
      });
      this.loadUserRoles();
    }
  }

  loadUserRoles() {
  if (this.selectedUser) {
    this.userService.getUserRoles(this.selectedUser.userId).subscribe(roles => {
      this.isAdmin = roles.includes('admin');
      this.isStudent = roles.includes('student');
    });
  }
}

  // получение ошибок валидации
  getFieldErrors(field: string) {
    return this.editUserForm.get(field)?.errors;
  }

  // отправка обновленных данных юзера
  onSubmit() {
    if (this.editUserForm.valid) {
      const updatedUser = {
        ...this.selectedUser,
        ...this.editUserForm.value
      };
      this.userUpdate.emit(updatedUser);
    }
  }

  onRoleChange(role: string, event: any) {
  const isChecked = event.target.checked;
  if (role === 'admin') {
    this.isAdmin = isChecked;
  } else if (role === 'student') {
    this.isStudent = isChecked;
  }
}

onSubmitRoles() {
  if (this.selectedUser) {
    const roles = [];
    if (this.isAdmin) roles.push('admin');
    if (this.isStudent) roles.push('student');
    this.userService.updateUserRoles(this.selectedUser.userId, roles).subscribe(response => {
      console.log('Roles updated:', response);
    }, error => {
      console.error('Error updating roles:', error);
    });
  }
}

  // обязательное форматирование даты для birthday
  formatDate(date: string | Date | undefined): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
