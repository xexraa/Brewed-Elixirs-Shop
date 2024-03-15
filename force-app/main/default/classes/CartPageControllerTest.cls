@isTest
private class CartPageControllerTest {
    
    @isTest
    static void testGetProductsByIdsList() {
        // Create test data - product records
        List<Product2> testProducts = new List<Product2>();
        for(Integer i = 0; i < 3; i++) {
            testProducts.add(new Product2(
                Name = 'Test Product ' + i,
                IsActive = true
            ));
        }
        insert testProducts;

        // Create test data - PricebookEntry records
        Pricebook2 standardPricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
        if (standardPricebook == null) {
            standardPricebook = new Pricebook2(Name = 'Standard Pricebook', IsActive = true);
            insert standardPricebook;
            standardPricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
        }

        List<PricebookEntry> testPricebookEntries = new List<PricebookEntry>();
        for(Product2 product : testProducts) {
            testPricebookEntries.add(new PricebookEntry(
                Pricebook2Id = standardPricebook.Id,
                Product2Id = product.Id,
                UnitPrice = 22.99, // Set your desired price here
                IsActive = true
            ));
        }
        insert testPricebookEntries;

        // Call the method to be tested
        Test.startTest();
        List<Id> productIds = new List<Id>();
        for(Product2 product : testProducts) {
            productIds.add(product.Id);
        }
        List<PricebookEntryService.ProductBaseDataWrapper> actualResults = CartPageController.getProductsByIdsList(productIds);
        Test.stopTest();

        // Assert the results
        System.assertEquals(testProducts.size(), actualResults.size(), 'Size of expected and actual results should match');
        for(Integer i = 0; i < testProducts.size(); i++) {
            System.assertEquals(testProducts[i].Id, actualResults[i].productId, 'Product Ids should match');
            System.assertEquals(testProducts[i].Name, actualResults[i].name, 'Product Names should match');
            // Add more assertions if necessary
        }
    }
}
