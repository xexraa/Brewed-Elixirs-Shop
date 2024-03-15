public with sharing class Product2Service {
    
    public static void updateProductImageUrl(String url, Id productId) {
        Product2 product = new Product2(
                Id = productId,
                ImageUrl__c = url
            );   

        update product;
    }

}