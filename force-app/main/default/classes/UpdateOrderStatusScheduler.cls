global class UpdateOrderStatusScheduler implements Schedulable {

    global void execute(SchedulableContext context) {
        Database.executeBatch(new UpdateOrderStatusBatch());
    }
}
