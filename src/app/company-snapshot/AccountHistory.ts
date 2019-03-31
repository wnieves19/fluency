export class AccountHistory{
  accountName: string;
  property
  history = new Array();

  constructor(name: string, property: string){
    this.accountName = name;
    this.property = property;
  }
}
