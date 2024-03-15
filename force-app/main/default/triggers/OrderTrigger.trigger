trigger OrderTrigger on Order (after update) {

    if(CheckRecursive.runOnce()) {
        TriggerDispatcher.run(new OrderTriggerHandler());
    }
}