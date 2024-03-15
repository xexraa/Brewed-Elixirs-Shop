public with sharing class EmailTemplateService {

    private final static String SUMMARY_EMAIL_TEMPLATE = Constants.SUMMARY_EMAIL_TEMPLATE;
    private final static String ORDER_SENT_EMAIL_TEMPLATE = Constants.ORDER_SENT_EMAIL_TEMPLATE;
    
    public static EmailTemplate getSummaryEmailTemplate() {
        return [SELECT Id, Subject, Body FROM EmailTemplate WHERE DeveloperName = :SUMMARY_EMAIL_TEMPLATE LIMIT 1];
    }

    public static EmailTemplate getOrderSentEmailTemplate() {
        return [SELECT Id, Subject, Body FROM EmailTemplate WHERE DeveloperName = :ORDER_SENT_EMAIL_TEMPLATE LIMIT 1];
    }
}