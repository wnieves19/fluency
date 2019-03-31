export class AccountHistory{
  accountName: string;
  history = new Array();

  constructor(name: string){
    this.accountName = name;
  }
}
