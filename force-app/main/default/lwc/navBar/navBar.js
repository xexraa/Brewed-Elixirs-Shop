import { LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

import USER_ID from "@salesforce/user/Id";
import NAME_FIELD from "@salesforce/schema/User.Name";

import * as ICONS from "c/icons";
import * as LABELS from "c/labels";

export default class NavBar extends NavigationMixin(LightningElement) {
  icon = ICONS;
  label = LABELS;

  currentUserFullName;

  @wire(getRecord, { recordId: USER_ID, fields: [NAME_FIELD] })
  wireUser({ error, data }) {
    if (data) {
      this.currentUserFullName = getFieldValue(data, NAME_FIELD);
    } else if (error) {
      this.displayToastError(
        error.body.message || this.label.TOAST_Error,
        "error"
      );
    }
  }

  handleLogoClick() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/s/`
      }
    });
  }

  navigateToUserPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/user`
      }
    });
  }

  navigateToOrdersPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/orders`
      }
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
  displayToastError(message, variant) {
    const toastEvent = this.showToastMessage(message, variant);
    this.dispatchEvent(toastEvent);
  }
}
