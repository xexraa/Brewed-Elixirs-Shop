public with sharing class UserService {
    
    public static Id getCurrentUserContactId() {
        return [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
    }
}