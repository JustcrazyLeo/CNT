import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.component.html',
  styleUrls: ['./admins-list.component.css']
})
export class AdminsListComponent implements OnInit {
  asideIndex: number = 0;
  admins: any[] = [];
  selectedAdmin: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  get adminsWithActions(): any[] {
    return this.admins.map(admin => ({
      ...admin,
      admin_password_hash: '********'
    }));
  }

  loadAdmins(): void {
    this.http.get<any>('/api/admins').subscribe({
      next: (response) => {
        this.admins = response.data || response;
      },
      error: (err) => console.error('Ошибка загрузки:', err)
    });
  }

  onAddAdminBtn(): void {
    this.asideIndex = 1;
  }

  onAdminSelect(admin: any): void {
    this.selectedAdmin = admin;
    this.asideIndex = 2;
  }

  onAdminAdded(event: any): void {
    this.asideIndex = 0;
    this.loadAdmins();
  }

  onAdminUpdated(event: any): void {
    this.asideIndex = 0;
    this.selectedAdmin = null;
    this.loadAdmins();
  }

  deleteAdmin(id: number): void {
    if (confirm('Удалить администратора?')) {
      this.http.delete(`/api/admins/${id}`).subscribe({
        next: () => this.loadAdmins(),
        error: (err) => console.error('Ошибка удаления:', err)
      });
    }
  }
}
