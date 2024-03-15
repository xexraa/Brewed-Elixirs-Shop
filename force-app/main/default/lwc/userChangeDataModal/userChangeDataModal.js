import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import updateUserInfo from "@salesforce/apex/UserChangeDataModalController.updateUserInfo";

import * as LABELS from "c/labels";
import { PHONE_NUMBER_MAX_LENGTH } from "c/constants";

export default class UserChangeDataModal extends LightningElement {
  label = LABELS;
  phoneNumberMaxLength = PHONE_NUMBER_MAX_LENGTH;

  isLoading = false;

  @api contact_id;
  @api email;
  @api phone;

  // Handle change
  handleChange(event) {
    this[event.target.dataset.name] = event.target.value;

    if (event.target.dataset.name === "phone") {
      if (event.target.value.length > this.phoneNumberMaxLength) {
        this[event.target.dataset.name] = event.target.value.slice(
          0,
          this.phoneNumberMaxLength
        );
      }
    }

    this.checkInputValidity(event.target);
  }

  // Phone input pressed key check
  keyPressCheck(event) {
    const isNumeric = /^\d+$/.test(event.key);

    if (!isNumeric) {
      event.preventDefault();
    }
  }

  // Save data
  handleSave() {
    this.isLoading = true;

    if (this.isInputValid()) {
      let userInfo = { sobjectType: "Contact" };
      userInfo.Id = this.contact_id;
      userInfo.Email = this.email;
      userInfo.Phone = this.phone;

      updateUserInfo({ userInfo: userInfo })
        .then(() => {
          this.displayToast(
            this.label.TOAST_Success_UserInfoUpdated,
            "success"
          );
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
    let inputFields = this.template.querySelectorAll(".validate");

    inputFields.forEach((inputField) => {
      if (
        !inputField.checkValidity() ||
        (inputField.required && !inputField.value)
      ) {
        inputField.reportValidity();
        isValid = false;
      }
    });

    return isValid;
  }

  // General Validity check
  checkInputValidity(eventTarget) {
    let inputTarget = this.template.querySelector(
      `[data-name="${eventTarget.dataset.name}"]`
    );

    inputTarget.reportValidity();
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
