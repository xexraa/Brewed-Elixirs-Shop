public with sharing class ProductDetailsCardController {

    @AuraEnabled(Cacheable=true)
    public static PricebookEntryService.ProductFullDescriptionWrapper getProductById(Id productId) {
        try {
            return PricebookEntryService.getProductById(productId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(Cacheable=true)
    public static List<ReviewService.ReviewForProductWrapper> getReviewsForProduct(Id productId) {
        try {
            return ReviewService.getReviewsForProduct(productId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}