import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CurrentPageReference } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import { publish, MessageContext } from "lightning/messageService";

import cartChanged from "@salesforce/messageChannel/CartUpdate__c";

import getProductById from "@salesforce/apex/ProductDetailsCardController.getProductById";
import getReviewsForProduct from "@salesforce/apex/ProductDetailsCardController.getReviewsForProduct";

import * as LABELS from "c/labels";

export default class ProductDetailsCard extends LightningElement {
  label = LABELS;

  isLoading = false;
  isAddReviewModalVisible = false;

  resultProductDetails;
  resultProductReviews;
  productId;
  name;
  description;
  weight;
  mark;
  taste;
  price;
  currencyIsoCode;
  imageUrl;
  quantity = 1;
  ratingFromFirstReview;

  reviewsList = [];

  @wire(MessageContext)
  messageContext;

  @wire(CurrentPageReference)
  currentPageReference(ref) {
    if (ref) {
      this.productId = ref.state.id;
    }
  }

  @wire(getProductById, { productId: "$productId" })
  wiredProductDetails(result) {
    this.isLoading = true;
    this.resultProductDetails = result;

    if (result.data) {
      this.populateInitialValues(result.data);
    } else if (result.error) {
      this.displayToast(
        result.error.body.message || this.label.TOAST_Error,
        "error"
      );
    }

    this.isLoading = false;
  }

  @wire(getReviewsForProduct, { productId: "$productId" })
  wiredReviewsForProduct(result) {
    this.isLoading = true;
    this.resultProductReviews = result;

    if (result.data) {
      this.reviewsList = result.data;
    } else if (result.error) {
      this.displayToast(
        result.error.body.message || this.label.TOAST_Error,
        "error"
      );
    }

    this.isLoading = false;
  }

  populateInitialValues(result) {
    this.name = this.getFieldValue(result.name);
    this.description = this.getFieldValue(result.description);
    this.weight = this.getFieldValue(result.weight);
    this.mark = this.getFieldValue(result.mark);
    this.taste = this.getFieldValue(result.taste);
    this.price = this.getFieldValue(parseFloat(result.price).toFixed(2));
    this.currencyIsoCode = this.getFieldValue(result.currencyIsoCode);
    this.imageUrl = this.getFieldValue(result.imageUrl);
  }

  getFieldValue(field) {
    return typeof field === "undefined" ? "" : field;
  }

  handleAddToCart() {
    const payload = {
      recordId: this.productId,
      quantity: this.quantity,
      price: this.price
    };
    publish(this.messageContext, cartChanged, payload);
  }

  handleSelected(event) {
    this.quantity = event.detail;
  }

  openAddReviewModal(event) {
    if (event.detail) {
      this.ratingFromFirstReview = event.detail.ratingFromFirstReview;
    }

    this.isAddReviewModalVisible = true;
  }

  closeAddReviewModal() {
    this.refreshData(this.resultProductReviews);
    this.isAddReviewModalVisible = false;
  }

  // Refresh data in cmp
  refreshData(data) {
    this.isLoading = true;

    refreshApex(data)
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

  get isReviewsEmpty() {
    return this.reviewsList.length === 0 ? true : false;
  }

  get firstReviewValue() {
    return this.ratingFromFirstReview === undefined
      ? undefined
      : this.ratingFromFirstReview;
  }
}
