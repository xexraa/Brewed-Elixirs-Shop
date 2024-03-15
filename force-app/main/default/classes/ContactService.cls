public with sharing class ContactService {

    private final static Id CURRENT_USER_CONTACT_ID = Constants.CURRENT_USER_CONTACT_ID;

    public static Contact getUserFullDetails() {
        return [SELECT FirstName, LastName, Email, Phone, MailingAddress FROM Contact WHERE Id = :CURRENT_USER_CONTACT_ID WITH SECURITY_ENFORCED LIMIT 1];
    }

    public static Contact getContactById(Id contactId) {
        return [SELECT FirstName, LastName, Email, Phone, MailingStreet, MailingPostalCode, MailingCity FROM Contact WHERE Id = :contactId LIMIT 1];
    }

    public static void updateUserInfo(Contact userInfo) {
        try {
            update userInfo;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static void updateUserAddress(Contact userData) {
        try {
            update userData;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static Id getAccountId(Id contactId) {
        return [SELECT Id, AccountId FROM Contact WHERE Id = :contactId LIMIT 1].AccountId;
    }
}