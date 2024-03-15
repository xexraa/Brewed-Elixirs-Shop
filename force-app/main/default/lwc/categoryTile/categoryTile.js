import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import * as ICONS from "c/icons";

export default class ProductsCategoryTile extends NavigationMixin(
  LightningElement
) {
  icon = ICONS;
  
  selectedSubcategory;

  @api subcategory;
  @api category;

  handleTileClick(event) {
    this.selectedSubcategory = event.currentTarget.dataset.value;
    this.navigateToProducts();
  }

  navigateToProducts() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/products?category=${this.category}&subcategory=${this.selectedSubcategory}`
      }
    });
  }

  get iconName() {
    return this.icon[this.subcategory.name];
  }
}
