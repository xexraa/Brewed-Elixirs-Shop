public with sharing class OrderTriggerHandler implements ITriggerHandler {
    
    private static final String ORDER_IN_PACKING_STATUS = Constants.ORDER_IN_PACKING_STATUS;
    private static final String ORDER_SENT_STATUS = Constants.ORDER_SENT_STATUS;
    
    public Boolean isDisabled() {      
        return !TriggerHandlerSettings__mdt.getInstance('OrderTriggerHandler').Is_Active__c;
    }

    public void afterUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {
        List<Order> ordersInPacking = new List<Order>();
        List<Order> ordersSent = new List<Order>();

        for (Id orderId : newItems.keySet()) {
            Order oldOrder = (Order) oldItems.get(orderId);
            Order newOrder = (Order) newItems.get(orderId);

            if (oldOrder.Status != newOrder.Status) {
                if (newOrder.Status == ORDER_IN_PACKING_STATUS) {
                    ordersInPacking.add(newOrder);
                } else if (newOrder.Status == ORDER_SENT_STATUS) {
                    ordersSent.add(newOrder);
                }
            }
        }

        if (!ordersInPacking.isEmpty()) {
            String ordersJson = JSON.serialize(ordersInPacking);
            EmailService.sendEmailWithAttachment(ordersJson);
        }
    
        if (!ordersSent.isEmpty()) {
            System.enqueueJob(new EmailQueueable(ordersSent));
        }
    }
}