import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from '../domains/modules/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = '/api/admins';

  constructor(private http: HttpClient) {}

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrl);
  }
}
