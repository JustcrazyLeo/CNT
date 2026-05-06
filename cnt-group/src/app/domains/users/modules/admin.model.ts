// admin.model.ts
// Модель администратора, соответствует структуре таблицы admins в базе данных

export interface Admin {
  admin_id: number;
  admin_login: string;
  is_active_admin: boolean;
  admin_birth_date: string | null;
  created_at: string;
}

// Для создания нового администратора
export interface CreateAdminDto {
  admin_login: string;
  admin_password: string;
  is_active_admin?: boolean;
  admin_birth_date?: string | null;
}

// Для обновления администратора
export interface UpdateAdminDto {
  admin_login?: string;
  admin_password?: string;
  is_active_admin?: boolean;
  admin_birth_date?: string | null;
}

// Для авторизации
export interface AdminLoginDto {
  admin_login: string;
  admin_password: string;
}

// Ответ от сервера при авторизации
export interface AdminLoginResponse {
  ok: boolean;
  admin: Admin;
  admin_session_id?: string;
}