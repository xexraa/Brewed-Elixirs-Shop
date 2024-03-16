public with sharing class CartPageController {

    @AuraEnabled(Cacheable=true)
    public static Map<Id, List<OrderItemService.OrderItemWrapper>> getDraftOrder() {
        try {
            return OrderService.getDraftOrder();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteDraftOrder(Id orderId) {
        try {
            OrderService.deleteDraftOrder(orderId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteOrderItem(Id orderItemId) {
        try {
            OrderItemService.deleteOrderItem(orderItemId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateOrderItemQuantity(Id orderItemId, Decimal quantity) {
        try {
            OrderItemService.updateOrderItemQuantity(orderItemId, quantity);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateOrderStatus(Order order) {
        try {
            OrderService.updateOrderStatus(order);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}