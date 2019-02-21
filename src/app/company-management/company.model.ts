export class Company{
  companyId: string;
  name: string;
  email: string;
  realm: string;
  address: string;
  state: string;
  city: string;
  zip: string;

  constructor(companyId: string, name: string, email: string, realm: string) {
    this.companyId = companyId;
    this.name = name;
    this.email = email;
    this.realm = realm;
  }
}
