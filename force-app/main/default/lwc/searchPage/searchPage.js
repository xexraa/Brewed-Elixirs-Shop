import { LightningElement, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getProductsBySearchQuery from "@salesforce/apex/SearchPageController.getProductsBySearchQuery";

import * as LABELS from "c/labels";

export default class SearchPage extends LightningElement {
  label = LABELS;

  isLoading = false;
  isProductsEmpty = true;

  searchQuery;
  products = [];
  originalProducts = [];

  @wire(CurrentPageReference)
  currentPageReference(ref) {
    if (ref) {
      this.searchQuery = ref.state.term;
    }
  }

  @wire(getProductsBySearchQuery, { query: "$searchQuery" })
  wiredProductsBySearchQuery(result) {
    this.isLoading = true;

    if (result.data) {
      this.products = this.filterOutDuplicates(result.data);
      this.originalProducts = [...this.products];
      this.checkProductsLength();
    } else if (result.error) {
      this.displayToastError(
        result.error.body.message || this.label.TOAST_Error,
        "error"
      );
    }

    this.isLoading = false;
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

  checkProductsLength() {
    this.isProductsEmpty = this.products.length === 0 ? false : true;
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

  get countProducts() {
    return this.products.length;
  }

  get isProductsListNotEmpty() {
    return this.originalProducts && this.originalProducts.length > 0;
  }
}
