import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class NavBarItemsMenu extends NavigationMixin(LightningElement) {
  @api coffee_icon;
  @api coffee_label;
  @api tea_icon;
  @api tea_label;

  navigateToCategories(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/categories?category=${event.currentTarget.dataset.category}`
      }
    });
  }
}
