export class Company{
  companyId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  url: string;
  realm: string;
  companyData;

  constructor(companyId: string, name: string, email: string, phone: string,
              address: string, city: string, state: string, zip: string,
              url: string, realm: string) {
    this.companyId = companyId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.url = url;
    this.realm = realm;
  }
}
