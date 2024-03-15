import { LightningElement, api } from "lwc";

export default class InfoLabelsCmp extends LightningElement {
  @api title_label;
  @api ask_label;
  @api button_label;
}
