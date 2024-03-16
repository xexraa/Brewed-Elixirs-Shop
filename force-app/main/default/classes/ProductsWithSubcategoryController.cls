public with sharing class ProductsWithSubcategoryController {
    
    @AuraEnabled(Cacheable=true)
    public static List<PricebookEntryService.ProductFullDescriptionWrapper> getProductsByTypeAndSubtype(String type, String subtype) {
        try {
            return PricebookEntryService.getProductsByTypeAndSubtype(type, subtype);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}