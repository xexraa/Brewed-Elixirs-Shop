public with sharing class UserPageController {
    
    @AuraEnabled(Cacheable=true)
    public static Contact getUserFullDetails() {
        return ContactService.getUserFullDetails();
    }
}