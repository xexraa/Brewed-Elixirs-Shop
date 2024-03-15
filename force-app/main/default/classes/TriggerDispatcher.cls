public class TriggerDispatcher {

    public static void run(ITriggerHandler handler) {
        if (handler.isDisabled()) {
            return;
        }       

        if (Trigger.isAfter) {
            if (Trigger.isUpdate) {
                handler.afterUpdate(Trigger.newMap, Trigger.oldMap);
            }           
        }
    }
}
