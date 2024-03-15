import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getProducts from "@salesforce/apex/ProductsPageController.getProducts";

export default class ProductsPage extends LightningElement {
  isLoading = false;

  products;
  discountProduct;

  @wire(getProducts)
  wiredProducts(result) {
    this.isLoading = true;

    if (result.data) {
      this.products = result.data.map((product) => {
        let modifiedProduct = {
          ...product,
          price: parseFloat(product.price).toFixed(2)
        };
        return modifiedProduct;
      });

      this.randomProductIntoDiscount();
    } else if (result.error) {
      this.displayToastError(
        result.error.body.message || this.label.TOAST_Error,
        "error"
      );
    }

    this.isLoading = false;
  }

  randomProductIntoDiscount() {
    if (this.products && this.products.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.products.length);
      this.discountProduct = this.products[randomIndex];

      // remover from main list
      this.products = this.products.filter(
        (product, index) => index !== randomIndex
      );
    }
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
}
