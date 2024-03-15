import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import * as LABELS from "c/labels";
import { CATEGORIES } from "c/constants";

export default class CategoriesCard extends NavigationMixin(LightningElement) {
  label = LABELS;
  categories = CATEGORIES;

  selectedCategory;

  @api category;

  handleCategoryClick(event) {
    this.selectedCategory = event.currentTarget.dataset.value;
    this.navigateToProducts();
  }

  navigateToProducts() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/categories?category=${this.selectedCategory}`
      }
    });
  }
}
