export class Company{
  companyId: string;
  companyName: string;
  currency: string;


  constructor(companyId: string, companyName: string, currency: string) {
    this.companyId = companyId;
    this.companyName = companyName;
    this.currency = currency;
  }
}
