public with sharing class DebugLogService {
    
    public static void logException(Exception e) {
        String objectType = String.valueOf(e.getCause());
        Debug_Log__c debugLog = new Debug_Log__c(
            Name = 'Exception on ' + objectType + ' ' + String.valueOf(DateTime.now()),
            ObjectType__c = objectType,
            LineNumber__c = e.getLineNumber(),
            ErrorMessage__c = e.getMessage(),
            ExceptionType__c = e.getTypeName(),
            ErrorDate__c = DateTime.now()
        );

        insert debugLog;
    }
}