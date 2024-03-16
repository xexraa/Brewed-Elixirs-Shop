public with sharing class UserPageController {
    
    @AuraEnabled(Cacheable=true)
    public static Contact getUserFullDetails() {
        try {
            return ContactService.getUserFullDetails();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}