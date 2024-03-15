@isTest
private class ProductsWithSubcategoryControllerTest {
    
    @isTest
    static void testGetProductsByTypeAndSubtype() {
        String type = 'Test Type';
        String subtype = 'Test Subtype';
        
        Test.startTest();
        List<PricebookEntryService.ProductFullDescriptionWrapper> actualResults = ProductsWithSubcategoryController.getProductsByTypeAndSubtype(type, subtype);
        Test.stopTest();
        
        System.assertEquals(0, actualResults.size(), 'Size of expected and actual results should match');
    }
}
