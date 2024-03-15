import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";

import getUserFullDetails from "@salesforce/apex/UserPageController.getUserFullDetails";

import * as LABELS from "c/labels";

export default class UserPage extends LightningElement {
  label = LABELS;

  isLoading = false;
  isReadOnly = true;
  isChangeModalVisible = false;
  isEditModalVisible = false;

  userResultData;
  contactId;
  fullName = "";
  phone = "";
  email = "";
  street = "";
  city = "";
  postalCode = "";
  country = "";

  @wire(getUserFullDetails)
  wiredUserDetails(result) {
    this.isLoading = true;
    this.userResultData = result;

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

  populateInitialValues(result) {
    this.contactId = result.Id;
    this.fullName =
      this.getFieldValue(result.FirstName) +
      " " +
      this.getFieldValue(result.LastName);
    this.phone = this.getFieldValue(result.Phone);
    this.email = this.getFieldValue(result.Email);
    this.street = this.getFieldValue(result.MailingAddress.street);
    this.city = this.getFieldValue(result.MailingAddress.city);
    this.postalCode = this.getFieldValue(result.MailingAddress.postalCode);
    this.country = this.getFieldValue(result.MailingAddress.country);
  }

  getFieldValue(field) {
    return typeof field === "undefined" ? "" : field;
  }

  openChangeModal() {
    this.isChangeModalVisible = true;
  }

  closeChangeModal() {
    this.refreshData();
    this.isChangeModalVisible = false;
  }

  openEditModal() {
    this.isEditModalVisible = true;
  }

  closeEditModal() {
    this.refreshData();
    this.isEditModalVisible = false;
  }

  // Refresh data in cmp
  refreshData() {
    this.isLoading = true;

    refreshApex(this.userResultData)
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
}
