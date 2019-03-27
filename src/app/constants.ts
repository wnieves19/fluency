import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public CASH_DESCRIPTION = "Cash and cash equivalents refer to the line item on the balance sheet that reports the value of a company's assets that are cash or can be converted into cash immediately. These include bank accounts, marketable securities, commercial paper, Treasury bills and short-term government bonds with a maturity date of three months or less. Marketable securities and money market holdings are considered cash equivalents because they are liquid and not subject to material fluctuations in value."
  public RECEIVABLE_DESCRIPTION = "Accounts receivable is the balance of money due to a firm for goods or services delivered or used but not yet paid for by customers. Said another way, account receivable are amounts of money owed by customers to another entity for goods or services delivered or used on credit but not yet paid for by clients."
  public PAYABLE_DESCRIPTION = "Accounts payable (AP) is an accounting entry that represents a company's obligation to pay off a short-term debt to its creditors or suppliers. It appears on the balance sheet under the current liabilities. Another common usage of AP refers to a business department or division that is responsible for making payments owed by the company to suppliers and other creditors."
  public INVENTORY_DESCRIPTION = "Inventory is the term for the goods available for sale and raw materials used to produce goods available for sale. Inventory represents one of the most important assets of a business because the turnover of inventory represents one of the primary sources of revenue generation and subsequent earnings for the company's shareholders."
}
