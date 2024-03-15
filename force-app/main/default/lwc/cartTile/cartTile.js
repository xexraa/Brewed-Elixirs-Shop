import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class CartTile extends NavigationMixin(LightningElement) {
  amountOfProduct = 1;

  @api product;

  navigateToProduct() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/product?id=${this.product.value.productId}`
      }
    });
  }

  handleTrashClick() {
    this.dispatchEvent(
      new CustomEvent("trashclick", {
        detail: { orderItemId: this.product.value.orderItemId }
      })
    );
  }

  handleSelected(event) {
    this.dispatchEvent(
      new CustomEvent("selected", {
        detail: {
          orderItemId: this.product.value.orderItemId,
          quantity: event.detail
        }
      })
    );
  }
}
