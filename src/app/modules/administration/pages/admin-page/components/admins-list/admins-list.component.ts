import { Component, OnInit } from '@angular/core';

interface Admin {
  admin_id: number;
  admin_login: string;
  admin_password_hash: string;
  is_active_admin: any;
  admin_birth_date: string;
  created_at: string;
}

@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.component.html',
  styleUrls: ['./admins-list.component.css']
})
export class AdminsListComponent implements OnInit {
  asideIndex: number = 0;
  admins: Admin[] = [];
  selectedAdmin: Admin | null = null;

  ngOnInit(): void {
    this.loadAdmins();
  }

  // Загрузка из localStorage
  loadAdmins(): void {
    const stored = localStorage.getItem('admins');
    if (stored) {
      this.admins = JSON.parse(stored);
    } else {
      // Начальные тестовые данные
      this.admins = [
        {
          admin_id: 1,
          admin_login: 'admin1',
          admin_password_hash: '********',
          is_active_admin: true,
          admin_birth_date: '1990-01-01',
          created_at: '2023-01-01 10:00:00'
        },
        {
          admin_id: 2,
          admin_login: 'superadmin',
          admin_password_hash: '********',
          is_active_admin: true,
          admin_birth_date: '1985-05-15',
          created_at: '2023-02-01 12:00:00'
        }
      ];
      this.saveToLocalStorage();
    }
    // Маскируем пароли для отображения
    this.admins = this.admins.map(admin => ({
      ...admin,
      admin_password_hash: '********'
    }));
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('admins', JSON.stringify(this.admins));
  }

  // Добавление нового администратора
  onAdminAdded(newAdmin: any): void {
    // Получаем максимальный ID
    const maxId = this.admins.length > 0 ? Math.max(...this.admins.map(a => a.admin_id)) : 0;
    const adminToAdd: Admin = {
      admin_id: maxId + 1,
      admin_login: newAdmin.admin_login,
      admin_password_hash: newAdmin.admin_password_hash,
      is_active_admin: newAdmin.is_active_admin,
      admin_birth_date: newAdmin.admin_birth_date,
      created_at: newAdmin.created_at || new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    this.admins.push(adminToAdd);
    this.saveToLocalStorage();
    // Перезагружаем с маскировкой паролей
    this.loadAdmins();
    this.asideIndex = 0;
    this.selectedAdmin = null;
  }

  // Обновление существующего администратора
  onAdminUpdated(updatedAdmin: Admin): void {
    const index = this.admins.findIndex(a => a.admin_id === updatedAdmin.admin_id);
    if (index !== -1) {
      this.admins[index] = { ...updatedAdmin };
      this.saveToLocalStorage();
    }
    this.loadAdmins();
    this.asideIndex = 0;
    this.selectedAdmin = null;
  }

  onAddAdminBtn(): void {
    this.asideIndex = 1;
    this.selectedAdmin = null;
  }

  onAdminSelect(admin: Admin): void {
    this.asideIndex = 2;
    // Передаём копию с реальным паролем (из хранилища, а не замаскированным)
    const realAdmin = JSON.parse(localStorage.getItem('admins') || '[]')
      .find((a: Admin) => a.admin_id === admin.admin_id);
    this.selectedAdmin = realAdmin || admin;
  }
}
