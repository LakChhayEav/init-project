export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  pagination?: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}
