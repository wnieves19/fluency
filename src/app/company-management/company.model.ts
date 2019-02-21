export class Company{
  companyId: string;
  name: string;
  email: string;


  constructor(companyId: string, companyName: string, email: string) {
    this.companyId = companyId;
    this.name = companyName;
    this.email = email;
  }
}
