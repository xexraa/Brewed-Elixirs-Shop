import { LightningElement, api } from "lwc";

import * as LABELS from "c/labels";

import { CATEGORIES } from "c/constants";

export default class ProductsCategoryListCard extends LightningElement {
  label = LABELS;
  categories = CATEGORIES;

  selectedCategory = [];

  @api category;

  renderedCallback() {
    if (this.category) {
      const categoryObj = this.categories.find(
        (item) => item.name === this.category
      );
      if (categoryObj) {
        this.selectedCategory = categoryObj.subcategories;
      }
    }
  }
}
