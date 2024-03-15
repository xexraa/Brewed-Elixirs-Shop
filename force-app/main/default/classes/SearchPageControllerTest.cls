@isTest
private class SearchPageControllerTest {
    @isTest
    static void testGetProductsBySearchQuery() {
        String query = 'Test Query';
        
        Test.startTest();
        List<PricebookEntryService.ProductFullDescriptionWrapper> actualResults = SearchPageController.getProductsBySearchQuery(query);
        Test.stopTest();
        
        System.assertEquals(0, actualResults.size(), 'Size of expected and actual results should match');
    }
}
