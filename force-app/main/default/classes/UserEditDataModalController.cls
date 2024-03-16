public with sharing class UserEditDataModalController {
    
    @AuraEnabled
    public static void updateUserAddress(Contact userData) {
        try {
            ContactService.updateUserAddress(userData);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}