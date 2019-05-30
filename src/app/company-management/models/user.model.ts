export class UserModel{
  id:string;
  email:string;
  firstName:string;
  lastName:string;
  phone:string;
  private _role: string

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }
}
