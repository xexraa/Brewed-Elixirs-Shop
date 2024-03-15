import { LightningElement, api } from "lwc";

import { SIX_SYSTEM_STARS } from "c/constants";

export default class ReviewTile extends LightningElement {
  @api review;

  displayLocaleDate;
  stars = [];

  connectedCallback() {
    this.dataModifications();
    this.fetchStarsList();
  }

  dataModifications() {
    this.displayLocaleDate = new Date(
      this.review.reviewDate
    ).toLocaleDateString();
  }

  // Fetching stars list
  fetchStarsList() {
    const rating = this.review.rating;
    for (let i = 1; i <= SIX_SYSTEM_STARS; i++) {
      if (i <= rating) {
        this.stars.push({
          value: i,
          className: "star-filled"
        });
      } else {
        this.stars.push({
          value: i,
          className: "star-unfilled"
        });
      }
    }
  }
}
