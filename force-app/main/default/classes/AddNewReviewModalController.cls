public with sharing class AddNewReviewModalController {
    
    @AuraEnabled
    public static void addReview(Review__c review) {
        ReviewService.addReview(review);
    }
}