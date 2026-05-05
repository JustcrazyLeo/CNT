import { UserService } from 'src/app/domains/users/models/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRegister } from 'src/app/domains/users/models/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
  providers: [DatePipe]
})
export class AddUserFormComponent implements OnInit {
  addUserForm: FormGroup = new FormGroup({});
  users: UserRegister[] = this.UserService.users;
  currentYear = new Date().getFullYear();
  minBirthYear = this.currentYear - 100;
  maxBirthYear = this.currentYear - 12;

  constructor(private UserService: UserService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.initAddUserForm();
  }

initAddUserForm(): void {
  this.addUserForm = new FormGroup({
    userLogin: new FormControl('', [Validators.required, Validators.minLength(2)]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    ]),
    userFirstName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[а-яА-ЯёЁ]+$/),
      Validators.maxLength(50)
    ]),
    userLastName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[а-яА-ЯёЁ]+$/),
      Validators.maxLength(50)
    ]),
    userPatronymic: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[а-яА-ЯёЁ]+$/),
      Validators.maxLength(50)
    ]),
    userCreateDate: new FormControl(''),
    userBirthday: new FormControl('', [
      Validators.required,
      this.validateBirthDate.bind(this)
    ]),
    userEnabled: new FormControl(false)
  });
}

  validateBirthDate(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const currentDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(this.minBirthYear);
    const maxDate = new Date();
    maxDate.setFullYear(this.maxBirthYear);

    if (birthDate > currentDate) {
      return { 'futureDate': true };
    }

    if (birthDate < minDate) {
      return { 'tooOld': true };
    }

    if (birthDate > maxDate) {
      return { 'tooYoung': true };
    }

    return null;
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
      userEnabled: this.addUserForm.get('userEnabled')?.value,
      userFirstName: this.addUserForm.get('userFirstName')?.value,
      userLastName: this.addUserForm.get('userLastName')?.value,
      userPatronymic: this.addUserForm.get('userPatronymic')?.value,
      userCreateDate: this.getCurrentDateTime(),
      userBirthday: this.addUserForm.get('userBirthday')?.value,
    };

    this.users.push(newUser);
    this.addUserForm.reset({
      userEnabled: false
    });
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