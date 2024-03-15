import { LightningElement, wire, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

import USER_ID from "@salesforce/user/Id";
import CONTACT_ID_FIELD from "@salesforce/schema/User.ContactId";

import addReview from "@salesforce/apex/AddNewReviewModalController.addReview";

import * as LABELS from "c/labels";
import { TODAY, SIX_SYSTEM_STARS } from "c/constants";

export default class AddNewReviewModal extends LightningElement {
  label = LABELS;

  isLoading = false;

  description;
  rating;
  contactId;
  reviewDate = TODAY;
  stars = [];
  errorMessage;

  @api product_id;
  @api product_name;
  @api img_url;
  @api rating_from_first_review;

  @wire(getRecord, { recordId: USER_ID, fields: [CONTACT_ID_FIELD] })
  wireUser({ error, data }) {
    if (data) {
      this.contactId = getFieldValue(data, CONTACT_ID_FIELD);
    } else if (error) {
      this.displayToastError(
        error.body.message || this.label.TOAST_Error,
        "error"
      );
    }
  }

  connectedCallback() {
    console.log("value: " + this.rating_from_first_review);
    if (this.rating_from_first_review) {
      this.initializeStarsWithRating();
    } else {
      this.fetchStarsList();
    }
  }

  // Fetching stars list with provided rating
  initializeStarsWithRating() {
    this.rating = this.rating_from_first_review;

    for (let i = 1; i <= SIX_SYSTEM_STARS; i++) {
      if (i <= this.rating_from_first_review) {
        this.stars.push({
          value: i,
          className: "star-filled"
        });
      } else {
        this.stars.push({
          value: i,
          className: "star-unfilled"
        });
      }
    }
  }

  // Fetching stars list
  fetchStarsList() {
    for (let i = 1; i <= SIX_SYSTEM_STARS; i++) {
      this.stars.push({
        value: i,
        className: "star-unfilled"
      });
    }
  }

  // Handle hover over stars
  handleHover(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10) - 1;
    this.highlightStars(index);
  }

  // Handle hover-out over stars
  handleMouseOut() {
    if (this.rating === undefined) {
      this.highlightStars(-1);
    } else {
      this.highlightStars(this.rating - 1);
    }
  }

  // Handle click on star
  handleClick(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10) - 1;
    this.updateRating(index);
    this.clearErrorMessage();
  }

  // Dynamic stars filling
  highlightStars(index) {
    this.stars.forEach((star, i) => {
      if (i <= index) {
        star.className = "star-filled";
      } else {
        star.className = "star-unfilled";
      }
    });
    this.stars = [...this.stars];
  }

  // Update this.rating variable
  updateRating(index) {
    this.rating = index + 1;
  }

  // Handle change
  handleChange(event) {
    this[event.target.dataset.name] = event.target.value;

    this.checkInputValidity(event.target);
  }

  // Save data
  handleSave() {
    this.isLoading = true;

    if (this.isInputValid()) {
      let reviewData = { sobjectType: "Review__c" };
      reviewData.Description__c = this.description;
      reviewData.Rating__c = this.rating;
      reviewData.ReviewDate__c = this.reviewDate;
      reviewData.Product__c = this.product_id;
      reviewData.Contact__c = this.contactId;

      addReview({ review: reviewData })
        .then(() => {
          this.displayToast(this.label.TOAST_Success_ReviewAdded, "success");
          this.closeModal();
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
    } else {
      this.isLoading = false;
    }
  }

  // Before save check
  isInputValid() {
    let isValid = true;
    this.clearErrorMessage();

    if (this.rating === undefined) {
      isValid = false;
      this.displayErrorMessage();
    }

    return isValid;
  }

  // Display error message
  displayErrorMessage() {
    this.errorMessage = this.label.ERROR_RatingRequired;
  }

  // Clear error message
  clearErrorMessage() {
    this.errorMessage = undefined;
  }

  // Close modal
  closeModal() {
    const closeEvent = new CustomEvent("closemodal");
    this.dispatchEvent(closeEvent);
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
}
