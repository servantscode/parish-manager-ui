import { Family } from './family';

export class FamilyResponse {
  start: number;
  count: number;
  totalResults: number;
  results: Family[];
}
