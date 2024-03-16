public with sharing class UserChangeDataModalController {
    
    @AuraEnabled
    public static void updateUserInfo(Contact userInfo) {
        try {
            ContactService.updateUserInfo(userInfo);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}