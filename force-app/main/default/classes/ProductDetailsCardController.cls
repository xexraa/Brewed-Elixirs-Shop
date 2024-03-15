public with sharing class ProductDetailsCardController {

    @AuraEnabled(Cacheable=true)
    public static PricebookEntryService.ProductFullDescriptionWrapper getProductById(Id productId) {
        return PricebookEntryService.getProductById(productId);
    }

    @AuraEnabled(Cacheable=true)
    public static List<ReviewService.ReviewForProductWrapper> getReviewsForProduct(Id productId) {
        return ReviewService.getReviewsForProduct(productId);
    }
}