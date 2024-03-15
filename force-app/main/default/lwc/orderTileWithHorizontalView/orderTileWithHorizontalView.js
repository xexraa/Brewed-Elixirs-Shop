import { LightningElement, api } from "lwc";

export default class OrderTileWithHorizontalView extends LightningElement {
  @api order;
  @api nr_label;

  status;
  boughtDate;
  orderNr;
  totalAmount;
  currencyIsoCode;
  orderItems = [];

  connectedCallback() {
    this.populateInitialValues(this.order);
  }

  populateInitialValues(result) {
    this.status = this.getFieldValue(result.Status);
    this.boughtDate = new Date(result.EffectiveDate).toLocaleDateString();
    this.orderNr = this.getFieldValue(result.OrderNumber);
    this.totalAmount = this.getFieldValue(
      parseFloat(result.TotalAmount).toFixed(2)
    );
    this.currencyIsoCode = this.getFieldValue(result.CurrencyIsoCode);
    if (result.OrderItems) {
      this.orderItems = result.OrderItems.map((item) => {
        return {
          ...item,
          UnitPrice: parseFloat(item.UnitPrice).toFixed(2)
        };
      });
    }
  }

  getFieldValue(field) {
    return typeof field === "undefined" ? "" : field;
  }

  get isOrderItemsEmpty() {
    return this.orderItems.length === 0 ? false : true;
  }
}
