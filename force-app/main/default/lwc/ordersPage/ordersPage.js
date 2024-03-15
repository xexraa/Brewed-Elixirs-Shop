import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getConfirmedOrders from "@salesforce/apex/OrdersPageController.getConfirmedOrders";

import * as LABELS from "c/labels";

export default class OrdersPage extends LightningElement {
  label = LABELS;

  isLoading = true;
  isOrdersFullyLoaded = false;

  ordersResultData;
  orders = [];

  @wire(getConfirmedOrders)
  wiredGetConfirmedOrders(result) {
    this.isOrdersFullyLoaded = false;
    this.isLoading = true;
    this.ordersResultData = result;

    if (result.data) {
      this.orders = result.data;
      this.isOrdersFullyLoaded = true;
    } else if (result.error) {
      this.displayToast(
        result.error.body.message || this.label.TOAST_Error,
        "error"
      );
    }

    this.isLoading = false;
  }

  connectedCallback() {
    this.refreshData();
  }

  // Refresh data in cmp
  refreshData() {
    this.isLoading = true;

    refreshApex(this.ordersResultData)
      .catch((error) => {
        this.displayToast(
          error.body.message || this.label.TOAST_Error,
          "error"
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // Toast message builder
  showToastMessage(title, variant) {
    return new ShowToastEvent({
      title: title,
      variant: variant
    });
  }

  // General toast error message
  displayToast(message, variant) {
    const toastEvent = this.showToastMessage(message, variant);
    this.dispatchEvent(toastEvent);
  }

  get isOrdersEmpty() {
    return this.orders.length === 0 ? true : false;
  }
}
