export interface User {
  id: string;
  email: string;
  password: string;
  created_at: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}
