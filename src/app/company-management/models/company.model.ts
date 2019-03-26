import {TrialBalance} from './trial-balance.model';

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
  trialBalanceList: TrialBalance[];

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
    this.trialBalanceList = [];
  }
}
