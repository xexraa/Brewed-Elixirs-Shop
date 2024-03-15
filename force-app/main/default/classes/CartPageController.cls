public with sharing class CartPageController {

    @AuraEnabled(Cacheable=true)
    public static Map<Id, List<OrderItemService.OrderItemWrapper>> getDraftOrder() {
        return OrderService.getDraftOrder();
    }

    @AuraEnabled
    public static void deleteDraftOrder(Id orderId) {
        OrderService.deleteDraftOrder(orderId);
    }

    @AuraEnabled
    public static void deleteOrderItem(Id orderItemId) {
        OrderItemService.deleteOrderItem(orderItemId);
    }

    @AuraEnabled
    public static void updateOrderItemQuantity(Id orderItemId, Decimal quantity) {
        OrderItemService.updateOrderItemQuantity(orderItemId, quantity);
    }

    @AuraEnabled
    public static void updateOrderStatus(Order order) {
        OrderService.updateOrderStatus(order);
    }
}