import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class SearchBar extends NavigationMixin(LightningElement) {
  searchBarValue;

  @api placeholder_label;

  handleKeypress(event) {
    if (event.key === 'Enter' && this.searchBarValue) {
        this.navigateToSearchResult();
      }
  }

  handleSearchChange(event) {
    this[event.currentTarget.dataset.name] = event.target.value;
  }

  navigateToSearchResult() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: `/search/${this.searchBarValue}`
      }
    });
  }
}
