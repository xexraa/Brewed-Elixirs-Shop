import { LightningElement, api } from "lwc";

import * as LABELS from "c/labels";
import { SIX_SYSTEM_STARS } from "c/constants";

export default class ProductPageReviewsSection extends LightningElement {
  label = LABELS;
  sixSystemStars = SIX_SYSTEM_STARS;

  totalReviews;
  averageRating;
  stars = [];
  ratingStrips = [];

  @api reviews;

  connectedCallback() {
    this.calculateStatistics();
  }

  calculateStatistics() {
    this.totalReviews = this.reviews.length;
    let totalRating = 0;
    let ratingCounts = new Array(SIX_SYSTEM_STARS).fill(0);

    this.reviews.forEach((review) => {
      totalRating += review.rating;
      ratingCounts[review.rating - 1]++;
    });

    let average = totalRating / this.totalReviews;
    this.averageRating = average.toFixed(1);

    let filledStars = Math.floor(average);
    let remainingFraction = average - filledStars;
    let halfStar = remainingFraction > 0 ? 1 : 0;

    for (let i = 1; i <= SIX_SYSTEM_STARS; i++) {
      if (i <= filledStars) {
        this.stars.push({
          value: i,
          className: "star-filled"
        });
      } else if (i > filledStars && i <= filledStars + 1 && halfStar === 1) {
        this.stars.push({
          value: i,
          className: "star-half-filled"
        });
      } else {
        this.stars.push({
          value: i,
          className: "star-unfilled"
        });
      }
    }

    for (let i = SIX_SYSTEM_STARS; i >= 1; i--) {
      this.ratingStrips.push({ rating: i, opinions: ratingCounts[i - 1] });
    }
  }

  openAddReviewModal() {
    const openModal = new CustomEvent("openmodal");
    this.dispatchEvent(openModal);
  }
}
