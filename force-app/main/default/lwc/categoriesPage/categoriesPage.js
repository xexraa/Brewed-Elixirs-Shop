import { LightningElement, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";

export default class ProductsCategoryPage extends LightningElement {
  category;

  products = [];

  @wire(CurrentPageReference)
  currentPageReference(ref) {
    if (ref) {
      this.category = ref.state.category;
    }
  }
}
