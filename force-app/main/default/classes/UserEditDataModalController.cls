public with sharing class UserEditDataModalController {
    
    @AuraEnabled
    public static void updateUserAddress(Contact userData) {
        ContactService.updateUserAddress(userData);
    }
}