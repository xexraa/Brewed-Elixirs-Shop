public with sharing class ProductsPageController {
    
    @AuraEnabled(Cacheable=true)
    public static List<PricebookEntryService.ProductBaseDataWrapper> getProducts() {
        try {
            return PricebookEntryService.getProducts();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}