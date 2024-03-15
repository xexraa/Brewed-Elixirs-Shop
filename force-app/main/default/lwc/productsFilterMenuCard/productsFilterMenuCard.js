import { LightningElement, api } from "lwc";

import * as LABELS from "c/labels";
import { FILTERS } from "c/constants";

export default class FilterCard extends LightningElement {
  label = LABELS;

  priceFrom;
  priceTo;

  priceClass = "";

  productsCountList = [];
  activeFilters = [];
  productsCountByMark = {};

  @api products;
  @api category;
  @api subcategory;

  connectedCallback() {
    if (this.category) {
      this.fetchActiveFilters();
      this.countMarksInProducts();
      this.productsCountList = this.fetchProductsCountList();
    }
  }

  countMarksInProducts() {
    this.activeFilters.forEach((filter) => {
      this.productsCountByMark[filter] = this.countProductsByMark(filter);
    });
  }

  countProductsByMark(filter) {
    return this.products.filter((product) => product.mark === filter).length;
  }

  fetchActiveFilters() {
    this.activeFilters =
      FILTERS.find((filter) => filter.category === this.category)?.filter
        ?.marks || [];
  }

  fetchProductsCountList() {
    return Object.keys(this.productsCountByMark).map((mark) => {
      return {
        mark: mark,
        count: this.productsCountByMark[mark]
      };
    });
  }

  handleCategoryClick(event) {
    const filter = event.currentTarget.dataset.value;
    const checkbox = event.currentTarget.querySelector(".category-checkbox");
    checkbox.checked = !checkbox.checked;

    this.eventFilterChangeSender(filter, checkbox);
  }

  eventFilterChangeSender(filter, checkbox) {
    const filterChangeEvent = new CustomEvent("filterchange", {
      detail: { filter: filter, isChecked: checkbox.checked }
    });
    this.dispatchEvent(filterChangeEvent);
  }

  handlePriceChange(event) {
    let value = parseFloat(event.target.value);

    if (value < 0) {
      value = 0;
    }
    this[event.currentTarget.dataset.name] = value;

    if (this.validatePrices()) {
      this.eventPriceChangeSender();
    }
  }

  eventPriceChangeSender() {
    const priceRangeEvent = new CustomEvent("pricerangechange", {
      detail: {
        priceFrom: this.priceFrom,
        priceTo: this.priceTo
      }
    });
    this.dispatchEvent(priceRangeEvent);
  }

  validatePrices() {
    if (this.priceFrom && this.priceTo && this.priceFrom > this.priceTo) {
      this.priceClass = "error";
      return false;
    }
    this.priceClass = "";
    return true;
  }

  get dynamicPriceClass() {
    return `box ${this.priceClass}`;
  }

  get isCategory() {
    return this.category === undefined ? false : true;
  }
}
