import { Person } from './person';

export class PersonResponse {
  start: number;
  count: number;
  totalResults: number;
  results: Person[];
}
