import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.http.get<any>('/api/admins').subscribe({
      next: (response) => {
        let data = response.data || response;
        this.admins = data.map((admin: Admin) => ({
          ...admin,
          admin_password_hash: '********'
        }));
      },
      error: (err) => console.error('Ошибка загрузки:', err)
    });
  }

  onAddAdminBtn(): void {
    this.asideIndex = 1;
    this.selectedAdmin = null;
  }

  onAdminSelect(admin: Admin): void {
    this.asideIndex = 2;
    this.selectedAdmin = admin;
  }

  onAdminAdded(newAdmin: any): void {
    this.admins.push({
      ...newAdmin,
      admin_password_hash: '********'
    });
    this.asideIndex = 0;
  }

  onAdminUpdated(event: any): void {
    this.asideIndex = 0;
    this.selectedAdmin = null;
    this.loadAdmins();
  }
}
