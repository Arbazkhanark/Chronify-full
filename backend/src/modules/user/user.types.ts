export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  timezone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
