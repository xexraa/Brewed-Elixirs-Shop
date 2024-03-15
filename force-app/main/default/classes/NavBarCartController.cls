public with sharing class NavBarCartController {

    @AuraEnabled(Cacheable=true)
    public static Decimal getOrderTotalQuantity() {
        return OrderService.getOrderTotalQuantity();
    }
    
    @AuraEnabled
    public static void createNewOrUpdateOrder(Id productId, Integer quantity, Decimal price) {
        OrderService.createNewOrUpdateOrder(productId, quantity, price);
    }
}