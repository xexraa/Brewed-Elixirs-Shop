public with sharing class SearchPageController {
    
    @AuraEnabled(Cacheable=true)
    public static List<PricebookEntryService.ProductFullDescriptionWrapper> getProductsBySearchQuery(String query) {
        try {
            return PricebookEntryService.getProductsBySearchQuery(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}