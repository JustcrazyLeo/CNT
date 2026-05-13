import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit, OnChanges {
  @Input() selectedAdmin: any = null;
  @Output() adminUpdated = new EventEmitter<any>();

  editAdminForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editAdminForm = this.fb.group({
      adminLogin: ['', [Validators.required, Validators.minLength(2)]],
      adminPassword: [''], // не обязателен при редактировании
      adminBirthDate: ['', [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedAdmin']) {
      this.updateForm();
    }
  }

  updateForm() {
    if (this.selectedAdmin) {
      this.editAdminForm.patchValue({
        adminLogin: this.selectedAdmin.admin_login,
        adminPassword: '',
        adminBirthDate: this.selectedAdmin.admin_birth_date?.split(' ')[0] || '',
        isActive: this.selectedAdmin.is_active_admin
      });
    }
  }

  onSubmit() {
    if (this.editAdminForm.invalid) {
      this.editAdminForm.markAllAsTouched();
      return;
    }
    if (!this.selectedAdmin) return;

    const updated = { ...this.selectedAdmin };
    updated.admin_login = this.editAdminForm.value.adminLogin;
    updated.admin_birth_date = this.editAdminForm.value.adminBirthDate;
    updated.is_active_admin = this.editAdminForm.value.isActive;

    // Если пароль введён – обновляем хеш
    const newPassword = this.editAdminForm.value.adminPassword;
    if (newPassword && newPassword.trim().length >= 6) {
      updated.admin_password_hash = newPassword;
    }

    this.adminUpdated.emit(updated);
  }

  getFieldErrors(fieldName: string) {
    const field = this.editAdminForm.get(fieldName);
    if (field?.touched && field?.invalid) return field.errors;
    return null;
  }
}
