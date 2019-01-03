export class Donation {
  id: number;
  familyId: number;
  amount: number
  donationDate: Date;
  donationType: string;
  checkNumber: number;
  transactionId: number;

  static template(): Donation {
    var template = new Donation();
    template.id=0;
    template.familyId=0;
    template.amount=0;
    template.donationDate=new Date();
    template.donationType ="";
    template.checkNumber=0;
    template.transactionId=0;
    return template;
  }
}
