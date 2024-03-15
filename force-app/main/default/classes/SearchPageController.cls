public with sharing class SearchPageController {
    
    @AuraEnabled(Cacheable=true)
    public static List<PricebookEntryService.ProductFullDescriptionWrapper> getProductsBySearchQuery(String query) {
        return PricebookEntryService.getProductsBySearchQuery(query);
    }
}