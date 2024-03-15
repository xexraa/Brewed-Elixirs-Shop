public with sharing class UserChangeDataModalController {
    
    @AuraEnabled
    public static void updateUserInfo(Contact userInfo) {
        ContactService.updateUserInfo(userInfo);
    }
}