export interface PageRequest {
  page: number;
  size: number;
}

export interface PageResponse<T> {
  content: T[];
  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}
