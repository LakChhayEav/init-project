export interface AuditFields {
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}

export interface Permission extends AuditFields {
  id?: number;
  name: string;
  description: string;
}

export interface Role extends AuditFields {
  id?: number;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface User extends AuditFields {
  id?: number;
  username: string;
  email: string;
  password?: string;
  enabled: boolean;
  roles?: Role[];
}
