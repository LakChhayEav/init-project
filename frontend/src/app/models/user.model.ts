export interface Permission {
  id?: number;
  name: string;
  description: string;
}

export interface Role {
  id?: number;
  name: string;
  permissions?: Permission[];
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  enabled: boolean;
  createdAt?: string;
  roles?: Role[];
}
