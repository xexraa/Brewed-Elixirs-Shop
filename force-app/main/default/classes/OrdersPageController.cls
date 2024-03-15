public with sharing class OrdersPageController {
    
    @AuraEnabled(Cacheable=true)
    public static List<Order> getConfirmedOrders() {
        return OrderService.getConfirmedOrders();
    }
}