import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-admin-form',
  templateUrl: './add-admin-form.component.html',
  styleUrls: ['./add-admin-form.component.css']
})
export class AddAdminFormComponent implements OnInit {
  @Output() adminAdded = new EventEmitter<any>();

  addAdminForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.addAdminForm = new FormGroup({
      adminLogin: new FormControl('', [Validators.required, Validators.minLength(2)]),
      adminPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      adminBirthDate: new FormControl('', [Validators.required])
    });
  }

  addNewAdmin() {
    if (this.addAdminForm.invalid) {
      this.addAdminForm.markAllAsTouched();
      return;
    }

    const newAdmin = {
      admin_login: this.addAdminForm.get('adminLogin')?.value,
      admin_password_hash: this.addAdminForm.get('adminPassword')?.value,
      admin_birth_date: this.addAdminForm.get('adminBirthDate')?.value,
      is_active_admin: true,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    this.adminAdded.emit(newAdmin);
    this.addAdminForm.reset();
  }

  getFieldErrors(fieldName: string) {
    const field = this.addAdminForm.get(fieldName);
    if (field?.touched && field?.invalid) return field.errors;
    return null;
  }
}
