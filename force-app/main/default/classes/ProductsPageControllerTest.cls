@isTest
private class ProductsPageControllerTest {
        
    @isTest
    static void testGetProducts() {       
        Test.startTest();
        List<PricebookEntryService.ProductBaseDataWrapper> actualResults = ProductsPageController.getProducts();
        Test.stopTest();
        
        System.assertEquals(0, actualResults.size(), 'Size of expected and actual results should match');
    }   
}
