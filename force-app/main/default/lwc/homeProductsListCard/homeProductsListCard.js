import { LightningElement, api } from "lwc";

import * as LABELS from "c/labels";

export default class ProductsCard extends LightningElement {
  label = LABELS;

  @api products;
}
