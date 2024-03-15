import { LightningElement, api } from "lwc";

import * as LABELS from "c/labels";
import { SIX_SYSTEM_STARS } from "c/constants";

export default class ProductPageFirstReviewSection extends LightningElement {
  label = LABELS;

  rating;
  stars = [];

  @api product_name;

  connectedCallback() {
    this.fetchStarsList();
  }

  // Fetching stars list
  fetchStarsList() {
    for (let i = 1; i <= SIX_SYSTEM_STARS; i++) {
      this.stars.push({
        value: i,
        className: "star-unfilled"
      });
    }
  }

  // Handle hover over stars
  handleHover(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10) - 1;
    this.highlightStars(index);
  }

  // Handle hover-out over stars
  handleMouseOut() {
    if (this.rating === undefined) {
      this.highlightStars(-1);
    } else {
      this.highlightStars(this.rating - 1);
    }
  }

  // Handle click on star
  handleClick(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10) - 1;
    this.updateRating(index);
  }

  // Dynamic stars filling
  highlightStars(index) {
    this.stars.forEach((star, i) => {
      if (i <= index) {
        star.className = "star-filled";
      } else {
        star.className = "star-unfilled";
      }
    });
    this.stars = [...this.stars];
  }

  // Update this.rating variable
  updateRating(index) {
    this.rating = index + 1;
  }

  openAddReviewModal() {
    const openModal = new CustomEvent("openmodal", {
      detail: { ratingFromFirstReview: this.rating }
    });
    this.dispatchEvent(openModal);
  }
}
