@isTest
private class PricebookEntryServiceTest {

    @isTest
    static void testGetProductById() {
        Product2 testProduct = new Product2(
            Name = 'Test Product',
            IsActive = true
        );
        insert testProduct;

        // Pricebook2 standardPricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
        // if (standardPricebook == null) {
        //     standardPricebook = new Pricebook2(Name = 'Standard Pricebook', IsActive = true);
        //     insert standardPricebook;
        //     standardPricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
        // }
        // PricebookEntry testPricebookEntry = new PricebookEntry(
        //     Pricebook2Id = standardPricebook.Id,
        //     Product2Id = testProduct.Id,
        //     UnitPrice = 22.99,
        //     IsActive = true
        // );
        // insert testPricebookEntry;

        Test.startTest();
        PricebookEntryService.ProductFullDescriptionWrapper actualResult = PricebookEntryService.getProductById(testProduct.Id);
        Test.stopTest();

        System.assertNotEquals(null, actualResult, 'Expected product details to be returned');
        System.assertEquals(testProduct.Id, actualResult.productId, 'Product Ids should match');
        System.assertEquals(testProduct.Name, actualResult.name, 'Product Names should match');
    }
}
