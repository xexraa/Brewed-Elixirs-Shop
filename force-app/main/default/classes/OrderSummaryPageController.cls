public with sharing class OrderSummaryPageController {

    public Id orderId { get; set; }
    public String orderNumber { get; set; }
    public String startDate { get; set; }
    public String totalAmount { get; set; }
    public String currencyIsoCode { get; set; }
    public String firstName { get; set; }
    public String lastName { get; set; }
    public String street { get; set; }
    public String postCode { get; set; }
    public String city { get; set; }
    public String customerNumber { get; set; }
    public List<OrderItem> orderItemsList { get; set; }

    public OrderSummaryPageController() {
        Map<String, String> pageParameters = ApexPages.currentPage().getParameters();

        orderId = pageParameters.get('orderId');
        orderNumber = pageParameters.get('orderNumber');
        startDate = pageParameters.get('startDate');
        totalAmount = pageParameters.get('totalAmount');
        currencyIsoCode = pageParameters.get('currencyIsoCode');
        firstName = pageParameters.get('firstName');
        lastName = pageParameters.get('lastName');
        street = pageParameters.get('street');
        postCode = pageParameters.get('postCode');
        city = pageParameters.get('city');
        customerNumber = pageParameters.get('customerNumber');

        fetchProducts();
    }

    private void fetchProducts() {
        List<OrderItem> orderItems = [SELECT Id, Product2.Name, Quantity, UnitPrice FROM OrderItem WHERE OrderId = :orderId];

        // Convert Quantity to integer
        for(OrderItem item : orderItems) {
            item.Quantity = (Integer)item.Quantity;
        }

        orderItemsList = orderItems;
    }
}