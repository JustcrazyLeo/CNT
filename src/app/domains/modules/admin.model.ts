// domains/modules/admin.model.ts

export interface Admin {
  adminId: string | number;
  adminLogin: string;
  adminPassword: string;
  adminEnabled: boolean;
  adminFirstName: string;
  adminLastName: string;
  adminPatronymic?: string;
  adminEmail?: string;
  adminRole: 'superadmin' | 'admin' | 'moderator';
  adminCreateDate: string | Date;
  adminLastLogin?: string | Date;
}
