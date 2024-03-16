public with sharing class EmailService {
    
    private final static String SUMMARY_FILE_NAME = Constants.SUMMARY_FILE_NAME;

    public static void sendEmailConfirmingShipment(List<Order> orders) {
        List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();
        EmailTemplate et = EmailTemplateService.getOrderSentEmailTemplate();

        for (Order order : orders) {
            Contact con = ContactService.getContactById(order.BillToContactId);
            emailsToSend.add(fetchSingleEmailMessage(order.Id, et, con, null));
        }

        if (!emailsToSend.isEmpty()) {
            sendEmails(emailsToSend);     
        }
    }

    @Future(Callout=true)
    public static void sendEmailWithAttachment(String ordersJson) {
        List<Order> orders = (List<Order>) JSON.deserialize(ordersJson, List<Order>.class);
        List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();
        EmailTemplate et = EmailTemplateService.getSummaryEmailTemplate();

        for (Order order : orders) {
            Contact con = ContactService.getContactById(order.BillToContactId);
            Blob pdfBlob = getOrderSummaryPageBlob(order, con);
            emailsToSend.add(fetchSingleEmailMessage(order.Id, et, con, pdfBlob));
        }

        if (!emailsToSend.isEmpty()) {
            sendEmails(emailsToSend);     
        }
    }

    public static void sendEmails(List<Messaging.SingleEmailMessage> emailsToSend) {
        try {
            Messaging.sendEmail(emailsToSend);
            return;
        } catch (Exception e) {
            DebugLogService.logException(e);
        }
    }

    private static Blob getOrderSummaryPageBlob(Order order, Contact con) {
        PageReference pdfPage = Page.OrderSummaryPage;
        pdfPage.getParameters().put('orderId', order.Id);
        pdfPage.getParameters().put('orderNumber', String.valueOf(order.OrderNumber));
        pdfPage.getParameters().put('startDate', String.valueOf(order.EffectiveDate));
        pdfPage.getParameters().put('totalAmount', String.valueOf(order.TotalAmount));
        pdfPage.getParameters().put('currencyIsoCode', String.valueOf(order.CurrencyIsoCode));
        pdfPage.getParameters().put('firstName', String.valueOf(con.FirstName));
        pdfPage.getParameters().put('lastName', String.valueOf(con.LastName));
        pdfPage.getParameters().put('street', String.valueOf(con.MailingStreet));
        pdfPage.getParameters().put('postCode', String.valueOf(con.MailingPostalCode));
        pdfPage.getParameters().put('city', String.valueOf(con.MailingCity));
        pdfPage.getParameters().put('customerNumber', String.valueOf(con.CustomerNumber__c));

        Blob pdfBlob = pdfPage.getContentAsPDF();
        return pdfBlob;
    }

    private static Messaging.SingleEmailMessage fetchSingleEmailMessage(Id orderId, EmailTemplate et, Contact con, Blob pdfBlob) {       
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setTemplateId(et.Id); 
        email.setToAddresses(new String[] { con.Email });
        email.setSubject(et.Subject);
        email.setHTMLBody(updateMergeFieldsInTemplate(et, con));
        email.setTargetObjectId(con.Id);
        email.setWhatId(et.Id);
        email.setSaveAsActivity(false);
        email.setUseSignature(false); 
        email.setBccSender(false); 

        if (pdfBlob != null && pdfBlob.size() > 0) {
            Messaging.EmailFileAttachment pdfAttachment = fetchEmailFileAttachment(orderId, pdfBlob);
            email.setFileAttachments(new Messaging.EmailFileAttachment[] { pdfAttachment });
        }

        return email;
    }

    private static Messaging.EmailFileAttachment fetchEmailFileAttachment(Id orderId, Blob pdfBlob) {
        Messaging.EmailFileAttachment pdfAttachment = new Messaging.EmailFileAttachment();
        String fileName = SUMMARY_FILE_NAME + orderId + '.pdf';
        pdfAttachment.setFileName(fileName);
        pdfAttachment.setBody(pdfBlob);
        
        return pdfAttachment;
    }

    private static String updateMergeFieldsInTemplate(EmailTemplate et, Contact con) {
        String htmlBody = et.Body;
        htmlBody = htmlBody.replace('{!Contact.FirstName}', con.FirstName);
        htmlBody = htmlBody.replace('{!Contact.LastName}', con.LastName);

        return htmlBody;
    }
}