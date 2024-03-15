import { LightningElement, wire, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { publish, MessageContext } from "lightning/messageService";

import cartChanged from "@salesforce/messageChannel/CartUpdate__c";

import * as LABELS from "c/labels";

export default class ProductTile extends NavigationMixin(LightningElement) {
  label = LABELS;

  @api product;

  @wire(MessageContext)
  messageContext;

  navigateToProductDetails() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/product?id=${this.product.productId}`
      }
    });
  }

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const payload = { recordId: this.product.productId, quantity: 1, price: this.product.price };

    publish(this.messageContext, cartChanged, payload);
  }

  handleHeartClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
