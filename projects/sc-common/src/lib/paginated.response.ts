export class PaginatedResponse<T> {
  start: number;
  count: number;
  totalResults: number;
  results: T[];
}