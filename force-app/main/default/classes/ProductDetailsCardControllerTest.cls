@isTest
private class ProductDetailsCardControllerTest {
    
    @isTest
    static void testGetProductById() {
        Product2 testProduct = new Product2(
            Name = 'Test Product',
            IsActive = true
        );
        insert testProduct;

        Test.startTest();
        PricebookEntryService.ProductFullDescriptionWrapper actualResult = ProductDetailsCardController.getProductById(testProduct.Id);
        Test.stopTest();
        system.debug(actualResult);
        System.assertNotEquals(null, actualResult, 'Expected product details to be returned');
        System.assertEquals(testProduct.Id, actualResult.productId, 'Product Ids should match');
        System.assertEquals(testProduct.Name, actualResult.name, 'Product Names should match');
    }
}
