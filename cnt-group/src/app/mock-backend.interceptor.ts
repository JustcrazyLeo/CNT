import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  // «База данных» в оперативной памяти
  private admins = [
    {
      admin_id: 1,
      admin_login: 'admin',
      is_active_admin: true,
      admin_birth_date: '1990-01-01',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      admin_id: 2,
      admin_login: 'manager',
      is_active_admin: false,
      admin_birth_date: null,
      created_at: '2024-02-20T12:00:00Z'
    },
    {
      admin_id: 3,
      admin_login: 'superadmin',
      is_active_admin: true,
      admin_birth_date: '1985-06-15',
      created_at: '2023-12-01T08:00:00Z'
    }
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method } = req;

    // Получить список администраторов (GET /api/admins)
    if (url.includes('/api/admins') && method === 'GET' && !url.match(/\/api\/admins\/\d+/)) {
      const includeInactive = req.params.get('include_inactive');
      const filtered = includeInactive === 'true' ? this.admins : this.admins.filter(a => a.is_active_admin);
      return of(new HttpResponse({ status: 200, body: { admins: filtered } }));
    }

    // Получить одного администратора (GET /api/admins/:id)
    if (url.match(/\/api\/admins\/\d+/) && method === 'GET') {
      const id = parseInt(url.split('/').pop()!, 10);
      const admin = this.admins.find(a => a.admin_id === id);
      return admin
        ? of(new HttpResponse({ status: 200, body: admin }))
        : of(new HttpResponse({ status: 404 }));
    }

    // Создать администратора (POST /api/admins)
    if (url.includes('/api/admins') && method === 'POST') {
      const newId = Math.max(...this.admins.map(a => a.admin_id), 0) + 1;
      const newAdmin = { ...req.body, admin_id: newId, created_at: new Date().toISOString() };
      this.admins.push(newAdmin);
      return of(new HttpResponse({ status: 201, body: newAdmin }));
    }

    // Обновить администратора (PATCH /api/admins/:id)
    if (url.match(/\/api\/admins\/\d+/) && method === 'PATCH') {
      const id = parseInt(url.split('/').pop()!, 10);
      const index = this.admins.findIndex(a => a.admin_id === id);
      if (index !== -1) {
        this.admins[index] = { ...this.admins[index], ...req.body };
        return of(new HttpResponse({ status: 200, body: this.admins[index] }));
      }
      return of(new HttpResponse({ status: 404 }));
    }

    // Удалить администратора (DELETE /api/admins/:id)
    if (url.match(/\/api\/admins\/\d+/) && method === 'DELETE') {
      const id = parseInt(url.split('/').pop()!, 10);
      const index = this.admins.findIndex(a => a.admin_id === id);
      if (index !== -1) {
        this.admins.splice(index, 1);
        return of(new HttpResponse({ status: 200, body: {} }));
      }
      return of(new HttpResponse({ status: 404 }));
    }

    // Вход в систему (POST /api/admins/admin_sign_in)
    if (url.includes('/api/admins/admin_sign_in') && method === 'POST') {
      const { admin_login, admin_password } = req.body;
      const admin = this.admins.find(a => a.admin_login === admin_login);
      if (admin && admin_password) {
        return of(new HttpResponse({
          status: 200,
          body: {
            ok: true,
            admin: admin,
            admin_session_id: 'mock-session-' + Date.now()
          }
        }));
      }
      return of(new HttpResponse({ status: 401, body: { ok: false, detail: 'Неверные данные' } }));
    }

    // Выход (POST /api/admins/admin_sign_out)
    if (url.includes('/api/admins/admin_sign_out') && method === 'POST') {
      return of(new HttpResponse({ status: 200, body: { ok: true } }));
    }

    // Все остальные запросы обрабатываются стандартно
    return next.handle(req);
  }
}
