export class AccountHistory{
  accountName: string;
  property: string;
  component: string;
  action: string;
  categoryType: string;
  history = new Array();

  constructor(name: string, property: string, component: string, action: string, categoryType: string){
    this.accountName = name;
    this.property = property;
    this.component = component;
    this.action = action;
    this.categoryType = categoryType;
  }
}
