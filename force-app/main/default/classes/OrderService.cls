public with sharing class OrderService {

    private final static Id CURRENT_USER_CONTACT_ID = Constants.CURRENT_USER_CONTACT_ID;
    private final static Date TODAY = Constants.TODAY;
    private final static String ORDER_STATUS_DRAFT = Constants.ORDER_STATUS_DRAFT;

    public static Map<Id, List<OrderItemService.OrderItemWrapper>> getDraftOrder() {
        Map<Id, List<OrderItemService.OrderItemWrapper>> orderItems = new Map<Id, List<OrderItemService.OrderItemWrapper>>();
        List<Order> draftOrder = [SELECT Id FROM Order WHERE Status = :ORDER_STATUS_DRAFT AND BillToContactId = :CURRENT_USER_CONTACT_ID WITH SECURITY_ENFORCED LIMIT 1];

        if(!draftOrder.isEmpty()) {
            orderItems.put(draftOrder[0].Id, OrderItemService.getOrderItemWrappers(draftOrder[0].Id));
        } 

        return orderItems;
    }

    public static Decimal getOrderTotalQuantity() {
        Decimal totalQuantity = 0;
        List<Order> draftOrder = [SELECT Id, TotalQuantity__c FROM Order WHERE Status = :ORDER_STATUS_DRAFT AND BillToContactId = :CURRENT_USER_CONTACT_ID WITH SECURITY_ENFORCED LIMIT 1];

        if(!draftOrder.isEmpty()) {
            totalQuantity = draftOrder[0].TotalQuantity__c;
        } 

        return totalQuantity;
    }

    public static List<Order> getConfirmedOrders() {
        return [
            SELECT Id, OrderNumber, TotalAmount, CurrencyIsoCode, Status, EffectiveDate, (SELECT Id, Product2.Name, UnitPrice, Quantity FROM OrderItems)
            FROM Order 
            WHERE Status != :ORDER_STATUS_DRAFT
            AND BillToContactId = :CURRENT_USER_CONTACT_ID 
            WITH SECURITY_ENFORCED
            ORDER BY EffectiveDate DESC
        ];
    }
    
    public static void createNewOrUpdateOrder(Id productId, Integer quantity, Decimal price) {
        List<Order> existingOrder = [SELECT Id FROM Order WHERE Status = :ORDER_STATUS_DRAFT AND BillToContactId = :CURRENT_USER_CONTACT_ID WITH SECURITY_ENFORCED LIMIT 1];

        if (existingOrder.isEmpty()) {
            Order newOrder = new Order(
                AccountId = ContactService.getAccountId(CURRENT_USER_CONTACT_ID),
                BillToContactId = CURRENT_USER_CONTACT_ID,
                Status = ORDER_STATUS_DRAFT,
                EffectiveDate = TODAY
            );
            insert newOrder;

            OrderItemService.insertOrUpdateOrderItem(newOrder.Id, productId, quantity, price); 
        } else {
            OrderItemService.insertOrUpdateOrderItem(existingOrder[0].Id, productId, quantity, price);      
        }     
    }

    public static void updateOrderStatus(Order order) {
        update order;
    }

    public static void deleteDraftOrder(Id orderId) {
        delete [SELECT Id FROM Order WHERE Id = :orderId WITH SECURITY_ENFORCED LIMIT 1];   
    }
}