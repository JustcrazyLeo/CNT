import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../domains/users/services/admin.service';
import { Admin, CreateAdminDto, UpdateAdminDto } from '../../../../domains/users/modules/admin.model';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  admins: Admin[] = [];
  loading = false;
  showModal = false;
  isEditMode = false;
  currentAdminId: number | null = null;

  formData: any = {
    admin_login: '',
    admin_password: '',
    is_active_admin: true,
    admin_birth_date: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loading = true;
    this.adminService.getAllAdmins(true).subscribe({
      next: (data) => {
        this.admins = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки:', err);
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentAdminId = null;
    this.formData = {
      admin_login: '',
      admin_password: '',
      is_active_admin: true,
      admin_birth_date: ''
    };
    this.showModal = true;
  }

  openEditModal(admin: Admin): void {
    this.isEditMode = true;
    this.currentAdminId = admin.admin_id;
    this.formData = {
      admin_login: admin.admin_login,
      admin_password: '',
      is_active_admin: admin.is_active_admin,
      admin_birth_date: admin.admin_birth_date || ''
    };
    this.showModal = true;
  }

  saveAdmin(): void {
    if (!this.formData.admin_login) {
      alert('Введите логин');
      return;
    }

    if (this.isEditMode) {
      const updateData: UpdateAdminDto = {
        admin_login: this.formData.admin_login,
        is_active_admin: this.formData.is_active_admin,
        admin_birth_date: this.formData.admin_birth_date || null
      };
      if (this.formData.admin_password) {
        updateData.admin_password = this.formData.admin_password;
      }
      this.adminService.updateAdmin(this.currentAdminId!, updateData).subscribe({
        next: () => {
          this.loadAdmins();
          this.closeModal();
        },
        error: (err) => console.error('Ошибка обновления:', err)
      });
    } else {
      if (!this.formData.admin_password) {
        alert('Введите пароль');
        return;
      }
      const createData: CreateAdminDto = {
        admin_login: this.formData.admin_login,
        admin_password: this.formData.admin_password,
        is_active_admin: this.formData.is_active_admin,
        admin_birth_date: this.formData.admin_birth_date || null
      };
      this.adminService.createAdmin(createData).subscribe({
        next: () => {
          this.loadAdmins();
          this.closeModal();
        },
        error: (err) => {
          console.error('Ошибка создания:', err);
          alert('Ошибка: ' + (err.error?.detail || 'Неизвестная ошибка'));
        }
      });
    }
  }

  deleteAdmin(id: number): void {
    if (confirm('Удалить администратора?')) {
      this.adminService.deleteAdmin(id, true).subscribe({
        next: () => this.loadAdmins(),
        error: (err) => console.error('Ошибка удаления:', err)
      });
  }
}

  closeModal(): void {
    this.showModal = false;
  }
}
