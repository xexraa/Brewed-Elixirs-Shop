import { LightningElement, api } from "lwc";

export default class SelectCmp extends LightningElement {
  options = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  @api quantity;
  @api size;

  renderedCallback() {
    if (this.size === "medium") {
      const selectElement = this.template.querySelector("select");

      if (selectElement) {
        selectElement.style.padding = "0.65rem 1.0rem";
      }
    }
  }

  handleChange(event) {
    const selectedValue = parseInt(event.target.value, 10);

    this.dispatchEvent(new CustomEvent("selected", { detail: selectedValue }));
  }
}
