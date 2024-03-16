public with sharing class ContactService {

    private final static Id CURRENT_USER_CONTACT_ID = Constants.CURRENT_USER_CONTACT_ID;

    public static Contact getUserFullDetails() {
        return [SELECT FirstName, LastName, Email, Phone, MailingAddress FROM Contact WHERE Id = :CURRENT_USER_CONTACT_ID WITH SECURITY_ENFORCED LIMIT 1];
    }

    public static Contact getContactById(Id contactId) {
        return [SELECT FirstName, LastName, Email, Phone, MailingStreet, MailingPostalCode, MailingCity, CustomerNumber__c FROM Contact WHERE Id = :contactId LIMIT 1];
    }

    public static void updateUserInfo(Contact userInfo) {
        update userInfo;
    }

    public static void updateUserAddress(Contact userData) {
        update userData;
    }

    public static Id getAccountId(Id contactId) {
        return [SELECT Id, AccountId FROM Contact WHERE Id = :contactId LIMIT 1].AccountId;
    }
}