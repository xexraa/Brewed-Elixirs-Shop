public with sharing class ProductsPageController {
    
    @AuraEnabled(Cacheable=true)
    public static List<PricebookEntryService.ProductBaseDataWrapper> getProducts() {
        return PricebookEntryService.getProducts();
    }
}