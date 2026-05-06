import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../domains/users/services/admin.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    admin_login: '',
    admin_password: ''
  };
  loading = false;
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.admin_login || !this.credentials.admin_password) {
      this.errorMessage = 'Введите логин и пароль';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.adminService.login(this.credentials).subscribe({
      next: (response: any) => {
        console.log('Успешный вход:', response);

        // Сохраняем флаг в localStorage (временное решение)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('admin_login', this.credentials.admin_login);

        this.router.navigate(['/administration/admins']);
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка:', err);
        this.errorMessage = 'Неверный логин или пароль';
        this.loading = false;
      }
    });
  }
}
