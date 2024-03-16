public with sharing class NavBarCartController {

    @AuraEnabled(Cacheable=true)
    public static Decimal getOrderTotalQuantity() {
        try{
            return OrderService.getOrderTotalQuantity();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void createNewOrUpdateOrder(Id productId, Integer quantity, Decimal price) {
        try {
            OrderService.createNewOrUpdateOrder(productId, quantity, price);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}