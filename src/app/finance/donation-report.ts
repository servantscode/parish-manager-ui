export class DonationReport {
  startDate: Date;
  endDate: Date;
  fundId: number;
  totalDonations: number;
  pledged: number;
  unpledged: number;    
}

export class MonthlyDonations {
  month: Date;
  label: string;
  totalDonations: number;
  pledged: number;
  unpledged: number;
}
