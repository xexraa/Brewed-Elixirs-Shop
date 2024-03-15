import { LightningElement, wire, api } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import {
  subscribe,
  unsubscribe,
  MessageContext
} from "lightning/messageService";

import cartChanged from "@salesforce/messageChannel/CartUpdate__c";

import getOrderTotalQuantity from "@salesforce/apex/NavBarCartController.getOrderTotalQuantity";
import createNewOrUpdateOrder from "@salesforce/apex/NavBarCartController.createNewOrUpdateOrder";

export default class NavBarCart extends NavigationMixin(LightningElement) {
  isLoading = false;
  subscription = null;
  totalProductsAmount = 0;

  orderResultData;

  @api cart_label;
  @api toast_error_label;

  @wire(MessageContext)
  messageContext;

  @wire(getOrderTotalQuantity)
  wiredGetOrderTotalQuantity(result) {
    this.isLoading = true;
    this.orderResultData = result;

    if (result.data) {
      this.totalProductsAmount = result.data;
    } else if (result.error) {
      this.displayToastError(
        result.error.body.message || this.toast_error_label,
        "error"
      );
    }

    this.isLoading = false;
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        cartChanged,
        (message) => {
          this.handleMessage(message);
        }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // Process the message received
  handleMessage(message) {
    if (message.isChanged) {
      this.refreshData();
    } else {
      this.handleReceivedProduct(message);
    }
  }

  handleReceivedProduct(message) {
    this.isLoading = true;

    createNewOrUpdateOrder({
      productId: message.recordId,
      quantity: message.quantity,
      price: message.price
    })
      .then(() => {
        refreshApex(this.orderResultData);
      })
      .catch((error) => {
        this.displayToast(
          error.body.message || this.toast_error_label,
          "error"
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // Handle open cart
  handleOpenCart() {
    this.navigateToCartPage();
  }

  // Navigate to cart page
  navigateToCartPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: "/cart"
      }
    });
  }

  refreshData() {
    this.isLoading = true;
    this.totalProductsAmount = 0;

    refreshApex(this.orderResultData)
      .catch((error) => {
        this.displayToast(
          error.body.message || this.toast_error_label,
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

  get isCartEmpty() {
    return this.totalProductsAmount === 0 ? false : true;
  }
}
