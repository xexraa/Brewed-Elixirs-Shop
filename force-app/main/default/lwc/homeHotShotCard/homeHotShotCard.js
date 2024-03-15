import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import * as LABELS from "c/labels";
import { DISCOUNTS } from "c/constants";

export default class HomeHotShotCard extends NavigationMixin(LightningElement) {
  label = LABELS;

  discountProductId;
  discountProductName;
  discountProductOriginalPrice;
  discountProductPrice;
  discountProductCurrency;
  discountProductImageUrl;
  selectedDiscountLabel;

  hours;
  minutes;
  seconds;
  remainingTime;

  @api product;

  connectedCallback() {
    const countdownDuration = 2 * 3600;
    this.remainingTime = countdownDuration;
    this.updateCountdown();
    this.populateDiscountProductValues(this.product);
    this.calculateDiscount();
  }

  updateCountdown() {
    const hours = Math.floor(this.remainingTime / 3600);
    const minutes = Math.floor((this.remainingTime % 3600) / 60);
    const seconds = this.remainingTime % 60;

    this.hours = ("0" + hours).slice(-2);
    this.minutes = ("0" + minutes).slice(-2);
    this.seconds = ("0" + seconds).slice(-2);

    this.remainingTime--;

    if (this.remainingTime >= 0) {
      setTimeout(() => {
        this.updateCountdown();
      }, 1000);
    }
  }

  populateDiscountProductValues(product) {
    this.discountProductId = product.productId;
    this.discountProductName = product.name;
    this.discountProductOriginalPrice = product.price;
    this.discountProductCurrency = product.currencyIsoCode;
    this.discountProductImageUrl = product.imageUrl;
  }

  calculateDiscount() {
    const randomIndex = Math.floor(Math.random() * DISCOUNTS.length);
    const randomDiscount = DISCOUNTS[randomIndex];
    this.selectedDiscountLabel = randomDiscount.label;
    this.discountProductPrice = (
      this.discountProductOriginalPrice *
      (1 - randomDiscount.value)
    ).toFixed(2);
  }

  navigateToProduct() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/product?id=${this.discountProductId}`
      }
    });
  }
}
