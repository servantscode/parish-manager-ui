export class DonationTierReport {
  totalFamiles: number;
  totalDonations: number;
  averageFamilyDonation: number;
  startDate: Date;
  endDate: Date;
  tiers: DonationTier[];  
}

export class DonationTier {
  name: string;
  families: number;
  percentFamilies: number;
  total: number;
  percentTotal: number;
}