public class EmailQueueable implements Queueable {

    private List<Order> orders;

    public EmailQueueable(List<Order> orders) {
        this.orders = orders;
    }

    public void execute(QueueableContext context) {
        EmailService.sendEmailConfirmingShipment(orders);
    }
}