public with sharing class OrdersPageController {
    
    @AuraEnabled(Cacheable=true)
    public static List<Order> getConfirmedOrders() {
        try {
            return OrderService.getConfirmedOrders();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}