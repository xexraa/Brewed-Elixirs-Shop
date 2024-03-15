import { LightningElement, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getProductsByTypeAndSubtype from "@salesforce/apex/ProductsWithSubcategoryController.getProductsByTypeAndSubtype";

import * as LABELS from "c/labels";

export default class ProductsWithSubcategoryPage extends LightningElement {
  label = LABELS;

  isLoading = false;

  category;
  subcategory;

  activeFilters = [];
  originalProducts = [];
  products = [];

  @wire(CurrentPageReference)
  currentPageReference(ref) {
    if (ref) {
      this.category = ref.state.category;
      this.subcategory = ref.state.subcategory;
    }
  }

  @wire(getProductsByTypeAndSubtype, {
    type: "$category",
    subtype: "$subcategory"
  })
  wiredProductsByCategory(result) {
    this.isLoading = true;

    if (result.data) {
      this.products = this.filterOutDuplicates(result.data);
      this.originalProducts = [...this.products];
    } else if (result.error) {
      this.displayToastError(
        result.error.body.message || this.label.TOAST_Error,
        "error"
      );
    }

    this.isLoading = false;
  }

  // Retrieve event from filter cmp (filter = price)
  handlePriceChange(event) {
    const priceFrom = event.detail.priceFrom;
    const priceTo = event.detail.priceTo;

    if (!isNaN(priceFrom) || !isNaN(priceTo)) {
      this.filterProductsByPrice(priceFrom, priceTo);
    } else {
      this.products = [...this.originalProducts];
    }
  }

  filterProductsByPrice(priceFrom, priceTo) {
    this.products = this.originalProducts.filter((product) => {
      const productPrice = product.price;

      if (!isNaN(priceFrom) && !isNaN(priceTo)) {
        return productPrice >= priceFrom && productPrice <= priceTo;
      } else if (!isNaN(priceFrom)) {
        return productPrice >= priceFrom;
      } else if (!isNaN(priceTo)) {
        return productPrice <= priceTo;
      }
      return true;
    });
  }

  // Retrieve event from filter cmp (filter = mark)
  handleFilterChange(event) {
    const filter = event.detail.filter;
    const isChecked = event.detail.isChecked;

    if (isChecked) {
      this.activeFilters.push(filter);
    } else {
      this.activeFilters = this.activeFilters.filter((item) => item !== filter);
    }

    this.filterProductsByMark();
  }

  filterProductsByMark() {
    if (this.activeFilters.length === 0) {
      this.products = [...this.originalProducts];
    } else {
      this.products = this.originalProducts.filter((product) => {
        return this.activeFilters.includes(product.mark);
      });
    }
  }

  filterOutDuplicates(products) {
    let uniqueProductsMap = new Map();

    products.forEach((product) => {
      let compositeKey = product.productId;
      let parsedPrice = parseFloat(product.price).toFixed(2);
      if (!uniqueProductsMap.has(compositeKey)) {
        uniqueProductsMap.set(compositeKey, { ...product, price: parsedPrice });
      }
    });

    return Array.from(uniqueProductsMap.values());
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

  get categoryName() {
    return `${this.category} - ${this.subcategory}`;
  }

  get countProducts() {
    return this.products.length;
  }

  get isProductsListNotEmpty() {
    return this.originalProducts && this.originalProducts.length > 0;
  }
  
}
