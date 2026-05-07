import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Admin, CreateAdminDto, UpdateAdminDto, AdminLoginDto, AdminLoginResponse } from '../modules/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAllAdmins(includeInactive?: boolean): Observable<Admin[]> {
    let params = new HttpParams();
    if (includeInactive !== undefined) {
      params = params.set('include_inactive', includeInactive.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/admins`, { params, withCredentials: true })
      .pipe(map(response => response.admins));
  }

  getAdminById(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/admins/${id}`, { withCredentials: true });
  }

  createAdmin(data: CreateAdminDto): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/admins`, data, { withCredentials: true });
  }

  updateAdmin(id: number, data: UpdateAdminDto): Observable<Admin> {
    return this.http.patch<Admin>(`${this.apiUrl}/admins/${id}`, data, { withCredentials: true });
  }

  deleteAdmin(id: number, hard: boolean = false): Observable<any> {
    let params = new HttpParams().set('hard', hard.toString());
    return this.http.delete(`${this.apiUrl}/admins/${id}`, { params, withCredentials: true });
  }

  login(loginData: AdminLoginDto): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/admins/admin_sign_in`, loginData, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/admins/admin_sign_out`, {}, { withCredentials: true });
  }
}
