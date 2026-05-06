import { UserService } from '../../../../../../domains/users/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserRegister } from 'src/app/domains/users/models/user.model';
import { DatePipe } from '@angular/common';

function ageValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const birthDate = new Date(control.value);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return { invalidDate: true };
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18 ? null : { underAge: true };
}

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  if (!value) {
    return null;
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const errors: ValidationErrors = {};

  if (!hasUpperCase) {
    errors['noUpperCase'] = true;
  }

  if (!hasLowerCase) {
    errors['noLowerCase'] = true;
  }

  if (!hasNumber) {
    errors['noNumber'] = true;
  }

  if (!hasSpecialChar) {
    errors['noSpecialChar'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function uniqueLoginValidator(userService: UserService) {
  return (control: AbstractControl): ValidationErrors | null => {
    const login = control.value;
    if (!login || !userService) {
      return null;
    }

    const existingUser = userService.users.find(user =>
      user.userLogin.toLowerCase() === login.toLowerCase()
    );

    return existingUser ? { loginExists: true } : null;
  };
}

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
  providers: [DatePipe]
})
export class AddUserFormComponent implements OnInit {
  addUserForm: FormGroup = new FormGroup({});
  users: UserRegister[] = this.UserService.users;

  constructor(private UserService: UserService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.initAddUserForm();
  }

  initAddUserForm(): void {
    this.addUserForm = new FormGroup({

      userLogin: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9]+$'),
        uniqueLoginValidator(this.UserService)
      ]),

      userPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        passwordValidator
      ]),

      userFirstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zа-яА-ЯёЁ\\s\-]+$')
      ]),

      userLastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zа-яА-ЯёЁ\\s\-]+$')
      ]),

      userPatronymic: new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Zа-яА-ЯёЁ\\s\-]*$')
      ]),

      userCreateDate: new FormControl(''),

      userBirthday: new FormControl('', [
        Validators.required,
        ageValidator
      ])
    });
  }

  addNewUser() {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }

    const newUser: UserRegister = {
      userId: this.users.length + 1,
      userLogin: this.addUserForm.get('userLogin')?.value,
      userPassword: this.addUserForm.get('userPassword')?.value,
      userEnabled: '1',
      userFirstName: this.addUserForm.get('userFirstName')?.value,
      userLastName: this.addUserForm.get('userLastName')?.value,
      userPatronymic: this.addUserForm.get('userPatronymic')?.value || '',
      userCreateDate: this.getCurrentDateTime(),
      userBirthday: this.addUserForm.get('userBirthday')?.value,
    };

    this.users.push(newUser);
    this.addUserForm.reset();
  }

  getFieldErrors(fieldName: string) {
    const field = this.addUserForm.get(fieldName);
    if (field?.touched && field?.invalid) {
      return field.errors;
    }
    return null;
  }

  getCurrentDateTime() {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss') as string;
  }
}
