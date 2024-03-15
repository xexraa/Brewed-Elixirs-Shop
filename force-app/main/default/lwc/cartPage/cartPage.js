import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { publish, MessageContext } from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

import cartChanged from "@salesforce/messageChannel/CartUpdate__c";

import getDraftOrder from "@salesforce/apex/CartPageController.getDraftOrder";
import deleteDraftOrder from "@salesforce/apex/CartPageController.deleteDraftOrder";
import deleteOrderItem from "@salesforce/apex/CartPageController.deleteOrderItem";
import updateOrderItemQuantity from "@salesforce/apex/CartPageController.updateOrderItemQuantity";
import updateOrderStatus from "@salesforce/apex/CartPageController.updateOrderStatus";

import * as LABELS from "c/labels";
import { ORDER_IN_PACKING_STATUS } from "c/constants";

export default class CartPage extends NavigationMixin(LightningElement) {
  label = LABELS;

  isLoading = true;
  isProductsFullyLoaded = false;
  totalProductsAmount = 0;
  totalPriceAmount = 0;

  draftOrderResultData;
  orderId;
  products;
  currencyIsoCode;

  @wire(MessageContext)
  messageContext;

  @wire(getDraftOrder)
  wiredGetDraftOrder(result) {
    this.isLoading = true;
    this.isProductsFullyLoaded = false;
    this.draftOrderResultData = result;

    if (result.data && Object.keys(result.data).length !== 0) {
      Object.keys(result.data).forEach((orderId) => {
        this.orderId = orderId;
      });

      this.products = result.data[this.orderId].map((product) => {
        this.currencyIsoCode = product.currencyIsoCode;
        let modifiedProduct = {
          ...product,
          price: parseFloat(product.price).toFixed(2),
          totalPrice: parseFloat(product.totalPrice).toFixed(2)
        };
        return modifiedProduct;
      });

      this.countTotalAmountOfProductsAndPrice();
    } else if (result.data && Object.keys(result.data).length === 0) {
      this.isProductsFullyLoaded = true;
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

  countTotalAmountOfProductsAndPrice() {
    this.isProductsFullyLoaded = false;
    let totalAmount = 0;
    let totalQuantity = 0;

    if (this.products) {
      this.products.forEach((product) => {
        totalAmount += parseFloat(product.totalPrice);
        totalQuantity += parseFloat(product.quantity);
      });
    }
    this.totalPriceAmount = totalAmount.toFixed(2);
    this.totalProductsAmount = totalQuantity;

    this.isProductsFullyLoaded = true;
  }

  // Handle quantity selection event from child
  handleSelectedEvent(event) {
    const orderItemId = event.detail.orderItemId;
    const quantity = parseFloat(event.detail.quantity);
    this.initiateUpdateOrderItemQuantity(orderItemId, quantity);
  }

  // Initiate apex method to update order item quantity
  initiateUpdateOrderItemQuantity(orderItemId, quantity) {
    this.isLoading = true;

    updateOrderItemQuantity({ orderItemId: orderItemId, quantity: quantity })
      .then(() => {
        this.refreshData();
      })
      .then(() => {
        publish(this.messageContext, cartChanged, { isChanged: true });
      })
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

  // Handle delete all button event
  handleTrashIconClick() {
    this.initiateDeleteDraftOrder();
  }

  // Initiate apex method to delete 'Draft' order
  initiateDeleteDraftOrder() {
    this.isLoading = true;

    deleteDraftOrder({ orderId: this.orderId })
      .then(() => {
        this.totalProductsAmount = 0;
        this.refreshData();
      })
      .then(() => {
        publish(this.messageContext, cartChanged, { isChanged: true });
      })
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

  // Handle delete event from child cmp
  handleTrashClickEvent(event) {
    const orderItemId = event.detail.orderItemId;
    this.initiateDeleteOrderItem(orderItemId);
  }

  // Initiate apex method to delete order item
  initiateDeleteOrderItem(orderItemId) {
    this.isLoading = true;

    deleteOrderItem({ orderItemId: orderItemId })
      .then(() => {
        this.refreshData();
      })
      .then(() => {
        publish(this.messageContext, cartChanged, { isChanged: true });
      })
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

  // Handle confirm button click
  handleConfirmOrder() {
    this.initiateUpdateOrderStatus();
  }

  // Initiate apex method to change Order status from 'Draft' to 'In Packing'
  initiateUpdateOrderStatus() {
    this.isLoading = true;
    let orderData = { sobjectType: "Order" };
    orderData.Id = this.orderId;
    orderData.Status = ORDER_IN_PACKING_STATUS;

    updateOrderStatus({ order: orderData })
      .then(() => {
        this.refreshData();
      })
      .then(() => {
        publish(this.messageContext, cartChanged, { isChanged: true });
        this.navigateToOrderPage();
        this.displayToast(this.label.TOAST_Success_OrderInPacking, "success");
      })
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

  navigateToOrderPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: "/orders"
      }
    });
  }

  // Refresh data in cmp
  refreshData() {
    this.isLoading = true;

    refreshApex(this.draftOrderResultData)
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

  get isCartEmpty() {
    return this.totalProductsAmount === 0 ? true : false;
  }
}
