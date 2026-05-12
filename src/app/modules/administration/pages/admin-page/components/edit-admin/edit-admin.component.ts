import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit, OnChanges {
  @Input() selectedAdmin: any = null;
  @Output() adminUpdated = new EventEmitter<any>();

  editAdminForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.editAdminForm = this.fb.group({
      adminLogin: ['', [Validators.required]],
      adminPassword: ['', [Validators.required]],
      adminBirthDate: [''],
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
    if (this.editAdminForm.valid && this.selectedAdmin) {
      const updated = {
        ...this.selectedAdmin,
        admin_login: this.editAdminForm.value.adminLogin,
        admin_birth_date: this.editAdminForm.value.adminBirthDate,
        is_active_admin: this.editAdminForm.value.isActive
      };
      this.adminUpdated.emit(updated);
    }
  }
}