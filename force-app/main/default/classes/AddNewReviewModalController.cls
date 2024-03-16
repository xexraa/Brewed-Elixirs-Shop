public with sharing class AddNewReviewModalController {
    
    @AuraEnabled
    public static void addReview(Review__c review) {
        try {
            ReviewService.addReview(review);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}