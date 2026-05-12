import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-admin-form',
  templateUrl: './add-admin-form.component.html',
  styleUrls: ['./add-admin-form.component.css']
})
export class AddAdminFormComponent implements OnInit {
  @Output() adminAdded = new EventEmitter<boolean>();
  
  addAdminForm: FormGroup = new FormGroup({});

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.addAdminForm = new FormGroup({
      adminLogin: new FormControl('', [Validators.required]),
      adminPassword: new FormControl('', [Validators.required]),
      adminBirthDate: new FormControl('')
    });
  }

  addNewAdmin() {
    if (this.addAdminForm.invalid) return;

    const newAdmin = {
      admin_login: this.addAdminForm.get('adminLogin')?.value,
      admin_password_hash: this.addAdminForm.get('adminPassword')?.value,
      admin_birth_date: this.addAdminForm.get('adminBirthDate')?.value || '2000-01-01 00:00:00',
      is_active_admin: true
    };

    this.http.post('/api/admins', newAdmin).subscribe({
      next: (response: any) => {
        console.log('Админ добавлен:', response);
        this.addAdminForm.reset();
        this.adminAdded.emit(true);
      },
      error: (err) => console.error('Ошибка:', err)
    });
  }

  getFieldErrors(fieldName: string) {
    const field = this.addAdminForm.get(fieldName);
    if (field?.touched && field?.invalid) return field.errors;
    return null;
  }
}