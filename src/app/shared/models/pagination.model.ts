// shared/models/pagination.model.ts
export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}