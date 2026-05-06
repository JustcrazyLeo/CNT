export interface UserRegister {
  userId: string | number;
  userLogin: string;
  userPassword: string;
  userEnabled: string | number;
  userFirstName: string;
  userLastName: string;
  userPatronymic: string;
  userCreateDate?: string | Date;
  userBirthday?: string | Date;
}
