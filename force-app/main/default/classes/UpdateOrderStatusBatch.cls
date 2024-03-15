public with sharing class UpdateOrderStatusBatch implements Database.Batchable<SObject> {

    private static final String ORDER_IN_PACKING_STATUS = Constants.ORDER_IN_PACKING_STATUS;
    private static final String ORDER_SENT_STATUS = Constants.ORDER_SENT_STATUS;
    private static final Date THREE_DAYS_AGO = Constants.THREE_DAYS_AGO;

    public Database.QueryLocator start(Database.BatchableContext context) {
        return Database.getQueryLocator([SELECT Id, Status FROM Order WHERE Status = :ORDER_IN_PACKING_STATUS AND EffectiveDate = :THREE_DAYS_AGO]);
    }

    public void execute(Database.BatchableContext context, List<Order> orders) {
        for (Order ord : orders) {
            ord.Status = ORDER_SENT_STATUS;
        }

        update orders;
    }

    public void finish(Database.BatchableContext context) {
        System.debug('');
    }
}
