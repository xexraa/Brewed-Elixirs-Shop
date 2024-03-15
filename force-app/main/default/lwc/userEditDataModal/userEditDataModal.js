import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import updateUserAddress from "@salesforce/apex/UserEditDataModalController.updateUserAddress";

import * as LABELS from "c/labels";
import { POSTAL_CODE_MAX_LENGTH } from "c/constants";

export default class UserEditDataModal extends LightningElement {
  label = LABELS;
  postalCodeMaxLength = POSTAL_CODE_MAX_LENGTH;

  isLoading = false;

  @api contact_id;
  @api street;
  @api city;
  @api postal_code;
  @api country;

  // Handle change
  handleChange(event) {
    this[event.target.dataset.name] = event.target.value;

    this.checkInputValidity(event.target);
  }

  // Save data
  handleSave() {
    this.isLoading = true;

    if (this.isInputValid()) {
      let userData = { sobjectType: "Contact" };
      userData.Id = this.contact_id;
      userData.MailingStreet = this.street;
      userData.MailingCity = this.city;
      userData.MailingPostalCode = this.postal_code;
      userData.MailingCountry = this.country;

      updateUserAddress({ userData: userData })
        .then(() => {
          this.displayToast(
            this.label.TOAST_Success_UserAddressUpdated,
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
