@isTest
private class Product2ServiceTest {
    
    @isTest
    static void testUpdateProductImageUrl() {
        Product2 testProduct = new Product2(
            Name = 'Test Product',
            IsActive = true
        );
        insert testProduct;

        String newImageUrl = 'https://example.com/image.jpg';

        Test.startTest();
        Product2Service.updateProductImageUrl(newImageUrl, testProduct.Id);
        Test.stopTest();

        Product2 updatedProduct = [SELECT Id, ImageUrl__c FROM Product2 WHERE Id = :testProduct.Id];

        System.assertEquals(newImageUrl, updatedProduct.ImageUrl__c, 'Product image URL should be updated');
    }
}
