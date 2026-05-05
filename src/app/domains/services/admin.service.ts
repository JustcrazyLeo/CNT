// domains/services/admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from '../modules/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admins'; // замените на ваш URL

  constructor(private http: HttpClient) {}

  /**
   * Получение всех администраторов
   */
  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrl);
  }

  /**
   * Получение администратора по ID
   */
  getAdminById(adminId: string | number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/${adminId}`);
  }

  /**
   * Создание нового администратора
   */
  createAdmin(admin: Omit<Admin, 'adminId'>): Observable<Admin> {
    return this.http.post<Admin>(this.apiUrl, admin);
  }

  /**
   * Обновление администратора
   */
  updateAdmin(adminId: string | number, admin: Partial<Admin>): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/${adminId}`, admin);
  }

  /**
   * Удаление администратора
   */
  deleteAdmin(adminId: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${adminId}`);
  }
}
