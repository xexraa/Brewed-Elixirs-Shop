public with sharing class OrderItemService {

    public static List<OrderItemWrapper> getOrderItemWrappers(Id orderId) {
        List<OrderItemWrapper> wrappers = new List<OrderItemWrapper>();
    
        List<OrderItem> orderItems = [SELECT Id, Quantity, UnitPrice, TotalPrice, CurrencyIsoCode, Product2.Id, Product2.ImageUrl__c, Product2.Name FROM OrderItem WHERE OrderId = :orderId WITH SECURITY_ENFORCED];
    
        for (OrderItem item : orderItems) {
            OrderItemWrapper wrapper = new OrderItemWrapper(
                item.Id,
                item.Product2.Id,
                item.Product2.Name,
                item.UnitPrice,
                item.TotalPrice,
                item.CurrencyIsoCode,
                item.Product2.ImageUrl__c,
                item.Quantity
            );
            wrappers.add(wrapper);
        }
    
        return wrappers;
    }

    public static void insertOrUpdateOrderItem(Id orderId, Id productId, Integer quantity, Decimal price) {
        List<OrderItem> existingOrderItem = [SELECT Id, Quantity FROM OrderItem WHERE OrderId = :orderId AND Product2Id = :productId WITH SECURITY_ENFORCED LIMIT 1];

        if (existingOrderItem.isEmpty()) {
            OrderItem orderItem = createOrderItem(orderId, productId, quantity, price);
            insert orderItem;
        } else {
            existingOrderItem[0].Quantity += quantity;
            update existingOrderItem;
        }
    }

    public static void updateOrderItemQuantity(Id orderItemId, Decimal quantity) {
        OrderItem orderItemToUpdate = createOrderItemToUpdate(orderItemId, quantity);
        try {
            update orderItemToUpdate;
        } catch (Exception e) {
            throw new AuraException(e.getMessage());
        }
    }

    public static void deleteOrderItem(Id orderItemId) {
        try {
            delete [SELECT Id FROM OrderItem WHERE Id = :orderItemId WITH SECURITY_ENFORCED LIMIT 1];
        } catch (Exception e) {
            throw new AuraException(e.getMessage());
        }  
    }

    private static OrderItem createOrderItem(Id orderId, Id productId, Integer quantity, Decimal price) {
        return new OrderItem(
           OrderId = orderId,
           Product2Id = productId,
           Quantity = quantity,
           UnitPrice = price,
           ListPrice = price
        );
   }

    private static OrderItem createOrderItemToUpdate(Id orderItemId, Decimal quantity) {
        return new OrderItem(
            Id = orderItemId,
            Quantity = quantity
        ); 
    }

    public class OrderItemWrapper {
        @AuraEnabled
        public Id orderItemId { get; set; }
        @AuraEnabled
        public Id productId { get; set; }
        @AuraEnabled
        public String name { get; set; }
        @AuraEnabled
        public Decimal price { get; set; }
        @AuraEnabled
        public Decimal totalPrice { get; set; }
        @AuraEnabled
        public String currencyIsoCode { get; set; }
        @AuraEnabled
        public String imageUrl { get; set; }
        @AuraEnabled
        public Decimal quantity { get; set; }

        public OrderItemWrapper(Id orderItemId, Id productId, String name, Decimal price, Decimal totalPrice, String currencyIsoCode, String imageUrl, Decimal quantity) {
            this.orderItemId = orderItemId;
            this.productId = productId;
            this.name = name;
            this.price = price;
            this.totalPrice = totalPrice;
            this.currencyIsoCode = currencyIsoCode;
            this.imageUrl = imageUrl;
            this.quantity = quantity;
        }
    } 
}