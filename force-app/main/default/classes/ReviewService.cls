public with sharing class ReviewService {
    
    public static void addReview(Review__c review) {
        try {
            insert review;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static List<ReviewForProductWrapper> getReviewsForProduct(Id productId) {
        List<ReviewForProductWrapper> wrappers = new List<ReviewForProductWrapper>();

        List<Review__c> reviews = [SELECT Id, Contact__r.FirstName, Contact__r.LastName, Rating__c, Description__c, ReviewDate__c FROM Review__c WHERE Product__c = :productId ORDER BY ReviewDate__c DESC];

        for (Review__c rev : reviews) {
            ReviewForProductWrapper wrapper = new ReviewForProductWrapper(
                rev.Id,
                rev.Contact__r.FirstName,
                rev.Contact__r.LastName,
                rev.Rating__c,
                rev.Description__c,
                rev.ReviewDate__c
            );
            wrappers.add(wrapper);
        }
    
        return wrappers;
    }

    public class ReviewForProductWrapper {
        @AuraEnabled
        public Id reviewId { get; set; }
        @AuraEnabled
        public String firstName { get; set; }
        @AuraEnabled
        public String lastName { get; set; }
        @AuraEnabled
        public Decimal rating { get; set; }
        @AuraEnabled
        public String description { get; set; }
        @AuraEnabled
        public Date reviewDate { get; set; }

        public ReviewForProductWrapper(Id reviewId, String firstName, String lastName, Decimal rating, String description, Date reviewDate) {
            this.reviewId = reviewId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.rating = rating;
            this.description = description;
            this.reviewDate = reviewDate;
        }
    }
}