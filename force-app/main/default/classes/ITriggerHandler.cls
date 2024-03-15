public interface ITriggerHandler {
    
    void afterUpdate(Map<Id, SObject> newRecords, Map<Id, SObject> oldRecords); 
    Boolean isDisabled();  
}